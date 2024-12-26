<script lang="ts">
	import {onMount} from 'svelte';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import {BROWSER} from 'esm-env';

	import Dealt from '$lib/Dealt.svelte';
	// import Game from '$lib/game.svelte.js';
	import Scene_Controls from '$lib/Scene_Controls.svelte';
	import Renderer_Controls from '$lib/Renderer_Controls.svelte';
	import Unit_Layers_Controls from '$lib/Unit_Layers_Controls.svelte';
	import Scene_Renderer from '$lib/Scene_Renderer.svelte';
	import Scene_Interaction_Surface from '$lib/Scene_Interaction_Surface.svelte';
	import Unit_List_And_Layers from '$lib/Unit_List_And_Layers.svelte';
	import {scene_json} from '$routes/demo/sandbox/scene_data.js';
	import {App, app_context} from '$lib/app.svelte.js';
	import {Renderer} from '$lib/renderer.svelte.js';
	import {parse_project_json} from '$lib/project.svelte.js';
	import Fps_Indicator from '$lib/Fps_Indicator.svelte';
	import Help_Button from '$lib/Help_Button.svelte';
	import {Editor, editor_context} from '$lib/editor.svelte.js';
	import {renderer_components} from '$lib/renderer_components.js';
	import {clock_context} from '$lib/clock.svelte.js';

	const renderer = new Renderer(renderer_components, 'pixi', 0, 0);

	const app = app_context.set(new App({renderer}));
	clock_context.set(app.clock);
	if (BROWSER) (globalThis as any).app = app;
	// TODO @many add game
	// const game = new Game(app);
	const editor = editor_context.set(new Editor({app}));
	const {project} = app;
	// TODO @many refactor how?
	project.set_json(parse_project_json({scenes: [scene_json]})); // TODO silence or refactor?
	console.log(`scene_json`, scene_json);
	const {scene} = project;
	scene.set_json(scene_json); // TODO @many how to init? and save with reset button?
	scene.json_initial = scene.json; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects

	onMount(() => {
		const was_playing = editor.playing;
		editor.playing = true; // TODO hacky
		return () => {
			editor.playing = was_playing;
		};
	});
</script>

<Dealt>
	<div class="sandbox_demo">
		<div
			class="renderer relative"
			bind:clientWidth={renderer.width}
			bind:clientHeight={renderer.height}
		>
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
		{#if editor.editing}
			<div class="sidebar">
				<div class="topbar">
					<div class="row justify_content_space_between">
						<Breadcrumb>🔮</Breadcrumb>
						<button
							type="button"
							class="plain"
							title="toggle editor [` Backtick]"
							onclick={() => {
								editor.editing = !editor.editing;
							}}>✕</button
						>
					</div>
					<div class="py_xs flex">
						<Scene_Controls {project} />
						<Fps_Indicator />
					</div>
					<div class="row gap_md">
						<Renderer_Controls {renderer} omit_size row />
						<Help_Button />
					</div>
					<!-- TODO add a help button that shows the `Help_Dialog` -->
					<!-- <p class="mt_lg"><Help_Button /></p> -->
					<div class="row mt_xs">
						<Unit_Layers_Controls {editor} />
					</div>
				</div>
				<div class="unit_controls">
					<div class="unit_controls_inner">
						<Unit_List_And_Layers {project} />
					</div>
				</div>
			</div>
		{/if}
	</div>
</Dealt>

<style>
	.sandbox_demo,
	.renderer {
		width: 100%;
		height: 100%;
	}

	.sidebar {
		--offset_x: var(--space_lg);
		--offset_y: var(--space_lg);
		position: fixed;
		right: var(--offset_x);
		top: var(--offset_y);
		display: flex;
		flex-direction: column;
		height: calc(100% - var(--offset_x) - var(--offset_y));
		background-color: var(--bg_lighter);
		box-shadow: var(--shadow_bottom_lg)
			color-mix(in hsl, var(--shadow_color_f) var(--shadow_alpha_2), transparent);
		border-radius: var(--radius_sm);
		border: 1px solid var(--border_color_1);
	}

	.topbar {
		padding: var(--space_xs);
		border-bottom: var(--border_width) var(--border_style) var(--border_color_1);
	}

	/* TODO this is all hacky, just trying to ship */
	.unit_controls {
		flex: 1;
		position: relative;
		width: calc(var(--width_sm) + 215px); /* TODO @many hardcoding and hacking just to ship */
	}
	.unit_controls_inner {
		position: absolute;
		height: 100%;
		width: 100%;
		display: flex;
	}
</style>
