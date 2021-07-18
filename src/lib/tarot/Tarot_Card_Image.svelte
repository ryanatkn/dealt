<script lang="ts">
	import type {Tarot_Card} from '$lib/tarot/tarot.js';

	export let card: Tarot_Card;
	export let shadow = false;
</script>

<img class:shadow src="/tarot/images/{card.id}.jpg" alt="tarot card {card.name}" />

<style>
	img {
		min-width: var(--tarot_card_min_width);
		min-height: var(--tarot_card_min_height);
	}
	img.shadow {
		transform: rotate(180deg);
	}
</style>
