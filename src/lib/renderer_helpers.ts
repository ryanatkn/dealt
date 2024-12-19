import type {Unit} from '$lib/unit.svelte.js';

// TODO maybe rename this module?

export const to_unit_fill = (unit: Unit): string =>
	unit.dead
		? unit.scene.renderer.colors.dead
		: unit.type === 'polygon'
			? unit.is_simple_polygon
				? unit.concave
					? unit.scene.renderer.colors.concave
					: unit.behaviors.has('Player_Controller_Behavior')
						? unit.scene.renderer.colors.player
						: unit.behaviors.has('Harmful_Behavior')
							? unit.scene.renderer.colors.harmful
							: unit.behaviors.has('Goal_Behavior')
								? unit.scene.renderer.colors.goal
								: unit.scene.renderer.colors.unit
				: unit.scene.renderer.colors.selfintersecting
			: unit.behaviors.has('Player_Controller_Behavior')
				? unit.scene.renderer.colors.player
				: unit.behaviors.has('Harmful_Behavior')
					? unit.scene.renderer.colors.harmful
					: unit.behaviors.has('Goal_Behavior')
						? unit.scene.renderer.colors.goal
						: unit.scene.renderer.colors.unit;
