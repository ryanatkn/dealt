<script lang="ts">
	import {onMount} from 'svelte';

	import type {Entity} from '$lib/tar/entity';

	export let width: number;
	export let height: number;
	export let entities: Entity[];

	let canvas_el: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	const draw_canvas = (
		canvas: HTMLCanvasElement,
		width: number,
		height: number,
		entities: Entity[],
	): void => {
		if (canvas.width !== width) canvas.width = width;
		if (canvas.height !== height) canvas.height = height;
		if (!ctx) ctx = canvas.getContext('2d');
		if (!ctx) throw Error('Failed to get canvas context');

		ctx.clearRect(0, 0, width, height);
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'red';
		for (const entity of entities) {
			ctx.moveTo(entity.x - 1, entity.y - 1);
			ctx.lineTo(entity.x + 1, entity.y - 1);
			ctx.lineTo(entity.x + 1, entity.y + 1);
			ctx.lineTo(entity.x - 1, entity.y + 1);
			ctx.lineTo(entity.x - 1, entity.y - 1);
			ctx.stroke();
		}
		ctx.moveTo(0, height / 2);
		ctx.lineTo(100, 100);
		ctx.lineTo(120, 120);
		ctx.lineTo(80, 150);
		ctx.lineTo(100, 100);
		ctx.stroke();
	};

	let running = true;

	onMount(() => {
		const loop = () => {
			draw_canvas(canvas_el!, width, height, entities);
			if (running) requestAnimationFrame(loop);
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
