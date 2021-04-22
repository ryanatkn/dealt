<script lang="ts">
	import Thumbnail from '$lib/Thumbnail.svelte';
	import {randomCardIndex} from './tarot';

	// this is lightweight: it doesn't depend on the card data

	export let shadow = false;

	const drawCards = (count: number): number[] => {
		const drawn = new Set<number>();
		while (drawn.size < count) {
			drawn.add(randomCardIndex());
		}
		return Array.from(drawn);
	};

	const cards = drawCards(3);
</script>

<Thumbnail href="tarot/">
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
	}
	.card.shadow {
		transform: rotate(180deg);
	}
</style>
