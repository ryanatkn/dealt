<script lang="ts" module>
	// TODO @many refactor surface/selection state
	export interface Scene_Interaction_Surface_State {
		hovering_unit: Unit | null;
		hovered_unit: Unit | null; // not removed after pointer leaves
		hovering_handle: boolean;
		pointer_x: number;
		pointer_y: number;
		pointer_down: boolean;
		pointing: boolean;
		drag_start_x: number | null;
		drag_start_y: number | null;
		dragging_unit: Unit | null;
		dragging_selection: boolean;
		// TODO maybe track an offset and use derived for these - seems like it needs bigger refactoring
		drag_start_client_x: number | null;
		drag_start_client_y: number | null;
		pointer_last_client_x: number | null;
		pointer_last_client_y: number | null;
	}
</script>

<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	import Unit_Handles from '$lib/Unit_Handles.svelte';
	import Unit_Contextmenu from '$lib/Unit_Contextmenu.svelte';
	import Scrubbing_Indicator from '$lib/Scrubbing_Indicator.svelte';
	import type {Unit} from '$lib/unit.svelte.js';
	import {Unit_Selection} from '$lib/unit_selection.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';
	import {Selection_Manager, type Selection_Mode} from '$lib/selection_manager.svelte.js';

	interface Props {
		scene: Scene;
		scene_interaction_surface_state: Scene_Interaction_Surface_State;
		unit_selection: Unit_Selection;
		width: number;
		height: number;
	}

	const {
		scene,
		scene_interaction_surface_state = $bindable(),
		unit_selection,
		width,
		height,
	}: Props = $props();

	const {controller} = $derived(scene);

	// TODO delete key should delete selected units, this component may be okay for that logic

	// TODO bug where quickly moving on an initial drag, the values are off, possibly missing the first frame? (select many and in dev to reproduce)

	// TODO key to clear selection?

	// TODO refactor - to a `Camera`?
	const to_scene_x = (screen_x: number): number => screen_x;
	const to_scene_y = (screen_y: number): number => screen_y;

	const selection_manager: Selection_Manager<Unit> = new Selection_Manager({
		find_top_item: scene.find_top_unit_at_point,
		find_all_items: scene.find_all_units_in_rect,
	});

	const get_selection_mode = (e: {
		shiftKey: boolean;
		ctrlKey: boolean;
		altKey: boolean;
	}): Selection_Mode => {
		// Even with Alt held, preserve Shift's additive selection behavior
		if (e.shiftKey && e.ctrlKey) return 'additive';
		if (e.ctrlKey) return 'subtractive';
		if (e.shiftKey) return 'additive';
		return 'normal';
	};

	const hovering_selection = $derived(
		scene_interaction_surface_state.hovering_unit !== null &&
			unit_selection.has(scene_interaction_surface_state.hovering_unit),
	);

	const update_pointer = (offset_x: number, offset_y: number): void => {
		const x = to_scene_x(offset_x);
		const y = to_scene_y(offset_y);

		const prev_x = scene_interaction_surface_state.pointer_x;
		const prev_y = scene_interaction_surface_state.pointer_y;

		scene_interaction_surface_state.pointer_x = x;
		scene_interaction_surface_state.pointer_y = y;

		if (scene_interaction_surface_state.dragging_unit) {
			const dx = x - prev_x;
			const dy = y - prev_y;
			for (const unit of unit_selection) {
				unit.x += dx;
				unit.y += dy;
			}
		} else {
			scene_interaction_surface_state.hovering_unit = scene.find_top_unit_at_point(x, y);
			if (scene_interaction_surface_state.hovering_unit) {
				scene_interaction_surface_state.hovered_unit =
					scene_interaction_surface_state.hovering_unit;
			}
		}
	};

	const reset_state = () => {
		scene_interaction_surface_state.pointer_down = false;
		scene_interaction_surface_state.drag_start_x = null;
		scene_interaction_surface_state.drag_start_y = null;
		scene_interaction_surface_state.dragging_unit = null;
		scene_interaction_surface_state.dragging_selection = false;
		scene_interaction_surface_state.drag_start_client_x = null;
		scene_interaction_surface_state.drag_start_client_y = null;
		scene_interaction_surface_state.pointer_last_client_x = null;
		scene_interaction_surface_state.pointer_last_client_y = null;
	};

	const duplicate_selected_units = (): void => {
		const new_units: Array<Unit> = [];
		for (const unit of unit_selection) {
			const cloned_unit = unit.clone();
			scene.add_unit(cloned_unit);
			new_units.push(cloned_unit);
		}
		// TODO @many refactor surface/selection state
		unit_selection.clear();
		selection_manager.clear();
		for (const unit of new_units) {
			unit_selection.add(unit);
			selection_manager.add(unit);
		}
	};

	const onpointerdown = (e: PointerEvent): void => {
		update_pointer(e.offsetX, e.offsetY);
		scene_interaction_surface_state.pointer_down = true;
		scene_interaction_surface_state.drag_start_x = scene_interaction_surface_state.pointer_x;
		scene_interaction_surface_state.drag_start_y = scene_interaction_surface_state.pointer_y;
		scene_interaction_surface_state.drag_start_client_x =
			scene_interaction_surface_state.pointer_last_client_x = e.clientX;
		scene_interaction_surface_state.drag_start_client_y =
			scene_interaction_surface_state.pointer_last_client_y = e.clientY;

		const duplicating = e.shiftKey && e.ctrlKey && !e.altKey;

		// Handle handle interactions first
		if (scene_interaction_surface_state.hovering_handle) {
			if (!e.altKey && e.shiftKey && scene_interaction_surface_state.hovering_unit) {
				scene_interaction_surface_state.dragging_unit =
					scene_interaction_surface_state.hovering_unit;
				scene_interaction_surface_state.dragging_selection = true;
				if (!unit_selection.has(scene_interaction_surface_state.hovering_unit)) {
					if (!e.ctrlKey || duplicating) {
						unit_selection.clear();
					}
					unit_selection.add(scene_interaction_surface_state.hovering_unit);
				}
				if (duplicating && hovering_selection) {
					duplicate_selected_units();
				}
			}
			return;
		}

		const hovering_unit = scene_interaction_surface_state.hovering_unit;
		const is_selected = hovering_unit && unit_selection.has(hovering_unit);

		if (is_selected && ((e.shiftKey && !e.altKey) || !e.ctrlKey)) {
			scene_interaction_surface_state.dragging_unit = hovering_unit;
			scene_interaction_surface_state.dragging_selection = true;
			if (duplicating && hovering_selection) {
				duplicate_selected_units();
			}
			return;
		}

		selection_manager.handle_selection_start(
			scene_interaction_surface_state.pointer_x,
			scene_interaction_surface_state.pointer_y,
			get_selection_mode(e),
		);

		// Sync the unit_selection to match the selection manager
		unit_selection.clear();
		for (const unit of selection_manager.get_selected_items()) {
			unit_selection.add(unit);
		}
	};

	const onpointerup = (e: PointerEvent): void => {
		update_pointer(e.offsetX, e.offsetY);

		// Only update selection state if we were making a selection with the drag rectangle.
		// If we were dragging units, preserve the current selection.
		if (selection_manager.state.selecting) {
			selection_manager.end_drag(
				scene_interaction_surface_state.pointer_x,
				scene_interaction_surface_state.pointer_y,
				get_selection_mode(e),
			);

			// Sync the unit_selection to match the selection manager
			unit_selection.clear();
			for (const unit of selection_manager.get_selected_items()) {
				unit_selection.add(unit);
			}
		}

		reset_state();
	};

	const onpointermove = (e: PointerEvent): void => {
		update_pointer(e.offsetX, e.offsetY);
		scene_interaction_surface_state.pointer_last_client_x = e.clientX;
		scene_interaction_surface_state.pointer_last_client_y = e.clientY;

		if (
			scene_interaction_surface_state.pointer_down &&
			!scene_interaction_surface_state.dragging_unit
		) {
			const dx =
				scene_interaction_surface_state.pointer_x - selection_manager.state.initial_pointer_x;
			const dy =
				scene_interaction_surface_state.pointer_y - selection_manager.state.initial_pointer_y;
			const should_start_selection =
				Math.sqrt(dx * dx + dy * dy) > selection_manager.selection_threshold;

			if (should_start_selection && !selection_manager.state.selecting) {
				selection_manager.start_drag(
					selection_manager.state.initial_pointer_x,
					selection_manager.state.initial_pointer_y,
				);
			}
		}

		if (selection_manager.state.selecting) {
			selection_manager.update_drag(
				scene_interaction_surface_state.pointer_x,
				scene_interaction_surface_state.pointer_y,
				get_selection_mode(e),
			);

			// Sync the unit_selection to match the selection manager
			unit_selection.clear();
			for (const unit of selection_manager.get_selected_items()) {
				unit_selection.add(unit);
			}
		}
	};

	const onpointerenter = (e: PointerEvent): void => {
		update_pointer(e.offsetX, e.offsetY);
		scene_interaction_surface_state.pointing = true;
	};

	const onpointerleave = (e: PointerEvent): void => {
		update_pointer(e.offsetX, e.offsetY);
		scene_interaction_surface_state.pointing = false;
		scene_interaction_surface_state.hovering_unit = null;
	};

	const onpointercancel = (_e: PointerEvent): void => {
		if (scene_interaction_surface_state.pointer_down) {
			scene_interaction_surface_state.pointer_down = false;
		}
		scene_interaction_surface_state.dragging_unit = null;
		scene_interaction_surface_state.dragging_selection = false;
	};

	const onkeydown = (event: KeyboardEvent) => {
		if (event.key === 'Shift' || event.key === 'Control') {
			selection_manager.update_drag(
				scene_interaction_surface_state.pointer_x,
				scene_interaction_surface_state.pointer_y,
				get_selection_mode(event),
			);
		}
	};

	const onkeyup = (event: KeyboardEvent) => {
		if (event.key === 'Shift' || event.key === 'Control') {
			selection_manager.update_drag(
				scene_interaction_surface_state.pointer_x,
				scene_interaction_surface_state.pointer_y,
				get_selection_mode(event),
			);
		}
	};

	const onkeydowncapture = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && scene_interaction_surface_state.dragging_unit) {
			// Reset positions of all selected units
			const dx =
				scene_interaction_surface_state.pointer_x - scene_interaction_surface_state.drag_start_x!;
			const dy =
				scene_interaction_surface_state.pointer_y - scene_interaction_surface_state.drag_start_y!;
			for (const unit of unit_selection) {
				unit.x -= dx;
				unit.y -= dy;
			}

			reset_state();
			swallow(e);
		}
	};

	// TODO there's a bug here where the selection doesn't update if the positions of things change via simulation,
	// maybe just add an effect that calculates it every frame when the simulation is running? best way?
	// this isn't quite right:
	// $effect(() => {
	// 	scene.simulation.time;
	// 	if (selecting) update_selection(true, false);
	// });
</script>

<!-- TODO ideally this uses the global value but I think we need to somehow set the app+editor that the global hotkeys use -->
<svelte:window {onkeydown} {onkeyup} {onkeydowncapture} />

<Unit_Contextmenu {scene} unit={scene_interaction_surface_state.hovered_unit}>
	<div
		class="scene_interaction_surface"
		class:pressing={scene_interaction_surface_state.pointer_down}
		class:selecting={selection_manager.state.selecting}
		class:hovering={!!scene_interaction_surface_state.hovering_unit}
		class:hovering_selection
		class:grabbable={scene_interaction_surface_state.hovering_unit &&
			unit_selection.has(scene_interaction_surface_state.hovering_unit) &&
			!selection_manager.state.selecting &&
			!scene_interaction_surface_state.pointer_down}
		class:grabbing={scene_interaction_surface_state.dragging_unit !== null}
		class:pressing_shift={controller.pressing_shift}
		class:pressing_ctrl={controller.pressing_ctrl}
		class:pressing_alt={controller.pressing_alt}
		style:width="{width}px"
		style:height="{height}px"
		{onpointerdown}
		{onpointerup}
		{onpointermove}
		{onpointerenter}
		{onpointerleave}
		{onpointercancel}
	>
		<svg class="controls_layer" {width} {height}>
			{#each Array.from(unit_selection) as unit (unit)}
				<Unit_Handles {unit} />
			{/each}
			{#if selection_manager.state.selecting}
				<rect
					class="selection_rect"
					x={selection_manager.state.selection_width >= 0
						? selection_manager.state.selection_start_x
						: selection_manager.state.selection_start_x + selection_manager.state.selection_width}
					y={selection_manager.state.selection_height >= 0
						? selection_manager.state.selection_start_y
						: selection_manager.state.selection_start_y + selection_manager.state.selection_height}
					width={Math.abs(selection_manager.state.selection_width)}
					height={Math.abs(selection_manager.state.selection_height)}
				/>
			{/if}
		</svg>
	</div>
	{#if scene_interaction_surface_state.dragging_unit}
		<Scrubbing_Indicator
			x_start={scene_interaction_surface_state.drag_start_client_x}
			y_start={scene_interaction_surface_state.drag_start_client_y}
			x_last={scene_interaction_surface_state.pointer_last_client_x}
			y_last={scene_interaction_surface_state.pointer_last_client_y}
		/>
	{/if}
</Unit_Contextmenu>

<style>
	.scene_interaction_surface {
		position: absolute;
		top: 0;
		left: 0;
	}
	.controls_layer {
		position: absolute;
		top: 0;
		left: 0;
	}
	.scene_interaction_surface.grabbable {
		cursor: grab;
	}
	.scene_interaction_surface.grabbing {
		cursor: grabbing;
	}
	/* Show crosshair when ctrl is pressed, regardless of alt */
	.scene_interaction_surface.pressing_ctrl:not(.pressing_shift) {
		cursor: crosshair;
	}
	.scene_interaction_surface.hovering_selection.pressing_shift.pressing_ctrl {
		cursor: copy;
	}
	/* Only disable controls when in a selection state and NOT pressing alt */
	.scene_interaction_surface:is(.selecting) .controls_layer,
	.scene_interaction_surface.pressing:not(.pressing_alt) .controls_layer,
	.scene_interaction_surface.pressing_shift:not(.pressing_alt) .controls_layer,
	.scene_interaction_surface.pressing_ctrl:not(.pressing_alt) .controls_layer {
		pointer-events: none;
		--color_selected: var(--color_selected_1);
	}
	.selection_rect {
		fill: var(--color_selected_3);
		stroke: var(--color_selected_2);
		stroke-width: 1;
		pointer-events: none;
	}
</style>
