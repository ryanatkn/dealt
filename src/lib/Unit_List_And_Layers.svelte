<script lang="ts">
	import Unit_List from '$lib/Unit_List.svelte';
	import Unit_Palette from '$lib/Unit_Palette.svelte';
	import Unit_Layers from '$lib/Unit_Layers.svelte';
	import Unit_Layers_Controls from '$lib/Unit_Layers_Controls.svelte';
	import type {Project} from '$lib/project.svelte.js';

	interface Props {
		project: Project;
	}

	const {project}: Props = $props();

	const {scene, editor} = $derived(project);

	let left_sidebar_1_scroll_top: number = $state(0);
	let left_sidebar_2_scroll_top: number = $state(0);
</script>

<div
	class="column"
	class:scrolled={left_sidebar_1_scroll_top > 0}
	onscroll={(e) => {
		left_sidebar_1_scroll_top = e.currentTarget.scrollTop;
	}}
>
	<div class="column_panel">
		<Unit_List {project} />
	</div>
	<div class="p_lg">
		<Unit_Palette {scene} />
	</div>
</div>
<div class="column">
	<div class="unit_layers_controls">
		<Unit_Layers_Controls {editor} />
	</div>
	<div
		class="column_panel"
		class:scrolled={left_sidebar_2_scroll_top > 0}
		onscroll={(e) => {
			left_sidebar_2_scroll_top = e.currentTarget.scrollTop;
		}}
	>
		<!-- TODO z-index prevents the chevron from floating above it - add classes? or fix directly on the chevron? -->
		<Unit_Layers {project} />
	</div>
</div>

<style>
	/* TODO hacky, probably want to make a customizable panel system */
	.column {
		width: var(--distance_sm);
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.column:first-child {
		width: 215px; /* TODO @many hardcoding and hacking just to ship */
	}
	.column:not(:last-child) {
		border-right: var(--border_width) var(--border_style) var(--border_color_1);
	}

	.column_panel {
		flex: 1;
		overflow: auto;
	}

	.unit_layers_controls {
		display: flex;
		border-bottom: var(--border_width) var(--border_style) var(--border_color_1);
	}
</style>
