<script lang="ts">
	import Dialog from '@ryanatkn/fuz/Dialog.svelte';
	import Mdn_Link from '@ryanatkn/fuz/Mdn_Link.svelte';
	import Svg from '@ryanatkn/fuz/Svg.svelte';
	import {github_logo} from '@ryanatkn/fuz/logos.js';
	import {slide} from 'svelte/transition';
	import {base} from '$app/paths';

	import {App} from '$lib/app.svelte.js';
	import Scene_Datafiles from '$lib/Scene_Datafiles.svelte';
	import Scene_Loader from '$lib/Scene_Loader.svelte';
	import Project_Form from '$lib/Project_Form.svelte';
	import Scene_Form from '$lib/Scene_Form.svelte';
	import {onNavigate} from '$app/navigation';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import {parse_project_json, get_next_project_name} from '$lib/project.svelte.js';
	import Project_Datafile from '$lib/Project_Datafile.svelte';
	import Project_Delete_Button from '$lib/Project_Delete_Button.svelte';
	import {create_scene_adventure} from '$lib/scenes.js';
	import {to_scene_metadata_json} from '$lib/scene.svelte.js';
	import {editor_context} from '$lib/editor.svelte.js';

	interface Props {
		app: App;
	}

	const {app}: Props = $props();

	let deleting_storage = $state(false);

	const editor = editor_context.maybe_get();
	const project = $derived(editor?.project);

	onNavigate(() => {
		if (app.show_main_menu) app.close_main_menu();
	});
</script>

{#if app.show_main_menu}
	<Dialog onclose={app.close_main_menu} layout="page">
		<div class="main_menu">
			<div class="sidebar gap_xl3">
				<!-- TODO refactor, maybe setting snippets in context and rendering them here? -->
				{#if editor}
					<div class="pane p_lg width_sm">
						<h2 class="mt_0 mb_lg row pr_md"><span class="icon_size_lg">🏞</span> projects</h2>
						<div class="flex flex_column flex_wrap w_100">
							{#each editor.projects as project (project)}
								{@const selected = editor.selected_project_id === project.id}
								<div class="w_100 py_xs" transition:slide>
									<button
										type="button"
										title={selected
											? `${project.glyph} ${project.name} is selected`
											: `select project ${project.glyph} ${project.name}`}
										class="w_100 color_d text_align_left justify_content_start"
										style:flex-wrap="nowrap"
										class:selected
										onclick={selected
											? undefined
											: () => {
													editor.select_project(project.id);
												}}
									>
										<div class="size_xl3 mr_lg">{project.glyph}</div>
										<div class="ellipsis">{project.name}</div>
									</button>
								</div>
							{/each}
							<button
								type="button"
								title="create a new project"
								class="w_100 mt_xs justify_content_start"
								onclick={() => {
									editor.create_project(
										parse_project_json({
											name: get_next_project_name(editor.projects),
											scenes: [to_scene_metadata_json(create_scene_adventure())],
										}),
									);
									// TODO create scene metadata, save?
								}}
							>
								<div class="row white_space_nowrap">
									<span class="size_xl3 mr_lg line_height_1">+</span>
									create new project
								</div>
							</button>
						</div>
					</div>
				{/if}
				<div class="box">
					<!-- TODO configure for this app instead of hardcoding -->
					<div class="box pane p_xs2">
						<div class="box p_xl3 gap_xl3 radius_sm shadow_md">
							<Breadcrumb><span class="size_xl">🔮</span></Breadcrumb>
							<nav>
								<ul class="flex flex_column gap_sm unstyled">
									<li>
										<a class="chip w_100 box px_md py_xs" href="{base}/demo">demos</a>
									</li>
									<li>
										<a class="chip w_100 box px_md py_xs" href="{base}/about">about</a>
									</li>
									<li>
										<a
											class="chip w_100 box p_md pb_xs white_space_nowrap"
											href="https://github.com/ryanatkn/dealt"
											><Svg data={github_logo} size="var(--icon_size_md)" /> source</a
										>
									</li>
								</ul>
							</nav>
						</div>
					</div>
				</div>
				<div class="box">
					<div class="box row pane">
						<div class="icon_size_lg" title="dealt">🔮</div>
					</div>
				</div>
			</div>
			<div class="content">
				{#if editor && project}
					<div class="pane p_xl mb_xl3">
						<section>
							<Project_Form {project} />
						</section>
						<section>
							<Project_Datafile {project} />
						</section>
					</div>
					<div class="pane p_xl mb_xl3">
						<section>
							<Scene_Loader project={editor.project} />
						</section>
						<section>
							<h3>Edit scene</h3>
							<Scene_Form scene={editor.project.scene} />
						</section>
					</div>
					<div class="pane p_lg mb_xl3">
						<Scene_Datafiles scene={editor.project.scene} />
					</div>
					<div class="pane p_xl mb_xl3 shadow_c_xl">
						<h2 class="mt_xl color_c_5 font_weight_600">Danger zone</h2>
						<section class="width_sm">
							<Project_Delete_Button {project} />
						</section>
						<section>
							<h3 class="mt_xl">Storage</h3>
							<div>
								<p class="width_sm">
									Data is saved locally on your computer using <Mdn_Link
										path="Web/API/Window/localStorage"
									/>.
								</p>
								<!-- TODO add an `export saved data` button -->
								<!-- TODO @many helper component -->
								<div class="width_sm">
									<button
										type="button"
										class="w_100 color_c"
										onclick={() => (deleting_storage = !deleting_storage)}
									>
										clear all saved data
									</button>
									{#if deleting_storage}
										<div transition:slide>
											<button
												type="button"
												class="w_100 color_c selected deselectable"
												onpointerup={() => {
													localStorage.clear();
													location.reload();
												}}
											>
												<div class="size_xl3">✕</div>
												<div class="ml_lg text_align_left">
													permanently delete<br />all locally saved data
												</div>
											</button>
										</div>
									{/if}
								</div>
							</div>
						</section>
					</div>
				{/if}
			</div>
		</div>
	</Dialog>
{/if}

<style>
	.main_menu {
		display: flex;
		gap: var(--space_xl3);
	}

	.content {
		width: var(--width_md);
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		/*  */
	}
</style>
