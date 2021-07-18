<script lang="ts">
	import {onMount} from 'svelte';

	import type {Simulation} from '$lib/tar/Simulation';

	export let width: number;
	export let height: number;
	export let sim: Simulation;

	let canvas_el: HTMLCanvasElement;
	let canvas_width: number;
	let canvas_height: number;

	let running = true;

	onMount(() => {
		// TODO extract to a game loop
		sim.set_canvas(canvas_el);
		let last_time: number | null = null;
		const loop = (time: number) => {
			if (!running || !canvas_el) {
				sim.unset_canvas();
				return;
			}
			if (last_time === null) {
				last_time = time;
			} else {
				const dt = time - last_time;
				last_time = time;
				if (canvas_width !== width || canvas_height !== height) {
					sim.set_dimensions(width, height);
					canvas_width = width;
					canvas_height = height;
				}
				sim.update(dt);
			}
			requestAnimationFrame(loop);
		};
		requestAnimationFrame(loop);
	});

	const on_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			running = false;
		}
	};
</script>

<canvas bind:this={canvas_el} />

<svelte:window on:keydown={on_keydown} />
