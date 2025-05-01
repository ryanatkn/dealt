<script lang="ts">
	import {base} from '$app/paths';
	import {page} from '$app/state';
	import type {Snippet} from 'svelte';

	interface Props {
		icon?: Snippet;
		children?: Snippet;
	}

	const {icon = icon_default, children}: Props = $props();

	const at_root = $derived(page.url.pathname === '/');
</script>

<header class="box">
	{#if at_root}
		{@render icon()}
	{:else}
		<a href="{base}/">{@render icon()}</a>
	{/if}
	{#if children}
		{@render children()}
	{:else}
		<h1 class="mt_xl2">Dealt</h1>
	{/if}
</header>

{#snippet icon_default()}
	<span class="size_xl7">🔮</span>
{/snippet}
