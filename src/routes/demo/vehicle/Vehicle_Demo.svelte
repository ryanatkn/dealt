<script lang="ts">
	import {onMount} from 'svelte';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import {BROWSER} from 'esm-env';

	import Dealt from '$lib/Dealt.svelte';
	// import Game from '$lib/game.svelte.js';
	import {Collisions} from '$lib/collisions.js';
	import Scene_Controls from '$lib/Scene_Controls.svelte';
	import {Simulation} from '$lib/simulation.svelte.js';
	import {Renderer} from '$lib/renderer.svelte.js';
	import Renderer_Controls from '$lib/Renderer_Controls.svelte';
	import Unit_List_And_Layers from '$lib/Unit_List_And_Layers.svelte';
	import Scene_Renderer from '$lib/Scene_Renderer.svelte';
	import Scene_Interaction_Surface from '$lib/Scene_Interaction_Surface.svelte';
	import {scene_json} from '$routes/demo/vehicle/scene_data.js';
	import {Unit} from '$lib/unit.svelte.js';
	import {Clock, clock_context} from '$lib/clock.svelte.js';
	import {Controller} from '$lib/controller.svelte.js';
	import Fps_Indicator from '$lib/Fps_Indicator.svelte';
	import {App, app_context} from '$lib/app.svelte.js';
	import {renderer_components} from '$lib/renderer_components.js';
	import {Editor, editor_context} from '$lib/editor.svelte.js';
	import {parse_project_json} from '$lib/project.svelte.js';
	import Help_Button from '$lib/Help_Button.svelte';

	// TODO end state reached by pushing all harmful units offscreen.
	// Need a polygon for the interior bounds (if it doesn't already exist?) -
	// lack of collision between the bounds and any harmful units is the win condition

	const renderer = new Renderer(renderer_components, 'pixi', 800, 600);
	const clock = clock_context.set(new Clock());
	const collisions = new Collisions();
	const simulation = new Simulation(collisions);
	const controller = new Controller();
	const app = app_context.set(new App({renderer, clock, simulation, controller}));
	if (BROWSER) (globalThis as any).app = app;
	// TODO @many add game
	// const game = new Game(app);
	const editor = editor_context.set(new Editor({app}));
	const {project} = app;
	// TODO @many refactor how?
	project.set_json(parse_project_json({scenes: [scene_json]})); // TODO silence or refactor?
	const {
		scenes: {current: scene},
	} = project;
	scene.set_json(scene_json); // TODO @many how to init? and save with reset button?
	scene.json_initial = scene.json; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects

	onMount(() => {
		const was_playing = editor.playing;
		editor.playing = true; // TODO hacky
		editor.player_input_enabled = false; // TODO @many hack to disable player input for some demos
		const unwatch = scene.onupdate(onupdate);
		return () => {
			unwatch();
			editor.playing = was_playing;
			editor.player_input_enabled = true; // TODO @many hack to disable player input for some demos
		};
	});

	const onupdate = (_dt: number) => {
		if (scene.players) {
			for (const player of scene.players) {
				handle_input(player);
				process_game_logic(player);
			}
		}
	};

	const handle_input = (player: Unit) => {
		if (!player.dead && controller.moving) {
			player.velocity -= 0.1 * controller.moving_y;
			player.rotation += 0.04 * controller.moving_x;
		}
	};

	const process_game_logic = (player: Unit) => {
		if (!player.dead) {
			const x = Math.cos(player.rotation);
			const y = Math.sin(player.rotation);

			if (player.velocity > 0) {
				player.velocity -= 0.05;

				if (player.velocity > 3) {
					player.velocity = 3;
				}
			} else if (player.velocity < 0) {
				player.velocity += 0.05;

				if (player.velocity < -2) {
					player.velocity = -2;
				}
			}

			if (!Math.round(player.velocity * 100)) {
				player.velocity = 0;
			}

			if (player.velocity) {
				player.x += x * player.velocity;
				player.y += y * player.velocity;
			}
		}
	};
</script>

<Dealt>
	<div class="wrapper">
		<div class="content p_md">
			<header class="pb_md"><Breadcrumb>🔮</Breadcrumb></header>
			<div class="my_md flex">
				<Scene_Controls {project} />
				<div class="align_self_end">
					<Fps_Indicator />
				</div>
			</div>
			<div class="mb_md">
				<Renderer_Controls {renderer} />
			</div>
			<div class="relative mt_md">
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
			<p class="mt_lg width_sm"><Help_Button /></p>
		</div>
		{#if editor.editing}
			<div class="controls_wrapper">
				<Unit_List_And_Layers {project} {editor} />
			</div>
		{/if}
	</div>
</Dealt>

<style>
	/* TODO these are all a mess */
	.wrapper {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.controls_wrapper {
		flex: 1;
		display: flex;
		height: 100%;
		padding-left: var(--space_xl);
	}
</style>
