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

import {Body} from '$lib/body.js';
import type {Unit_Angle} from '$lib/unit.svelte.js';
import type {I_Point} from '$lib/point_helpers.js';

// TODO @many refactor collisions and polygon helpers types

/**
 * A polygon used to detect collisions
 */
export class Polygon<T_Point extends boolean = false> extends Body {
	override readonly is_polygon = true as const;
	override readonly is_circle = false as const;
	override readonly is_point: T_Point | false = false as const; // super weird but seems to work?

	angle: Unit_Angle;

	scale_x: number;

	scale_y: number;

	_x: number;

	_y: number;

	_angle: Unit_Angle;

	_scale_x: number;

	_scale_y: number;

	_min_x = 0;

	_min_y = 0;

	_max_x = 0;

	_max_y = 0;

	_points: Float64Array | null = null;

	_coords: Float64Array | null = null;

	_edges: Float64Array | null = null;

	_normals: Float64Array | null = null;

	_dirty_coords = true;

	_dirty_normals = true;

	/**
	 * @param x - The starting X coordinate
	 * @param y - The starting Y coordinate
	 * @param points- An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
	 * @param angle - The starting rotation in radians
	 * @param scale_x - The starting scale along the X axis
	 * @param scale_y - The starting scale long the Y axis
	 * @param padding - The amount to pad the bounding volume when testing for potential collisions
	 */
	constructor(
		x = 0,
		y = 0,
		points: Array<I_Point> = [],
		angle = 0,
		scale_x = 1,
		scale_y = 1,
		padding = 0,
	) {
		super(x, y, padding);

		this.angle = angle;

		this.scale_x = scale_x;

		this.scale_y = scale_y;

		this._x = x;

		this._y = y;

		this._angle = angle;

		this._scale_x = scale_x;

		this._scale_y = scale_y;

		Polygon.prototype.set_points.call(this, points);
	}

	/**
	 * Sets the points making up the polygon. It's important to use this function when changing the polygon's shape to ensure internal data is also updated.
	 * @param new_points - An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
	 */
	set_points(new_points: Array<I_Point>): void {
		var count = new_points.length,
			points = new Float64Array(count * 2),
			new_point: I_Point;

		this._points = points;
		this._coords = new Float64Array(count * 2);
		this._edges = new Float64Array(count * 2);
		this._normals = new Float64Array(count * 2);

		for (var i = 0, ix = 0, iy = 1; i < count; ++i, ix += 2, iy += 2) {
			new_point = new_points[i];

			points[ix] = new_point.x;
			points[iy] = new_point.y;
		}

		this._dirty_coords = true;
	}

	/**
	 * Calculates and caches the polygon's scene coordinates based on its points, angle, and scale
	 */
	_calculate_coords(): void {
		const x = this.x;
		const y = this.y;
		const angle = this.angle;
		const scale_x = this.scale_x;
		const scale_y = this.scale_y;
		const points = this._points!;
		const coords = this._coords!;
		const count = points.length;

		let min_x!: number;
		let max_x!: number;
		let min_y!: number;
		let max_y!: number;

		for (let ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
			let coord_x = points[ix] * scale_x;
			let coord_y = points[iy] * scale_y;

			if (angle !== 0) {
				const cos = Math.cos(angle);
				const sin = Math.sin(angle);
				const tmp_x = coord_x;
				const tmp_y = coord_y;

				coord_x = tmp_x * cos - tmp_y * sin;
				coord_y = tmp_x * sin + tmp_y * cos;
			}

			coord_x += x;
			coord_y += y;

			coords[ix] = coord_x;
			coords[iy] = coord_y;

			if (ix === 0) {
				min_x = max_x = coord_x;
				min_y = max_y = coord_y;
			} else {
				if (coord_x < min_x) {
					min_x = coord_x;
				} else if (coord_x > max_x) {
					max_x = coord_x;
				}

				if (coord_y < min_y) {
					min_y = coord_y;
				} else if (coord_y > max_y) {
					max_y = coord_y;
				}
			}
		}

		this._x = x;
		this._y = y;
		this._angle = angle;
		this._scale_x = scale_x;
		this._scale_y = scale_y;
		this._min_x = min_x;
		this._min_y = min_y;
		this._max_x = max_x;
		this._max_y = max_y;
		this._dirty_coords = false;
		this._dirty_normals = true;
	}

	/**
	 * Calculates the normals and edges of the polygon's sides
	 */
	_calculate_normals(): void {
		const coords = this._coords!;
		const edges = this._edges!;
		const normals = this._normals!;
		const count = coords.length;

		for (let ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
			const next = ix + 2 < count ? ix + 2 : 0;
			const x = coords[next] - coords[ix];
			const y = coords[next + 1] - coords[iy];
			const length = x || y ? Math.sqrt(x * x + y * y) : 0;

			edges[ix] = x;
			edges[iy] = y;
			normals[ix] = length ? y / length : 0;
			normals[iy] = length ? -x / length : 0;
		}

		this._dirty_normals = false;
	}
}
