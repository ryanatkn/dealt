<script lang="ts">
	import {zodiacComponents} from './zodiacComponents';

	export let activeZodiac: number | undefined;
</script>

{#each zodiacComponents as component, i}
	<svelte:component this={component} active={i === activeZodiac} />
{/each}
