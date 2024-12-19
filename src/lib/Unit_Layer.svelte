<script lang="ts">
	import {slide} from 'svelte/transition';

	import type {Project} from '$lib/project.svelte.js';
	import {Unit_Point, type Unit} from '$lib/unit.svelte.js';
	import Scrubbable_Input from '$lib/Scrubbable_Input.svelte';
	import Unit_Behavior_Controls from '$lib/Unit_Behavior_Handles.svelte';
	import Unit_Icon from '$lib/Unit_Icon.svelte';
	import {editor_context} from '$lib/editor.svelte.js';

	interface Props {
		unit: Unit;
		project: Project;
	}

	const {unit, project}: Props = $props();

	// $inspect('project', project);

	// TODO @many move unit_selection to the right abstraction, maybe an `Editor`?
	const {unit_selection, collapsed_layers} = editor_context.get();

	const collapsed = $derived(collapsed_layers.has(unit));

	const toggle = () => {
		if (collapsed_layers.has(unit)) {
			collapsed_layers.delete(unit);
		} else {
			collapsed_layers.add(unit);
		}
	};

	// TODO aria

	const POSITION_STEP = 0.5;
	const RADIUS_STEP = 0.1;
	// TODO add scale
	// const SCALE_STEP = 0.01;

	// TODO duplicate layer contextmenu action

	// TODO instead of the unicode icons, draw scaled versions using svg (normalize sizes), like 30% minimum for the smallest
</script>

<!-- TODO better a11y -->
<!-- TODO @many the `id` is used for scrolling it into view in the `Project_Editor`, but it's fragile -->
<li
	class="unit_layer"
	id="unit_layer_{unit.id}"
	role="none"
	class:collapsed
	class:selected={unit_selection.has(unit)}
	onpointerdown={() => unit_selection.set(unit)}
>
	<header class="row gap_xs2">
		<div class="unit_layer_type">
			<button type="button" class="plain" title={unit.type} onclick={toggle}>
				<div class="row">
					<div class="chevron"></div>
					<Unit_Icon {unit} />
				</div>
			</button>
		</div>
		<input
			class="name_input plain"
			placeholder="name"
			title="{unit.type} name"
			bind:value={unit.name}
		/>
	</header>
	{#if !collapsed}
		<div transition:slide>
			<div class="row pb_sm pt_md">
				<div class="pr_md text_align_right font_weight_600 input_width_sm">id</div>
				<small style:padding="var(--input_padding_y) var(--input_padding_x)">{unit.id}</small>
			</div>
			{#if unit.type === 'circle'}
				<div class="input_row" style:--title_width="3.4rem">
					<Scrubbable_Input
						title="circle x"
						input_classes="plain"
						row
						bind:value={unit.x}
						step={POSITION_STEP}>x</Scrubbable_Input
					>
					<Scrubbable_Input
						title="circle y"
						input_classes="plain"
						row
						bind:value={unit.y}
						step={POSITION_STEP}>y</Scrubbable_Input
					>
				</div>
				<div class="input_row">
					<Scrubbable_Input
						title="circle scale"
						input_classes="plain"
						row
						bind:value={unit.scale}
						step={0.01}>scale</Scrubbable_Input
					>
				</div>
				<div class="input_row">
					<Scrubbable_Input
						title="circle radius"
						input_classes="plain"
						row
						bind:value={unit.radius}
						min={0}
						step={RADIUS_STEP}>radius</Scrubbable_Input
					>
				</div>
				<!-- <Scrubbable_Input title="circle scale" input_classes="plain" row bind:value={unit.scale} step={SCALE_STEP} min={0}
					>scale</Scrubbable_Input
				> -->
			{:else if unit.type === 'polygon'}
				<div class="input_row" style:--title_width="3.4rem">
					<Scrubbable_Input
						title="polygon x"
						input_classes="plain"
						row
						bind:value={unit.x}
						step={POSITION_STEP}>x</Scrubbable_Input
					>
					<Scrubbable_Input
						title="polygon y"
						input_classes="plain"
						row
						bind:value={unit.y}
						step={POSITION_STEP}>y</Scrubbable_Input
					>
				</div>
				<div class="input_row">
					<Scrubbable_Input
						title="polygon angle"
						input_classes="plain"
						row
						bind:value={unit.angle}
						step={Math.PI / 360}>angle</Scrubbable_Input
					>
				</div>
				<div class="input_row">
					<Scrubbable_Input
						title="polygon scale"
						input_classes="plain"
						row
						bind:value={unit.scale}
						step={0.01}>scale</Scrubbable_Input
					>
				</div>
				<ul class="unstyled mt_md">
					{#each unit.points as point, i (point)}
						<li class="row" transition:slide>
							<div class="flex_1 row justify_content_end" style:--title_width="3.4rem">
								<Scrubbable_Input
									title="polygon.points[{i}].x"
									classes="mb_0"
									input_classes="plain"
									row
									value={point.x}
									oninput={(v) => {
										point.x = v;
										// TODO @many horrible hacks to deal with syncing points data - problem is point forms now change when becoming concave
										unit.update_points();
										project.renderer.dirty++;
									}}
									step={POSITION_STEP}>x</Scrubbable_Input
								>
								<Scrubbable_Input
									title="polygon.points[{i}].y"
									classes="mb_0"
									input_classes="plain"
									row
									value={point.y}
									oninput={(v) => {
										point.y = v;
										// TODO @many horrible hacks to deal with syncing points data - problem is point forms now change when becoming concave
										unit.update_points();
										project.renderer.dirty++;
									}}
									step={POSITION_STEP}>y</Scrubbable_Input
								>
							</div>
							<button
								type="button"
								class="icon_button plain ml_md"
								title="remove point"
								onpointerup={() => {
									unit.remove_point(point);
									// TODO @many horrible hacks to deal with syncing points data - problem is point forms now change when becoming concave
									project.renderer.dirty++;
								}}>✕</button
							>
						</li>
					{/each}
				</ul>
				<button
					type="button"
					title="add a point to this polygon"
					class="plain"
					onclick={() => {
						unit.add_point(new Unit_Point(120, 200));
						// TODO @many horrible hacks to deal with syncing points data - problem is point forms now change when becoming concave
						project.renderer.dirty++;
					}}>◎ add point</button
				>
			{/if}
		</div>
		{#if unit.type === 'polygon'}
			<div class="row gap_sm">
				<!-- TODO button actions (to decompose, do other things?) -->
				{#if !unit.is_simple_polygon}
					<div transition:slide={{axis: 'x'}}>
						<div transition:slide class="py_sm">
							<button
								type="button"
								class="inline color_g selected white_space_nowrap"
								title="this polygon intersects itself - collision detection is disabled"
								>self-intersecting</button
							>
						</div>
					</div>
				{/if}
				{#if unit.concave}
					<div transition:slide={{axis: 'x'}}>
						<div transition:slide class="py_sm">
							<button
								type="button"
								class="inline color_d selected deselectable white_space_nowrap"
								title="this polygon is concave, and can be decomposed into {unit.decomped
									.length} convex polygons"
								onclick={() => {
									// eslint-disable-next-line no-alert
									alert(
										`TODO this button should present choices for decomposing the concave polygon into ${unit.decomped.length} convex ones`,
									);
								}}>concave</button
							>
						</div>
					</div>
				{/if}
			</div>
		{/if}
		<Unit_Behavior_Controls {unit} />
	{/if}
</li>

<style>
	.unit_layer {
		padding: var(--space_lg);
		border-bottom: var(--border_width) var(--border_style) var(--border_color_1);

		&.selected {
			background-color: var(--color_selected_4);
		}
	}

	.unit_layer_type {
		font-size: var(--size_lg);
	}
	.unit_layer_type .chevron {
		margin-right: var(--space_md);
	}

	header input {
		flex: 1;
		width: auto;
		max-width: 100%;
	}

	.chevron {
		transform: rotate(90deg);
	}
	.collapsed .chevron {
		transform: rotate(0deg);
	}

	input {
		width: 100px;
		min-width: 100px;
		max-width: 100px;
	}

	/* TODO could be cleaner */
	.name_input {
		width: 100%;
	}

	.input_row {
		display: flex;
		justify-content: end;
	}
</style>
