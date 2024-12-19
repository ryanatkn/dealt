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

import type {Some_Body} from '$lib/collisions.js';

/**
 * A branch within a BVH
 */
export class Bvh_Branch {
	readonly _bvh_branch = true as const;

	_bvh_parent: Bvh_Branch | null = null;

	_bvh_left: Bvh_Branch | Some_Body | null = null;

	_bvh_right: Bvh_Branch | Some_Body | null = null;

	_bvh_sort = 0;

	_bvh_min_x = 0;

	_bvh_min_y = 0;

	_bvh_max_x = 0;

	_bvh_max_y = 0;

	static branch_pool: Array<Bvh_Branch> = [];

	/**
	 * Returns a branch from the branch pool or creates a new branch
	 */
	static get_branch(pool = Bvh_Branch.branch_pool): Bvh_Branch {
		return pool.pop() ?? new Bvh_Branch();
	}

	/**
	 * Releases a branch back into the branch pool
	 * @param branch The branch to release
	 */
	static release_branch(branch: Bvh_Branch, pool = Bvh_Branch.branch_pool): void {
		pool.push(branch);
	}
}
