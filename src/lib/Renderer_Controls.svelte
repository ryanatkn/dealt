<script lang="ts">
	import {renderer_types, type Renderer} from '$lib/renderer.svelte.js';
	import Scrubbable_Input from '$lib/Scrubbable_Input.svelte';

	interface Props {
		renderer: Renderer;
		omit_type?: boolean;
		omit_size?: boolean;
		row?: boolean;
	}

	const {renderer, omit_type, omit_size, row}: Props = $props();
</script>

<div class="row gap_xs">
	{#if !omit_type}
		<label class="mb_0" class:row>
			<div class="title">renderer</div>
			<select bind:value={renderer.type}>
				{#each renderer_types as renderer_type}
					<option value={renderer_type}>{renderer_type}</option>
				{/each}
			</select>
		</label>
	{/if}
	{#if !omit_size}
		<Scrubbable_Input {row} title="renderer width" bind:value={renderer.width} min={0}
			>width</Scrubbable_Input
		>
		<Scrubbable_Input {row} title="renderer height" bind:value={renderer.height} min={0}
			>height</Scrubbable_Input
		>
	{/if}
</div>

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

	label.row select {
		flex: 1;
		max-width: 100%;
	}
</style>
