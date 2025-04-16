<script lang="ts">
	import Dialog from '@ryanatkn/fuz/Dialog.svelte';

	import {editor_context} from '$lib/editor.svelte.js';

	// TODO maybe extract other components, this is just a quick hack

	// interface Props {}

	// const {}: Props = $props();

	const editor = editor_context.get();

	let show_dialog = $state(false);
</script>

<button type="button" onclick={() => (show_dialog = true)}>help</button>

{#if show_dialog}
	<Dialog onclose={() => (show_dialog = false)}>
		<div class="box width_md mx_auto">
			<div class="pane p_md">
				<h2 class="mt_0">Global controls</h2>
				{#if editor.player_input_enabled}
					<p><strong>WASD</strong> and <strong>arrow keys</strong> to move the player</p>
				{/if}
				<p><strong>r</strong> to reset</p>
				<p><strong>spacebar</strong> to toggle the clock</p>
				{#if editor.player_input_enabled}
					<p><strong>` Backtick</strong> to toggle playing</p>
				{/if}
				<p><strong>~ Shift+Backtick</strong> to toggle editing</p>
				<p>
					edit with mouse and <strong>Ctrl</strong>/<strong>Shift</strong>/<strong>Alt</strong>:
				</p>
				<ul>
					<li><strong>Shift</strong> to add to selection</li>
					<li><strong>Ctrl</strong> to remove from selection</li>
					<li><strong>Delete</strong> to delete the selected units</li>
					<li><strong>Shift+Ctrl</strong> to duplicate the selected units</li>
					<li><strong>Alt</strong> to recenter polygons</li>
					<li><strong>Alt</strong> to duplicate points</li>
					<li><strong>Alt+Ctrl</strong> to delete points</li>
				</ul>
			</div>
		</div>
	</Dialog>
{/if}
