<script lang="ts">
	import type {Unit} from '$lib/unit.svelte.js';
	import {Player_Controller_Behavior} from '$lib/behaviors/Player_Controller_Behavior.svelte.js';
	import {Harmful_Behavior} from '$lib/behaviors/Harmful_Behavior.svelte.js';
	import {Goal_Behavior} from '$lib/behaviors/Goal_Behavior.svelte.js';

	interface Props {
		unit: Unit;
	}

	const {unit}: Props = $props();
</script>

<div class="w_100 mt_lg display_flex column_gap_xl2 row_gap_sm justify_content_end flex_wrap">
	<label class="row mb_0" title="use WASD to move the player">
		<input
			type="checkbox"
			checked={unit.behaviors.has('Player_Controller_Behavior')}
			onchange={(e) => {
				if (e.currentTarget.checked) {
					unit.add_behavior(new Player_Controller_Behavior());
				} else {
					unit.remove_behavior('Player_Controller_Behavior');
				}
			}}
		/> player controls
	</label>
	<label class="row mb_0" title="causes damage to the player">
		<input
			type="checkbox"
			checked={unit.behaviors.has('Harmful_Behavior')}
			onchange={(e) => {
				if (e.currentTarget.checked) {
					unit.add_behavior(new Harmful_Behavior());
				} else {
					unit.remove_behavior('Harmful_Behavior');
				}
			}}
		/> harmful
	</label>
	<label class="row mb_0" title="the player touches this unit to win">
		<input
			type="checkbox"
			checked={unit.behaviors.has('Goal_Behavior')}
			onchange={(e) => {
				if (e.currentTarget.checked) {
					unit.add_behavior(new Goal_Behavior());
				} else {
					unit.remove_behavior('Goal_Behavior');
				}
			}}
		/> goal
	</label>
	<label class="row mb_0" title="the unit is a goner">
		<input type="checkbox" bind:checked={unit.dead} /> dead
	</label>
</div>
