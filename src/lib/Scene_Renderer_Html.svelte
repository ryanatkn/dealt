<script lang="ts">
	import {render_units_to_string} from '$lib/unit_html.js';
	import type {Renderer} from '$lib/renderer.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';

	interface Props {
		renderer: Renderer;
		scene: Scene;
	}

	const {renderer, scene}: Props = $props();

	const raw_string = $derived(render_units_to_string(renderer.width, renderer.height, scene.units));
</script>

<div
	class="scene_renderer_html"
	style:width="{renderer.width}px"
	style:height="{renderer.height}px"
	style:background-color={renderer.colors.background ?? 'transparent'}
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html raw_string}
</div>
