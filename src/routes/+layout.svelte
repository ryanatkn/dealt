<script lang="ts">
	import '@ryanatkn/moss/style.css';
	import '@ryanatkn/moss/theme.css';
	import '$routes/moss.css';
	import '$routes/style.css';

	import Themed from '@ryanatkn/fuz/Themed.svelte';
	import type {Snippet} from 'svelte';
	import {sync_color_scheme, Themer} from '@ryanatkn/fuz/theme.svelte.js';

	interface Props {
		children: Snippet;
	}

	const {children}: Props = $props();

	// TODO forcing dark mode is awkward
	const themer = new Themer(undefined, 'dark');
	sync_color_scheme(themer.color_scheme); // TODO probably shouldn't be needed
</script>

<svelte:head>
	<title>Dealt</title>
</svelte:head>

<Themed {themer} color_scheme_fallback={themer.color_scheme}>
	{@render children()}
</Themed>
