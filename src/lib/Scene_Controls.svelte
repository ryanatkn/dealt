<script lang="ts">
	import Pending_Animation from '@ryanatkn/fuz/Pending_Animation.svelte';
	import {slide} from 'svelte/transition';
	import type {Snippet} from 'svelte';

	import type {Project} from '$lib/project.svelte.js';
	import {editor_context} from '$lib/editor.svelte.js';

	// TODO @many get the right abstractions between scene and clock/simulation/renderer/stage/etc

	interface Props {
		project: Project;
		children?: Snippet;
	}

	const {project, children}: Props = $props();

	const {renderer, scene} = $derived(project);
	const {clock} = $derived(scene);

	const editor = editor_context.get();
</script>

<!-- <fieldset class="row">
		<Scrubbable_Input title="canvas width" bind:value={scene.width}>width</Scrubbable_Input>
		<Scrubbable_Input title="canvas height" bind:value={scene.height}>height</Scrubbable_Input>
	</fieldset> -->

<div class="scene_controls">
	<button
		type="button"
		title="toggle the clock [Spacebar]"
		onclick={clock.toggle}
		style:min-width="105px"
		class:color_d={clock.running}
	>
		<div class="pr_sm">clock</div>
		<Pending_Animation running={clock.running} />
	</button>
	<button type="button" title="reset the scene [r]" class="plain" onclick={() => scene.reset()}
		>reset</button
	>
	<button
		type="button"
		class="plain deselectable"
		class:color_d={editor.editing}
		title="{editor.editing ? 'stop editing' : 'start editing'} [~ Shift+Backtick]"
		onclick={() => (editor.editing = !editor.editing)}
	>
		edit
	</button>
	{@render children?.()}
</div>

<!-- TODO implement for other renderers -->
{#if renderer.type === 'canvas'}
	<fieldset transition:slide>
		<label class="row pt_xs"
			><input type="checkbox" bind:checked={renderer.show_bvh} /> show bounding volume hierarchy</label
		>
	</fieldset>
{/if}

<style>
	.scene_controls {
		display: flex;
		align-items: stretch;
	}
</style>
