import type {Collisions} from '$lib/collisions.js';
import {cr, type Collision_Result} from '$lib/collision_result.js';
import type {Unit} from '$lib/unit.svelte.js';
import {colliding} from '$lib/colliding.js';
import {behavior_handle_collision} from '$lib/collision_behavior.js';

// TODO maybe this shouldn't exist, and instead have plain functions as the various implementations? instead compose directly in a `Scene` or somewhere else?
export class Simulation {
	readonly collisions: Collisions;

	speed = $state(1);

	constructor(collisions: Collisions) {
		this.collisions = collisions;
	}

	/**
	 * Update simulation with movement-then-collision phase ordering.
	 *
	 * PHASE ORDERING: Movement → Collision Detection → Collision Response
	 *
	 * This ensures rendered frames never show overlapping objects (better visual quality).
	 * Movement happens first, then we detect and fix any collisions that occurred.
	 *
	 * The oncollide callback handles physics (e.g., strength-based separation for editor,
	 * or reflection/bounce for arcade physics).
	 */
	update(
		units: Array<Unit>,
		dt: number,
		oncollide: (unit_a: Unit, unit_b: Unit, cr: Collision_Result) => void,
	): void {
		this.collisions.update();

		const final_dt = dt * this.speed;

		var unit_speed: number;

		// MOVEMENT-THEN-COLLISION (per-unit iteration for efficiency)
		for (const unit of units) {
			// PHASE 1: Movement
			if (!unit.dead) {
				unit_speed = unit.speed * final_dt;
				if (unit_speed !== 0) {
					if (unit.direction_x !== 0) unit.x += unit.direction_x * unit_speed;
					if (unit.direction_y !== 0) unit.y += unit.direction_y * unit_speed;
				}
			}

			// Teleport even when dead
			if (unit.teleporting_x !== 0) unit.x += unit.teleporting_x;
			if (unit.teleporting_y !== 0) unit.y += unit.teleporting_y;

			// PHASE 2: Collision detection and response
			for (const body of unit.body.potentials()) {
				if (colliding(unit.body, body, cr)) {
					// Check for special behavior collisions first
					if (!behavior_handle_collision(unit, body.unit)) {
						// No special behavior - apply normal physics
						oncollide(unit, body.unit, cr);
					}
				}
			}
		}
	}
}
