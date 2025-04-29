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

	_bvh_left = null;

	_bvh_right = null;
*/

import type {Bvh} from '$lib/bvh.js';
import type {Bvh_Branch} from '$lib/bvh_branch.js';
import type {Some_Body} from '$lib/collisions.js';
import type {Unit} from '$lib/unit.svelte.js';
import type {I_Point} from '$lib/point_helpers.js';

// TODO @many refactor collisions and polygon helpers types

/**
 * The base class for bodies used to detect collisions
 * @protected
 */
export class Body implements I_Point {
	unit!: Unit;

	is_circle = false;
	is_polygon = false;
	is_point = false;

	/**
	 * @desc The X coordinate of the body
	 * @type {Number}
	 */
	x: number;

	/**
	 * @desc The Y coordinate of the body
	 * @type {Number}
	 */
	y: number;

	/**
	 * @desc The amount to pad the bounding volume when testing for potential collisions
	 * @type {Number}
	 */
	padding: number;

	readonly _bvh_branch = false as const;

	_bvh: Bvh | null = null;

	_bvh_parent: Bvh_Branch | null = null;

	_bvh_padding: number;

	_bvh_min_x = 0;

	_bvh_min_y = 0;

	_bvh_max_x = 0;

	_bvh_max_y = 0;

	/**
	 * @param x - The starting X coordinate
	 * @param y - The starting Y coordinate
	 * @param padding - The amount to pad the bounding volume when testing for potential collisions
	 */
	constructor(x = 0, y = 0, padding = 0) {
		this.x = x;
		this.y = y;
		this.padding = padding;
		this._bvh_padding = padding;
	}

	/**
	 * Returns a list of potential collisions
	 */
	potentials(): Array<Some_Body> {
		const bvh = this._bvh;

		if (bvh === null) {
			throw Error('Body does not belong to a collision system');
		}

		return bvh.potentials(this as any);
	}

	/**
	 * Removes the body from its current collision system
	 */
	remove(): void {
		const bvh = this._bvh;

		if (bvh) {
			bvh.remove(this as any, false);
		}
	}
}
