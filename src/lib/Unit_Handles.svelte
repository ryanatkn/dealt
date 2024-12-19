<script lang="ts">
	import {unreachable} from '@ryanatkn/belt/error.js';

	import type {Unit} from '$lib/unit.svelte.js';
	import Unit_Circle_Handles from '$lib/Unit_Circle_Handles.svelte';
	import Unit_Polygon_Handles from '$lib/Unit_Polygon_Handles.svelte';

	interface Props {
		unit: Unit;
	}

	const {unit}: Props = $props();

	const {type} = $derived(unit);
</script>

{#if type === 'circle'}
	<Unit_Circle_Handles {unit} />
{:else if type === 'polygon'}
	<Unit_Polygon_Handles {unit} />
{:else}
	{unreachable(type)}
{/if}
