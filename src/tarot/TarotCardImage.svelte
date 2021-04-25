<script lang="ts">
	import type {TarotCard} from './tarot.js';

	export let card: TarotCard;
	export let shadow = false;
</script>

<img class:shadow src="/tarot/images/{card.id}.jpg" alt={card.name} />

<style>
	img {
		margin: 20px;
		/* TODO generated metadata */
		min-width: var(--tarot_card_min_width);
		min-height: var(--tarot_card_min_height);
	}
	img.shadow {
		transform: rotate(180deg);
	}
</style>
