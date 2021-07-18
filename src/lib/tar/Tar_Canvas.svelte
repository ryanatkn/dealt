<script lang="ts">
	import {onMount} from 'svelte';

	export let width: number;
	export let height: number;

	let canvas_el: HTMLCanvasElement | null = null;

	$: canvas_el && draw_canvas(canvas_el, width, height);

	let ctx: CanvasRenderingContext2D | null = null;

	const draw_canvas = (canvas: HTMLCanvasElement, width: number, height: number): void => {
		console.log('draw canvas', canvas, width, height);
		// TODO can remove these temp vars after refactoring into a standalone component - names should be shortened
		if (canvas.width !== width) canvas.width = width;
		if (canvas.height !== height) canvas.height = height;
		if (!ctx) ctx = canvas.getContext('2d');
		if (!ctx) throw Error('Failed to get canvas context');

		ctx.clearRect(0, 0, width, height);
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'red';
		ctx.moveTo(0, height / 2);
		ctx.lineTo(100, 100);
		ctx.lineTo(120, 120);
		ctx.lineTo(80, 150);
		ctx.lineTo(100, 100);
		ctx.stroke();
	};

	onMount(() => draw_canvas(canvas_el!, width, height));
</script>

<canvas bind:this={canvas_el} />
