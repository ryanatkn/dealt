<script lang="ts">
	import {slide} from 'svelte/transition';

	import type {Unit} from '$lib/unit.svelte.js';
	import Scrubbable_Input from '$lib/Scrubbable_Input.svelte';

	interface Props {
		unit: Unit;
	}

	const {unit}: Props = $props();

	const POSITION_STEP = 0.5;

	const remove_disabled = $derived(unit.points.length <= 3);
</script>

<ul class="unstyled">
	{#each unit.points as point, i (point)}
		<li class="row" transition:slide>
			<div class="flex_1 row justify_content_end" style:--title_width="3.4rem">
				<Scrubbable_Input
					title="polygon.points[{i}].x"
					classes="mb_0"
					input_classes="plain"
					row
					value={point.x}
					oninput={(v) => {
						point.x = v;
						unit.update_points();
					}}
					step={POSITION_STEP}>x</Scrubbable_Input
				>
				<Scrubbable_Input
					title="polygon.points[{i}].y"
					classes="mb_0"
					input_classes="plain"
					row
					value={point.y}
					oninput={(v) => {
						point.y = v;
						unit.update_points();
					}}
					step={POSITION_STEP}>y</Scrubbable_Input
				>
			</div>
			<button
				type="button"
				class="icon_button plain ml_md"
				title="remove point"
				disabled={remove_disabled}
				onpointerup={() => {
					unit.remove_point(point);
				}}>✕</button
			>
		</li>
	{/each}
</ul>
