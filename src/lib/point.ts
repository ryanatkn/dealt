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

import {Polygon} from '$lib/polygon.js';

// TODO @many refactor collisions and polygon helpers types

/**
 * A point used to detect collisions
 */
export class Point extends Polygon<true> {
	override readonly is_polygon = true as const;
	override readonly is_circle = false as const;
	override readonly is_point = true as const;

	/**
	 * @param x - The starting X coordinate
	 * @param y - The starting Y coordinate
	 * @param padding - The amount to pad the bounding volume when testing for potential collisions
	 */
	constructor(x = 0, y = 0, padding = 0) {
		super(x, y, [{x: 0, y: 0}], 0, 1, 1, padding);
	}

	override set_points = undefined as any;
}
