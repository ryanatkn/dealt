import {STRENGTH_MAX, type Unit} from '$lib/unit.svelte.js';
import type {Collision_Result} from '$lib/collision_result.js';

/**
 * Collision response for the main editor.
 *
 * Uses STRENGTH-BASED separation where heavier/stronger objects
 * push lighter ones more. This is different from reflection physics
 * used in spawn demo (see physics.ts for pure physics algorithms).
 *
 * Key differences from physics.ts:
 * - Considers unit.strength (mass-like property)
 * - Respects unit.pressing (player control)
 * - Honors movement_multiplier (walls don't move)
 * - Does NOT reflect velocity (objects don't bounce)
 *
 * Used by: Main editor simulation (scene.update)
 * Not used by: Spawn demo (uses reflection physics)
 */
// TODO support lots of different kinds of collision behaviors
export const handle_collision = (a: Unit, b: Unit, result: Collision_Result): void => {
	const overlap_x = result.overlap! * result.overlap_x;
	const overlap_y = result.overlap! * result.overlap_y;

	// Calculate separation percentages based on strength
	const strength_a = a.pressing ? STRENGTH_MAX : a.strength;
	const strength_b = b.pressing ? STRENGTH_MAX : b.strength;
	const body2_pct = strength_a / (strength_a + strength_b) || 0; // TODO add more factors (what? push? weight? inertia?)
	const body1_pct = 1 - body2_pct;

	// Apply strength-based separation
	a.x -= body1_pct * overlap_x * a.movement_multiplier;
	a.y -= body1_pct * overlap_y * a.movement_multiplier;
	b.x += body2_pct * overlap_x * b.movement_multiplier;
	b.y += body2_pct * overlap_y * b.movement_multiplier;
};
