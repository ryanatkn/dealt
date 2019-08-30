<script lang="ts">
	import {writable} from 'svelte/store';

	import TarotCardThumbnail from './TarotCardThumbnail.svelte';
	import TarotCardDetail from './TarotCardDetail.svelte';
	import Overlay from './Overlay.svelte';
	import {cards} from './tarot.json';

	//  TODO show load animation and then animate things onscreen once everything is loaded
	// I like the idea of the cards all snapping to their locations, like they were spread out and snapping into an ordered list - I think this is easy with a random translate that goes to 0

	// TODO move with index constant
	const TAROT_COUNT = 78;

	// TODO move this to gro/utils/math
	const randInt = (min: number, max: number): number =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	// TODO share with root
	const drawCards = (count: number): number[] => {
		const drawn = new Set();
		while (drawn.size < count) {
			drawn.add(randInt(0, TAROT_COUNT - 1));
		}
		return Array.from(drawn);
	};

	// TODO do this better
	// we want an animation that moves the card into the overlay when opened,
	// and back onto the main space when closed
	let activeCardIds = [];
</script>

<div class="app">
	<div class="draw-card-buttons">
		<button on:click={() => (activeCardIds = drawCards(1))}>draw a card</button>
		<button on:click={() => (activeCardIds = drawCards(3))}>
			draw three cards
		</button>
	</div>
	<div class="cards">
		{#each {length: TAROT_COUNT} as _, i (i)}
			<TarotCardThumbnail
				cardId={i}
				card={cards[i]}
				on:click={() => (activeCardIds = [i])} />
		{/each}
	</div>
</div>
{#if activeCardIds.length}
	<Overlay close={() => (activeCardIds = [])}>
		{#each activeCardIds as id, index (id)}
			<TarotCardDetail cardId={id} card={cards[id]} />
			{#if index !== activeCardIds.length - 1}
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
