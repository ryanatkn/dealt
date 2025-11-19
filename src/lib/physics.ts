/**
 * Pure physics algorithms for collision response.
 *
 * These functions are framework-agnostic and work with any object
 * that has the required properties (position, direction, etc.).
 *
 * Design principles:
 * - Pure functions (no side effects except parameter mutation)
 * - Performance-optimized (used in hot loops)
 * - Type-safe (proper interfaces)
 *
 * ---
 *
 * ## Phase Ordering (Collision Before Movement vs After)
 *
 * **Recommended: Collision BEFORE Movement (Ripple approach)**
 * ```
 * 1. Detect collisions (using previous frame positions)
 * 2. Apply collision response (separation + reflection)
 * 3. Move units (apply velocity/direction)
 * ```
 * ✅ Prevents tunneling (fast objects passing through)
 * ✅ More stable (no overlap accumulation)
 * ✅ Single-pass (better performance)
 *
 * **Current Svelte approach: Movement THEN Collision**
 * ```
 * 1. Move unit
 * 2. Detect collision
 * 3. Apply collision response
 * 4. (Repeat for each unit)
 * ```
 * ⚠️ Can accumulate overlap over multiple frames
 * ⚠️ One unit at a time (less efficient BVH usage)
 * ℹ️ Works for editor with strength-based separation
 *
 * **Spawn Demo: Hybrid approach (two-pass)**
 * ```
 * Pass 1: simulation.update() - Movement + strength separation
 * Pass 2: onupdate() callback - Reflection physics
 * ```
 * ⚠️ Duplicated collision detection
 * ℹ️ Works but could be optimized
 *
 * **Future refactoring:** Standardize on collision-before-movement for all renderers.
 */

import type {Collision_Result} from '$lib/collision_result.js';

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
 * **Phase ordering:** Should be called BEFORE movement to prevent tunneling.
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
 *   apply_reflection_physics(unit, other, cr);
 * }
 * ```
 */
export function apply_reflection_physics(
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
 * **Phase ordering:** Should be called BEFORE movement, typically
 * right before or after reflection physics.
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
 *   apply_separation_physics(unit, other, cr);
 *   apply_reflection_physics(unit, other, cr);
 * }
 * ```
 */
export function apply_separation_physics<T extends Has_Position & Partial<Has_Body>>(
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
 * **Phase ordering:** Call this during collision detection phase,
 * BEFORE movement updates.
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
 *       apply_bounce_physics(unit, other_body.unit, cr);
 *     }
 *   }
 * }
 * ```
 */
export function apply_bounce_physics<
	T extends Has_Position & Has_Direction & Partial<Has_Body>,
>(a: T, b: T, cr: Collision_Result, separation_factor: number = 0.5): void {
	apply_separation_physics(a, b, cr, separation_factor);
	apply_reflection_physics(a, b, cr);
}
