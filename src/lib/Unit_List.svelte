<script lang="ts">
	import type {Project} from '$lib/project.svelte.js';
	import Unit_List_Item from '$lib/Unit_List_Item.svelte';
	import Unit_Contextmenu from '$lib/Unit_Contextmenu.svelte';
	import Reorderable_List from '$lib/Reorderable_List.svelte';

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
			document.getElementById('unit_list_item_' + latest.id)?.scrollIntoView({block: 'nearest'});
		});
	}
</script>

<div class="unit_list">
	<Reorderable_List
		items={project.scene.units}
		on_reorder={(from_index, to_index) => project.scene.move_unit(from_index, to_index)}
	>
		{#snippet children(unit)}
			<Unit_Contextmenu scene={project.scene} {unit}>
				<Unit_List_Item {unit} />
			</Unit_Contextmenu>
		{/snippet}
	</Reorderable_List>
</div>

<style>
	.unit_list {
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
