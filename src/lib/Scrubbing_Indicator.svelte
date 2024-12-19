<script lang="ts">
	import Teleport from '@ryanatkn/fuz/Teleport.svelte';
	import {BROWSER} from 'esm-env';
	import {innerWidth, innerHeight} from 'svelte/reactivity/window';

	interface Props {
		x_start: number | null;
		y_start: number | null;
		x_last: number | null;
		y_last: number | null;
		// TODO `dimensions`?
		container_width?: number;
		container_height?: number;
	}

	const {x_start, y_start, x_last, y_last, container_width, container_height}: Props = $props();

	const width = $derived(container_width ?? innerWidth.current);
	const height = $derived(container_height ?? innerHeight.current);

	// TODO on hover, maybe show the line?

	// TODO better hover/active feedback (cursor? selection color?)
	// maybe show the original and current values and difference?
	// what if we showed presets you could release over to select
</script>

<!-- TODO hacky, needed because we may be inside a `svg` which breaks the layout, wouldn't need if we drew the line with HTML elements instead of SVG -->
<Teleport to={BROWSER ? document.body : null}>
	<svg
		class="scrubbing_indicator"
		viewBox="0 0 {width} {height}"
		aria-hidden="true"
		{width}
		{height}
	>
		{#if x_start !== null && y_start !== null && x_last !== null && y_last !== null}
			<line x1={x_start} y1={y_start} x2={x_last} y2={y_last} />
		{/if}
	</svg>
</Teleport>

<style>
	.scrubbing_indicator {
		z-index: 2;
		position: fixed;
		top: 0;
		left: 0;
		/* prevent drag&drop and other unintentional interactions */
		pointer-events: none;
	}

	line {
		stroke: var(--color_d_3);
		stroke-width: var(--border_width_4);
		box-shadow: var(--shadow_xl) var(--shadow_f_md);
		opacity: var(--fade_2);
	}
</style>
