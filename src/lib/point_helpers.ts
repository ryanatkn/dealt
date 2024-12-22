import type {Unit, Unit_Point, Unit_Rotation, Unit_Scale} from '$lib/unit.svelte.js';

// TODO @many refactor collisions and polygon helpers types
export interface I_Point {
	x: number;
	y: number;
}

export const serialize_points = (x: number, y: number, points: Array<I_Point>): string => {
	let s = '';
	for (const point of points) {
		s += `${point.x + x},${point.y + y} `;
	}
	return s;
};

// TODO @many hacky to get things working
// this duplicates the calculations in `_calculate_coords` in `polygon.ts`
export const transform_points = (
	points: Array<I_Point>,
	rotation: Unit_Rotation,
	scale: Unit_Scale,
): Array<I_Point> => {
	const count = points.length;
	const transformed: Array<I_Point> = new Array(count);

	for (let i = 0; i < count; i++) {
		let coord_x = points[i].x * scale; // TODO @many scale_x|y
		let coord_y = points[i].y * scale; // TODO @many scale_x|y

		if (rotation !== 0) {
			const cos = Math.cos(rotation);
			const sin = Math.sin(rotation);
			const tmp_x = coord_x;
			const tmp_y = coord_y;

			coord_x = tmp_x * cos - tmp_y * sin;
			coord_y = tmp_x * sin + tmp_y * cos;
		}

		transformed[i] = {x: coord_x, y: coord_y};
	}

	return transformed;
};

export const untransform_point = (
	x: number,
	y: number,
	rotation: Unit_Rotation,
	scale: Unit_Scale,
): I_Point => {
	let coord_x = x;
	let coord_y = y;

	if (rotation !== 0) {
		const cos = Math.cos(rotation);
		const sin = Math.sin(rotation);
		const tmp_x = coord_x;
		const tmp_y = coord_y;

		coord_x = tmp_x * cos + tmp_y * sin;
		coord_y = -tmp_x * sin + tmp_y * cos;
	}

	return {x: coord_x / scale, y: coord_y / scale}; // TODO @many scale_x|y
};

/**
 * Determines if movement is closer to the previous point than the next point
 * by comparing dot products of movement vector with adjacent point vectors.
 * Uses dot product to consider both distance and angle of movement,
 * returning true when moving more towards the previous point.
 */
export const is_moving_towards_previous_point = (
	unit: Unit,
	original_point: Unit_Point,
	current_screen_x: number,
	current_screen_y: number,
	initial_screen_x: number,
	initial_screen_y: number,
): boolean => {
	const index = unit.points.indexOf(original_point);

	// Get adjacent points transformed to screen coordinates
	const before_transformed =
		unit.transformed_points[index === 0 ? unit.points.length - 1 : index - 1];
	const after_transformed =
		unit.transformed_points[index === unit.points.length - 1 ? 0 : index + 1];
	const original_transformed = unit.transformed_points[index];

	// Get all points in screen coordinates
	const before_screen_x = unit.x + before_transformed.x;
	const before_screen_y = unit.y + before_transformed.y;
	const after_screen_x = unit.x + after_transformed.x;
	const after_screen_y = unit.y + after_transformed.y;
	const original_screen_x = unit.x + original_transformed.x;
	const original_screen_y = unit.y + original_transformed.y;

	// Calculate drag vector from initial press
	const drag_dx = current_screen_x - initial_screen_x;
	const drag_dy = current_screen_y - initial_screen_y;

	// Calculate vectors to adjacent points
	const before_dx = before_screen_x - original_screen_x;
	const before_dy = before_screen_y - original_screen_y;
	const after_dx = after_screen_x - original_screen_x;
	const after_dy = after_screen_y - original_screen_y;

	// Compare dot products to determine which direction we're dragging towards
	const dot_before = drag_dx * before_dx + drag_dy * before_dy;
	const dot_after = drag_dx * after_dx + drag_dy * after_dy;

	return dot_before > dot_after;
};
