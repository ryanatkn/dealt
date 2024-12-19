<script lang="ts">
	import {slide} from 'svelte/transition';

	import type {Unit} from '$lib/unit.svelte.js';
	import {editor_context} from '$lib/editor.svelte.js';
	import Unit_Icon from '$lib/Unit_Icon.svelte';

	interface Props {
		unit: Unit;
	}

	const {unit}: Props = $props();

	// $inspect('project', project);

	// TODO maybe draw these as compact chips, with just a name+icon, and contextmenu actions for delete

	// TODO @many move unit_selection to the right abstraction, maybe an `Editor`?
	const {unit_selection} = editor_context.get();

	const selected = $derived(unit_selection.has(unit));
</script>

<!-- TODO better a11y -->
<!-- TODO @many the `id` is used for scrolling it into view in the `Project_Editor`, but it's fragile -->
<li
	role="none"
	id="unit_list_item_{unit.id}"
	class="unit_list_item plain"
	class:selected
	onpointerdown={() => unit_selection.set(unit)}
	transition:slide
>
	<label class="flex_1 row mb_0 pr_lg">
		<div class="unit_type">
			<Unit_Icon {unit} />
		</div>
		<!-- TODO omit the label? -->
		{#if selected}
			<input class="unit_name plain" bind:value={unit.name} placeholder="name" />
		{:else}
			<div class="unit_name">{unit.name}</div>
		{/if}
	</label>
</li>

<style>
	.unit_list_item {
		display: flex;
		align-items: center;
		gap: var(--space_sm);

		&.selected {
			background-color: var(--color_selected_4);
		}
	}

	.unit_name {
		flex: 1;
		padding: var(--input_padding_y) var(--input_padding_x);
	}

	.unit_type {
		padding: 0 var(--space_md);
	}
</style>
