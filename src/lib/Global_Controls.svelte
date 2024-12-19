<script lang="ts">
	import type {Controller} from '$lib/controller.svelte.js';
	import Global_Keyboard_Input from '$lib/Global_Keyboard_Input.svelte';
	import Global_Gamepad_Input from '$lib/Global_Gamepad_Input.svelte';
	import {editor_context} from './editor.svelte.js';

	interface Props {
		controller?: Controller;
	}

	const {controller = editor_context.get().controller}: Props = $props();

	// TODO `Input` or `Controls`? rename either this component or the children, probably
</script>

<Global_Keyboard_Input {controller} />
<Global_Gamepad_Input {controller} />
