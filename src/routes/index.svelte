<script lang="ts">
	import TarotThumbnail from '$lib/tarot/TarotThumbnail.svelte';
	import Thumbnail from '$lib/Thumbnail.svelte';
</script>

<main>
	<h1>dealt</h1>
	<TarotThumbnail />
	<Thumbnail href="https://github.com/ryanatkn/dealt">source code on GitHub</Thumbnail>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: lowercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}
	}
</style>
