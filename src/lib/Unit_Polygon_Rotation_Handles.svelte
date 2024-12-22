<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	import {HANDLE_SIZE, parse_rotation, type Unit} from '$lib/unit.svelte.js';
	import Scrubbing_Indicator from '$lib/Scrubbing_Indicator.svelte';

	interface Props {
		unit: Unit;
		size?: number;
	}

	const {unit, size = HANDLE_SIZE}: Props = $props();

	// TODO @many refactor this control so it shares code with other polygon/circle controls and `Scrubbable_Input`

	const SENSITIVITY = 0.013;

	let pressing = $state(false);
	let rotation_before_pressing: number | null = $state(null);
	let x_before_pressing: number | null = $state(null);
	let y_before_pressing: number | null = $state(null);
	// TODO maybe prefix these with `pointer`
	let x_start: number | null = $state(null);
	let y_start: number | null = $state(null);
	let x_last: number | null = $state(null);
	let y_last: number | null = $state(null);
	let x_now: number | null = $state(null);
	let y_now: number | null = $state(null);

	const cursor = $derived(unit.scene.controller.pressing_alt ? 'move' : 'ew-resize');

	const dx = $derived(unit.x + size * Math.cos(-1 * (unit.rotation - Math.PI / 2)));
	const dy = $derived(unit.y - size * Math.sin(-1 * (unit.rotation - Math.PI / 2)));
	const points = $derived(
		`${dx},${dy - size / 2} ${dx + size / 3},${dy} ${dx},${dy + size / 2} ${dx - size / 3},${dy}`,
	);

	const press = (x: number, y: number) => {
		if (pressing) return;
		pressing = true;
		rotation_before_pressing = unit.rotation;
		x_before_pressing = unit.x;
		y_before_pressing = unit.y;
		x_start = x;
		y_start = y;
		x_last = x;
		y_last = y;
	};

	const reset = () => {
		pressing = false;
		rotation_before_pressing = null;
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
			if (unit.scene.controller.pressing_alt) {
				// Move the unit's center when Alt is pressed
				unit.move_center_to(unit.x + (x_now - x_last), unit.y + (y_now - y_last));
			} else {
				// Rotate the unit when Alt is not pressed
				unit.rotation = parse_rotation(
					rotation_before_pressing! + SENSITIVITY * (x_now - x_start! - (y_now - y_start!)),
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
	const onwindowkeydowncapture = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if (unit.scene.controller.pressing_alt) {
				unit.move_center_to(x_before_pressing!, y_before_pressing!);
			} else {
				unit.rotation = rotation_before_pressing!;
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
	onkeydowncapture={pressing ? onwindowkeydowncapture : undefined}
/>

<!-- TODO add `title` when changed to DOM elements -->
<polygon
	role="none"
	class="unit_polygon_rotation_handles"
	class:pressing
	{points}
	transform="rotate({unit.rotation_degrees} {dx} {dy})"
	fill="var(--color_selected)"
	style:cursor
	{onpointerdown}
/>
{#if pressing}
	<Scrubbing_Indicator {x_start} {y_start} {x_last} {y_last} />
{/if}

<style>
	.unit_polygon_rotation_handles {
		cursor: ew-resize;
		opacity: 0.4;
	}
	.unit_polygon_rotation_handles:hover {
		opacity: 0.6;
	}
	.unit_polygon_rotation_handles.pressing {
		opacity: 0.8;
	}
</style>
