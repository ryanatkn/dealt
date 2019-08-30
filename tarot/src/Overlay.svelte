<script lang="ts">
	import {onMount, onDestroy} from 'svelte';

	export let contentStyle = '';
	export let contentClass = 'p-1';

	export let close;

	// TODO close with escape key
	// TODO extract OverlayContent?
	// TODO mount transition animation
</script>

<div class="overlay-wrapper" on:click={close}>
	<div class="overlay-wrapper-inner">
		<div class="content-wrapper p-3" on:click|stopPropagation>
			<div class="content {contentClass}" style={contentStyle}>
				<slot />
			</div>
		</div>
	</div>
</div>

<style>
	.overlay-wrapper {
		/*
			this keeps the overlay centered over the content,
			assuming the main app container has a scrollbar.
			(which it always does in this app, so far)
			TODO really, this should match the detected scrollbar state of the app container
		*/
		overflow-y: scroll;
		height: 100%;
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background-color: var(--bg-color-overlay);
	}
	.overlay-wrapper-inner {
		/* this extra layer is needed because padding and scroll bars get wonky - so .overlay-wrapper has no padding */
		padding: 40px;
		width: 100%;
	}
	.content-wrapper {
		margin: auto;
		max-width: 800px; /* TODO max-column-width */
		background-color: var(--bg-color-backdrop);
		border: 1px solid var(--border-color);
		box-shadow: 4px 12px 24px var(--bg-color-backdrop); /* TODO does this perform ok on all devices? */
	}
	.content {
	}
</style>
