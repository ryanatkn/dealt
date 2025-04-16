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

	onNavigate(() => {
		if (editor.show_scene_menu) editor.show_scene_menu = false;
	});
</script>

{#if editor.show_scene_menu}
	<Dialog onclose={() => (editor.show_scene_menu = !editor.show_scene_menu)} layout="page">
		<div class="column width_md gap_xl3 mx_auto">
			<div class="pane p_lg">
				<section>
					<Scene_Loader project={editor.project} />
				</section>
				<section>
					<h3>Edit scene</h3>
					<Scene_Form scene={editor.project.scene} />
				</section>
			</div>
			<div class="pane p_lg">
				<Scene_Datafiles scene={editor.project.scene} />
			</div>
		</div>
	</Dialog>
{/if}
