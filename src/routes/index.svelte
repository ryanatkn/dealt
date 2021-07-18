<script lang="ts">
	import Footer from '$lib/ui/Footer.svelte';
	import Tarot_Thumbnail from '$lib/tarot/Tarot_Thumbnail.svelte';
	import Zodiac from '$lib/zodiac/Zodiac.svelte';
	import {get_shadow, get_shadow2} from '$lib/ui/shadow';
	import {random_zodiac} from '$lib/zodiac/zodiac';
	import Tar_Thumbnail from '$lib/tar/Tar_Thumbnail.svelte';

	const shadow = get_shadow();
	const shadow2 = get_shadow2();
	const active_zodiac = random_zodiac();
</script>

<main>
	<section>
		<header>
			<h1 class:shadow class:shadow2>dealt</h1>
		</header>
		<Tarot_Thumbnail {shadow} />
	</section>
	<section>
		<Tar_Thumbnail />
	</section>
	<section>
		<Footer />
	</section>
	<section class="zodiac">
		<Zodiac {active_zodiac} />
	</section>
</main>

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
		border-bottom: 4px dashed var(--light_text_color);
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
