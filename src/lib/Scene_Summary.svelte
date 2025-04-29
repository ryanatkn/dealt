<script lang="ts">
	import {Project} from '$lib/project.svelte.js';
	import {editor_context} from '$lib/editor.svelte.js';

	interface Props {
		project: Project;
	}

	const {project}: Props = $props();

	const editor = editor_context.get();
</script>

<div class="scene_summary">
	<button class="plain" type="button" onclick={() => (editor.show_scene_menu = true)}
		>{project.scenes.current.name}</button
	>
</div>

<style>
	.scene_summary {
		height: 100%;
	}

	button {
		white-space: nowrap;
		margin-bottom: 0;
		height: 100%;
	}
</style>
