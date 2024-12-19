<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	import {HANDLE_SIZE, parse_scale, type Unit} from '$lib/unit.svelte.js';
	import Scrubbing_Indicator from '$lib/Scrubbing_Indicator.svelte';

	interface Props {
		unit: Unit;
		size?: number;
	}

	const {unit, size = HANDLE_SIZE}: Props = $props();

	// TODO @many refactor this control so it shares code with other polygon/circle controls and `Scrubbable_Input`

	// TODO @many refactor how this works so it works for all renderers, using a collision Point for the pointer

	const SENSITIVITY = 0.01;

	let pressing = $state(false);
	let scale_before_pressing: number | null = $state(null);
	let x_before_pressing: number | null = $state(null);
	let y_before_pressing: number | null = $state(null);
	let x_start: number | null = $state(null);
	let y_start: number | null = $state(null);
	let x_last: number | null = $state(null);
	let y_last: number | null = $state(null);
	let x_now: number | null = $state(null);
	let y_now: number | null = $state(null);

	const cursor = $derived(unit.scene.controller.pressing_alt ? 'move' : 'nesw-resize');

	const press = (x: number, y: number) => {
		if (pressing) return;
		pressing = true;
		scale_before_pressing = unit.scale;
		x_before_pressing = unit.x;
		y_before_pressing = unit.y;
		x_start = x;
		y_start = y;
		x_last = x;
		y_last = y;
	};

	const reset = () => {
		pressing = false;
		scale_before_pressing = null;
		x_before_pressing = null;
		y_before_pressing = null;
		x_start = null;
		y_start = null;
		x_last = null;
		y_last = null;
		x_now = null;
		y_now = null;
	};

	const move = (x: number, y: number) => {
		x_last = x_now;
		y_last = y_now;
		x_now = x;
		y_now = y;

		if (x_last !== null && y_last !== null) {
			if (unit.scene.controller.pressing_alt) {
				// Move the unit's center when Alt is pressed
				unit.move_center_to(unit.x + (x_now - x_last), unit.y + (y_now - y_last));
			} else {
				// Scale the unit when Alt is not pressed
				unit.scale = parse_scale(
					scale_before_pressing! + SENSITIVITY * (x_now - x_start! - (y_now - y_start!)),
				);
			}
		}
	};

	const onpointerdown = (e: MouseEvent) => {
		press(e.clientX, e.clientY);
		swallow(e);
	};

	const onwindowpointerup = (_e: MouseEvent) => {
		reset();
	};

	const onwindowpointerleave = (_e: MouseEvent) => {
		reset();
	};

	const onwindowpointermove = (e: MouseEvent) => {
		move(e.clientX, e.clientY);
	};

	const onwindowkeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if (unit.scene.controller.pressing_alt) {
				unit.move_center_to(x_before_pressing!, y_before_pressing!);
			} else {
				unit.scale = scale_before_pressing!;
			}
			reset();
			swallow(e);
		}
	};
</script>

<svelte:window
	onpointerup={pressing ? onwindowpointerup : undefined}
	onpointermove={pressing ? onwindowpointermove : undefined}
	onpointerleave={pressing ? onwindowpointerleave : undefined}
	onkeydowncapture={pressing ? onwindowkeydown : undefined}
/>

<!-- TODO add `title` when changed to DOM elements -->
<circle
	role="none"
	class="unit_scale_handles"
	class:pressing
	cx={unit.x}
	cy={unit.y}
	r={size / 2}
	fill="var(--color_selected)"
	style:cursor
	{onpointerdown}
/>
{#if pressing}
	<Scrubbing_Indicator
		{x_start}
		{y_start}
		{x_last}
		{y_last}
		container_width={innerWidth}
		container_height={innerHeight}
	/>
{/if}

<style>
	.unit_scale_handles {
		opacity: 0.4;
	}
	.unit_scale_handles:hover {
		opacity: 0.6;
	}
	.unit_scale_handles.pressing {
		opacity: 0.8;
	}
</style>
