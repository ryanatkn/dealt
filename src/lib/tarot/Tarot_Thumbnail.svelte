<script lang="ts">
	import Thumbnail from '$lib/ui/Thumbnail.svelte';
	import {card_indices} from '$lib/tarot/tarot';
	import {random_items} from '$lib/util/random';

	// this is lightweight: it doesn't depend on the card data

	export let shadow = false;

	const cards = random_items(card_indices, 3);
</script>

<Thumbnail href="tarot">
	<div class="cards">
		{#each cards as card (card)}
			<img class="card" class:shadow src="/tarot/images/{card}.jpg" alt="tarot card {card}" />
		{/each}
	</div>
</Thumbnail>

<style>
	.cards {
		display: flex;
		align-items: center; /* they're not all exactly the same height */
	}
	.card {
		/* get the flex-item cards to shrink and maintain aspect ratio */
		min-width: 0;
		width: 100%;
		padding: 0 10px;
	}
	.card.shadow {
		transform: rotate(180deg);
	}
</style>
