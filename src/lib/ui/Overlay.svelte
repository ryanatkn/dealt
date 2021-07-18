<script lang="ts">
	import {onMount} from 'svelte';

	export let close: () => void;

	// TODO close with escape key
	// TODO extract OverlayContent?
	// TODO mount transition animation

	// TODO isn't working as intended, see comments below
	let el: HTMLElement;

	onMount(() => {
		// TODO I think SvelteKit's adding `tabindex` is causing keyboard scrolling to break
		// super hacky but w/e, and still doesn't work with keyboard until overlay is clicked (focus doesn't work?)
		document.body.classList.add('noscroll');
		const body_tabindex = document.body.getAttribute('tabindex');
		if (body_tabindex === null) {
			console.error('TODO look at this code because things might be fixed');
		} else {
			document.body.setAttribute('tabindex', '');
		}
		el.focus();
		return () => {
			document.body.classList.remove('noscroll');
			if (body_tabindex !== null) {
				document.body.setAttribute('tabindex', body_tabindex);
			}
		};
	});
</script>

<div class="overlay-wrapper" on:click={close}>
	<div class="overlay-wrapper-inner">
		<div class="content-wrapper p-3" on:click|stopPropagation>
			<div class="content p-1" bind:this={el}>
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
		background-color: var(--bg_color_overlay);
	}
	.overlay-wrapper-inner {
		/* this extra layer is needed because padding and scroll bars get wonky - so .overlay-wrapper has no padding */
		padding: 40px;
		width: 100%;
	}
	.content-wrapper {
		margin: auto;
		max-width: 800px; /* TODO max-column-width */
		background-color: var(--bg_color_backdrop);
		border: 1px solid var(--border_color);
		box-shadow: 4px 12px 24px var(--bg_color_backdrop); /* TODO does this perform ok on all devices? */
	}
</style>
