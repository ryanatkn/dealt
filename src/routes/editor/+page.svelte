<script lang="ts">
	import {editor_context} from '$lib/editor.svelte.js';
	import Project_Editor from '$lib/Project_Editor.svelte';
	import {create_scene_adventure} from '$lib/scenes.js';

	// TODO @many add game
	// const game = new Game(app);
	const editor = editor_context.get();

	const {project} = $derived(editor.app);

	// TODO fix this to use the loaded project and scene data
	// maybe `scene` should be `null`able
	if (project.scenes.current.units.length === 0) {
		// TODO refactor - maybe allow `current_id` to be `undefined`?
		const all = [create_scene_adventure()];
		project.set_json({...project.toJSON(), scenes: {all, current_id: all[0].id}});
	}
</script>

<main>
	<Project_Editor {editor} />
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
</style>
