<script lang="ts">
	import AboutLink from '$lib/AboutLink.svelte';
	import TarotThumbnail from '../tarot/TarotThumbnail.svelte';
	import Zodiac from '../zodiac/Zodiac.svelte';
	import {useShadow} from '$lib/shadow';
	import {randomZodiac} from '../zodiac/zodiac';

	const shadow = useShadow();
	const activeZodiac = randomZodiac();
</script>

<section>
	<h1 class:shadow>dealt</h1>
	<TarotThumbnail {shadow} />
</section>
<section>
	<AboutLink />
</section>
<section class="zodiac">
	<Zodiac {activeZodiac} />
</section>

<style>
	h1 {
		color: var(--light_text_color);
		text-transform: lowercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
		text-align: center;
	}

	h1.shadow {
		color: var(--shadow_text_color);
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}
	}

	.zodiac {
		text-align: center;
	}
</style>
