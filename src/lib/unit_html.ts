import {Unreachable_Error} from '@ryanatkn/belt/error.js';

import type {Unit} from '$lib/unit.svelte.js';

export const render_unit_to_string = (unit: Unit): string => {
	switch (unit.type) {
		case 'circle':
			return `<circle cx="${unit.x}" cy="${unit.y}" r="${unit.radius * Math.abs(unit.scale)}" fill="${unit.color}" />`;
		case 'polygon':
			return `<polygon x="${unit.x}px"
				y="${unit.y}px"
				points="${unit.transformed_points_serialized}"
				fill="${unit.color}"
			/>`;
		default:
			throw new Unreachable_Error(unit.type);
	}
};

export const render_units_to_string = (
	width: number,
	height: number,
	units: Array<Unit>,
	/**
	 * @example 'xmlns="http://www.w3.org/2000/svg"'
	 */
	ns?: string,
): string => {
	// TODO maybe normalize viewBox to `0 0 scene_width scene_height`?
	let s = `<svg ${ns ? ns + ' ' : ''}width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
	for (var unit of units) {
		s += render_unit_to_string(unit);
	}
	return s + '</svg>';
};
