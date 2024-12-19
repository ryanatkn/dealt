<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import type {ApplicationOptions} from 'pixi.js';

	import type {Renderer} from '$lib/renderer.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';
	import {Renderer_Scene_Pixi} from '$lib/renderer_scene_pixi.svelte.js';

	interface Props {
		renderer: Renderer;
		scene: Scene;
	}

	const {renderer, scene}: Props = $props();

	let el: HTMLDivElement | undefined;
	let scene_renderer: Renderer_Scene_Pixi | undefined;

	let ready = $state(false);

	onMount(async () => {
		const opts: Partial<ApplicationOptions> = {
			antialias: true, // TODO measure this performance cost
			width: renderer.width,
			height: renderer.height,
			sharedTicker: true,
			eventMode: 'none', // disable Pixi's interactivity because we reuse Dealt's collisions system
			eventFeatures: {click: false, globalMove: false, move: false, wheel: false},
		};
		// TODO make the Pixi app background reactive to `renderer.colors.background`
		if (renderer.colors.background === null) {
			opts.backgroundAlpha = 0;
		} else {
			opts.background = renderer.colors.background;
		}

		scene_renderer = new Renderer_Scene_Pixi(renderer, scene);
		const canvas = await scene_renderer.init(opts);
		el!.appendChild(canvas);

		ready = true;
	});

	onDestroy(() => {
		scene_renderer?.destroy();
	});

	$effect.pre(() => {
		const {width, height} = renderer;
		if (ready) {
			scene_renderer?.resize(width, height);
		}
	});

	$effect(() => {
		if (!ready || !scene_renderer) return;
		scene_renderer.update();
	});

	$effect(() => {
		if (!ready || !scene_renderer) return;
		const current_units = new Set(scene_renderer.unit_renderers.keys());

		// Handle new units
		for (const unit of scene.units) {
			if (!current_units.has(unit)) {
				scene_renderer.create_unit_renderer(unit);
			}
			current_units.delete(unit);
		}

		// Remove deleted units
		for (const unit of current_units) {
			scene_renderer.delete_unit_renderer(unit);
		}
	});

	// TODO maybe render components per unit that manage everything to do with rendering? but how to proxy values in the setters? `x_proxies`/`scale_proxies` array?
</script>

<div
	bind:this={el}
	class="scene_renderer_pixi"
	style:width="{renderer.width}px"
	style:height="{renderer.height}px"
	style:background-color={renderer.colors.background ?? 'transparent'}
></div>
