<script lang="ts">
	import type {Snippet} from 'svelte';
	import {BROWSER} from 'esm-env';

	import Scene_Renderer from '$lib/Scene_Renderer.svelte';
	import {renderer_types} from '$lib/renderer.svelte.js';
	import {renderer_components} from '$lib/renderer_components.js';
	import type {Project} from '$lib/project.svelte.js';

	interface Props {
		project: Project;
		children?: Snippet;
	}

	const {project, children}: Props = $props();

	const {scene} = $derived(project);

	let width: number | undefined = $state();
	let height: number | undefined = $state();

	// TODO refactor without the effect
	$effect.pre(() => {
		if (width !== undefined) {
			project.renderer.width = width;
		}
		if (height !== undefined) {
			project.renderer.height = height / project.renderer_count;
		}
	});
</script>

<div class="project_renderer" bind:clientWidth={width} bind:clientHeight={height}>
	{#if BROWSER}
		{#each renderer_types as renderer_type (renderer_type)}
			{#if project.renderers[renderer_type]}
				<div class="display_flex w_100 position_relative">
					<Scene_Renderer
						Component={renderer_components[renderer_type]}
						{scene}
						renderer={project.renderer}
					/>
					{@render children?.()}
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.project_renderer {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
</style>
