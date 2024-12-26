<script lang="ts">
	import {Editor} from '$lib/editor.svelte.js';
	import {app_context} from '$lib/app.svelte.js';

	interface Props {
		editor: Editor;
	}

	const {editor}: Props = $props();

	const app = app_context.get(); // TODO @many use props instead?

	const {scene} = app.project;
</script>

<button
	type="button"
	class="plain"
	onclick={() => {
		editor.collapsed_layers.clear();
	}}
	disabled={!editor.collapsed_layers.size}
>
	expand all
</button>
<button
	type="button"
	class="plain"
	onclick={() => {
		for (const unit of scene.units) {
			editor.collapsed_layers.add(unit);
		}
	}}
	disabled={editor.collapsed_layers.size === scene.units.length}
>
	collapse all
</button>
