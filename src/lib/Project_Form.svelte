<script lang="ts">
	import {slide} from 'svelte/transition';

	import {check_project_glyph, type Project} from '$lib/project.svelte.js';

	interface Props {
		project: Project;
	}

	const {project}: Props = $props();

	let glyph_error_message: string | null = $state(null);
</script>

<header class="row mb_lg size_xl3">
	<span class="icon_size_lg pr_xl">{project.glyph}</span>
	{project.name}
</header>
<form class="flex flex_column gap_md width_sm">
	<!-- TODO store in app/site/project data -->
	<label>
		<div class="title">name</div>
		<input
			bind:value={project.name}
			placeholder="project name"
			title="project name for {project.glyph}"
		/>
	</label>
	<label>
		<div class="title">glyph</div>
		<input
			value={project.glyph}
			placeholder="project glyph"
			title="project glyph for {project.name}"
			oninput={(e) => {
				// TODO think about this pattern
				// TODO parse function with efficient unwrapped value? maybe objects with a special symbol key?
				const {value} = e.currentTarget;
				glyph_error_message = check_project_glyph(value);
				if (glyph_error_message === null) {
					project.glyph = value;
				}
			}}
		/>
		{#if glyph_error_message}
			<div transition:slide>
				<strong class="color_c_5">{glyph_error_message}</strong>
			</div>
		{/if}
	</label>
</form>
