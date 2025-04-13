<script lang="ts">
	import type {Project} from '$lib/project.svelte.js';
	import Unit_Layer from '$lib/Unit_Layer.svelte';
	import Unit_Contextmenu from '$lib/Unit_Contextmenu.svelte';

	interface Props {
		project: Project;
		scroll_on_select?: boolean;
	}

	const {project, scroll_on_select = true}: Props = $props();

	// TODO @many refactor? the id is hacky and brittle
	if (scroll_on_select) {
		$effect(() => {
			const {latest} = project.editor.unit_selection;
			if (!latest) return;
			document.getElementById('unit_layer_' + latest.id)?.scrollIntoView({block: 'nearest'});
		});
	}
</script>

<ul class="unit_layers unstyled">
	{#each project.scene.units as unit (unit.id)}
		<Unit_Contextmenu scene={project.scene} {unit}>
			<Unit_Layer {unit} />
		</Unit_Contextmenu>
	{/each}
</ul>
