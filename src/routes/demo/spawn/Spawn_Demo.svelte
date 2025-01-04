<script lang="ts">
	import {onMount, untrack} from 'svelte';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import {random_float, random_int} from '@ryanatkn/belt/random.js';
	import {create_random_alea} from '@ryanatkn/belt/random_alea.js';
	import {BROWSER} from 'esm-env';

	import Dealt from '$lib/Dealt.svelte';
	// import Game from '$lib/game.svelte.js';
	import {cr} from '$lib/collision_result.js';
	import {colliding} from '$lib/colliding.js';
	import Scrubbable_Input from '$lib/Scrubbable_Input.svelte';
	import Scene_Controls from '$lib/Scene_Controls.svelte';
	import Renderer_Controls from '$lib/Renderer_Controls.svelte';
	import Help_Button from '$lib/Help_Button.svelte';
	import {Renderer} from '$lib/renderer.svelte.js';
	import {SPEED_DEFAULT, STRENGTH_MAX, Unit, type Unit_Scale} from '$lib/unit.svelte.js';
	import Scene_Renderer from '$lib/Scene_Renderer.svelte';
	import Scene_Interaction_Surface from '$lib/Scene_Interaction_Surface.svelte';
	import {App, app_context} from '$lib/app.svelte.js';
	import Fps_Indicator from '$lib/Fps_Indicator.svelte';
	import {Spawn_Demo_State} from '$routes/demo/spawn/spawn_demo.svelte.js';
	import {Editor, editor_context} from '$lib/editor.svelte.js';
	import {renderer_components} from '$lib/renderer_components.js';
	import {clock_context} from '$lib/clock.svelte.js';

	// TODO integrate with local storage so the hash gets restored if absent

	interface Props {
		spawn_demo?: Spawn_Demo_State;
	}

	const {spawn_demo = new Spawn_Demo_State()}: Props = $props();

	console.log(`spawn_demo.renderer_type`, spawn_demo.renderer_type);
	const renderer = new Renderer(
		renderer_components,
		spawn_demo.renderer_type,
		spawn_demo.width,
		spawn_demo.height,
	);

	const app = app_context.set(new App({renderer}));
	const {simulation} = app;
	clock_context.set(app.clock);
	if (BROWSER) (globalThis as any).app = app;
	// TODO @many add game
	// const game = new Game(app);
	const editor = editor_context.set(new Editor({app}));
	const {project} = app;
	const {scene} = project;

	const speed_step = 0.002;
	const speed_min = 0;
	const speed_max = 3;
	const size = 5;
	const unit_count_min = 1;
	const unit_count_max = 1000;
	const unit_scale_min = 0.1;
	const unit_scale_max = 5;
	const unit_scale_step = 0.01;

	// TODO better way to sync these?
	simulation.speed = spawn_demo.simulation_speed;
	$effect.pre(() => {
		spawn_demo.renderer_type = renderer.type;
	});
	$effect.pre(() => {
		spawn_demo.simulation_speed = simulation.speed;
	});

	// TODO select movement/collision behavior

	onMount(() => {
		const was_playing = editor.playing;
		editor.playing = true; // TODO hacky
		const unwatch = scene.onupdate(onupdate);
		return () => {
			unwatch();
			editor.playing = was_playing;
		};
	});

	const BOUNDS_SIZE = 100000; // TODO hm?

	const create_units = (count: number, scale: Unit_Scale, width: number, height: number) => {
		const random_alea = create_random_alea(count, scale);
		const random = (min: number, max: number): number => random_float(min, max, random_alea);

		console.time('resetting scene');
		scene.reset(null);
		console.timeEnd('resetting scene');

		// TODO real/efficient bounds, this is a hack using units (maybe is fine? forces the system to handle its needs)
		// Scene bounds
		scene.add_unit(
			new Unit(scene, {
				x: 0,
				y: 0,
				strength: STRENGTH_MAX,
				movement_multiplier: 0,
				points: [
					{x: 0, y: 0},
					{x: width, y: 0},
					{x: width, y: -BOUNDS_SIZE},
					{x: 0, y: -BOUNDS_SIZE},
				],
			}),
		);
		scene.add_unit(
			new Unit(scene, {
				x: 0,
				y: 0,
				strength: STRENGTH_MAX,
				movement_multiplier: 0,
				points: [
					{x: width, y: 0},
					{x: width, y: height},
					{x: width + BOUNDS_SIZE, y: height},
					{x: width + BOUNDS_SIZE, y: 0},
				],
			}),
		);
		scene.add_unit(
			new Unit(scene, {
				x: 0,
				y: 0,
				strength: STRENGTH_MAX,
				movement_multiplier: 0,
				points: [
					{x: width, y: height},
					{x: 0, y: height},
					{x: 0, y: height + BOUNDS_SIZE},
					{x: width, y: height + BOUNDS_SIZE},
				],
			}),
		);
		scene.add_unit(
			new Unit(scene, {
				x: 0,
				y: 0,
				strength: STRENGTH_MAX,
				movement_multiplier: 0,
				points: [
					{x: 0, y: height},
					{x: 0, y: 0},
					{x: -BOUNDS_SIZE, y: 0},
					{x: -BOUNDS_SIZE, y: height},
				],
			}),
		);

		console.log('creating shapes');
		console.time('creating shapes');
		for (let i = 0; i < count; ++i) {
			create_shape(random_alea() > 0.5 ? i % 16 === 0 : false, scale, random, random_alea);
		}
		console.timeEnd('creating shapes');
		console.log('created ' + count + ' shapes');

		scene.json_initial = scene.json; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects
	};

	$effect(() => {
		// TODO refactor how?
		console.log('[Spawn_Demo] creating units');
		const c = spawn_demo.unit_count,
			s = spawn_demo.unit_scale,
			w = renderer.width,
			h = renderer.height;
		untrack(() => create_units(c, s, w, h));
	});

	const onupdate = (_dt: number) => {
		// console.log('[Spawn_Demo] onupdate');

		for (let i = 0; i < scene.units.length; ++i) {
			const unit = scene.units[i];

			// if (speed > 0) {
			// 	unit.x += unit.direction_x * speed;
			// 	unit.y += unit.direction_y * speed;
			// }

			const potentials = unit.body.potentials();

			for (const body2 of potentials) {
				if (colliding(unit.body, body2, cr)) {
					// This makes them predictably bounce off each other. Without it, it's much more chaotic
					// unit.x -= cr.overlap! * cr.overlap_x;
					// unit.y -= cr.overlap! * cr.overlap_y;

					const dot1 = unit.direction_x * cr.overlap_y + unit.direction_y * -cr.overlap_x;

					unit.direction_x = 2 * dot1 * cr.overlap_y - unit.direction_x;
					unit.direction_y = 2 * dot1 * -cr.overlap_x - unit.direction_y;

					const dot2 =
						body2.unit.direction_x * cr.overlap_y + body2.unit.direction_y * -cr.overlap_x;

					body2.unit.direction_x = 2 * dot2 * cr.overlap_y - body2.unit.direction_x;
					body2.unit.direction_y = 2 * dot2 * -cr.overlap_x - body2.unit.direction_y;
				}
			}
		}
	};

	const create_shape = (
		large: boolean,
		scale: Unit_Scale,
		// TODO these are messy, maybe make a `random` object with all the functions (could track # of calls to seeded rng)
		random: (min: number, max: number) => number,
		random_alea: () => number,
	) => {
		const min_size = size * 1 * (large ? 4.2 * scale : scale);
		const max_size = size * 2.5 * (large ? 4.2 * scale : scale);
		const x = random(0, renderer.width);
		const y = random(0, renderer.height);
		const direction = (random(0, 360) * Math.PI) / 180;

		let body;

		if (random_alea() > 0.7) {
			body = scene.add_unit(new Unit(scene, {x, y, radius: random(min_size, max_size)}));
		} else {
			// hacky, just make 4 points and usually randomly remove 1
			let points = [
				{x: -random(min_size, max_size), y: -random(min_size, max_size)},
				{x: random(min_size, max_size), y: -random(min_size, max_size)},
				{x: random(min_size, max_size), y: random(min_size, max_size)},
				{x: -random(min_size, max_size), y: random(min_size, max_size)},
			];
			if (random_alea() > 0.17) {
				const index_to_remove = random_int(0, points.length - 1, random_alea);
				points = points.filter((_, i) => i !== index_to_remove);
			}
			body = scene.add_unit(
				new Unit(scene, {
					x,
					y,
					points,
					rotation: (random(0, 360) * Math.PI) / 180,
					speed: SPEED_DEFAULT * random(0.1, 1),
				}),
			);
		}

		// TODO type
		(body as any).direction_x = Math.cos(direction);
		(body as any).direction_y = Math.sin(direction);
	};
</script>

<Dealt>
	<div class="p_md">
		<header class="pb_md"><Breadcrumb>🔮</Breadcrumb></header>
		<form class="width_md">
			<div class="my_md flex">
				<Scene_Controls {project} />
				<div class="align_self_end">
					<Fps_Indicator />
				</div>
			</div>
			<div class="mb_md">
				<Renderer_Controls {renderer} />
			</div>
			<div class="row">
				<Scrubbable_Input
					title="unit speed"
					bind:value={simulation.speed}
					row
					step={speed_step}
					min={speed_min}
				>
					simuation speed
				</Scrubbable_Input>
				<input
					title="unit speed"
					type="range"
					bind:value={simulation.speed}
					step={speed_step}
					min={speed_min}
					max={speed_max}
				/>
			</div>
			<fieldset>
				<div class="row">
					<Scrubbable_Input
						title="unit count"
						bind:value={spawn_demo.unit_count}
						row
						min={unit_count_min}>unit count</Scrubbable_Input
					>
					<input
						title="unit count"
						type="range"
						bind:value={spawn_demo.unit_count}
						max={unit_count_max}
					/>
					<!-- TODO this make the value revert to 1, why?
					min={unit_count_min} -->
				</div>
				<div class="row">
					<Scrubbable_Input
						title="unit scale"
						bind:value={spawn_demo.unit_scale}
						row
						step={unit_scale_step}
						min={unit_scale_min}>unit scale</Scrubbable_Input
					>
					<input
						title="unit scale"
						type="range"
						bind:value={spawn_demo.unit_scale}
						step={unit_scale_step}
						min={unit_scale_min}
						max={unit_scale_max}
					/>
				</div>
			</fieldset>
		</form>

		<p>
			{scene.units.length} shapes - {scene.units.filter((u) => u.type === 'circle').length} circles,
			{scene.units.filter((u) => u.type === 'polygon').length} polygons
		</p>

		<div class="relative">
			<Scene_Renderer Component={renderer.Component} {scene} {renderer} />
			{#if editor.editing}
				<Scene_Interaction_Surface
					{scene}
					bind:scene_interaction_surface_state={editor.scene_interaction_surface_state}
					unit_selection={editor.unit_selection}
					width={renderer.width}
					height={renderer.height}
				/>
			{/if}
		</div>
		<p class="mt_lg">
			<Help_Button />
		</p>
		<div>
			<div>pointer_x: {editor.scene_interaction_surface_state.pointer_x}px</div>
			<div>pointer_y: {editor.scene_interaction_surface_state.pointer_y}px</div>
			<div>pointer_down: {editor.scene_interaction_surface_state.pointer_down}</div>
			<div>pointing: {editor.scene_interaction_surface_state.pointing}</div>
		</div>
	</div>
</Dealt>
