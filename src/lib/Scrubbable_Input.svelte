<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';
	import {untrack, type Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import Scrubbing_Indicator from '$lib/Scrubbing_Indicator.svelte';

	interface Props {
		title: string;
		value?: number;
		type?: SvelteHTMLElements['input']['type'];
		inputmode?: SvelteHTMLElements['input']['inputmode'];
		step?: number;
		min?: number;
		max?: number;
		row?: boolean;
		/**
		 * CSS classes for the label wrapper.
		 */
		classes?: string;
		/**
		 * CSS classes for the input element.
		 */
		input_classes?: string;
		oninput?: (value: number) => void;
		attrs?: SvelteHTMLElements['input'];
		children?: Snippet;
	}

	let {
		title,
		value = $bindable(0),
		type = 'text',
		inputmode = 'numeric',
		step = 1,
		min = Infinity * -1,
		max,
		row = false,
		classes,
		input_classes,
		oninput,
		attrs,
		children,
	}: Props = $props();

	// TODO contextmenu actions like resetting

	let current_value = $state(value); // unclamped for UX reasons, means dragging remains an absolute value not relative to the clamped value
	let value_str = $state(value.toString());

	const update_value = (v: number) => {
		current_value = v;
		value = Math.max(min, v); // clamp `value` but not `current_value`
		value_str = value.toString();
		oninput?.(value);
	};

	// TODO this is messy, basically if the value changes from above, we need to sync here
	$effect(() => {
		if (value !== untrack(() => current_value)) {
			current_value = value;
			value_str = value.toString();
		}
	});

	// This is needed to let non-numeric values be entered into the input.
	// The pattern could probably be improved.
	const handle_input = (v: string) => {
		value_str = v;
		const parsed = parseFloat(v);
		if (!Number.isNaN(parsed)) {
			update_value(parsed); // it's okay that this sets `value_str`, but could probably be improved
		}
	};

	const update_value_by = (delta: number) => {
		update_value(current_value + delta);
	};

	let pressing = $state(false);
	let value_before_pressing: number | null = $state(null);
	let x_start: number | null = $state(null); // x1
	let y_start: number | null = $state(null); // y1
	let x_last: number | null = $state(null); // x2
	let y_last: number | null = $state(null); // y2
	let x_now: number | null = $state(null);
	let y_now: number | null = $state(null);

	const dx = $derived(x_now === null || x_last === null ? null : x_now - x_last);
	const dy = $derived(y_now === null || y_last === null ? null : y_last - y_now);
	// $inspect('dx', dx);
	// $inspect('dy', dy);
	const magnitude = $derived(dx === null || dy === null ? null : (dx + dy) * step);

	const press = (x: number, y: number) => {
		if (pressing) return;
		pressing = true;
		value_before_pressing = value;
		x_start = x;
		y_start = y;
		x_last = x;
		y_last = y;
	};

	const reset = () => {
		pressing = false;
		value_before_pressing = null;
		x_start = null;
		y_start = null;
		x_last = null;
		y_last = null;
		x_now = null;
		y_now = null;
	};

	const move = (x: number, y: number) => {
		x_last = x_now;
		y_last = y_now;
		x_now = x;
		y_now = y;
		if (magnitude !== null) update_value_by(magnitude);
	};

	const onpointerdown = (e: MouseEvent) => {
		// The Control key bypasses the scrubbable behavior -
		// I wanted this to be `shift` but that interferes with the normal shift+click behavior in inputs.
		// It could be both but then the user can run into the weird edge case
		// of being unable to move the cursor position.
		if (e.ctrlKey) return;
		press(e.clientX, e.clientY);
	};

	// These events are only active when `pressing`
	const onwindowpointerup = (_e: MouseEvent) => {
		reset();
	};
	const onwindowpointerleave = (_e: MouseEvent) => {
		reset();
	};
	const onwindowpointermove = (e: MouseEvent) => {
		move(e.clientX, e.clientY);
	};
	const onwindowkeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			update_value(value_before_pressing!);
			reset();
			swallow(e);
		}
	};

	// TODO on hover, maybe show the line?

	// TODO better hover/active feedback (cursor? selection color?)
	// maybe show the original and current values and difference?
	// what if we showed presets you could release over to select
</script>

<svelte:window
	onpointerup={pressing ? onwindowpointerup : undefined}
	onpointermove={pressing ? onwindowpointermove : undefined}
	onpointerleave={pressing ? onwindowpointerleave : undefined}
	onkeydowncapture={pressing ? onwindowkeydown : undefined}
/>

<!-- TODO make interactive -->
<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<label
	class:selected={pressing}
	class={classes}
	class:row
	role="slider"
	aria-valuenow={magnitude}
	{title}
	{onpointerdown}
>
	{#if children}<div class="title">{@render children()}</div>{/if}
	<input
		{...attrs}
		class={input_classes}
		value={value_str}
		oninput={(e) => handle_input(e.currentTarget.value)}
		{type}
		{inputmode}
		{step}
		{min}
		{max}
	/>
</label>
{#if pressing}
	<Scrubbing_Indicator
		{x_start}
		{y_start}
		{x_last}
		{y_last}
		container_width={innerWidth}
		container_height={innerHeight}
	/>
{/if}

<style>
	label {
		margin-bottom: 0; /* fixes bumping around because of last-child margin */
	}

	.title {
		width: var(--title_width, var(--input_width_sm));
		text-align: center;
	}

	label.row .title {
		text-align: right;
		padding-right: var(--space_md);
	}

	input {
		width: var(--input_width, var(--input_width_sm));
		min-width: var(--input_width, var(--input_width_sm));
	}

	label.row {
		justify-content: end;
	}
</style>
