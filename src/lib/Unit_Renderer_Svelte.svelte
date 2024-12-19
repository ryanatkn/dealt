<script lang="ts">
	import {unreachable} from '@ryanatkn/belt/error.js';

	import type {Unit} from '$lib/unit.svelte.js';

	interface Props {
		unit: Unit;
	}

	const {unit}: Props = $props();

	const {id_string, type, x, y, radius, scale, transformed_points_serialized} = $derived(unit);
</script>

{#if type === 'circle'}
	<circle
		role="none"
		class="unit_renderer_svelte"
		id={id_string}
		cx={x}
		cy={y}
		r={radius * Math.abs(scale)}
		fill={unit.color}
	/>
{:else if type === 'polygon'}
	<polygon
		role="none"
		class="unit_renderer_svelte"
		id={id_string}
		points={transformed_points_serialized}
		fill={unit.color}
	/>
{:else}
	{unreachable(type)}
{/if}
