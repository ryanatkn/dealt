<script lang="ts">
	import Thumbnail from './Thumbnail.svelte';

	// TODO move this to gro/utils/math
	const randInt = (min: number, max: number): number =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	// TODO move these
	const TAROT_COUNT = 78;
	const drawCards = (count: number): number[] => {
		const drawn = new Set();
		while (drawn.size < count) {
			drawn.add(randInt(0, TAROT_COUNT - 1));
		}
		return Array.from(drawn);
	};

	const cards = drawCards(3);
</script>

<Thumbnail href="tarot/">
	<div class="cards">
		{#each cards as card (card)}
			<img class="card" src="tarot/images/{card}.jpg" alt="tarot card" />
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
</style>
