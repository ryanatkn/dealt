/**
 * Pure logic functions for Unit calculations.
 * No Svelte dependencies - can be used in both Svelte and Ripple contexts.
 */

import type {I_Point} from '$lib/point_helpers.js';
import {
	polygon_is_simple,
	polygon_decomp,
} from '$lib/polygon_helpers.js';
import type {Renderer_Colors} from '$lib/renderer.svelte.js';

/**
 * Determine unit color based on its properties and behaviors.
 * Pure function version that takes plain data instead of Unit instance.
 */
export function compute_unit_color(
	dead: boolean,
	type: 'circle' | 'polygon',
	is_simple: boolean,
	is_concave: boolean,
	behavior_names: string[],
	colors: Renderer_Colors,
): string {
	if (dead) return colors.dead;

	const has_behavior = (name: string) => behavior_names.includes(name);

	if (type === 'polygon') {
		if (!is_simple) return colors.selfintersecting;
		if (is_concave) return colors.concave;
	}

	if (has_behavior('Player_Controller_Behavior')) return colors.player;
	if (has_behavior('Harmful_Behavior')) return colors.harmful;
	if (has_behavior('Goal_Behavior')) return colors.goal;

	return colors.unit;
}

/**
 * Check if polygon is simple (not self-intersecting).
 */
export function is_simple_polygon(points: Array<I_Point>): boolean {
	return polygon_is_simple(points);
}

/**
 * Decompose polygon into convex parts.
 * Returns array of point arrays. If length > 1, original is concave.
 */
export function decompose_polygon(points: Array<I_Point>): Array<Array<I_Point>> {
	return polygon_decomp(points);
}

/**
 * Check if polygon is concave.
 */
export function is_concave_polygon(points: Array<I_Point>): boolean {
	return decompose_polygon(points).length > 1;
}

/**
 * Update unit position based on velocity and direction.
 * Mutates the provided position object.
 */
export function update_unit_position(
	position: {x: number; y: number},
	direction: {x: number; y: number},
	velocity: number,
	dt: number,
): void {
	if (velocity === 0) return;

	position.x += direction.x * velocity * dt;
	position.y += direction.y * velocity * dt;
}

/**
 * Normalize direction vector.
 */
export function normalize_direction(direction: {x: number; y: number}): {x: number; y: number} {
	const mag = Math.sqrt(direction.x ** 2 + direction.y ** 2);
	if (mag === 0) return {x: 0, y: 0};
	return {
		x: direction.x / mag,
		y: direction.y / mag,
	};
}

/**
 * Calculate distance between two points.
 */
export function distance(a: {x: number; y: number}, b: {x: number; y: number}): number {
	return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * Convert rotation from degrees to radians.
 */
export function degrees_to_radians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

/**
 * Convert rotation from radians to degrees.
 */
export function radians_to_degrees(radians: number): number {
	return (radians * 180) / Math.PI;
}
