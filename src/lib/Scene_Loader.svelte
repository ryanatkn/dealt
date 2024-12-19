<script lang="ts">
	import {slide} from 'svelte/transition';

	import type {Project} from '$lib/project.svelte.js';
	import {scene_creators} from '$lib/scenes.js';

	// TODO name? `Scene_Editor`? see `Scene_Editor_Dashboard` as well

	// TODO drag + drop to reorder

	// TODO border or some other active highlight on hover

	interface Props {
		project: Project;
	}

	const {project}: Props = $props();
</script>

<h2 class="mt_xl">Scenes</h2>
<h3>Create new scene</h3>
<section class="row gap_md flex_wrap">
	{#each scene_creators as scene_creator (scene_creator)}
		<button
			type="button"
			title="create scene: {scene_creator.name}"
			onclick={() => {
				const scene_json = scene_creator.create();
				project.create_scene(scene_json);
			}}
		>
			<span class="size_xl3 mr_sm">{scene_creator.glyph}</span>
			{scene_creator.name}
		</button>
	{/each}
</section>
{#if project.scenes.length}
	<h3>Load scene</h3>
	<section class="row gap_md flex_wrap">
		<!-- TODO store in app/site/project data -->
		{#each project.scenes as scene (scene.id)}
			{@const selected = project.selected_scene_id === scene.id}
			<div transition:slide={{axis: 'x'}}>
				<button
					type="button"
					class:selected
					class="white_space_nowrap"
					onclick={selected
						? undefined
						: () => {
								scene.load(); // TODO implicit in select?
								project.select_scene(scene.id);
							}}
				>
					{scene.glyph}
					{scene.name}
				</button>
			</div>
		{/each}
	</section>
{/if}
