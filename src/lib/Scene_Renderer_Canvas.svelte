<script lang="ts">
	import type {Renderer} from '$lib/renderer.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';
	import {draw_collisions_bvh, draw_unit} from '$lib/canvas.js';

	interface Props {
		renderer: Renderer;
		scene: Scene;
	}

	const {renderer, scene}: Props = $props();

	let el: HTMLCanvasElement | undefined;
	const c2d = $derived(el?.getContext('2d'));

	$effect(() => {
		if (!el) return;
		// TODO in each effect? or bind?
		if (el.width !== renderer.width) el.width = renderer.width;
		if (el.height !== renderer.height) el.height = renderer.height;
		if (!c2d) return;
		draw(el, c2d);
	});

	const draw = (el: HTMLCanvasElement, c2d: CanvasRenderingContext2D) => {
		// TODO normalize to width/height, also add renderer scale
		c2d.clearRect(0, 0, el.width, el.height);
		for (const unit of scene.units) {
			c2d.beginPath(); // TODO optimize
			c2d.fillStyle = unit.color;
			draw_unit(c2d, unit);
			c2d.closePath(); // TODO optimize
			c2d.fill();
		}

		if (renderer.show_bvh) {
			c2d.strokeStyle = renderer.bvh_color;
			c2d.beginPath();
			draw_collisions_bvh(c2d, scene.collisions);
			c2d.stroke();
		}
	};
</script>

<canvas
	class="scene_renderer_canvas"
	bind:this={el}
	style:background-color={renderer.colors.background ?? 'transparent'}
></canvas>
