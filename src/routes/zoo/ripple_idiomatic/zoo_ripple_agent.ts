/**
 * Zoo Ripple Agent types and constants.
 * Pure TypeScript - no Ripple-specific syntax.
 */

import type {I_Point} from '$lib/point_helpers.js';
import type {Some_Body} from '$lib/collisions.js';

/**
 * Ripple Zoo Agent interface.
 */
export interface Zoo_Ripple_Agent {
	id: number;
	dead: boolean;
	type: 'circle' | 'polygon';
	x: number;
	y: number;
	rotation: number;
	scale: number;
	speed: number;
	direction_x: number;
	direction_y: number;
	radius: number;
	points: Array<I_Point>;
	transformed_points: Array<I_Point>;
	color: string;
	body?: Some_Body;
}

/** Size of boundary walls (large enough to always contain agents). */
export const BOUNDS_SIZE = 100000;

/** Dummy agent for wall collisions (avoids allocation in hot path). */
export const WALL_AGENT = {x: 0, y: 0, direction_x: 0, direction_y: 0} as Zoo_Ripple_Agent;
