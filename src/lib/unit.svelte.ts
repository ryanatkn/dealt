import type {Flavored} from '@ryanatkn/belt/types.js';
import {EMPTY_OBJECT} from '@ryanatkn/belt/object.js';
import {identity} from '@ryanatkn/belt/function.js';
import {SvelteMap} from 'svelte/reactivity';
import {EMPTY_ARRAY} from '@ryanatkn/belt/array.js';

import {polygon_is_simple, polygon_make_ccw_points, polygon_decomp} from '$lib/polygon_helpers.js';
import type {Serializable} from '$lib/serializable.js';
import type {Scene} from '$lib/scene.svelte.js';
import {random_id, type Id} from '$lib/id.js';
import type {Some_Body} from '$lib/collisions.js';
import {
	serialize_points,
	transform_points,
	untransform_point,
	type I_Point,
} from '$lib/point_helpers.js';
import {type Behavior, type Behavior_Json} from '$lib/behavior.svelte.js';
import {behavior_class_by_name, type Behavior_Name} from '$lib/behaviors.js';
import {to_unit_fill} from '$lib/renderer_helpers.js';
import type {Polygon} from '$lib/polygon.js';

// TODO maybe move these primitives and remove the `Unit_` prefix?

export const HANDLE_SIZE = 24; // TODO where does this belong

export const RADIUS_MIN = 0;
export type Unit_Radius = Flavored<number, 'Unit_Radius'>;
export const parse_radius = (value: number): Unit_Radius => Math.max(RADIUS_MIN, value);

export type Unit_Scale = Flavored<number, 'Unit_Scale'>;
export const parse_scale: (value: number) => Unit_Scale = identity;

/**
 * `rotation` in radians.
 */
export type Unit_Rotation = Flavored<number, 'Unit_Rotation'>;
export const parse_rotation = (value: number): Unit_Rotation => value % (Math.PI * 2);

export const STRENGTH_DEFAULT: Unit_Strength = 1;
export const STRENGTH_MAX: Unit_Strength = 100_000_000_000;
export const STRENGTH_MIN: Unit_Strength = 0.001;

// TODO maybe just `Strength`?
export type Unit_Strength = Flavored<number, 'Unit_Strength'>;

// export const parse_strength = (value: unknown, fallback = STRENGTH_DEFAULT): Unit_Strength =>
// 	typeof value !== 'number' || Number.isNaN(value)
// 		? fallback
// 		: clamp(value, STRENGTH_MIN, STRENGTH_MAX);

export const SPEED_FASTEST = 1;
export const SPEED_FASTER = 0.62;
export const SPEED_FAST = 0.38;
export const SPEED_MEDIUM = 0.24;
export const SPEED_SLOW = 0.15;
export const SPEED_SLOWER = 0.09;
export const SPEED_SLOWEST = 0.056;
export const SPEED_ALMOST_ZERO = 0.0022;
export const SPEED_DEFAULT = SPEED_MEDIUM;

export type Unit_Id = Id | Flavored<number, 'Unit_Id'>;

export type Unit_Name = Flavored<string, 'Unit_Name'>;

export type Unit_Type = 'circle' | 'polygon';

export interface Unit_Json {
	id: Unit_Id;
	name: Unit_Name;
	behaviors: Array<Behavior_Json>;
	dead: boolean;
	type: Unit_Type; // TODO `body_type`? or bigger rename to `geometry_type`?
	x: number;
	y: number;
	rotation: Unit_Rotation;
	velocity: number;
	speed: number;
	// TODO represent strength visually, and refactor to friction/mass?
	strength: number; // TODO rethink
	movement_multiplier: number; // TODO @many quick hack to make walls unpushable
	direction_x: number;
	direction_y: number;
	teleporting_x: number; // TODO @many teleporting probably shouldn't be on the data? is an intra-tick effect
	teleporting_y: number;
	scale: Unit_Scale;
	// TODO @many support these - and allow/leverage negative values (interesting flipping effect, and can be separately controlled on each axis)
	// scale_x: Unit_Scale_X; // TODO @many scale_x|y
	// scale_y: Unit_Scale_Y; // TODO @many scale_x|y
	// polygon
	points: Array<I_Point>;
	// circle
	radius: Unit_Radius;
}

export const default_unit_json = (): Unit_Json => ({
	get id(): Unit_Id {
		throw Error('cannot access `id` of default_unit_json, use `random_id()` instead');
	},
	name: '',
	behaviors: [],
	dead: false,
	type: 'circle',
	x: 0,
	y: 0,
	rotation: 0,
	velocity: 0,
	speed: SPEED_DEFAULT,
	strength: STRENGTH_DEFAULT,
	movement_multiplier: 1, // TODO @many quick hack to make walls unpushable
	direction_x: 0,
	direction_y: 0,
	teleporting_x: 0, // TODO @many teleporting probably shouldn't be on the data? is an intra-tick effect
	teleporting_y: 0,
	scale: 1,
	// TODO @many support these - and allow/leverage negative values (interesting flipping effect, and can be separately controlled on each axis)
	// scale_x: 1, // TODO @many scale_x|y
	// scale_y: 1, // TODO @many scale_x|y
	// polygon
	points: [],
	// circle
	radius: 10,
});

const defaults = default_unit_json();

// TODO add a `destroy` method so it removes the body? or bulk do that at the scene or project level?
export class Unit implements Serializable<Unit_Json> {
	id: number = $state()!;
	id_string: string = $derived(this.id.toString());
	name: string = $state()!;

	behaviors: SvelteMap<Behavior_Name, Behavior> = new SvelteMap(); // TODO anything gained by making the `key` the class or something? just type safety?

	dead: boolean = $state()!;

	type: Unit_Type = $state()!;

	// TODO revisit this pattern with setters, the point is to avoid effects, could try derived and some other hacks to subscribe to changes

	// TODO #x and #y ?
	#x: number = $state()!;
	#y: number = $state()!;
	get x(): number {
		return this.#x;
	}
	set x(v: number) {
		if (this.#x === v) return;
		this.#x = v;
		this.body.x = v;
		for (const cb of this.#on_change_x) cb(v);
	}
	get y(): number {
		return this.#y;
	}
	set y(v: number) {
		if (this.#y === v) return;
		this.#y = v;
		this.body.y = v;
		for (const cb of this.#on_change_y) cb(v);
	}
	// TODO the above or below or someunit in between/else?
	// move_to(x: number, y: number): void {
	// 	this.x = x;
	// 	this.y = y;
	// 	this.body.x = x;
	// 	this.body.y = y;
	// }

	#rotation: Unit_Rotation = $state()!;
	/**
	 * radians
	 */
	get rotation(): Unit_Rotation {
		return this.#rotation;
	}
	set rotation(v: Unit_Rotation) {
		if (this.#rotation === v) return;
		this.#rotation = v;
		if (this.body.is_polygon) this.body.rotation = v;
		for (const cb of this.#on_change_rotation) cb(v);
	}
	/**
	 * `rotation` in degrees.
	 */
	rotation_degrees: Unit_Rotation = $derived((this.#rotation * 360) / (Math.PI * 2));

	velocity: number = $state()!;

	/**
	 * When `true`, applies high strength to the unit for collisions.
	 */
	pressing: boolean = $state(false);

	speed: number = $state()!;
	strength: number = $state()!; // TODO how to get the parsed version of this? a separate proprerty?
	movement_multiplier: number = $state()!; // TODO @many quick hack to make walls unpushable
	// strength_parsed: Unit_Strength = $derived(parse_strength(this.strength));
	direction_x: number = $state()!;
	direction_y: number = $state()!;
	teleporting_x: number = $state()!; // TODO @many teleporting probably shouldn't be on the data? is an intra-tick effect
	teleporting_y: number = $state()!;

	#scale: Unit_Scale = $state()!;
	get scale(): Unit_Scale {
		return this.#scale;
	}
	set scale(v: Unit_Scale) {
		if (this.#scale === v) return;
		this.#scale = v;
		const {body} = this;
		if (body.is_circle) {
			body.scale = Math.abs(v); // collisions fail with negative circle scale, but seem to work with negative polygon scale
		} else if (!body.is_point) {
			body.scale_x = v;
			body.scale_y = v;
		}
		for (const cb of this.#on_change_scale) cb(v);
	}
	// TODO @many support these - and allow/leverage negative values (interesting flipping effect, and can be separately controlled on each axis)
	// scale_x: Unit_Scale_X = $state()!;
	// scale_y: Unit_Scale_Y = $state()!;

	// circle
	#radius: Unit_Radius = $state()!;
	get radius(): Unit_Radius {
		return this.#radius;
	}
	set radius(v: Unit_Radius) {
		if (this.#radius === v) return;
		this.#radius = v;
		const {body} = this;
		if (body.is_circle) {
			body.radius = v;
		}
		for (const cb of this.#on_change_radius) cb(v);
	}

	// polygon
	#points: Array<Unit_Point> = $state()!;
	get points(): Array<Unit_Point> {
		return this.#points;
	}
	set points(v: Array<Unit_Point>) {
		if (this.type === 'circle') {
			if (v.length > 0) {
				throw Error('Cannot set circle with points');
			}
			this.#points = EMPTY_ARRAY;
			return;
		}
		if (v.length < 3) {
			// TODO maybe instead of erroring, add the missing points by just cloning?
			throw Error('Cannot set polygon with fewer than three points');
		}
		polygon_make_ccw_points(v);
		this.#points = v;
		(this.body as Polygon).set_points(this.#points);
		for (const cb of this.#on_change_points) cb(v);
	}
	// TODO this is a hack, workaround to sync points data to the collision body
	update_points(): void {
		this.points = this.#points;
	}
	is_simple_polygon: boolean = $derived(polygon_is_simple(this.#points));
	decomped: Array<Array<I_Point>> = $derived(polygon_decomp(this.#points));
	concave: boolean = $derived(this.decomped.length > 1);
	points_serialized: string = $derived(serialize_points(this.#x, this.#y, this.#points));
	// TODO @many hacky to get things working
	transformed_points: Array<I_Point> = $derived(
		transform_points(this.#points, this.#rotation, this.#scale),
	);
	transformed_points_serialized: string = $derived(
		serialize_points(this.#x, this.#y, this.transformed_points),
	);

	color: string = $derived(to_unit_fill(this));

	// TODO `bodies`, automatically decomposing concave polygons and managing multiple parts, maybe `Unit_Body` with `parts`
	body: Some_Body = $state()!;

	readonly scene: Scene;

	json: Unit_Json = $derived($state.snapshot(this));
	// TODO add either `json_compact` that omits defaults, or `json_full` that includes all properties

	constructor(
		// TODO maybe just pass the project?
		scene: Scene,
		data: Partial<Unit_Json> = EMPTY_OBJECT,
	) {
		this.scene = scene;
		this.set_json(data);
	}

	destroy(): void {
		// console.log('[unit] destroy', this);
		this.scene.project.editor.unit_selection.delete(this); // TODO @many hack added so that units can remove themselves from `editor.unit_selection`
		this.body.remove();
	}

	// TODO @many omit defaults - option? separate method?
	toJSON(): Unit_Json {
		return {
			id: this.id,
			name: this.name,
			behaviors: $state.snapshot(Array.from(this.behaviors.values())),
			dead: this.dead,
			type: this.type,
			x: this.x,
			y: this.y,
			rotation: this.rotation,
			velocity: this.velocity,
			speed: this.speed,
			strength: this.strength,
			movement_multiplier: this.movement_multiplier,
			direction_x: this.direction_x,
			direction_y: this.direction_y,
			// TODO @many teleporting probably shouldn't be on the data? is an intra-tick effect
			teleporting_x: this.teleporting_x,
			teleporting_y: this.teleporting_y,
			scale: this.scale,
			// TODO @many support these - and allow/leverage negative values (interesting flipping effect, and can be separately controlled on each axis)
			// scale_x: this.scale_x,
			// scale_y: this.scale_y,
			// circle
			radius: this.radius,
			// polygon
			points: this.#points, // TODO `$state.snapshot`
		};
	}

	set_json(value: Partial<Unit_Json>): void {
		// console.log(`[unit] set_json`, value);
		const type = value.type ?? (value.points ? 'polygon' : 'circle');

		this.#create_body(value, type);

		this.id = value.id ?? random_id();
		this.name = value.name ?? defaults.name;

		// TODO behaviors
		this.behaviors.clear();
		if (value.behaviors) {
			for (const behavior of value.behaviors) {
				const Behavior_Class = behavior_class_by_name[behavior.name];
				this.behaviors.set(behavior.name, new Behavior_Class());
			}
		}

		this.type = type;

		this.x = value.x ?? defaults.x;
		this.y = value.y ?? defaults.y;

		this.rotation = value.rotation ?? defaults.rotation;
		this.velocity = value.velocity ?? defaults.velocity;
		this.speed = value.speed ?? defaults.speed;
		this.strength = value.strength ?? defaults.strength;
		this.movement_multiplier = value.movement_multiplier ?? defaults.movement_multiplier; // TODO @many quick hack to make walls unpushable
		this.direction_x = value.direction_x ?? defaults.direction_x;
		this.direction_y = value.direction_y ?? defaults.direction_y;
		this.teleporting_x = value.teleporting_x ?? defaults.teleporting_x;
		this.teleporting_y = value.teleporting_y ?? defaults.teleporting_y;
		this.scale = value.scale ?? defaults.scale;
		// TODO @many support these - and allow/leverage negative values (interesting flipping effect, and can be separately controlled on each axis)
		// this.scale_x = data.scale_x ?? defaults.scale_x;
		// this.scale_y = data.scale_y ?? defaults.scale_y;

		this.radius = value.radius ?? defaults.radius;

		this.points =
			type === 'circle'
				? EMPTY_ARRAY
				: (value.points ?? defaults.points).map((v) => new Unit_Point(v.x, v.y));
	}

	clone(): Unit {
		// TODO should be the json variant that has no defaults (when supported)
		return new Unit(this.scene, {...this.json, id: random_id()});
	}

	/**
	 * Called by the constructor before the item instance is ready.
	 * Needs to be called if the body type changes.
	 */
	#create_body(partial: Partial<Unit_Json> | null, type: Unit_Type): void {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.body) {
			if (
				(type === 'circle' && this.body.is_circle) ||
				(type === 'polygon' && this.body.is_polygon)
			) {
				return; // already have the type we need
			}
			this.body.remove();
			console.log('removing body so it can be recreated with new type', this.body);
		}

		this.body =
			type === 'polygon'
				? this.scene.collisions.create_polygon(
						partial?.x ?? this.#x,
						partial?.y ?? this.#y,
						partial?.points ?? this.#points,
						partial?.rotation ?? this.#rotation,
						partial?.scale ?? this.#scale,
						partial?.scale ?? this.#scale,
					)
				: this.scene.collisions.create_circle(
						partial?.x ?? this.#x,
						partial?.y ?? this.#y,
						partial?.radius ?? this.#radius,
						partial?.scale ?? this.#scale,
					);
		this.body.unit = this; // add the back reference
	}

	update(_dt: number): void {
		// TODO keep this or move to systems?
	}

	remove_point(point: Unit_Point): void {
		if (this.#points.length <= 3) {
			throw Error('Cannot remove point from polygon with three or fewer points');
		}
		this.#points.splice(this.#points.indexOf(point), 1);
		this.update_points(); // TODO @many horrible hacks to deal with syncing points data - problem is point forms now change when becoming concave
	}

	add_point(point: Unit_Point): void {
		this.#points.push(point); // TODO check duplicates?
		this.update_points(); // TODO @many horrible hacks to deal with syncing points data - problem is point forms now change when becoming concave
	}

	move_transformed_point(point: Unit_Point, dx: number, dy: number): void {
		const untransformed = untransform_point(dx, dy, this.rotation, this.scale);
		point.x += untransformed.x;
		point.y += untransformed.y;
		this.update_points(); // TODO @many horrible hacks to deal with syncing points data - problem is point forms now change when becoming concave
	}

	// TODO maybe a different API, like `get_new_point_to_insert`?
	create_new_point(index = 0): Unit_Point {
		const point = this.get_next_new_point(index);
		this.add_point(point);
		return point;
	}

	/**
	 * Creates a copy of a point and inserts it before or after the original point.
	 */
	duplicate_point(point: Unit_Point, insert_before = false): Unit_Point {
		const index = this.#points.indexOf(point);
		if (index === -1) throw new Error('Point not found in polygon');

		const new_point = new Unit_Point(point.x, point.y);

		// Insert the new point before or after the source point
		const index_inserted = insert_before ? index : index + 1;
		this.#points.splice(index_inserted, 0, new_point);
		this.update_points();

		return new_point;
	}

	get_next_new_point(index = 0): Unit_Point {
		let x = 0;
		let y = 0;
		const existing = this.#points[index] as Unit_Point | undefined;
		if (!existing) {
			return new Unit_Point(0, 0);
		}
		const previous =
			index === 0
				? this.#points[this.#points.length - 1]
				: (this.#points[index - 1] as Unit_Point | undefined);
		if (previous) {
			x = (existing.x + previous.x) / 2;
			y = (existing.y + previous.y) / 2;
		} else {
			x = existing.x + 20;
			y = existing.y + 20;
		}
		return new Unit_Point(x, y);
	}

	/**
	 * Moves the unit's center point while maintaining the shape's absolute position in world space.
	 * Points are adjusted using the inverse transform to compensate for the center's movement,
	 * taking into account both rotation and scale.
	 */
	move_center_to(new_x: number, new_y: number): void {
		const dx = new_x - this.x;
		const dy = new_y - this.y;

		// Transform world-space delta into local space, accounting for both rotation and scale
		const local = untransform_point(dx, dy, this.rotation, this.scale);

		// Adjust all points to maintain their world positions
		for (const point of this.#points) {
			point.x -= local.x;
			point.y -= local.y;
		}
		this.update_points();

		// Move the center position
		this.x = new_x;
		this.y = new_y;
		this.body.x = new_x;
		this.body.y = new_y;
	}

	// TODO @many try to rework this pattern without effects for efficiency, dunno how though, maybe still sync in deriveds but with per-unit components

	#on_change_x: Array<(x: number) => void> = [];
	on_change_x(cb: (x: number) => void): Change_Unsubscriber {
		this.#on_change_x.push(cb);
		cb(this.x);
		return () => {
			const index = this.#on_change_x.indexOf(cb);
			if (index === -1) throw Error('callback not found');
			this.#on_change_x.splice(index, 1);
		};
	}

	#on_change_y: Array<(y: number) => void> = [];
	on_change_y(cb: (y: number) => void): Change_Unsubscriber {
		this.#on_change_y.push(cb);
		cb(this.#y);
		return () => {
			const index = this.#on_change_y.indexOf(cb);
			if (index === -1) throw Error('callback not found');
			this.#on_change_y.splice(index, 1);
		};
	}

	#on_change_rotation: Array<(rotation: Unit_Rotation) => void> = [];
	on_change_rotation(cb: (rotation: Unit_Rotation) => void): Change_Unsubscriber {
		this.#on_change_rotation.push(cb);
		cb(this.rotation);
		return () => {
			const index = this.#on_change_rotation.indexOf(cb);
			if (index === -1) throw Error('callback not found');
			this.#on_change_rotation.splice(index, 1);
		};
	}

	#on_change_scale: Array<(scale: Unit_Scale) => void> = [];
	on_change_scale(cb: (scale: Unit_Scale) => void): Change_Unsubscriber {
		this.#on_change_scale.push(cb);
		cb(this.#scale);
		return () => {
			const index = this.#on_change_scale.indexOf(cb);
			if (index === -1) throw Error('callback not found');
			this.#on_change_scale.splice(index, 1);
		};
	}

	#on_change_radius: Array<(radius: Unit_Radius) => void> = [];
	on_change_radius(cb: (radius: Unit_Radius) => void): Change_Unsubscriber {
		this.#on_change_radius.push(cb);
		cb(this.#radius);
		return () => {
			const index = this.#on_change_radius.indexOf(cb);
			if (index === -1) throw Error('callback not found');
			this.#on_change_radius.splice(index, 1);
		};
	}

	#on_change_points: Array<(points: Array<I_Point>) => void> = [];
	on_change_points(cb: (points: Array<I_Point>) => void): Change_Unsubscriber {
		this.#on_change_points.push(cb);
		cb(this.#points);
		return () => {
			const index = this.#on_change_points.indexOf(cb);
			if (index === -1) throw Error('callback not found');
			this.#on_change_points.splice(index, 1);
		};
	}

	add_behavior = (behavior: Behavior): void => {
		this.behaviors.set(behavior.name, behavior);
	};

	remove_behavior = (name: Behavior_Name): void => {
		this.behaviors.delete(name);
	};

	kill = (): void => {
		this.dead = true;
	};
}

export type Change_Unsubscriber = () => void;

// TODO maybe cx, cy, r, etc?'

export interface Unit_Point_Json {
	x: number;
	y: number;
}

export class Unit_Point implements I_Point, Serializable<Unit_Point_Json> {
	// TODO add a body for collisions?
	x: number = $state()!;
	y: number = $state()!;

	json: Unit_Point_Json = $derived($state.snapshot(this));

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	// TODO static factory method?

	// TODO @many omit defaults - option? separate method?
	toJSON(): Unit_Point_Json {
		return {x: this.x, y: this.y};
	}

	set_json(value: Unit_Point_Json): void {
		// console.log(`[unit_point] set_json`, value);
		this.x = value.x;
		this.y = value.y;
	}
}
