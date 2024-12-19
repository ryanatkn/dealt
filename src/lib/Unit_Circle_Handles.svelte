<script lang="ts">
	import type {Unit} from '$lib/unit.svelte.js';
	import Unit_Circle_Radius_Handles from '$lib/Unit_Circle_Radius_Handles.svelte';
	import Unit_Scale_Handles from '$lib/Unit_Scale_Handles.svelte';

	interface Props {
		unit: Unit;
	}

	const {unit}: Props = $props();
</script>

<Unit_Scale_Handles {unit} />
<Unit_Circle_Radius_Handles {unit} />
