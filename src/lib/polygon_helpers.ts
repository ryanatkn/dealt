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

import type {I_Point} from '$lib/point_helpers.js';

// TODO faster convex detection than decomping? no usecase yet but seems likely, @see https://stackoverflow.com/questions/471962/how-do-i-efficiently-determine-if-a-polygon-is-convex-non-convex-or-complex

/*

The library's optimal algorithm has bugs like this one, so I removed that code.
Some cases are infinite loops too so it doesn't seem worth trying to fix.
@see https://github.com/schteppe/poly-decomp.js/issues/9

const failing_case: Array<I_Point> = [
	{x: -10, y: 40},
	{x: -100, y: 20},
	{x: 10, y: -55},
	{x: -20.061746145122694, y: 1.5513760107592027},
];

*/

/**
 * Make sure that the polygon vertices are ordered counter-clockwise.
 */
export const polygon_make_ccw = (polygon: Array<I_Point>): boolean => {
	var br = 0,
		v = polygon;

	// find bottom right point
	for (var i = 1; i < polygon.length; ++i) {
		if (v[i].y < v[br].y || (v[i].y === v[br].y && v[i].x > v[br].x)) {
			br = i;
		}
	}

	// reverse poly if clockwise
	if (!is_left(polygon_at(polygon, br - 1), polygon_at(polygon, br), polygon_at(polygon, br + 1))) {
		polygon.reverse();
		return true;
	} else {
		return false;
	}
};

/**
 * Same as `polygon_make_ccw` but for `Point` objects instead of `Vertex` tuples.
 */
export const polygon_make_ccw_points = (polygon: Array<I_Point>): boolean => {
	var br = 0,
		v = polygon;

	// find bottom right point
	for (var i = 1; i < polygon.length; ++i) {
		if (v[i].y < v[br].y || (v[i].y === v[br].y && v[i].x > v[br].x)) {
			br = i;
		}
	}

	// reverse poly if clockwise
	if (
		!is_left_points(
			polygon_at(polygon, br - 1),
			polygon_at(polygon, br),
			polygon_at(polygon, br + 1),
		)
	) {
		polygon.reverse();
		return true;
	} else {
		return false;
	}
};

/**
 * Checks that the line segments of this polygon do not intersect each other.
 * @param path - An array of vertices e.g. `[{x: 0, y: 0}, {x: 0, y: 1}, ...]`
 * @todo Should it check all segments with all others?
 */
export const polygon_is_simple = (polygon: Array<I_Point>): boolean => {
	var path = polygon,
		i;
	// Check
	for (i = 0; i < path.length - 1; i++) {
		for (var j = 0; j < i - 1; j++) {
			if (line_segments_intersect(path[i], path[i + 1], path[j], path[j + 1])) {
				return false;
			}
		}
	}

	// Check the segment between the last and the first point to all others
	for (i = 1; i < path.length - 2; i++) {
		if (line_segments_intersect(path[0], path[path.length - 1], path[i], path[i + 1])) {
			return false;
		}
	}

	return true;
};

/**
 * Quickly decompose the Polygon into convex sub-polygons.
 */
export const polygon_decomp = (
	polygon: Array<I_Point>,
	result: Array<Array<I_Point>> = [],
	reflex_vertices: Array<I_Point> = [],
	steiner_positions: Array<I_Point> = [],
	delta = 25,
	maxlevel = 100,
	current_level = 0,
): Array<Array<I_Point>> => {
	var level = current_level,
		// points
		upper_int: I_Point = {x: 0, y: 0},
		lower_int: I_Point = {x: 0, y: 0},
		p: I_Point = {x: 0, y: 0},
		// scalars
		upper_dist = 0,
		lower_dist = 0,
		d = 0,
		closest_dist = 0,
		// integers
		upper_index = 0,
		lower_index = 0,
		closest_index = 0,
		i,
		j,
		// polygons
		lower_poly: Array<I_Point> = [],
		upper_poly: Array<I_Point> = [],
		count = polygon.length;

	if (count < 3) {
		return result;
	}

	level++;
	if (level > maxlevel) {
		console.warn('polygon_decomp: max level (' + maxlevel + ') reached.');
		return result;
	}

	for (i = 0; i < count; ++i) {
		if (polygon_is_reflex(polygon, i)) {
			reflex_vertices.push(polygon[i]);
			upper_dist = lower_dist = Number.MAX_VALUE;

			for (j = 0; j < count; ++j) {
				if (
					is_left(polygon_at(polygon, i - 1), polygon_at(polygon, i), polygon_at(polygon, j)) &&
					is_right_on(
						polygon_at(polygon, i - 1),
						polygon_at(polygon, i),
						polygon_at(polygon, j - 1),
					)
				) {
					// if line intersects with an edge
					p = get_intersection_point(
						polygon_at(polygon, i - 1),
						polygon_at(polygon, i),
						polygon_at(polygon, j),
						polygon_at(polygon, j - 1),
					); // find the point of intersection
					if (is_right(polygon_at(polygon, i + 1), polygon_at(polygon, i), p)) {
						// make sure it's inside the poly
						d = sqdist(polygon[i], p);
						if (d < lower_dist) {
							// keep only the closest intersection
							lower_dist = d;
							lower_int = p;
							lower_index = j;
						}
					}
				}
				if (
					is_left(polygon_at(polygon, i + 1), polygon_at(polygon, i), polygon_at(polygon, j + 1)) &&
					is_right_on(polygon_at(polygon, i + 1), polygon_at(polygon, i), polygon_at(polygon, j))
				) {
					p = get_intersection_point(
						polygon_at(polygon, i + 1),
						polygon_at(polygon, i),
						polygon_at(polygon, j),
						polygon_at(polygon, j + 1),
					);
					if (is_left(polygon_at(polygon, i - 1), polygon_at(polygon, i), p)) {
						d = sqdist(polygon[i], p);
						if (d < upper_dist) {
							upper_dist = d;
							upper_int = p;
							upper_index = j;
						}
					}
				}
			}

			// if there are no vertices to connect to, choose a point in the middle
			if (lower_index === (upper_index + 1) % count) {
				p.x = (lower_int.x + upper_int.x) / 2;
				p.y = (lower_int.y + upper_int.y) / 2;
				steiner_positions.push(p);

				if (i < upper_index) {
					polygon_append(lower_poly, polygon, i, upper_index + 1);
					lower_poly.push(p);
					upper_poly.push(p);
					if (lower_index !== 0) {
						polygon_append(upper_poly, polygon, lower_index, count);
					}
					polygon_append(upper_poly, polygon, 0, i + 1);
				} else {
					if (i !== 0) {
						polygon_append(lower_poly, polygon, i, count);
					}
					polygon_append(lower_poly, polygon, 0, upper_index + 1);
					lower_poly.push(p);
					upper_poly.push(p);
					polygon_append(upper_poly, polygon, lower_index, i + 1);
				}
			} else {
				// connect to the closest point within the triangle

				if (lower_index > upper_index) {
					upper_index += count;
				}
				closest_dist = Number.MAX_VALUE;

				if (upper_index < lower_index) {
					return result;
				}

				for (j = lower_index; j <= upper_index; ++j) {
					if (
						is_left_on(
							polygon_at(polygon, i - 1),
							polygon_at(polygon, i),
							polygon_at(polygon, j),
						) &&
						is_right_on(polygon_at(polygon, i + 1), polygon_at(polygon, i), polygon_at(polygon, j))
					) {
						d = sqdist(polygon_at(polygon, i), polygon_at(polygon, j));
						if (d < closest_dist && polygon_can_see(polygon, i, j)) {
							closest_dist = d;
							closest_index = j % count;
						}
					}
				}

				if (i < closest_index) {
					polygon_append(lower_poly, polygon, i, closest_index + 1);
					if (closest_index !== 0) {
						polygon_append(upper_poly, polygon, closest_index, count);
					}
					polygon_append(upper_poly, polygon, 0, i + 1);
				} else {
					if (i !== 0) {
						polygon_append(lower_poly, polygon, i, count);
					}
					polygon_append(lower_poly, polygon, 0, closest_index + 1);
					polygon_append(upper_poly, polygon, closest_index, i + 1);
				}
			}

			// solve smallest poly first
			if (lower_poly.length < upper_poly.length) {
				polygon_decomp(
					lower_poly,
					result,
					reflex_vertices,
					steiner_positions,
					delta,
					maxlevel,
					level,
				);
				polygon_decomp(
					upper_poly,
					result,
					reflex_vertices,
					steiner_positions,
					delta,
					maxlevel,
					level,
				);
			} else {
				polygon_decomp(
					upper_poly,
					result,
					reflex_vertices,
					steiner_positions,
					delta,
					maxlevel,
					level,
				);
				polygon_decomp(
					lower_poly,
					result,
					reflex_vertices,
					steiner_positions,
					delta,
					maxlevel,
					level,
				);
			}

			return result;
		}
	}
	result.push(polygon);

	return result;
};

/**
 * Remove collinear points in the polygon.
 * @returns The number of points removed
 */
export const polygon_remove_collinear_positions = (
	polygon: Array<I_Point>,
	precision: number,
): number => {
	var i,
		num = 0;
	for (i = polygon.length - 1; polygon.length > 3 && i >= 0; --i) {
		if (
			collinear(
				polygon_at(polygon, i - 1),
				polygon_at(polygon, i),
				polygon_at(polygon, i + 1),
				precision,
			)
		) {
			// Remove the middle point
			polygon.splice(i % polygon.length, 1);
			num++;
		}
	}
	return num;
};

/**
 * Remove duplicate points in the polygon.
 */
export const polygon_remove_duplicate_points = (polygon: Array<I_Point>, precision = 0): void => {
	var i, j, pi;
	for (i = polygon.length - 1; i >= 1; --i) {
		pi = polygon[i];
		for (j = i - 1; j >= 0; --j) {
			if (points_eq(pi, polygon[j], precision)) {
				polygon.splice(i, 1);
				continue;
			}
		}
	}
};

/**
 * Checks if two line segments intersects.
 * @param p1 - The start vertex of the first line segment.
 * @param p2 - The end vertex of the first line segment.
 * @param q1 - The start vertex of the second line segment.
 * @param q2 - The end vertex of the second line segment.
 * @returns True if the two line segments intersect
 */
const line_segments_intersect = (p1: I_Point, p2: I_Point, q1: I_Point, q2: I_Point): boolean => {
	var dx = p2.x - p1.x,
		dy = p2.y - p1.y,
		da = q2.x - q1.x,
		db = q2.y - q1.y;

	// segments are parallel
	if (da * dy - db * dx === 0) {
		return false;
	}

	var s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx),
		t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy);

	return s >= 0 && s <= 1 && t >= 0 && t <= 1;
};

/**
 * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
 */
const triangle_area = (a: I_Point, b: I_Point, c: I_Point): number =>
	(b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);

const is_left = (a: I_Point, b: I_Point, c: I_Point): boolean => triangle_area(a, b, c) > 0;
const is_left_on = (a: I_Point, b: I_Point, c: I_Point): boolean => triangle_area(a, b, c) >= 0;
const is_right = (a: I_Point, b: I_Point, c: I_Point): boolean => triangle_area(a, b, c) < 0;
const is_right_on = (a: I_Point, b: I_Point, c: I_Point): boolean => triangle_area(a, b, c) <= 0;

const triangle_area_points = (a: I_Point, b: I_Point, c: I_Point): number =>
	(b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);

const is_left_points = (a: I_Point, b: I_Point, c: I_Point): boolean =>
	triangle_area_points(a, b, c) > 0;
// const is_left_on_points = (a: I_Point, b: I_Point, c: I_Point): boolean =>
// 	triangle_area_points(a, b, c) >= 0;
// const is_right_points = (a: I_Point, b: I_Point, c: I_Point): boolean =>
// 	triangle_area_points(a, b, c) < 0;
// const is_right_on_points = (a: I_Point, b: I_Point, c: I_Point): boolean =>
// 	triangle_area_points(a, b, c) <= 0;

/**
 * Check if three points are collinear.
 */
const collinear = (a: I_Point, b: I_Point, c: I_Point, threshold_angle: number): boolean => {
	if (!threshold_angle) {
		return triangle_area(a, b, c) === 0;
	} else {
		var ab0 = b.x - a.x,
			ab1 = b.y - a.y,
			bc0 = c.x - b.x,
			bc1 = c.y - b.y,
			angle = Math.acos(
				ab0 * bc0 +
					(ab1 * bc1) / (Math.sqrt(ab0 * ab0 + ab1 * ab1) * Math.sqrt(bc0 * bc0 + bc1 * bc1)),
			);
		return angle < threshold_angle;
	}
};

const sqdist = (a: I_Point, b: I_Point): number => {
	var dx = b.x - a.x,
		dy = b.y - a.y;
	return dx * dx + dy * dy;
};

/**
 * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
 */
const polygon_at = <T>(polygon: Array<T>, i: number): T => {
	var s = polygon.length;
	return polygon[i < 0 ? (i % s) + s : i % s];
};

/**
 * Append points "from" to "to"-1 from an other polygon "poly" onto this one.
 * @param polygon - The polygon to add points to.
 * @param source - The polygon to get points from.
 * @param from - The vertex index in "poly".
 * @param to - The end vertex index in "poly". Note that this vertex is NOT included when appending.
 */
const polygon_append = (
	polygon: Array<I_Point>,
	source: Array<I_Point>,
	from: number,
	to: number,
): void => {
	for (var i = from; i < to; i++) {
		polygon.push(source[i]);
	}
};

/**
 * Check if a point in the polygon is a reflex point
 */
const polygon_is_reflex = (polygon: Array<I_Point>, i: number): boolean =>
	is_right(polygon_at(polygon, i - 1), polygon_at(polygon, i), polygon_at(polygon, i + 1));

/**
 * Check if two vertices in the polygon can see each other
 */
const polygon_can_see = (polygon: Array<I_Point>, a: number, b: number): boolean => {
	// for each edge
	for (var i = 0; i !== polygon.length; ++i) {
		// ignore incident edges
		if (i === a || i === b || (i + 1) % polygon.length === a || (i + 1) % polygon.length === b) {
			continue;
		}
		if (
			line_segments_intersect(
				polygon_at(polygon, a),
				polygon_at(polygon, b),
				polygon_at(polygon, i),
				polygon_at(polygon, i + 1),
			)
		) {
			return false;
		}
	}
	return true;
};

const get_intersection_point = (
	p1: I_Point,
	p2: I_Point,
	q1: I_Point,
	q2: I_Point,
	precision = 0,
): I_Point => {
	var a1 = p2.y - p1.y,
		b1 = p1.x - p2.x,
		c1 = a1 * p1.x + b1 * p1.y,
		a2 = q2.y - q1.y,
		b2 = q1.x - q2.x,
		c2 = a2 * q1.x + b2 * q1.y,
		det = a1 * b2 - a2 * b1;

	if (!scalar_eq(det, 0, precision)) {
		return {x: (b2 * c1 - b1 * c2) / det, y: (a1 * c2 - a2 * c1) / det};
	} else {
		return {x: 0, y: 0};
	}
};

/**
 * Check if two scalars are equal
 */
const scalar_eq = (a: number, b: number, precision: number): boolean =>
	Math.abs(a - b) <= precision;

/**
 * Check if two points are equal
 */
const points_eq = (a: I_Point, b: I_Point, precision: number): boolean =>
	scalar_eq(a.x, b.x, precision) && scalar_eq(a.y, b.y, precision);
