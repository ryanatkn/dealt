<!-- TODO make this generic on `T_Item`, I couldn't get usage to typecheck -->
<script lang="ts">
	import type {Snippet} from 'svelte';

	import type {Unit} from '$lib/unit.svelte.js';

	const {
		items,
		on_reorder,
		children,
	}: {
		items: Array<Unit>;
		on_reorder: (from_index: number, to_index: number) => void;
		children: Snippet<[item: Unit]>;
	} = $props();

	let drag_source_index: number | null = $state(null);
	let drop_target_index: number | null = $state(null);
	let indicator_y: number | null = $state(null);

	const handle_dragover = (event: DragEvent) => {
		event.preventDefault();
		if (drag_source_index === null || !event.currentTarget || !event.dataTransfer) return;

		const list = event.currentTarget as Element;
		const items = Array.from(list.children);
		const bounding_rects = items.map((item) => item.getBoundingClientRect());

		const list_rect = list.getBoundingClientRect();
		const y = event.clientY;
		let new_target_index = bounding_rects.findIndex((rect) => y < (rect.bottom + rect.top) / 2);

		// If we're past all items, we're targeting the end of the list
		if (new_target_index === -1) {
			new_target_index = items.length;
			if (items.length > 0) {
				const last_rect = bounding_rects[items.length - 1];
				indicator_y = last_rect.bottom - list_rect.top;
			}
		} else {
			indicator_y = bounding_rects[new_target_index].top - list_rect.top;
		}

		// Adjust the visual target index to account for the gap
		if (new_target_index > drag_source_index) {
			new_target_index--;
		}

		drop_target_index = new_target_index;
		event.dataTransfer.dropEffect = 'move';
	};

	const handle_dragend = (event: DragEvent) => {
		event.preventDefault();

		if (
			event.dataTransfer?.dropEffect === 'move' && // may have been canceled
			drag_source_index !== null &&
			drop_target_index !== null &&
			drag_source_index !== drop_target_index
		) {
			on_reorder(drag_source_index, drop_target_index);
		}

		// Reset state
		drag_source_index = null;
		drop_target_index = null;
		indicator_y = null;
	};

	const handle_dragstart = (event: DragEvent) => {
		if (!event.dataTransfer) return;

		const target = event.target as HTMLElement;
		const dragged_element = target.closest('[data-item]');
		if (!dragged_element) return;

		const item_id = parseInt((dragged_element as HTMLElement).dataset.item ?? '', 10);
		if (!item_id) return;

		event.dataTransfer.effectAllowed = 'move';
		drag_source_index = items.findIndex((item) => item.id === item_id);
	};
</script>

<div class="reorderable_list">
	<ul
		class="unstyled"
		ondragover={handle_dragover}
		ondragend={handle_dragend}
		ondragstart={handle_dragstart}
	>
		{#each items as item, i (item)}
			<div
				class="list_item"
				class:dragging={i === drag_source_index}
				data-item={item.id}
				draggable="true"
			>
				{@render children(item)}
			</div>
		{/each}
	</ul>
	{#if indicator_y !== null}
		<div class="drop_indicator" style:top="{indicator_y}px"></div>
	{/if}
</div>

<style>
	.reorderable_list {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.list_item {
		cursor: grab;
		user-select: none;
	}

	.list_item:active {
		cursor: grabbing;
	}

	.list_item.dragging {
		opacity: 0.5;
	}

	.drop_indicator {
		position: absolute;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--color_selected_3);
		pointer-events: none;
	}
</style>
