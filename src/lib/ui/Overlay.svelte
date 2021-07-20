<script lang="ts">
	import {onMount} from 'svelte';

	export let close: () => void;

	// TODO rename to Modal?
	// TODO close with escape key
	// TODO extract OverlayContent?
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
<div class="overlay" on:click={close} bind:this={el} tabindex="-1">
	<div class="pane-wrapper">
		<div class="pane" on:click|stopPropagation>
			<slot />
		</div>
	</div>
</div>

<style>
	.overlay {
		/*
			this keeps the overlay centered over the content,
			assuming the main app container has a scrollbar.
			(which it always does in this app, so far)
			TODO really, this should match the detected scrollbar state of the app container
		*/
		overflow-y: scroll;
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background-color: var(--bg_color_overlay);
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
		background-color: var(--bg_color_backdrop);
		border: 1px solid var(--border_color);
		box-shadow: 4px 12px 24px var(--bg_color_backdrop); /* TODO does this perform ok on all devices? */
	}
</style>
