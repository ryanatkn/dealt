/**
 * Game behavior collision logic.
 *
 * Handles special collision cases for game behaviors:
 * - Player vs Harmful (player dies)
 * - Player vs Goal (scene exits)
 *
 * Works with both Svelte Units and Ripple units via duck-typing.
 *
 * This logic is shared between:
 * - Editor simulation (simulation.svelte.ts)
 * - Spawn demo
 * - Ripple renderer
 */

/**
 * Interface for units that have behaviors.
 * Uses duck-typing to work with both:
 * - Svelte Units (behaviors: SvelteMap, kill() method)
 * - Ripple units (behavior_names: string[], dead property)
 */
export interface Unit_With_Behaviors {
	// Svelte units have behaviors Map
	behaviors?: {has(name: string): boolean};
	// Ripple units have behavior_names array
	behavior_names?: string[];
	// State mutation - different implementations
	kill?(): void;
	dead?: boolean;
	scene?: {exit(): void};
}

/**
 * Check if a unit has a specific behavior.
 * Works with both Svelte (behaviors Map) and Ripple (behavior_names array).
 */
function has_behavior(unit: Unit_With_Behaviors, name: string): boolean {
	if (unit.behaviors) {
		return unit.behaviors.has(name);
	}
	if (unit.behavior_names) {
		return unit.behavior_names.includes(name);
	}
	return false;
}

/**
 * Handle behavior-based collision interactions.
 *
 * Checks for special gameplay collisions (Player/Harmful/Goal) and applies
 * their effects (killing, scene exit).
 *
 * Returns true if the collision was handled by behavior logic,
 * false if normal physics should be applied.
 *
 * @example
 * ```ts
 * if (!behavior_handle_collision(unit, other)) {
 *   // No special behavior - apply physics
 *   physics_apply_bounce(unit, other, cr);
 * }
 * ```
 */
export function behavior_handle_collision(
	unit_a: Unit_With_Behaviors,
	unit_b: Unit_With_Behaviors,
): boolean {
	const a_has_harmful = has_behavior(unit_a, 'Harmful_Behavior');
	const a_has_player = has_behavior(unit_a, 'Player_Controller_Behavior');
	const a_has_goal = has_behavior(unit_a, 'Goal_Behavior');

	const b_has_harmful = has_behavior(unit_b, 'Harmful_Behavior');
	const b_has_player = has_behavior(unit_b, 'Player_Controller_Behavior');
	const b_has_goal = has_behavior(unit_b, 'Goal_Behavior');

	// Player vs Harmful - player dies
	if (b_has_harmful && a_has_player) {
		// Svelte: call kill() method, Ripple: set dead property
		if (unit_a.kill) {
			unit_a.kill();
		} else {
			unit_a.dead = true;
		}
		return true;
	}
	if (a_has_harmful && b_has_player) {
		if (unit_b.kill) {
			unit_b.kill();
		} else {
			unit_b.dead = true;
		}
		return true;
	}

	// Player vs Goal - scene exits
	if (b_has_goal && a_has_player) {
		unit_a.scene?.exit();
		return true;
	}
	if (a_has_goal && b_has_player) {
		unit_b.scene?.exit();
		return true;
	}

	// No special behavior - apply normal physics
	return false;
}
