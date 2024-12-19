<script lang="ts">
	import Unit_Polygon_Point_Handles from '$lib/Unit_Polygon_Point_Handles.svelte';
	import Unit_Scale_Handles from '$lib/Unit_Scale_Handles.svelte';
	import Unit_Polygon_Angle_Handles from '$lib/Unit_Polygon_Angle_Handles.svelte';
	import type {Unit} from '$lib/unit.svelte.js';

	interface Props {
		unit: Unit;
	}

	const {unit}: Props = $props();
</script>

{#each unit.points as point, i (point)}
	<Unit_Polygon_Point_Handles {unit} {point} transformed_point={unit.transformed_points[i]} />
{/each}
<Unit_Scale_Handles {unit} />
<Unit_Polygon_Angle_Handles {unit} />
