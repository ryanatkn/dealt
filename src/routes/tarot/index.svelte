<script lang="ts">
	import Overlay from '$lib/Overlay.svelte';
	import AboutLink from '$lib/AboutLink.svelte';
	import TarotCardButton from '../../tarot/TarotCardButton.svelte';
	import TarotCardDetail from '../../tarot/TarotCardDetail.svelte';
	import DrawnTarotCards from '../../tarot/DrawnTarotCards.svelte';
	import {cards as cardsData} from '../../tarot/tarot.json';
	import {drawCards, last, TAROT_CARD_MIN_WIDTH, TAROT_CARD_MIN_HEIGHT} from '../../tarot/tarot';
	import type {TarotCard} from '../../tarot/tarot.js';
	import {shuffle} from '$lib/random';

	// TODO refactor, extract some components

	const cards: TarotCard[] = shuffle(cardsData);

	let drawnCards: TarotCard[] = [];
	let viewingCards: TarotCard[] = [];

	$: lastViewingCard = last(viewingCards);

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

<section
	style="--tarot_card_min_width: {TAROT_CARD_MIN_WIDTH}px; --tarot_card_min_height: {TAROT_CARD_MIN_HEIGHT}px;"
>
	<div>
		<div class="draw-card-buttons">
			<button on:click={() => draw(1)}>draw a card</button>
			<button on:click={() => draw(3)}> draw three cards </button>
		</div>
		<div class="cards">
			{#each cards as card (card.id)}
				<TarotCardButton {card} click={view} />
			{/each}
		</div>
	</div>
	{#if drawnCards.length}
		<Overlay close={() => (drawnCards = [])}>
			<DrawnTarotCards cards={drawnCards} />
		</Overlay>
	{/if}
	{#if viewingCards.length}
		<Overlay close={() => (viewingCards = [])}>
			{#each viewingCards as card (card.id)}
				<TarotCardDetail {card} />
				{#if card !== lastViewingCard}
					<hr />
				{/if}
			{/each}
		</Overlay>
	{/if}
</section>
<section>
	<AboutLink />
</section>

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
		color: var(--font_color);
		background-color: var(--bg_color_fg);
	}
	.cards {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
</style>
