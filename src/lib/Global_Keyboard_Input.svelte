<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	import type {Controller} from '$lib/controller.svelte.js';
	import {editor_context} from '$lib/editor.svelte.js';
	import {app_context} from '$lib/app.svelte.js';
	import {enable_global_hotkeys} from '$lib/dom.js';

	// TODO shift+click on the unit lists/layers should add them
	// TODO control+click should deselect (probably?)

	interface Props {
		controller: Controller;
	}

	const {controller}: Props = $props();

	const app = app_context.get();
	const editor = editor_context.get();

	const onkeydown = (e: KeyboardEvent) => {
		// console.log(`keydown e`, e.key);
		if (!enable_global_hotkeys(e.target)) return;

		const {key, ctrlKey, altKey} = e;

		// console.log(`key`, key);

		// TODO move this logic, either to the controller or subscribed externally
		if (key === ' ') {
			editor.clock.toggle();
			swallow(e);
			return;
		} else if (key === 'r' && !ctrlKey) {
			editor.project.scene.reset();
			swallow(e);
			return;
		} else if (key === '`' && !ctrlKey && !altKey) {
			editor.toggle_playing();
			swallow(e);
			return;
		} else if (key === '~' && !ctrlKey && !altKey) {
			editor.editing = !editor.editing;
			swallow(e);
			return;
		} else if (key === 'Escape' && !ctrlKey && !altKey) {
			// TODO use `Dialogs`
			if (editor.show_scene_menu) {
				editor.show_scene_menu = false;
			} else {
				app.toggle_main_menu();
			}
			swallow(e);
			return;
		}

		if (controller.handle_keydown(key)) {
			swallow(e);
		}
	};

	const onkeyup = (e: KeyboardEvent) => {
		// console.log(`keyup e`, e.key);
		if (!enable_global_hotkeys(e.target)) return;

		if (controller.handle_keyup(e.key)) {
			swallow(e);
		}
	};
</script>

<!-- TODO maybe capture? or both? -->
<svelte:window {onkeydown} {onkeyup} />
