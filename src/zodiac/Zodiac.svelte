<script lang="ts">
	import {randomFloat} from '$lib/random';

	import {zodiacComponents} from './zodiacComponents';

	export let activeZodiac: number | undefined;

	const toColor = (active: boolean): string => (active ? '#9e00ff' : 'var(--shadow_text_color)');
	const toScale = (_index: number): number => 0.55 + randomFloat() / 2;
	$: scales = Object.keys(zodiacComponents).map((_, i) => toScale(i));
</script>

{#each zodiacComponents as component, i (component)}
	<div style="transform: scale3d({scales[i]}, {scales[i]}, {scales[i]});">
		<svelte:component this={component} fill={toColor(i === activeZodiac)} />
	</div>
{/each}
