<script lang="ts">
	import AboutLink from '$lib/AboutLink.svelte';
	import TarotThumbnail from '../tarot/TarotThumbnail.svelte';
	import Zodiac from '../zodiac/Zodiac.svelte';
	import {useShadow} from '$lib/shadow';
	import {randomZodiac} from '../zodiac/zodiac';

	const shadow = useShadow();
	const activeZodiac = randomZodiac();
</script>

<h1 class:shadow>dealt</h1>
<TarotThumbnail {shadow} />
<AboutLink />
<Zodiac {activeZodiac} />

<style>
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
