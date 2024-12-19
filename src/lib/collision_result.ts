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
 * An object used to collect the detailed results of a collision test
 *
 * > **Note:** It is highly recommended you recycle the same Result object if possible in order to avoid wasting memory
 */
export class Collision_Result {
	/**
	 * True if a collision was detected
	 */
	collision = false;

	/**
	 * The source body tested
	 */
	a: Some_Body | null = null;

	/**
	 * The target body tested against
	 */
	b: Some_Body | null = null;

	/**
	 * True if A is completely contained within B
	 */
	a_in_b = false;

	/**
	 * True if B is completely contained within A
	 */
	b_in_a = false;

	/**
	 * The magnitude of the shortest axis of overlap
	 */
	overlap: number | null = 0;

	/**
	 * The X direction of the shortest axis of overlap
	 */
	overlap_x = 0;

	/**
	 * The Y direction of the shortest axis of overlap
	 */
	overlap_y = 0;
}

export const cr = new Collision_Result();
