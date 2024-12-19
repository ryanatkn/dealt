/*

Adapted from https://github.com/schteppe/poly-decomp.js
by Stefan Hedman - http://steffe.se - https://github.com/schteppe

The MIT License (MIT)

Copyright (c) 2013 Stefan Hedman

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


*/

import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {
	polygon_decomp,
	polygon_is_simple,
	polygon_make_ccw,
	polygon_remove_duplicate_points,
} from '$lib/polygon_helpers.js';
import type {I_Point} from '$lib/point_helpers.js';

var concave: Array<I_Point> = [
	{x: -1, y: 1},
	{x: -1, y: 0},
	{x: 1, y: 0},
	{x: 1, y: 1},
	{x: 0.5, y: 0.5},
];
const concave2: Array<I_Point> = [
	{x: -10, y: 40},
	{x: -100, y: 20},
	{x: 10, y: -55},
	{x: -20.061746145122694, y: 1.5513760107592027},
];

var convex: Array<I_Point> = [],
	N = 10;
for (var i = 0; i < N; i++) {
	const angle = ((2 * Math.PI) / N) * i;
	convex.push({x: Math.cos(angle), y: Math.sin(angle)});
}

test('polygon_decomp', () => {
	assert.equal(polygon_decomp(convex).length, 1);
	assert.equal(polygon_decomp(concave).length, 2);
	assert.equal(polygon_decomp(concave2).length, 2);
});

test('polygon_is_simple', () => {
	const not_simple: Array<I_Point> = [
		{x: -1, y: -1},
		{x: 0, y: 0},
		{x: 1, y: 1},
		{x: 0, y: 2},
		{x: -1, y: 1},
		{x: 0, y: 0},
		{x: 1, y: -1},
	];

	assert.ok(polygon_is_simple(concave));
	assert.ok(polygon_is_simple(convex));
	assert.ok(!polygon_is_simple(not_simple));
});

test('polygon_remove_duplicate_points', () => {
	const data: Array<I_Point> = [
		{x: 0, y: 0},
		{x: 1, y: 1},
		{x: 2, y: 2},
		{x: 0, y: 0},
	];
	polygon_remove_duplicate_points(data);
	assert.equal(data.length, 3);

	const data2: Array<I_Point> = [
		{x: 0, y: 0},
		{x: 1, y: 1},
		{x: 2, y: 2},
		{x: 1, y: 1},
		{x: 0, y: 0},
		{x: 2, y: 2},
	];
	polygon_remove_duplicate_points(data2);
	assert.equal(data2.length, 3);
});

test('polygon_decomp_extra_visibility_test_fix', () => {
	// This test checks that this bug is fixed: https://github.com/schteppe/poly-decomp.js/issues/8
	const path: Array<I_Point> = [
		{x: 0, y: -134},
		{x: 50, y: -139},
		{x: 60, y: -215},
		{x: 70, y: -6},
		{x: 80, y: -236},
		{x: 110, y: -120},
		{x: 110, y: 0},
		{x: 0, y: 0},
	].map((point) => ({x: 2 * point.x + 100, y: 1 * point.y + 500}));
	polygon_make_ccw(path);
	const polys = polygon_decomp(path);
	assert.equal(polys.length, 3);

	const path2: Array<I_Point> = [
		{x: 0, y: -134},
		{x: 50, y: -139},
		{x: 60, y: -215},
		{x: 70, y: -6},
		{x: 80, y: -236},
		{x: 110, y: -120},
		{x: 110, y: 0},
		{x: 0, y: 0},
	].map((point) => ({x: 3 * point.x + 100, y: 1 * point.y + 500}));
	polygon_make_ccw(path2);
	const polys2 = polygon_decomp(path2);
	assert.equal(polys2.length, 3);

	const path3: Array<I_Point> = [
		{x: 0, y: -134},
		{x: 50, y: -139},
		{x: 60, y: -215},
		{x: 70, y: -6},
		{x: 80, y: -236},
		{x: 110, y: -120},
		{x: 110, y: 0},
		{x: 0, y: 0},
	].map((point) => ({x: -3 * point.x, y: -point.y}));
	polygon_make_ccw(path3);
	const polys3 = polygon_decomp(path3);
	assert.equal(polys3.length, 3);

	const path4: Array<I_Point> = [
		{x: 331, y: 384},
		{x: 285, y: 361},
		{x: 238, y: 386},
		{x: 283, y: 408},
		{x: 191, y: 469},
		{x: 213, y: 372},
		{x: 298, y: 314},
		{x: 342, y: 340},
	];
	polygon_make_ccw(path4);
	const polys4 = polygon_decomp(path4);
	assert.equal(polys4.length, 3);

	const path5: Array<I_Point> = [
		{x: 30, y: 80},
		{x: -60, y: 60},
		{x: 50, y: -15},
		{x: 90, y: 60},
	];
	assert.ok(!polygon_make_ccw(path5));

	const path6: Array<I_Point> = [
		{x: 90, y: 60},
		{x: 50, y: -15},
		{x: -60, y: 60},
		{x: 30, y: 80},
	];
	assert.not.equal(path5, path6);
	assert.ok(polygon_make_ccw(path6));
	assert.equal(path5, path6);
});

test.run();
