<script lang="ts">
	import type {Controller} from '$lib/controller.svelte.js';

	interface Props {
		controller: Controller;
	}

	const {controller}: Props = $props();
</script>

<svelte:window
	ongamepadconnected={(e) => {
		controller.handle_gamepad_connected(e.gamepad);
	}}
	ongamepaddisconnected={(e) => {
		controller.handle_gamepad_disconnected(e.gamepad);
	}}
/>
