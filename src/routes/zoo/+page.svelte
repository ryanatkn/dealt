<script lang="ts">
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import Dealt from '$lib/Dealt.svelte';
</script>

<svelte:head>
	<title>Dealt: zoo</title>
</svelte:head>

<Dealt>
	{#snippet global_controls()}{/snippet}
	{#snippet app_contextmenu()}{/snippet}
	<div class="p_md">
		<header class="pb_md"><Breadcrumb>🦒</Breadcrumb></header>
		<h1>Zoo</h1>
		<p class="mb_lg">
			A virtual space full of agents with different behaviors, simulated and rendered with multiple
			reactive frameworks.
		</p>

		<h2>Implementations</h2>
		<ul>
			<li>
				<a href="/zoo/svelte_idiomatic">Svelte Idiomatic</a> - Pure Svelte 5 with $state runes
			</li>
			<li>
				<a href="/zoo/ripple_idiomatic">Ripple Idiomatic</a> - Pure RippleJS with TrackedObject
			</li>
		</ul>
	</div>
</Dealt>
