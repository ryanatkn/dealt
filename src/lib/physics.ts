/**
 * Physics algorithms for collision response.
 *
 * Provides both pure physics models (bounce, reflection, separation)
 * and game-specific models (strength-based separation for editor).
 *
 * Design principles:
 * - Pure functions (no side effects except parameter mutation)
 * - Performance-optimized (used in hot loops)
 * - Type-safe (proper interfaces)
 *
 * ---
 *
 * ## Phase Ordering: Movement-Then-Collision
 *
 * **Current approach (all renderers):**
 * ```
 * 1. Move units (apply velocity/direction)
 * 2. Detect collisions (check for overlap)
 * 3. Apply collision response (separation + reflection)
 * 4. Render (no overlap visible!)
 * ```
 *
 * **Benefits:**
 * ✅ No visible overlap in rendered frames (better visual quality)
 * ✅ Collision response happens in same frame as collision
 * ✅ Intuitive - collision fixes problems immediately
 *
 * **Trade-offs:**
 * ⚠️ Fast-moving objects can tunnel through thin walls without continuous collision detection
 * ⚠️ Requires small timesteps or swept collision for high-speed physics
 * ℹ️ Good enough for arcade physics with reasonable speeds
 *
 * **Note:** Collision-before-movement is an alternative that separates phases more cleanly,
 * but can show one frame of overlap when objects first collide. We prioritize visual quality.
 */

import type {Collision_Result} from '$lib/collision_result.js';
import {STRENGTH_MAX, type Unit} from '$lib/unit.svelte.js';

/**
 * Interface for objects with 2D direction vectors.
 * Used by reflection physics.
 */
export interface Has_Direction {
	direction_x: number;
	direction_y: number;
}

/**
 * Interface for objects with 2D position.
 * Used by separation physics.
 */
export interface Has_Position {
	x: number;
	y: number;
}

/**
 * Interface for objects with collision body reference.
 * Used when body position needs to be synced with unit position.
 */
export interface Has_Body {
	body?: {x: number; y: number};
}

/**
 * Applies reflection-based collision response to two objects.
 *
 * This implements a reflection algorithm where objects bounce off each other
 * by reflecting their velocity vectors across the collision normal.
 *
 * **Phase ordering:** Called AFTER movement (during collision response).
 *
 * **Algorithm:**
 * For each object, compute dot product of direction with collision normal,
 * then reflect the direction vector across that normal.
 *
 * **Mutates:** direction_x, direction_y on both objects
 *
 * @param a - First object with direction vector
 * @param b - Second object with direction vector
 * @param cr - Collision result containing overlap normal (overlap_x, overlap_y)
 *
 * @example
 * ```ts
 * if (colliding(unit.body, other.body, cr)) {
 *   physics_apply_reflection(unit, other, cr);
 * }
 * ```
 */
export function physics_apply_reflection(
	a: Has_Direction,
	b: Has_Direction,
	cr: Collision_Result,
): void {
	// Reflect object A's direction across collision normal
	const dot_a = a.direction_x * cr.overlap_y + a.direction_y * -cr.overlap_x;
	a.direction_x = 2 * dot_a * cr.overlap_y - a.direction_x;
	a.direction_y = 2 * dot_a * -cr.overlap_x - a.direction_y;

	// Reflect object B's direction across collision normal
	const dot_b = b.direction_x * cr.overlap_y + b.direction_y * -cr.overlap_x;
	b.direction_x = 2 * dot_b * cr.overlap_y - b.direction_x;
	b.direction_y = 2 * dot_b * -cr.overlap_x - b.direction_y;
}

/**
 * Separates two overlapping objects by pushing them apart.
 *
 * This prevents visual overlap and tunneling by moving both objects
 * along the collision normal by half the overlap distance.
 *
 * **Phase ordering:** Called AFTER movement (during collision response),
 * typically right before or after reflection physics.
 *
 * **Algorithm:**
 * Each object is pushed by (overlap / 2) along the collision normal.
 * Object A is pushed backward (-overlap), object B forward (+overlap).
 *
 * **Mutates:** x, y on both objects (and body.x, body.y if present)
 *
 * @param a - First object with position
 * @param b - Second object with position
 * @param cr - Collision result containing overlap magnitude and normal
 * @param separation_factor - Multiplier for separation distance (default 0.5 = half overlap each)
 *
 * @example
 * ```ts
 * if (colliding(unit.body, other.body, cr)) {
 *   physics_apply_separation(unit, other, cr);
 *   physics_apply_reflection(unit, other, cr);
 * }
 * ```
 */
export function physics_apply_separation<T extends Has_Position & Partial<Has_Body>>(
	a: T,
	b: T,
	cr: Collision_Result,
	separation_factor: number = 0.5,
): void {
	if (cr.overlap === null) return;

	const separation = cr.overlap * separation_factor;

	// Push object A backward along collision normal
	a.x -= cr.overlap_x * separation;
	a.y -= cr.overlap_y * separation;
	if (a.body) {
		a.body.x = a.x;
		a.body.y = a.y;
	}

	// Push object B forward along collision normal
	b.x += cr.overlap_x * separation;
	b.y += cr.overlap_y * separation;
	if (b.body) {
		b.body.x = b.x;
		b.body.y = b.y;
	}
}

/**
 * Combined separation + reflection physics for bouncing objects.
 *
 * This is a convenience function that applies both separation (to prevent
 * overlap) and reflection (to make objects bounce) in the correct order.
 *
 * **Phase ordering:** Call this AFTER movement (during collision response).
 *
 * @param a - First object with position and direction
 * @param b - Second object with position and direction
 * @param cr - Collision result
 * @param separation_factor - How much to separate (default 0.5)
 *
 * @example
 * ```ts
 * // Typical usage in spawn demo
 * for (const unit of units) {
 *   for (const other_body of unit.body.potentials()) {
 *     if (colliding(unit.body, other_body, cr)) {
 *       physics_apply_bounce(unit, other_body.unit, cr);
 *     }
 *   }
 * }
 * ```
 */
export function physics_apply_bounce<T extends Has_Position & Has_Direction & Partial<Has_Body>>(
	a: T,
	b: T,
	cr: Collision_Result,
	separation_factor: number = 0.5,
): void {
	physics_apply_separation(a, b, cr, separation_factor);
	physics_apply_reflection(a, b, cr);
}

/**
 * Apply strength-based separation to colliding units.
 *
 * This physics model is used by the editor simulation.
 * Unlike bounce physics, this:
 * - Considers unit.strength (mass-like property)
 * - Respects unit.pressing (player control gives max strength)
 * - Honors movement_multiplier (walls don't move)
 * - Does NOT reflect velocity (objects don't bounce)
 *
 * Heavier/stronger objects push lighter ones more.
 *
 * **Phase ordering:** Called AFTER movement (during collision response).
 *
 * @param a - First unit
 * @param b - Second unit
 * @param cr - Collision result with overlap data
 *
 * @example
 * ```ts
 * // Editor simulation uses strength-based separation
 * if (colliding(unit.body, other.body, cr)) {
 *   physics_apply_strength_separation(unit, other, cr);
 * }
 * ```
 */
export function physics_apply_strength_separation(a: Unit, b: Unit, cr: Collision_Result): void {
	const overlap_x = cr.overlap! * cr.overlap_x;
	const overlap_y = cr.overlap! * cr.overlap_y;

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
}
