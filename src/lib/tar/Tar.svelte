<script lang="ts">
	import Tar_Canvas from '$lib/tar/Tar_Canvas.svelte';
	import {Simulation} from '$lib/tar/Simulation';

	let height: number;
	let width: number;

	// TODO game loop to drive sim

	const sim = new Simulation();

	const on_keydown = (e: KeyboardEvent) => {
		sim.handle_keydown(e.key);
	};
	const on_keyup = (e: KeyboardEvent) => {
		sim.handle_keyup(e.key);
	};
</script>

<!-- TODO maybe instead use ResizeObserver? ? -->
<div class="tar" bind:clientHeight={height} bind:clientWidth={width}>
	<Tar_Canvas {width} {height} {sim} />
</div>

<svelte:window on:keydown={on_keydown} on:keyup={on_keyup} />

<style>
	.tar {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
