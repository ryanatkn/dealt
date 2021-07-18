<script lang="ts">
	import {onMount} from 'svelte';

	import type {Simulation} from '$lib/tar/Simulation';

	export let width: number;
	export let height: number;
	export let sim: Simulation;

	let canvas_el: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let canvas_width: number;
	let canvas_height: number;

	const draw_canvas = (
		canvas: HTMLCanvasElement,
		width: number,
		height: number,
		sim: Simulation,
	): void => {
		if (canvas_width !== width) {
			console.log('setting canvas width', width);
			canvas.width = canvas_width = width;
		}
		if (canvas_height !== height) {
			console.log('setting canvas height', width);
			canvas.height = canvas_height = height;
		}
		if (!ctx) {
			console.log('getting context2d');
			ctx = canvas.getContext('2d');
		}
		if (!ctx) throw Error('Failed to get canvas context');

		ctx.clearRect(0, 0, width, height);
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'cornflowerblue';
		for (const entity of sim.entities) {
			ctx.moveTo(entity.x - 1, entity.y - 1);
			ctx.lineTo(entity.x + 1, entity.y - 1);
			ctx.lineTo(entity.x + 1, entity.y + 1);
			ctx.lineTo(entity.x - 1, entity.y + 1);
			ctx.lineTo(entity.x - 1, entity.y - 1);
		}
		ctx.moveTo(0, height / 2);
		ctx.lineTo(100, 100);
		ctx.lineTo(120, 120);
		ctx.lineTo(80, 150);
		ctx.lineTo(100, 100);
		ctx.stroke();
		ctx.closePath();
	};

	let running = true;

	onMount(() => {
		const loop = () => {
			if (!running || !canvas_el) return;
			draw_canvas(canvas_el, width, height, sim);
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
