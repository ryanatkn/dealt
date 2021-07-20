<script lang="ts">
	import {onMount} from 'svelte';

	export let close: () => void;

	// TODO rename to Modal?
	// TODO close with escape key
	// TODO extract ModalContent?
	// TODO mount transition animation

	let el: HTMLElement;

	// TODO see this issue for other possible implementations:
	// https://github.com/sveltejs/svelte/issues/3105
	onMount(() => {
		// TODO using `body` here doesn't mesh with `absolute` positioning (so it only works fullscreen right now)
		// maybe we should parameterize the component by its container, and mount it there (how? a selector? what about SSR?)
		document.body.classList.add('noscroll');
		el.focus();
		return () => {
			document.body.classList.remove('noscroll');
		};
	});

	const on_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			close();
		}
	};
</script>

<svelte:window on:keydown={on_keydown} />

<!-- TODO maybe instead of stopping propagation on the pane, check the target -->
<div class="modal" on:click={close} bind:this={el} tabindex="-1">
	<div class="pane-wrapper">
		<div class="pane" on:click|stopPropagation>
			<slot />
		</div>
	</div>
</div>

<style>
	.modal {
		overflow-y: scroll;
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		/* TODO different variable name */
		background-color: var(--bg_color_modal);
	}
	.pane-wrapper {
		/* this extra layer is needed because padding and scroll bars get wonky */
		padding: 40px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pane {
		max-width: 800px; /* TODO max-column-width */
		/* TODO different variable name */
		background-color: var(--bg_color_backdrop);
		border: 1px solid var(--border_color);
		box-shadow: 4px 12px 24px var(--bg_color_backdrop); /* TODO does this perform ok on all devices? */
	}
</style>
