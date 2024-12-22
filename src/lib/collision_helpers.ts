import {STRENGTH_MAX, type Unit} from '$lib/unit.svelte.js';
import type {Collision_Result} from '$lib/collision_result.js';

// TODO support lots of different kinds of collision behaviors
export const handle_collision = (a: Unit, b: Unit, result: Collision_Result): void => {
	// const o_x = result.overlap! * result.overlap_x;
	// const o_y = result.overlap! * result.overlap_y;
	// t.x -= o_x;
	// t.y -= o_y;

	const overlap_x = result.overlap! * result.overlap_x;
	const overlap_y = result.overlap! * result.overlap_y;
	const strength_a = a.pressing ? STRENGTH_MAX : a.strength;
	const strength_b = b.pressing ? STRENGTH_MAX : b.strength;
	const body2_pct = strength_a / (strength_a + strength_b) || 0; // TODO add more factors (what? push? weight? inertia?)
	// const body2_pct = a.strength / (a.strength + b.strength);
	// TODO was broken
	//*			(b.speed / (b.speed + a.speed)) || 0; // TODO add more factors (what? push? weight? inertia?)
	const body1_pct = 1 - body2_pct;
	a.x -= body1_pct * overlap_x * a.movement_multiplier;
	a.y -= body1_pct * overlap_y * a.movement_multiplier;
	b.x += body2_pct * overlap_x * b.movement_multiplier;
	b.y += body2_pct * overlap_y * b.movement_multiplier;

	// player.x -= result.overlap! * result.overlap_x;
	// player.y -= result.overlap! * result.overlap_y;

	// player.velocity *= 0.9;

	// TODO delete this after figuring out where to use similar concepts
	// dot = direction_x * result.overlap_y + direction_y * -result.overlap_x;

	// body.direction_x = 2 * dot * result.overlap_y - direction_x;
	// body.direction_y = 2 * dot * -result.overlap_x - direction_y;

	// dot = body2.direction_x * result.overlap_y + body2.direction_y * -result.overlap_x;

	// body2.direction_x = 2 * dot * result.overlap_y - body2.direction_x;
	// body2.direction_y = 2 * dot * -result.overlap_x - body2.direction_y;

	// for (const t of scene.units) {
	// 	const potentials = t.body.potentials();

	// 	// Negate any collisions
	// 	for (const body of potentials) {
	// 		if (colliding(t.body, body, result)) {
	// 			t.x -= result.overlap! * result.overlap_x;
	// 			t.y -= result.overlap! * result.overlap_y;
	// 			// t.velocity *= 0.9;
	// 		}
	// 	}
	// }

	// const potentials = player.body.potentials();

	// // Negate any collisions with the player
	// for (const body of potentials) {
	// 	if (colliding(player.body, body, result)) {
	// 		player.x -= result.overlap! * result.overlap_x;
	// 		player.y -= result.overlap! * result.overlap_y;

	// 		player.velocity *= 0.9;
	// 	}
	// }
};
