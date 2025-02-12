<script lang="ts">
	import Dialog from '@ryanatkn/fuz/Dialog.svelte';
	import {onNavigate} from '$app/navigation';

	import {Editor} from '$lib/editor.svelte.js';
	import Scene_Datafiles from '$lib/Scene_Datafiles.svelte';
	import Scene_Loader from '$lib/Scene_Loader.svelte';
	import Scene_Form from '$lib/Scene_Form.svelte';

	interface Props {
		editor: Editor;
	}

	const {editor}: Props = $props();

	const {app} = $derived(editor);

	onNavigate(() => {
		if (editor.show_scene_menu) editor.show_scene_menu = false;
	});
</script>

{#if editor.show_scene_menu}
	<Dialog onclose={() => (editor.show_scene_menu = !editor.show_scene_menu)} layout="page">
		<div class="scene_menu width_md">
			<div class="pane p_xl mb_xl3">
				<section>
					<Scene_Loader project={app.projects.current} />
				</section>
				<section>
					<h3>Edit scene</h3>
					<Scene_Form scene={app.projects.current.scenes.current} />
				</section>
			</div>
			<div class="pane p_lg mb_xl3 width_md">
				<Scene_Datafiles scene={app.projects.current.scenes.current} />
			</div>
		</div>
	</Dialog>
{/if}

<style>
	.scene_menu {
		display: flex;
		flex-direction: column;
		gap: var(--space_xl3);
	}
</style>
