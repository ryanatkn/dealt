<script lang="ts">
	import Pending_Animation from '@ryanatkn/fuz/Pending_Animation.svelte';
	import {base} from '$app/paths';
	import Svg from '@ryanatkn/fuz/Svg.svelte';
	import {github_logo} from '@ryanatkn/fuz/logos.js';
	import {BROWSER} from 'esm-env';

	// import Game from '$lib/game.svelte.js';
	import Unit_List_And_Layers from '$lib/Unit_List_And_Layers.svelte';
	import Scene_Summary from '$lib/Scene_Summary.svelte';
	import Scene_Controls from '$lib/Scene_Controls.svelte';
	import Scene_Interaction_Surface from '$lib/Scene_Interaction_Surface.svelte';
	import {renderer_summaries, renderer_types} from '$lib/renderer.svelte.js';
	import Fps_Indicator from '$lib/Fps_Indicator.svelte';
	import type {Editor} from '$lib/editor.svelte.js';
	import Project_Renderer from '$lib/Project_Renderer.svelte';
	import Help_Button from '$lib/Help_Button.svelte';

	// TODO border or some other active highlight on hover

	interface Props {
		editor: Editor;
	}

	const {editor}: Props = $props();

	const {app, project} = $derived(editor);
	const {scene} = $derived(project);

	// TODO camera controls in the header

	// TODO the renderers currently size to their wrappers, maybe change?
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<div class="project_editor">
	<nav class="top_nav">
		<div class="scene_controls">
			<button
				style:height="100%"
				style:min-width="var(--icon_size_md)"
				class="icon_button plain"
				type="button"
				onclick={app.open_main_menu}>☰</button
			>
			<!-- <button type="button" onclick={app.open_main_menu}>load</button> -->
			<button type="button" class="plain" onclick={() => scene.save()}> save </button>
			<button
				type="button"
				class="edit_or_play color_d deselectable"
				class:selected={editor.playing}
				title="{editor.playing ? 'stop playing' : 'start playing'} [{'`'} Backtick]"
				onclick={() => {
					editor.toggle_playing();
				}}
			>
				{#if editor.playing}<Pending_Animation />{:else}play{/if}
			</button>
			<div class="row">
				<Fps_Indicator />
			</div>
			<Scene_Controls {project} />
			<div class="row align_items_stretch shadow_inset_xs pl_md">
				{#each renderer_types as renderer_type (renderer_type)}
					<button
						type="button"
						class:color_d={BROWSER && project.renderers[renderer_type]}
						class="deselectable"
						title={renderer_summaries[renderer_type]}
						onclick={() => {
							project.toggle_renderer(renderer_type);
						}}>{renderer_type}</button
					>
				{/each}
			</div>
			<div class="row pl_md">
				<span>
					<Help_Button />
				</span>
			</div>
		</div>
		<Scene_Summary {project} />
		<header class="flex">
			<div class="row ml_auto">
				<a class="nav_link" href="{base}/demo">demos</a>
				<a class="nav_link" href="{base}/about">about</a>
				<a class="nav_link" href="https://github.com/ryanatkn/dealt"
					><Svg data={github_logo} size="var(--icon_size_sm)" /></a
				>
			</div>
		</header>
	</nav>
	<div class="content">
		<!-- <div
			class="left_sidebar"
			class:scrolled={left_sidebar_scroll_top > 0}
			onscroll={(e) => {
				left_sidebar_scroll_top = e.currentTarget.scrollTop;
			}}
		></div> -->
		<Project_Renderer {project}>
			{#if editor.editing}
				<Scene_Interaction_Surface
					{scene}
					bind:scene_interaction_surface_state={editor.scene_interaction_surface_state}
					unit_selection={editor.unit_selection}
					width={project.renderer.width}
					height={project.renderer.height}
				/>
			{/if}
		</Project_Renderer>
		{#if editor.editing}
			<div class="right_sidebar">
				<Unit_List_And_Layers {project} />
			</div>
		{/if}
	</div>
</div>

<style>
	.project_editor {
		--top_nav_height: var(--icon_size_md);
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.edit_or_play {
		width: 75px;
	}

	.top_nav {
		height: var(--top_nav_height);
		width: 100%;
		border-bottom: var(--border_width) var(--border_style) var(--border_color_1);
		gap: var(--space_md);
		display: flex;
		justify-content: space-between;
		margin-bottom: 0;
	}

	.nav_link {
		display: flex;
		align-items: center;
		height: 100%;
		padding: var(--space_xs) var(--space_md);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.content {
		height: calc(100% - var(--top_nav_height));
		display: flex;
		flex: 1;
	}

	.right_sidebar {
		height: 100%;
		background-color: var(--bg_lighter);
		border-left: var(--border_width) var(--border_style) var(--border_color_1);
		display: flex;
	}

	.scene_controls {
		display: flex;
		align-items: stretch;
		flex: 1;
	}
</style>
