<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	import {HANDLE_SIZE, type Unit, Unit_Point} from '$lib/unit.svelte.js';
	import type {I_Point} from '$lib/point_helpers.js';
	import Scrubbing_Indicator from '$lib/Scrubbing_Indicator.svelte';

	interface Props {
		unit: Unit;
		point: Unit_Point;
		transformed_point: I_Point;
		size?: number;
	}

	const {unit, point, transformed_point, size = HANDLE_SIZE}: Props = $props();

	// TODO @many refactor this control so it shares code with other polygon/circle controls and `Scrubbable_Input`

	// TODO @many refactor how this works so it works for all renderers, using a collision Point for the pointer

	// TODO bug where dragging stops for non-simple polygons

	let pressing = $state(false);
	let x_before_pressing: number | null = $state(null);
	let y_before_pressing: number | null = $state(null);
	let x_start: number | null = $state(null);
	let y_start: number | null = $state(null);
	let x_last: number | null = $state(null);
	let y_last: number | null = $state(null);
	let x_now: number | null = $state(null);
	let y_now: number | null = $state(null);
	let active_point = $state(point);

	const x = $derived(unit.x + transformed_point.x);
	const y = $derived(unit.y + transformed_point.y);
	const radius = $derived(size / 2);
	const cursor = $derived(
		unit.scene.controller.pressing_ctrl && unit.scene.controller.pressing_alt
			? 'no-drop'
			: unit.scene.controller.pressing_alt
				? unit.scene.controller.pressing_shift
					? 'alias'
					: 'copy'
				: 'move',
	);

	const press = (x: number, y: number) => {
		// If Control+Alt is pressed, delete the point
		if (unit.scene.controller.pressing_ctrl && unit.scene.controller.pressing_alt) {
			// TODO revisit this restriction, if keeping put it in the unit
			// Don't delete if it would make the polygon have zero points
			if (unit.points.length > 3) {
				unit.remove_point(point);
			}
			return;
		}

		if (pressing) return;
		pressing = true;

		if (unit.scene.controller.pressing_alt) {
			// Create a duplicate point when Alt is pressed
			active_point = unit.duplicate_point(point, unit.scene.controller.pressing_shift);
		} else {
			active_point = point;
		}

		x_before_pressing = active_point.x;
		y_before_pressing = active_point.y;
		x_start = x;
		y_start = y;
		x_last = x;
		y_last = y;
	};

	const reset = () => {
		pressing = false;
		x_before_pressing = null;
		y_before_pressing = null;
		x_start = null;
		y_start = null;
		x_last = null;
		y_last = null;
		x_now = null;
		y_now = null;
		active_point = point;
	};

	const move = (x: number, y: number) => {
		x_last = x_now;
		y_last = y_now;
		x_now = x;
		y_now = y;
		if (x_last !== null && y_last !== null) {
			unit.move_transformed_point(active_point, x_now - x_last, y_now - y_last);
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
			if (unit.scene.controller.pressing_alt && active_point !== point) {
				// Remove the duplicated point if we hit escape
				unit.remove_point(active_point);
			} else {
				active_point.x = x_before_pressing!;
				active_point.y = y_before_pressing!;
				unit.update_points(); // TODO hack
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

<polygon
	role="none"
	class="unit_polygon_point_handles"
	class:pressing
	points="{x - radius},{y - radius} {x + radius},{y - radius} {x},{y + radius}"
	fill="var(--color_selected)"
	style:cursor
	{onpointerdown}
/>
{#if pressing}
	<Scrubbing_Indicator {x_start} {y_start} {x_last} {y_last} />
{/if}

<style>
	.unit_polygon_point_handles {
		cursor: move;
		opacity: 0.4;
	}
	.unit_polygon_point_handles:hover {
		opacity: 0.6;
	}
	.unit_polygon_point_handles.pressing {
		opacity: 0.8;
	}
</style>
