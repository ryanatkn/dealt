<script lang="ts">
	import Thumbnail from '$lib/Thumbnail.svelte';
	import {random_card_index} from '$lib/tarot/tarot';

	// this is lightweight: it doesn't depend on the card data

	export let shadow = false;

	const cards = [random_card_index(), random_card_index(), random_card_index()];
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
