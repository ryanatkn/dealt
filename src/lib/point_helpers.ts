import type {Unit_Rotation, Unit_Scale} from '$lib/unit.svelte.js';

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

		// TODO should the points be transformed to scene space?
		// coord_x += x;
		// coord_y += y;

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
