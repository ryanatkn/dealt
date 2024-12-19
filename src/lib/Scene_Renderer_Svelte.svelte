<script lang="ts">
	import Unit_Renderer_Svelte from '$lib/Unit_Renderer_Svelte.svelte';
	import type {Renderer} from '$lib/renderer.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';

	interface Props {
		renderer: Renderer;
		scene: Scene;
	}

	const {renderer, scene}: Props = $props();

	const {width, height, colors} = $derived(renderer);
</script>

<div
	class="scene_renderer_svelte"
	style:width="{width}px"
	style:height="{height}px"
	style:background-color={colors.background ?? 'transparent'}
>
	<svg {width} {height}>
		{#each scene.units as unit (unit)}
			<Unit_Renderer_Svelte {unit} />
		{/each}
	</svg>
</div>
