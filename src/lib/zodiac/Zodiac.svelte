<script lang="ts">
	import {random_float} from '$lib/util/random';
	import {zodiac_components} from '$lib/zodiac/zodiac_components';

	export let active_zodiac: number | undefined;

	const to_color = (active: boolean): string => (active ? '#9e00ff' : 'var(--shadow_text_color)');
	const to_scale = (_index: number): number => 0.55 + random_float() / 2;
	$: scales = Object.keys(zodiac_components).map((_, i) => to_scale(i));
</script>

{#each zodiac_components as component, i (component)}
	<div style="transform: scale3d({scales[i]}, {scales[i]}, {scales[i]});">
		<svelte:component this={component} fill={to_color(i === active_zodiac)} />
	</div>
{/each}
