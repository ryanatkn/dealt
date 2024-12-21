<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	import {HANDLE_SIZE, parse_angle, type Unit} from '$lib/unit.svelte.js';
	import Scrubbing_Indicator from '$lib/Scrubbing_Indicator.svelte';

	interface Props {
		unit: Unit;
		size?: number;
	}

	const {unit, size = HANDLE_SIZE}: Props = $props();

	// TODO @many refactor this control so it shares code with other polygon/circle controls and `Scrubbable_Input`

	// TODO @many refactor how this works so it works for all renderers, using a collision Point for the pointer

	const SENSITIVITY = 0.013;

	let pressing = $state(false);
	let angle_before_pressing: number | null = $state(null);
	let x_start: number | null = $state(null);
	let y_start: number | null = $state(null);
	let x_last: number | null = $state(null);
	let y_last: number | null = $state(null);
	let x_now: number | null = $state(null);
	let y_now: number | null = $state(null);

	const press = (x: number, y: number) => {
		if (pressing) return;
		pressing = true;
		angle_before_pressing = unit.angle;
		x_start = x;
		y_start = y;
		x_last = x;
		y_last = y;
	};

	const reset = () => {
		pressing = false;
		angle_before_pressing = null;
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
			// TODO parse, in the setter or is that too inefficient? multiple parsers that can assume `number` or not?
			unit.angle = parse_angle(
				angle_before_pressing! + SENSITIVITY * (x_now - x_start! - (y_now - y_start!)),
			); // TODO normalize to the distance from the initial
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
			unit.angle = angle_before_pressing!;
			reset();
			swallow(e);
		}
	};

	const dx = $derived(unit.x + size * Math.cos(-1 * (unit.angle - Math.PI / 2)));
	const dy = $derived(unit.y - size * Math.sin(-1 * (unit.angle - Math.PI / 2)));
	const points = $derived(
		`${dx},${dy - size / 2} ${dx + size / 3},${dy} ${dx},${dy + size / 2} ${dx - size / 3},${dy}`,
	);
</script>

<svelte:window
	onpointerup={pressing ? onwindowpointerup : undefined}
	onpointermove={pressing ? onwindowpointermove : undefined}
	onpointerleave={pressing ? onwindowpointerleave : undefined}
	onkeydowncapture={pressing ? onwindowkeydown : undefined}
/>

<!-- TODO add `title` when changed to DOM elements -->
<polygon
	role="none"
	class="unit_angle_handles"
	class:pressing
	{points}
	transform="rotate({unit.rotation} {dx} {dy})"
	fill="var(--color_selected)"
	{onpointerdown}
/>
{#if pressing}
	<Scrubbing_Indicator {x_start} {y_start} {x_last} {y_last} />
{/if}

<style>
	.unit_angle_handles {
		cursor: ew-resize;
		opacity: 0.4;
	}
	.unit_angle_handles:hover {
		opacity: 0.6;
	}
	.unit_angle_handles.pressing {
		opacity: 0.8;
	}
</style>
