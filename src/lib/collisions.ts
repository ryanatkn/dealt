/*

Adapted from https://github.com/Sinova/Collisions

MIT License

Copyright (c) 2017 Sinova

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import {Bvh} from '$lib/bvh.js';
import {Circle} from '$lib/circle.js';
import {Polygon} from '$lib/polygon.js';
import {Point} from '$lib/point.js';
import type {I_Point} from '$lib/point_helpers.js';

// TODO name? `Base_Body` and make this `Body`?
export type Some_Body = Circle | Polygon | Point;

export type Filter_Potentials = (body_a: Some_Body, body_b: Some_Body) => boolean;

/**
 * A collision system used to track bodies in order to improve collision detection performance
 */
export class Collisions {
	_bvh = new Bvh();

	/**
	 * Creates a `Circle` and inserts it into the collision system
	 * @param x - The starting X coordinate
	 * @param y - The starting Y coordinate
	 * @param radius - The radius
	 * @param scale - The scale
	 * @param padding - The amount to pad the bounding volume when testing for potential collisions
	 */
	create_circle(x = 0, y = 0, radius = 0, scale = 1, padding = 0): Circle {
		const body = new Circle(x, y, radius, scale, padding);

		this._bvh.insert(body);

		return body;
	}

	/**
	 * Creates a `Polygon` and inserts it into the collision system
	 * @param x - The starting X coordinate
	 * @param y - The starting Y coordinate
	 * @param points - An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
	 * @param rotation - The starting rotation in radians
	 * @param scale_x - The starting scale along the X axis
	 * @param scale_y - The starting scale long the Y axis
	 * @param padding - The amount to pad the bounding volume when testing for potential collisions
	 */
	create_polygon(
		x = 0,
		y = 0,
		points: Array<I_Point> = [{x: 0, y: 0}],
		rotation = 0,
		scale_x = 1,
		scale_y = 1,
		padding = 0,
	): Polygon {
		const body = new Polygon(x, y, points, rotation, scale_x, scale_y, padding);

		this._bvh.insert(body);

		return body;
	}

	/**
	 * Creates a `Point` and inserts it into the collision system
	 * @param {Number} [x = 0] The starting X coordinate
	 * @param {Number} [y = 0] The starting Y coordinate
	 * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
	 * @returns {Point}
	 */
	create_point(x = 0, y = 0, padding = 0): Point {
		const body = new Point(x, y, padding);

		this._bvh.insert(body);

		return body;
	}

	/**
	 * Inserts bodies into the collision system
	 */
	insert(...bodies: Array<Some_Body>): this {
		for (const body of bodies) {
			this._bvh.insert(body, false);
		}

		return this;
	}

	/**
	 * Removes bodies from the collision system
	 */
	remove(...bodies: Array<Some_Body>): this {
		for (const body of bodies) {
			this._bvh.remove(body, false);
		}

		return this;
	}

	/**
	 * Updates the collision system. This should be called before any collisions are tested.
	 */
	update(): this {
		this._bvh.update();

		return this;
	}

	/**
	 * Returns a list of potential collisions for a body
	 * @param body - The body to test for potential collisions against
	 */
	potentials(body: Some_Body): Array<Some_Body> {
		return this._bvh.potentials(body);
	}
}
