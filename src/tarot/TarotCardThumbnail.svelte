<script lang="ts">
	import type {TarotCard} from './tarot.js';

	export let card: TarotCard;
</script>

<img class="card" src="/tarot/images/{card.id}.jpg" alt={card.name} on:click />

<style>
	.card {
		/* TODO generated metadata */
		width: var(--tarot_card_min_width);
		min-height: var(--tarot_card_min_height);
	}
</style>
