<script lang="ts">
	import Thumbnail from '$lib/Thumbnail.svelte';
	import TarotThumbnail from '../tarot/TarotThumbnail.svelte';
	import Zodiac from '../zodiac/Zodiac.svelte';
	import {useShadow} from '$lib/shadow';

	const shadow = useShadow();
</script>

<main>
	<h1 class:shadow>dealt</h1>
	<TarotThumbnail />
	<Thumbnail href="https://github.com/ryanatkn/dealt"><h2>source code on GitHub</h2></Thumbnail>
	<Zodiac />
</main>

<style>
	main {
		height: 100%;
		overflow-y: scroll;
		overflow-x: auto;
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: var(--light_text_color);
		text-transform: lowercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	h1.shadow {
		color: var(--shadow_text_color);
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}
	}
</style>
