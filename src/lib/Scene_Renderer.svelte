<script lang="ts">
	import {BROWSER} from 'esm-env';

	import type {Renderer, Renderer_Component} from '$lib/renderer.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';

	interface Props {
		Component: Renderer_Component;
		scene: Scene;
		renderer: Renderer;
	}

	const {Component: Component_Prop, scene, renderer}: Props = $props();

	// TODO maybe make a `Renderers` component that layers multiple over each other, configurable?
</script>

<div
	class="scene_renderer"
	style:width="{renderer.width}px"
	style:height="{renderer.height}px"
	style:min-width="{renderer.width}px"
	style:min-height="{renderer.height}px"
>
	<!-- TODO this guard prevents mismatches between SSR and the client, how to fix correctly? ideally the components could opt out of SSR but module context ports aren't on the class -->
	{#if BROWSER}
		<Component_Prop {scene} {renderer} />
	{/if}
</div>

<style>
	.scene_renderer {
		display: flex;
		flex-grow: 0;
		flex-shrink: 0;
		outline: 1px solid var(--border_color_2);
	}
</style>
