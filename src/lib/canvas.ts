// import {Unit, to_unit_fill} from '$lib/unit.svelte.js';

import type {Unit} from '$lib/unit.svelte.js';
import type {Collisions, Some_Body} from '$lib/collisions.js';
import type {Bvh_Branch} from '$lib/bvh_branch.js';
import type {Bvh} from '$lib/bvh.js';

/**
 * Draws the bodies within the system to a CanvasRenderingContext2D's current path
 */
export const draw_collisions = (c2d: CanvasRenderingContext2D, collisions: Collisions): void => {
	draw_bvh_bodies(c2d, collisions._bvh);
};

/**
 * Draws the system's BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
 */
export const draw_collisions_bvh = (
	c2d: CanvasRenderingContext2D,
	collisions: Collisions,
): void => {
	draw_bvh(c2d, collisions._bvh);
};

/**
 * Draws the bodies within the BVH to a CanvasRenderingContext2D's current path
 */
export const draw_bvh_bodies = (c2d: CanvasRenderingContext2D, bvh: Bvh): void => {
	const bodies = bvh._bodies;
	const count = bodies.length;

	for (let i = 0; i < count; ++i) {
		draw_unit(c2d, bodies[i].unit);
	}
};

/**
 * Draws the BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
 */
export const draw_bvh = (c2d: CanvasRenderingContext2D, bvh: Bvh): void => {
	let current: Some_Body | Bvh_Branch | null = bvh._hierarchy;
	let traverse_left = true;

	while (current) {
		if (traverse_left) {
			traverse_left = false;

			let left = current._bvh_branch ? current._bvh_left : null;

			while (left) {
				current = left;
				left = current._bvh_branch ? current._bvh_left : null;
			}
		}

		const branch = current._bvh_branch;
		const min_x = current._bvh_min_x;
		const min_y = current._bvh_min_y;
		const max_x = current._bvh_max_x;
		const max_y = current._bvh_max_y;
		const right = branch ? current._bvh_right : null;

		c2d.moveTo(min_x, min_y);
		c2d.lineTo(max_x, min_y);
		c2d.lineTo(max_x, max_y);
		c2d.lineTo(min_x, max_y);
		c2d.lineTo(min_x, min_y);

		if (right) {
			current = right;
			traverse_left = true;
		} else {
			let parent = current._bvh_parent;

			if (parent) {
				while (parent && parent._bvh_right === current) {
					current = parent;
					parent = current._bvh_parent;
				}

				current = parent;
			} else {
				break;
			}
		}
	}
};

export const draw_unit = (c2d: CanvasRenderingContext2D, unit: Unit): void => {
	if (unit.body.is_polygon) {
		draw_polygon(c2d, unit); // TODO draws points too, but should it be a different path?
	} else {
		draw_circle(c2d, unit);
	}
};

/**
 * Draws the circle to a CanvasRenderingContext2D's current path
 */
export const draw_circle = (c2d: CanvasRenderingContext2D, unit: Unit): void => {
	const x = unit.x;
	const y = unit.y;
	const radius = unit.radius * Math.abs(unit.scale);
	c2d.moveTo(x + radius, y);
	c2d.arc(x, y, radius, 0, Math.PI * 2);
};

// TODO this is hacky with the data syncing between the unit and body
/**
 * Draws the polygon to a CanvasRenderingContext2D's current path
 */
export const draw_polygon = (c2d: CanvasRenderingContext2D, unit: Unit): void => {
	const {body} = unit;
	if (!body.is_polygon) throw Error('Expected a polygon');
	const {x, y, angle, points} = unit;
	if (
		body._dirty_coords ||
		x !== body._x ||
		y !== body._y ||
		angle !== body._angle ||
		body.scale_x !== body._scale_x ||
		body.scale_y !== body._scale_y
	) {
		body._calculate_coords();
	}

	// TODO hacky, just reading signals for redraws
	unit.scale;
	for (var p of points) {
		p.x;
		p.y;
	}

	const coords = body._coords;
	if (coords === null) return;
	if (coords.length === 2) {
		c2d.moveTo(coords[0], coords[1]);
		c2d.arc(coords[0], coords[1], 1, 0, Math.PI * 2);
	} else {
		c2d.moveTo(coords[0], coords[1]);

		for (let i = 2; i < coords.length; i += 2) {
			c2d.lineTo(coords[i], coords[i + 1]);
		}

		if (coords.length > 4) {
			c2d.lineTo(coords[0], coords[1]);
		}
	}
};

// /**
//  * Draws the circle to a CanvasRenderingContext2D's current path
//  * @param unit
//  * @param c2d
//  */
// export const draw_circle = (unit: Unit, c2d: CanvasRenderingContext2D): void => {
// 	// console.log(`[canvas] draw unit`, unit);
// 	const {x, y} = unit;
// 	const radius = unit.radius * Math.abs(unit.scale);

// 	c2d.fillStyle = unit.color;

// 	c2d.moveTo(x + radius, y);
// 	c2d.arc(x, y, radius, 0, Math.PI * 2);
// 	c2d.fill(); // TODO optimize
// };

// /**
//  * Draws the polygon to a CanvasRenderingContext2D's current path
//  * @param unit
//  * @param c2d
//  */
// export const draw_polygon = (unit: Unit, c2d: CanvasRenderingContext2D): void => {
// 	// console.log(`[canvas] draw unit`, unit);
// 	const {x, y, points} = unit;

// 	c2d.fillStyle = unit.color;

// 	const p0x = points[0].x + x;
// 	const p0y = points[0].y + y;

// 	c2d.moveTo(p0x, p0y);
// 	for (var i = 1, length = points.length; i < length; i++) {
// 		const point = points[i];
// 		c2d.lineTo(point.x + x, point.y + y);
// 	}
// 	c2d.lineTo(p0x, p0y);
// 	c2d.fill(); // TODO optimize
// };

// const draw = (): void => {
// 	if (!c2d) return;
// 	// Clear the canvas
// 	c2d.fillStyle = '#000';
// 	c2d.fillRect(0, 0, renderer.width, renderer.height);

// 	// Render the bodies
// 	c2d.strokeStyle = '#fff';
// 	c2d.beginPath();
// 	for (const p of scene.units) {
// 		p; // TODO just rendering
// 	}
// 	collisions.draw(c2d);
// 	c2d.stroke();

// 	// Render the BVH
// 	if (renderer.show_bvh) {
// 		c2d.strokeStyle = renderer.bvh_color;
// 		c2d.beginPath();
// 		collisions.draw_bvh(c2d);
// 		c2d.stroke();
// 	}
// };
