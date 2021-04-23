<script lang="ts">
	import Overlay from '$lib/Overlay.svelte';
	import {toRandomShadow} from '$lib/shadow';
	import AboutLink from '$lib/AboutLink.svelte';
	import TarotCardThumbnail from '../../tarot/TarotCardThumbnail.svelte';
	import TarotCardDetail from '../../tarot/TarotCardDetail.svelte';
	import DrawnTarotCard from '../../tarot/DrawnTarotCard.svelte';
	import {cards as cardsData} from '../../tarot/tarot.json';
	import {drawCards, last} from '../../tarot/tarot';
	import type {TarotCard} from '../../tarot/tarot';

	const cards: TarotCard[] = cardsData;

	let drawnCards: TarotCard[] = [];
	let viewingCards: TarotCard[] = [];

	const draw = (count: number): void => {
		drawnCards = drawCards(cards, count);
		viewingCards = [];
	};

	const view = (card: TarotCard): void => {
		drawnCards = [];
		viewingCards = [card];
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			drawnCards = []; // TODO should be hide modal
			viewingCards = [];
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div>
	<div class="draw-card-buttons">
		<button on:click={() => draw(1)}>draw a card</button>
		<button on:click={() => draw(3)}> draw three cards </button>
	</div>
	<div class="cards">
		{#each cards as card (card.id)}
			<button on:click={() => view(card)}>
				<TarotCardThumbnail {card} />
			</button>
		{/each}
	</div>
</div>
{#if drawnCards.length}
	<Overlay close={() => (drawnCards = [])}>
		{#each drawnCards as card (card.id)}
			<DrawnTarotCard {card} shadow={toRandomShadow()} />
			{#if card !== last(drawnCards)}
				<hr />
			{/if}
		{/each}
	</Overlay>
{/if}
{#if viewingCards.length}
	<Overlay close={() => (viewingCards = [])}>
		{#each viewingCards as card (card.id)}
			<TarotCardDetail {card} />
			{#if card !== last(viewingCards)}
				<hr />
			{/if}
		{/each}
	</Overlay>
{/if}

<AboutLink />

<style>
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
