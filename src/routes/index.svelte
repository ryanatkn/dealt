<script lang="ts">
	import AboutLink from '$lib/AboutLink.svelte';
	import TarotThumbnail from '../tarot/TarotThumbnail.svelte';
	import Zodiac from '../zodiac/Zodiac.svelte';
	import {useShadow, useShadow2} from '$lib/shadow';
	import {randomZodiac} from '../zodiac/zodiac';

	const shadow = useShadow();
	const shadow2 = useShadow2();
	const activeZodiac = randomZodiac();
</script>

<section>
	<header>
		<h1 class:shadow class:shadow2>dealt</h1>
	</header>
	<TarotThumbnail {shadow} />
</section>
<section>
	<AboutLink />
</section>
<section class="zodiac">
	<Zodiac {activeZodiac} />
</section>

<style>
	header {
		display: flex;
	}
	h1 {
		color: var(--light_text_color);
		text-transform: lowercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
		text-align: center;
		border-bottom: 4px solid var(--light_text_color);
	}
	h1.shadow {
		color: var(--shadow_text_color);
	}
	h1.shadow2 {
		border-bottom-color: var(--shadow_text_color);
	}
	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}
	}

	.zodiac {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		text-align: center;
	}
</style>
