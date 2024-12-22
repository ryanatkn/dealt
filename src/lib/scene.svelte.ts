import type {Flavored} from '@ryanatkn/belt/types.js';
import {EMPTY_OBJECT} from '@ryanatkn/belt/object.js';
import {count_graphemes} from '@ryanatkn/belt/string.js';

import {random_id, type Id} from '$lib/id.js';
import {Unit, type Unit_Json} from '$lib/unit.svelte.js';
import {Collisions} from '$lib/collisions.js';
import {Simulation} from '$lib/simulation.svelte.js';
import {Controller} from '$lib/controller.svelte.js';
import {handle_collision} from '$lib/collision_helpers.js';
import {filter_or_undefined, type Thunked} from '$lib/helpers.js';
import {load_from_storage, set_in_storage} from '$lib/storage.js';
import {Clock} from '$lib/clock.svelte.js';
import {Renderer} from '$lib/renderer.svelte.js';
import type {Serializable} from '$lib/serializable.js';
import type {Behavior_Name} from '$lib/behaviors.js';
import {Point} from '$lib/point.js';
import {Polygon} from '$lib/polygon.js';
import {colliding} from '$lib/colliding.js';
import type {Project} from '$lib/project.svelte.js';
import type {Editor} from '$lib/editor.svelte.js';

export type Scene_Id = Id | Flavored<number, 'Scene_Id'>;

// type Name = string; // TODO like `Id`?
export type Scene_Name = Flavored<string, 'Scene_Name'>;
export type Scene_Glyph = Flavored<string, 'Scene_Glyph'>;

// TODO `Scene_Info`?
export interface Scene_Metadata_Json {
	id: Scene_Id;
	name: Scene_Name;
	glyph: Scene_Glyph;
}

export interface Scene_Json {
	id: Scene_Id;
	name: Scene_Name;
	glyph: Scene_Glyph;
	units: Array<Partial<Unit_Json>>;
}

export const default_scene_metadata: Thunked<Scene_Metadata_Json> = {
	id: () => random_id(),
	name: () => 'untitled scene',
	glyph: () => '🌐',
};

// TODO this is an experiment compared to just returning the object, refactor with the others
export const default_scene_json: Thunked<Scene_Json> = {
	id: () => default_scene_metadata.id(),
	name: () => default_scene_metadata.name(),
	glyph: () => default_scene_metadata.glyph(),
	units: () => [],
};

export const parse_scene_metadata_json = (v: any): Scene_Metadata_Json => {
	return {
		id: typeof v?.id === 'number' && !Number.isNaN(v.id) ? v.id : default_scene_json.id(),
		name: typeof v?.name === 'string' ? v.name : default_scene_json.name(),
		glyph:
			typeof v?.glyph === 'string' && count_graphemes(v.glyph) === 1
				? v.glyph
				: default_scene_json.glyph(),
	};
};

export const parse_scene_json = (v: any): Scene_Json => {
	const m = parse_scene_metadata_json(v);
	return {
		id: m.id,
		name: m.name,
		glyph: m.glyph,
		units: Array.isArray(v?.units) ? v.units : default_scene_json.units(),
	};
};

export const get_next_scene_name = (
	scenes: Array<{name: Scene_Name}>,
	json: {name: Scene_Name},
): Scene_Name => {
	let name = json.name;
	let i = 1;
	while (scenes.some((p) => p.name === name)) {
		name = json.name + ' ' + ++i;
	}
	return name;
};

export interface Scene_Options {
	project: Project;
	scene_json?: Partial<Scene_Json>;
}

// TODO rename? `Simulation`? `Scene_Simulation`?
export class Scene implements Serializable<Scene_Json> {
	// TODO accept as a param? is this the desired pattern?
	readonly metadata = new Scene_Metadata();

	#id: Scene_Id = $state()!;
	get id(): Scene_Id {
		return this.#id;
	}
	set id(value: Scene_Id) {
		this.#id = value;
		this.metadata.id = value; // TODO refactor?
	}

	#name: Scene_Name = $state()!;
	get name(): Scene_Name {
		return this.#name;
	}
	set name(value: Scene_Name) {
		this.#name = value;
		this.metadata.name = value; // TODO refactor?
	}

	#glyph: Scene_Glyph = $state()!;
	get glyph(): Scene_Glyph {
		return this.#glyph;
	}
	set glyph(value: Scene_Glyph) {
		this.#glyph = value;
		this.metadata.glyph = value; // TODO refactor?
	}

	json: Scene_Json = $derived($state.snapshot(this));
	serialized: string | undefined | Error = $state();

	json_initial: Scene_Json; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects

	readonly project: Project;
	// These are all copied from the `project` for convenience.
	readonly editor: Editor;
	readonly clock: Clock;
	readonly renderer: Renderer;
	readonly collisions: Collisions;
	readonly simulation: Simulation;
	readonly controller: Controller;

	units: Array<Unit> = $state([]);

	constructor(options: Scene_Options) {
		console.log(`[scene] new with options`, options);
		const {project, scene_json} = options;

		this.project = project;
		this.editor = project.editor;
		this.clock = project.clock;
		this.renderer = project.renderer;
		this.collisions = project.collisions;
		this.simulation = project.simulation;
		this.controller = project.controller;

		const parsed = parse_scene_json(scene_json);
		this.json_initial = parsed; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects
		this.set_json(parsed);
	}

	// TODO @many omit defaults - option? separate method?
	toJSON(): Scene_Json {
		return {
			id: this.id,
			name: this.#name,
			glyph: this.#glyph,
			units: this.units.map((unit) => unit.json),
		};
	}

	set_json(value: Scene_Json): void {
		console.log(`[scene] set_json`, value);
		this.id = value.id; // the setter forwards to `metadata`
		this.name = value.name; // the setter forwards to `metadata`
		this.glyph = value.glyph; // the setter forwards to `metadata`
		this.#create_units(value);
	}

	save(scene_json: Scene_Json = this.json): void {
		this.json_initial = scene_json; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects
		this.serialized = Scene.save(scene_json); // TODO probably separate serialization comcerns from saving
	}

	loaded = $state(false); // TODO see usage, messy

	load(): void {
		if (this.loaded) return;
		this.set_json(Scene.load(this.id));
		this.loaded = true;
	}

	static load(scene_id: Scene_Id): Scene_Json {
		console.log(`[scene] loading scene_id`, scene_id);
		return load_from_storage(
			Scene.get_storage_key(scene_id),
			() => parse_scene_json(null), // TODO either add `id` or refactor - should this return `undefined` instead of having a default?
			parse_scene_json,
			true, // init the data in storage so it can be looked up from metadata
		);
	}

	static save(scene_json: Scene_Json): string | undefined | Error {
		console.log('[scene] saving json', scene_json);
		return set_in_storage(Scene.get_storage_key(scene_json.id), scene_json);
	}

	static get_storage_key(scene_id: Scene_Id): string {
		return 'scene_' + scene_id;
	}

	#create_units(value: Scene_Json): void {
		this.#destroy_units();
		this.units = value.units.map((unit_json) => new Unit(this, unit_json));
	}

	// TODO what if we had defaults generically on `Serializable`?
	// to_compact_json(): Partial<Scene_Json> {
	// 	return omit_values(this.json, scene_json_defaults);
	// }

	clone(partial?: Partial<Scene_Json>): Scene {
		const scene_json = $state.snapshot(this); // not accessing `.json` so we get a copy, but is there a better pattern?
		if (partial) Object.assign(scene_json, partial); // TODO better merging?
		const scene = new Scene({project: this.project, scene_json});
		return scene;
	}

	destroy(): void {
		this.#destroy_units();
	}

	#destroy_units(): void {
		const {units} = this;
		if (units.length) {
			for (const unit of units) {
				unit.destroy();
			}
			units.length = 0;
		}
	}

	reset(data: Scene_Json | null = this.json_initial): void {
		this.destroy();
		if (data !== null) {
			this.set_json(data);
		}
	}

	exit(): void {
		alert('you reached the portal! but it just loops you back to the start.. for now'); // eslint-disable-line no-alert
		this.controller.reset(); // TODO @many hack - keyup isn't running with the alert, so this is just a quick fix
		this.reset();
	}

	add_unit(unit: Unit): Unit {
		this.units.push(unit); // TODO unshift makes this crazy slow, is that expected?
		return unit;
	}

	remove_unit(unit: Unit): void {
		const index = this.units.indexOf(unit);
		if (index === -1) return;
		this.units.splice(index, 1);
		unit.destroy(); // TODO maybe a flag? or separate composed API that isn't destructive?
	}

	move_unit(from_index: number, to_index: number): void {
		if (from_index === to_index) return;
		const unit = this.units[from_index];
		this.units.splice(from_index, 1);
		this.units.splice(to_index, 0, unit);
	}

	// TODO here? in sim?
	// time = 0;

	// TODO should this be called by the simulation ticks?
	/**
	 * Updates the stage's simulation by a `dt` amount of time.
	 * @param dt The time delta in milliseconds after `time_dilation` is applied, if the implementing stage wants.
	 */
	update(dt: number): void {
		// TODO time dilation controls
		// this.time += dt; // TODO maybe don't track this on the stage? clock only?

		const {editor, controller} = this;

		controller.update(dt);

		// TODO hacky
		if (editor.players && editor.player_input_enabled) {
			for (const player of editor.players) {
				if (!player.dead) {
					player.direction_x = controller.moving_x;
					player.direction_y = controller.moving_y;
				}
				player.teleporting_x = controller.teleporting_x ?? 0;
				player.teleporting_y = controller.teleporting_y ?? 0;
			}
		}

		// TODO @many this is a hack copied over from the clock to let demos properly sequence updates
		for (const cb of this.callbacks) {
			cb(dt);
		}

		this.simulation.update(this.units, dt, handle_collision);

		// TODO how to do this? systems?
		for (const unit of this.units) {
			unit.update(dt);
		}

		// console.log(`[scene] update`, this.time);
	}

	// TODO @many this is a hack copied over from the clock to let demos properly sequence updates
	callbacks: Array<Scene_Update_Callback> = [];
	onupdate(callback: Scene_Update_Callback): () => void {
		this.callbacks.push(callback);
		return () => {
			const index = this.callbacks.indexOf(callback);
			if (index === -1) throw Error('callback not found');
			this.callbacks.splice(index, 1);
		};
	}

	filter_units_by_behavior(
		behavior_name: Behavior_Name,
		filter?: Unit_Filter,
	): Array<Unit> | undefined {
		const {units} = this;
		return filter_or_undefined(
			units,
			(unit, index, items) =>
				unit.behaviors.has(behavior_name) && (!filter || filter(unit, index, items)),
		);
	}

	pointer_body: Point | undefined;
	selection_polygon: Polygon | undefined;

	find_top_unit_at_point = (scene_x: number, scene_y: number): Unit | null => {
		let {pointer_body} = this;
		if (!pointer_body) {
			this.pointer_body = pointer_body = new Point(scene_x, scene_y);
		} else {
			pointer_body.x = scene_x;
			pointer_body.y = scene_y;
		}
		// Iterate backwards to get the topmost unit
		const {units} = this;
		for (let i = units.length - 1; i >= 0; i--) {
			const unit = units[i];
			if (colliding(pointer_body, unit.body)) {
				return unit;
			}
		}
		return null;
	};

	find_all_units_in_rect = (x: number, y: number, width: number, height: number): Array<Unit> => {
		let {selection_polygon} = this;
		if (!selection_polygon) {
			this.selection_polygon = selection_polygon = new Polygon();
		}
		selection_polygon.x = x;
		selection_polygon.y = y;
		selection_polygon.set_points([
			{x: 0, y: 0},
			{x: width, y: 0},
			{x: width, y: height},
			{x: 0, y: height},
		]);
		return this.units.filter((unit) => colliding(selection_polygon, unit.body));
	};
}

// TODO @many this is a hack copied over from the clock to let demos properly sequence updates
export type Scene_Update_Callback = (dt: number) => void;

export type Unit_Filter = (unit: Unit, index: number, array: Array<Unit>) => boolean;

export interface Scene_Metadata_Options {
	scene_metadata_data?: Scene_Metadata_Json; // TODO accept a partial?
}

export class Scene_Metadata implements Serializable<Scene_Metadata_Json> {
	id: Scene_Id = $state()!;
	name: Scene_Name = $state()!;
	glyph: string = $state()!;

	json: Scene_Metadata_Json = $derived($state.snapshot(this));

	constructor(options: Scene_Metadata_Options = EMPTY_OBJECT) {
		const {scene_metadata_data = parse_scene_metadata_json(null)} = options;

		// TODO parse? `parse_scene_metadata_data`
		this.set_json(scene_metadata_data); // TODO load like with app data
	}

	// TODO @many omit defaults - option? separate method?
	toJSON(): Scene_Metadata_Json {
		return {
			id: this.id,
			name: this.name,
			glyph: this.glyph,
		};
	}

	set_json(value: Scene_Metadata_Json): void {
		console.log(`[scene_metadata] set_json`, value);
		this.id = value.id;
		this.name = value.name;
		this.glyph = value.glyph;
	}
}

export const to_scene_metadata_json = (scene: Scene_Json): Scene_Metadata_Json => ({
	id: scene.id,
	name: scene.name,
	glyph: scene.glyph,
});

// TODO refactor - return an error message?
export const check_scene_glyph = (value: any): string | null => {
	if (typeof value !== 'string') return 'glyph is required';
	if (count_graphemes(value) !== 1) return 'glyph must be a single character';
	return null;
};
