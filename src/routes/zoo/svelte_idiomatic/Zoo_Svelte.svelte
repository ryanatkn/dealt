<script lang="ts">
	import {onMount, onDestroy} from 'svelte';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';

	import Dealt from '$lib/Dealt.svelte';
	import {serialize_points} from '$lib/point_helpers.js';
	import {Zoo_State, type Zoo_State_Options} from './zoo_svelte_state.svelte.ts';

	interface Props {
		options?: Zoo_State_Options;
	}

	const {options}: Props = $props();

	const zoo = new Zoo_State(options);

	// Controls
	const speed_min = 0;
	const speed_max = 3;
	const speed_step = 0.002;
	const agent_count_min = 1;
	const agent_count_max = 1000;
	const agent_scale_min = 0.1;
	const agent_scale_max = 5;
	const agent_scale_step = 0.01;

	// Recreate agents when count or scale changes
	let prev_count = zoo.agent_count;
	let prev_scale = zoo.agent_scale;

	$effect(() => {
		const count = zoo.agent_count;
		const scale = zoo.agent_scale;
		if (count !== prev_count || scale !== prev_scale) {
			prev_count = count;
			prev_scale = scale;
			zoo.create_agents();
		}
	});

	onMount(() => {
		zoo.init();
	});

	onDestroy(() => {
		zoo.destroy();
	});
</script>

<Dealt>
	{#snippet global_controls()}{/snippet}
	{#snippet app_contextmenu()}{/snippet}
	<div class="p_md">
		<header class="pb_md"><Breadcrumb>svelte_idiomatic</Breadcrumb></header>
		<h1>Zoo - Svelte Idiomatic</h1>
		<p class="mb_md">Pure Svelte 5 implementation with $state runes.</p>

		<form class="width_md mb_md">
			<div class="row mb_sm">
				<label>
					<span>simulation speed</span>
					<input
						type="number"
						bind:value={zoo.simulation_speed}
						step={speed_step}
						min={speed_min}
						max={speed_max}
					/>
				</label>
				<input
					type="range"
					bind:value={zoo.simulation_speed}
					step={speed_step}
					min={speed_min}
					max={speed_max}
				/>
			</div>
			<fieldset>
				<div class="row mb_sm">
					<label>
						<span>agent count</span>
						<input
							type="number"
							bind:value={zoo.agent_count}
							min={agent_count_min}
							max={agent_count_max}
						/>
					</label>
					<input
						type="range"
						bind:value={zoo.agent_count}
						min={agent_count_min}
						max={agent_count_max}
					/>
				</div>
				<div class="row mb_sm">
					<label>
						<span>agent scale</span>
						<input
							type="number"
							bind:value={zoo.agent_scale}
							step={agent_scale_step}
							min={agent_scale_min}
							max={agent_scale_max}
						/>
					</label>
					<input
						type="range"
						bind:value={zoo.agent_scale}
						step={agent_scale_step}
						min={agent_scale_min}
						max={agent_scale_max}
					/>
				</div>
			</fieldset>
			<div class="row">
				<button type="button" onclick={() => zoo.toggle()}>
					{zoo.running ? 'pause' : 'play'}
				</button>
			</div>
		</form>

		<p class="mb_sm">
			{zoo.agents.length} agents -
			{zoo.agents.filter((a) => a.type === 'circle').length} circles,
			{zoo.agents.filter((a) => a.type === 'polygon').length} polygons | fps: {zoo.fps}
		</p>

		<svg
			width={zoo.width}
			height={zoo.height}
			style:border="1px solid #444"
			style:background-color={zoo.colors.background}
		>
			{#each zoo.agents as agent (agent.id)}
				{#if agent.type === 'circle'}
					<circle
						cx={agent.x}
						cy={agent.y}
						r={agent.radius * Math.abs(agent.scale)}
						fill={agent.color}
					/>
				{:else if agent.transformed_points.length >= 3}
					<polygon
						points={serialize_points(agent.x, agent.y, agent.transformed_points)}
						fill={agent.color}
					/>
				{/if}
			{/each}
		</svg>
	</div>
</Dealt>
