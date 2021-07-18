<script lang="ts">
	import Overlay from '$lib/ui/Overlay.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import {last} from '@feltcoop/felt/util/array.js';

	import Tarot_Card_Button from '$lib/tarot/Tarot_Card_Button.svelte';
	import Tarot_Card_Detail from '$lib/tarot/Tarot_Card_Detail.svelte';
	import Drawn_Tarot_Cards from '$lib/tarot/Drawn_Tarot_Cards.svelte';
	import tarot_data from '$lib/tarot/tarot.json';
	import {TAROT_CARD_MIN_WIDTH, TAROT_CARD_MIN_HEIGHT} from '$lib/tarot/tarot';
	import type {Tarot_Card} from '$lib/tarot/tarot.js';
	import {random_items, shuffle} from '$lib/util/random';

	// TODO refactor, extract some components

	const cards: Tarot_Card[] = shuffle(tarot_data.cards);

	let drawn_cards: Tarot_Card[] = [];
	let viewing_cards: Tarot_Card[] = [];

	$: last_viewing_card = last(viewing_cards);

	const draw = (count: number): void => {
		drawn_cards = random_items(cards, count);
		viewing_cards = [];
	};

	const view = (card: Tarot_Card): void => {
		drawn_cards = [];
		viewing_cards = [card];
	};

	const on_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			drawn_cards = []; // TODO should be hide modal
			viewing_cards = [];
		}
	};
</script>

<svelte:window on:keydown={on_keydown} />

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
				<Tarot_Card_Button {card} click={view} />
			{/each}
		</div>
	</div>
	{#if drawn_cards.length}
		<Overlay close={() => (drawn_cards = [])}>
			<Drawn_Tarot_Cards cards={drawn_cards} />
		</Overlay>
	{/if}
	{#if viewing_cards.length}
		<Overlay close={() => (viewing_cards = [])}>
			{#each viewing_cards as card (card.id)}
				<Tarot_Card_Detail {card} />
				{#if card !== last_viewing_card}
					<hr />
				{/if}
			{/each}
		</Overlay>
	{/if}
</section>
<section>
	<Footer />
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
