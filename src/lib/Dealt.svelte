<script lang="ts">
	import type {Snippet} from 'svelte';
	import Contextmenu_Root from '@ryanatkn/fuz/Contextmenu_Root.svelte';

	import App_Contextmenu from '$lib/App_Contextmenu.svelte';
	import Global_Controls from '$lib/Global_Controls.svelte';

	interface Props {
		global_controls?: Snippet;
		app_contextmenu?: Snippet;
		children: Snippet;
	}

	const {global_controls, app_contextmenu, children}: Props = $props();
</script>

<Contextmenu_Root>
	{#if global_controls}
		{@render global_controls()}
	{:else}
		<Global_Controls />
	{/if}

	{#if app_contextmenu}
		{@render app_contextmenu()}
	{:else}
		<App_Contextmenu />
	{/if}

	{@render children()}
</Contextmenu_Root>
