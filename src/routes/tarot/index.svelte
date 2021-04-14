<script lang="ts">
	import {last} from '@feltcoop/gro/dist/utils/array.js';

	import TarotCardThumbnail from '$lib/tarot/TarotCardThumbnail.svelte';
	import TarotCardDetail from '$lib/tarot/TarotCardDetail.svelte';
	import Overlay from '$lib/Overlay.svelte';
	import {cards as cardsData} from '$lib/tarot/tarot.json';
	import {drawCards} from '$lib/tarot/tarot';
	import type {TarotCard} from '$lib/tarot/tarot';

	const cards: TarotCard[] = cardsData;

	let activeCards: TarotCard[] = [];
</script>

<div class="app">
	<div class="draw-card-buttons">
		<button on:click={() => (activeCards = drawCards(cards, 1))}>draw a card</button>
		<button on:click={() => (activeCards = drawCards(cards, 3))}> draw three cards </button>
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
