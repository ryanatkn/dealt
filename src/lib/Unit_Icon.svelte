<script lang="ts">
	import {unreachable} from '@ryanatkn/belt/error.js';
	import type {Unit} from '$lib/unit.svelte.js';

	// TODO ideally this would scale to be propotional to the largest unit
	// on a logarithmic scale with a min size around 30-50%,
	// as it is, all circles are exactly the same, and likewise polygons don't convey their size

	interface Props {
		unit: Unit;
		padding?: number;
	}

	const {unit, padding = 2}: Props = $props();

	const {type, points, angle} = $derived(unit);

	const VIEWBOX_SIZE = 100;
	const CENTER = VIEWBOX_SIZE / 2;

	const transform = $derived(`rotate(${(angle * 360) / (Math.PI * 2)} ${CENTER} ${CENTER})`);

	const normalized_points = $derived.by(() => {
		if (type !== 'polygon' || !points.length) return '';

		// Find center of original points
		const xs = points.map((p) => p.x);
		const ys = points.map((p) => p.y);
		const center_x = (Math.min(...xs) + Math.max(...xs)) / 2;
		const center_y = (Math.min(...ys) + Math.max(...ys)) / 2;

		// Calculate maximum radius from center to any point
		const max_radius = Math.max(
			...points.map((p) => Math.sqrt((p.x - center_x) ** 2 + (p.y - center_y) ** 2)),
		);

		// Scale based on radius rather than width/height
		const scale_factor = (VIEWBOX_SIZE - padding * 2) / (max_radius * 2);

		// Center using VIEWBOX_SIZE/2 as the target center
		const x_offset = VIEWBOX_SIZE / 2 - center_x * scale_factor;
		const y_offset = VIEWBOX_SIZE / 2 - center_y * scale_factor;

		return points
			.map((p) => `${p.x * scale_factor + x_offset},${p.y * scale_factor + y_offset}`)
			.join(' ');
	});
</script>

<svg viewBox="0 0 {VIEWBOX_SIZE} {VIEWBOX_SIZE}" class="unit_icon">
	{#if type === 'circle'}
		<circle
			role="none"
			cx={CENTER}
			cy={CENTER}
			r={(VIEWBOX_SIZE - padding * 2) / 2.6}
			fill={unit.color}
			{transform}
		/>
	{:else if type === 'polygon'}
		<polygon role="none" points={normalized_points} fill={unit.color} {transform} />
	{:else}
		{unreachable(type)}
	{/if}
</svg>

<style>
	.unit_icon {
		width: var(--icon_size, var(--icon_size_sm));
		height: var(--icon_size, var(--icon_size_sm));
		display: block;
	}
</style>
