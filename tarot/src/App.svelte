<script lang="ts">
	import {writable} from 'svelte/store';

	import TarotCardThumbnail from './TarotCardThumbnail.svelte';
	import TarotCardDetail from './TarotCardDetail.svelte';
	import Overlay from './Overlay.svelte';
	import {cards} from './tarot.json';

	// TODO move this to gro/utils/arr
	const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

	// TODO move this to gro/utils/math
	const randInt = (min: number, max: number): number =>
		Math.floor(Math.random() * (max - min + 1)) + min;
	const randFrom = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

	// TODO share with root
	// TODO this algorithm is terrible if count is close to length (could do one where we copy the array and remove each, using the quick index pop trick)
	const drawCards = (count: number): number[] => {
		if (count >= cards.length) return cards; // maybe throw error instead?
		const drawn = new Set();
		while (drawn.size < count) {
			drawn.add(randFrom(cards));
		}
		return Array.from(drawn);
	};

	let activeCards = [];
</script>

<div class="app">
	<div class="draw-card-buttons">
		<button on:click={() => (activeCards = drawCards(1))}>draw a card</button>
		<button on:click={() => (activeCards = drawCards(3))}>
			draw three cards
		</button>
	</div>
	<div class="cards">
		{#each cards as card (card.id)}
			<TarotCardThumbnail {card} on:click={() => (activeCards = [card])} />
		{/each}
	</div>
</div>
{#if activeCards.length}
	<Overlay close={() => (activeCards = [])}>
		{#each activeCards as card (card.id)}
			<TarotCardDetail {card} />
			{#if card !== last(activeCards)}
				<hr />
			{/if}
		{/each}
	</Overlay>
{/if}

<style>
	.app {
		height: 100%;
		overflow: auto;
	}
	.draw-card-buttons {
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.draw-card-buttons button {
		padding: 10px 20px;
		font-size: 24px;
		margin: 0 10px;
		color: var(--font-color);
		background-color: var(--bg-color-fg);
	}
	.cards {
		margin: 20px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
</style>
