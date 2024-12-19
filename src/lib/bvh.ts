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

import {Bvh_Branch} from '$lib/bvh_branch.js';
import type {Some_Body} from '$lib/collisions.js';

export type Filter_Potentials = (body_a: Some_Body, body_b: Some_Body) => boolean;

/**
 * A Bounding Volume Hierarchy (BVH) used to find potential collisions quickly
 * @private
 */
export class Bvh {
	_hierarchy: Some_Body | Bvh_Branch | null = null;

	_bodies: Array<Some_Body> = [];

	_dirty_branches: Array<Bvh_Branch> = [];

	/**
	 * Inserts a body into the BVH
	 * @param body - The body to insert
	 * @param updating - Set to true if the body already exists in the BVH (used internally when updating the body's position)
	 */
	insert(body: Some_Body, updating = false): void {
		if (!updating) {
			const bvh = body._bvh;

			if (bvh && bvh !== this) {
				throw new Error('Body belongs to another collision system');
			}

			body._bvh = this;
			this._bodies.push(body);
		}

		const polygon = body.is_polygon;
		const body_x = body.x;
		const body_y = body.y;

		if (polygon) {
			if (
				body._dirty_coords ||
				body.x !== body._x ||
				body.y !== body._y ||
				body.angle !== body._angle ||
				body.scale_x !== body._scale_x ||
				body.scale_y !== body._scale_y
			) {
				body._calculate_coords();
			}
		}

		const padding = body._bvh_padding;
		const radius = polygon ? 0 : body.radius * body.scale;
		const body_min_x = (polygon ? body._min_x : body_x - radius) - padding;
		const body_min_y = (polygon ? body._min_y : body_y - radius) - padding;
		const body_max_x = (polygon ? body._max_x : body_x + radius) + padding;
		const body_max_y = (polygon ? body._max_y : body_y + radius) + padding;

		body._bvh_min_x = body_min_x;
		body._bvh_min_y = body_min_y;
		body._bvh_max_x = body_max_x;
		body._bvh_max_y = body_max_y;

		let current = this._hierarchy;
		let sort = 0;

		if (!current) {
			this._hierarchy = body;
		} else {
			while (true) {
				// Branch
				if (current._bvh_branch) {
					const left: Bvh_Branch = current._bvh_left as any; // TODO types?
					const left_min_y = left._bvh_min_y;
					const left_max_x = left._bvh_max_x;
					const left_max_y = left._bvh_max_y;
					const left_new_min_x = body_min_x < left._bvh_min_x ? body_min_x : left._bvh_min_x;
					const left_new_min_y = body_min_y < left_min_y ? body_min_y : left_min_y;
					const left_new_max_x = body_max_x > left_max_x ? body_max_x : left_max_x;
					const left_new_max_y = body_max_y > left_max_y ? body_max_y : left_max_y;
					const left_volume = (left_max_x - left._bvh_min_x) * (left_max_y - left_min_y);
					const left_new_volume =
						(left_new_max_x - left_new_min_x) * (left_new_max_y - left_new_min_y);
					const left_difference = left_new_volume - left_volume;

					const right: Bvh_Branch = current._bvh_right as any; // TODO types?
					const right_min_x = right._bvh_min_x;
					const right_min_y = right._bvh_min_y;
					const right_max_x = right._bvh_max_x;
					const right_max_y = right._bvh_max_y;
					const right_new_min_x = body_min_x < right_min_x ? body_min_x : right_min_x;
					const right_new_min_y = body_min_y < right_min_y ? body_min_y : right_min_y;
					const right_new_max_x = body_max_x > right_max_x ? body_max_x : right_max_x;
					const right_new_max_y = body_max_y > right_max_y ? body_max_y : right_max_y;
					const right_volume = (right_max_x - right_min_x) * (right_max_y - right_min_y);
					const right_new_volume =
						(right_new_max_x - right_new_min_x) * (right_new_max_y - right_new_min_y);
					const right_difference = right_new_volume - right_volume;

					current._bvh_sort = sort++;
					current._bvh_min_x = left_new_min_x < right_new_min_x ? left_new_min_x : right_new_min_x;
					current._bvh_min_y = left_new_min_y < right_new_min_y ? left_new_min_y : right_new_min_y;
					current._bvh_max_x = left_new_max_x > right_new_max_x ? left_new_max_x : right_new_max_x;
					current._bvh_max_y = left_new_max_y > right_new_max_y ? left_new_max_y : right_new_max_y;

					current = left_difference <= right_difference ? left : right;
				}
				// Leaf
				else {
					const grandparent = current._bvh_parent;
					const parent_min_x = current._bvh_min_x;
					const parent_min_y = current._bvh_min_y;
					const parent_max_x = current._bvh_max_x;
					const parent_max_y = current._bvh_max_y;
					const new_parent = (current._bvh_parent = body._bvh_parent = Bvh_Branch.get_branch());

					new_parent._bvh_parent = grandparent;
					new_parent._bvh_left = current;
					new_parent._bvh_right = body;
					new_parent._bvh_sort = sort++;
					new_parent._bvh_min_x = body_min_x < parent_min_x ? body_min_x : parent_min_x;
					new_parent._bvh_min_y = body_min_y < parent_min_y ? body_min_y : parent_min_y;
					new_parent._bvh_max_x = body_max_x > parent_max_x ? body_max_x : parent_max_x;
					new_parent._bvh_max_y = body_max_y > parent_max_y ? body_max_y : parent_max_y;

					if (!grandparent) {
						this._hierarchy = new_parent;
					} else if (grandparent._bvh_left === current) {
						grandparent._bvh_left = new_parent;
					} else {
						grandparent._bvh_right = new_parent;
					}

					break;
				}
			}
		}
	}

	/**
	 * Removes a body from the BVH
	 * @param body - The body to remove
	 * @param updating - Set to true if this is a temporary removal (used internally when updating the body's position)
	 */
	remove(body: Some_Body, updating = false): void {
		if (!updating) {
			const bvh = body._bvh;

			if (bvh && bvh !== this) {
				throw new Error('Body belongs to another collision system');
			}

			body._bvh = null;
			this._bodies.splice(this._bodies.indexOf(body), 1);
		}

		if (this._hierarchy === body) {
			this._hierarchy = null;

			return;
		}

		const parent = body._bvh_parent!;
		const grandparent = parent._bvh_parent;
		const parent_left = parent._bvh_left!;
		const sibling = parent_left === body ? parent._bvh_right! : parent_left;

		sibling._bvh_parent = grandparent;

		if (sibling._bvh_branch) {
			sibling._bvh_sort = parent._bvh_sort;
		}

		if (grandparent) {
			if (grandparent._bvh_left === parent) {
				grandparent._bvh_left = sibling;
			} else {
				grandparent._bvh_right = sibling;
			}

			let branch: Bvh_Branch | null = grandparent;

			while (branch) {
				const left = branch._bvh_left;
				const left_min_x = left!._bvh_min_x;
				const left_min_y = left!._bvh_min_y;
				const left_max_x = left!._bvh_max_x;
				const left_max_y = left!._bvh_max_y;

				const right = branch._bvh_right;
				const right_min_x = right!._bvh_min_x;
				const right_min_y = right!._bvh_min_y;
				const right_max_x = right!._bvh_max_x;
				const right_max_y = right!._bvh_max_y;

				branch._bvh_min_x = left_min_x < right_min_x ? left_min_x : right_min_x;
				branch._bvh_min_y = left_min_y < right_min_y ? left_min_y : right_min_y;
				branch._bvh_max_x = left_max_x > right_max_x ? left_max_x : right_max_x;
				branch._bvh_max_y = left_max_y > right_max_y ? left_max_y : right_max_y;

				branch = branch._bvh_parent;
			}
		} else {
			this._hierarchy = sibling;
		}

		Bvh_Branch.release_branch(parent);
	}

	/**
	 * Updates the BVH. Moved bodies are removed/inserted.
	 */
	update(): void {
		const bodies = this._bodies;
		const count = bodies.length;

		for (let i = 0; i < count; ++i) {
			const body = bodies[i];

			let update = false;

			if (body.padding !== body._bvh_padding) {
				body._bvh_padding = body.padding;
				update = true;
			}

			if (!update) {
				const polygon = body.is_polygon;

				if (polygon) {
					if (
						body._dirty_coords ||
						body.x !== body._x ||
						body.y !== body._y ||
						body.angle !== body._angle ||
						body.scale_x !== body._scale_x ||
						body.scale_y !== body._scale_y
					) {
						body._calculate_coords();
					}
				}

				const x = body.x;
				const y = body.y;
				const radius = polygon ? 0 : body.radius * body.scale;
				const min_x = polygon ? body._min_x : x - radius;
				const min_y = polygon ? body._min_y : y - radius;
				const max_x = polygon ? body._max_x : x + radius;
				const max_y = polygon ? body._max_y : y + radius;

				update =
					min_x < body._bvh_min_x ||
					min_y < body._bvh_min_y ||
					max_x > body._bvh_max_x ||
					max_y > body._bvh_max_y;
			}

			if (update) {
				this.remove(body, true);
				this.insert(body, true);
			}
		}
	}

	// TODO probably pass a filter to be optimal
	// TODO @benchmark probably return null instead of allocating?
	/**
	 * Returns a list of potential collisions for a body
	 * @param body - The body to test
	 */
	potentials(body: Some_Body): Array<Some_Body> {
		const results: Array<Some_Body> = [];
		const min_x = body._bvh_min_x;
		const min_y = body._bvh_min_y;
		const max_x = body._bvh_max_x;
		const max_y = body._bvh_max_y;

		let current: Some_Body | Bvh_Branch | null = this._hierarchy;
		let traverse_left = true;

		if (!current?._bvh_branch) {
			return results;
		}

		while (current) {
			if (traverse_left) {
				traverse_left = false;

				let left: Some_Body | Bvh_Branch | null = current._bvh_branch ? current._bvh_left : null;

				while (
					left &&
					left._bvh_max_x >= min_x &&
					left._bvh_max_y >= min_y &&
					left._bvh_min_x <= max_x &&
					left._bvh_min_y <= max_y
				) {
					current = left;
					left = current._bvh_branch ? current._bvh_left : null;
				}
			}

			const right: Some_Body | Bvh_Branch | null = current._bvh_branch ? current._bvh_right : null;

			if (
				right &&
				right._bvh_max_x > min_x &&
				right._bvh_max_y > min_y &&
				right._bvh_min_x < max_x &&
				right._bvh_min_y < max_y
			) {
				current = right;
				traverse_left = true;
			} else {
				if (!current._bvh_branch && current !== body) {
					results.push(current);
				}

				let parent: Bvh_Branch | null = current._bvh_parent;

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

		return results;
	}
}
