import type {Collisions} from '$lib/collisions.js';
import {cr, type Collision_Result} from '$lib/collision_result.js';
import type {Unit} from '$lib/unit.svelte.js';
import {colliding} from '$lib/colliding.js';

// TODO maybe this shouldn't exist, and instead have plain functions as the various implementations? instead compose directly in a `Scene` or somewhere else?
export class Simulation {
	readonly collisions: Collisions;

	speed = $state(1);

	constructor(collisions: Collisions) {
		this.collisions = collisions;
	}

	update(
		units: Array<Unit>,
		dt: number,
		oncollide: (unit_a: Unit, unit_b: Unit, cr: Collision_Result) => void,
	): void {
		this.collisions.update();

		const final_dt = dt * this.speed;
		// TODO maybe track total time?

		var unit_speed: number;

		// TODO needs a lot of work
		// run the sim for each entitity
		for (const unit of units) {
			// if (e.disable_simulation) continue;

			// TODO hacky just to get some basic behavior
			if (!unit.dead) {
				unit_speed = unit.speed * final_dt;
				if (unit_speed !== 0) {
					// TODO this moves one unit and then tests for collisions,
					// but we're calling `collisions.update()` above --
					// will we get better behavior if we move everyunit first,
					// then update the collisions, then test for collisions?
					if (unit.direction_x !== 0) unit.x += unit.direction_x * unit_speed;
					if (unit.direction_y !== 0) unit.y += unit.direction_y * unit_speed;
				}
			}

			// still teleport when dead
			if (unit.teleporting_x !== 0) unit.x += unit.teleporting_x; // TODO batch this mutation?
			if (unit.teleporting_y !== 0) unit.y += unit.teleporting_y; // TODO batch this mutation?

			for (const body of unit.body.potentials()) {
				if (colliding(unit.body, body, cr)) {
					// TODO abysmal hack, refactor both the collision logic and removal, should have a "dead" state or behavior
					if (
						body.unit.behaviors.has('Harmful_Behavior') &&
						unit.behaviors.has('Player_Controller_Behavior')
					) {
						unit.kill();
					} else if (
						body.unit.behaviors.has('Player_Controller_Behavior') &&
						unit.behaviors.has('Harmful_Behavior')
					) {
						body.unit.kill();
					} else if (
						body.unit.behaviors.has('Goal_Behavior') &&
						unit.behaviors.has('Player_Controller_Behavior')
					) {
						unit.scene.exit();
					} else if (
						body.unit.behaviors.has('Player_Controller_Behavior') &&
						unit.behaviors.has('Goal_Behavior')
					) {
						body.unit.scene.exit();
					} else {
						oncollide(unit, body.unit, cr); // TODO type
					}
					// if (e.dead) break outer;
				}
			}
		}
	}
}
