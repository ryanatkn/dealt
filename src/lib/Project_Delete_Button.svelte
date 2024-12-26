<script lang="ts">
	import {slide} from 'svelte/transition';

	import type {Project} from '$lib/project.svelte.js';

	interface Props {
		project: Project;
	}

	const {project}: Props = $props();

	let deleting_project = $state(false);

	$effect(() => {
		project.id;
		deleting_project = false; // TODO @many better pattern?
	});
</script>

<button
	type="button"
	class="w_100 color_c"
	onpointerup={() => (deleting_project = !deleting_project)}
>
	delete project
</button>
{#if deleting_project}
	<div transition:slide>
		<button
			type="button"
			class="w_100 color_c selected deselectable"
			onpointerup={(e) => {
				project.app.projects.delete_project(project.id); // TODO hacky access
				deleting_project = false;
				e.currentTarget.closest('.dialog')?.scrollTo({top: 0, behavior: 'smooth'});
			}}
		>
			<div class="size_xl3">✕</div>
			<div class="ml_lg text_align_left">
				permanently delete project<br />{project.glyph}
				{project.name}
			</div>
		</button>
	</div>
{/if}
