<script lang="ts">
	import {zodiacComponents} from './zodiacComponents';

	export let activeZodiac: number | undefined;

	const toColor = (active: boolean) => (active ? 'green' : 'red');
</script>

{#each zodiacComponents as component, i}
	<svelte:component this={component} fill={toColor(i === activeZodiac)} />
{/each}
