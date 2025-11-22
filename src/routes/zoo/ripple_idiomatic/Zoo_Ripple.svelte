<script lang="ts">
	import {onMount, onDestroy} from 'svelte';
	import {mount} from 'ripple';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';

	import Dealt from '$lib/Dealt.svelte';
	import {colors_default} from '$lib/renderer.svelte.js';
	// @ts-expect-error - Ripple files use .ripple extension
	import {ZooRipple} from './zoo_ripple.ripple';

	// Static config (Ripple owns all dynamic state)
	const width = 800;
	const height = 600;

	let el: HTMLDivElement | undefined;
	let unmount_ripple: (() => void) | undefined;

	// RAF loop state (Svelte owns timing, Ripple owns simulation)
	let ripple_update_callback: ((dt: number) => void) | null = null;
	let frame_id: number | null = null;
	let last_time: number | null = null;

	function tick(): void {
		const now = performance.now();
		if (last_time !== null) {
			const dt = now - last_time;
			if (dt < 1000 && ripple_update_callback) {
				ripple_update_callback(dt);
			}
		}
		last_time = now;
		frame_id = requestAnimationFrame(tick);
	}

	function start(): void {
		if (frame_id !== null) return;
		last_time = null;
		tick();
	}

	function stop(): void {
		if (frame_id !== null) {
			cancelAnimationFrame(frame_id);
			frame_id = null;
		}
	}

	onMount(() => {
		if (el) {
			unmount_ripple = mount(ZooRipple, {
				target: el,
				props: {
					width,
					height,
					colors: colors_default,
					register_update_callback: (cb: ((dt: number) => void) | null) => {
						ripple_update_callback = cb;
					},
				},
			});
			start();
		}
	});

	onDestroy(() => {
		stop();
		if (unmount_ripple) {
			try {
				unmount_ripple();
			} catch (e) {
				console.warn('[Zoo_Ripple] Error during unmount:', e);
			}
		}
	});
</script>

<Dealt>
	{#snippet global_controls()}{/snippet}
	{#snippet app_contextmenu()}{/snippet}
	<div class="p_md">
		<header class="pb_md"><Breadcrumb>ripple_idiomatic</Breadcrumb></header>
		<h1>Zoo - Ripple Idiomatic</h1>
		<p class="mb_md">Pure RippleJS implementation - Ripple owns all state, RAF, and controls.</p>

		<div bind:this={el}></div>
	</div>
</Dealt>
