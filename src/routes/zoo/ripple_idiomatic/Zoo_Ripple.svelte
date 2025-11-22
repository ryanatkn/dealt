<script lang="ts">
	import {onMount, onDestroy} from 'svelte';
	import {mount} from 'ripple';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';

	import Dealt from '$lib/Dealt.svelte';
	import {colors_default} from '$lib/renderer.svelte.js';
	// @ts-expect-error - Ripple files use .ripple extension
	import {ZooRipple} from './zoo_ripple.ripple';

	let el: HTMLDivElement | undefined;
	let unmount_ripple: (() => void) | undefined;

	onMount(() => {
		if (el) {
			unmount_ripple = mount(ZooRipple, {
				target: el,
				props: {
					width: 800,
					height: 600,
					colors: colors_default,
				},
			});
		}
	});

	onDestroy(() => {
		try {
			unmount_ripple?.();
		} catch (error) {
			console.error(`Ripple unmount error`, error);
		}
	});
</script>

<Dealt>
	{#snippet global_controls()}{/snippet}
	{#snippet app_contextmenu()}{/snippet}
	<div class="p_md">
		<header class="pb_md"><Breadcrumb>ripple_idiomatic</Breadcrumb></header>
		<h1>Zoo - Ripple Idiomatic</h1>
		<p class="mb_md">
			Pure RippleJS implementation - Ripple owns all state, timing, and rendering.
		</p>

		<div bind:this={el}></div>
	</div>
</Dealt>
