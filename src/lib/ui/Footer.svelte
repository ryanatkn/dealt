<script lang="ts">
	import {page} from '$app/stores';

	import Thumbnail from '$lib/ui/Thumbnail.svelte';
</script>

<footer>
	<p>public domain <a href="https://github.com/feltcoop/dealt/blob/main/license">🐦</a></p>
	<Thumbnail href="https://github.com/feltcoop/dealt"><p>source code and credits</p></Thumbnail>
	{#if $page.path !== '/'}
		<a href="/">🔮</a>
	{/if}
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	a {
		font-size: 128px;
	}
	p,
	p a {
		font-size: 32px;
	}
</style>
