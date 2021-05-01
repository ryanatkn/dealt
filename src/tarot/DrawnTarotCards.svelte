<script lang="ts">
	import type {TarotCard} from './tarot.js';
	import {toRandomShadow} from '$lib/shadow';
	import DrawnTarotCard from './DrawnTarotCard.svelte';
	import TarotCardImage from './TarotCardImage.svelte';
	import {last} from './tarot';

	export let cards: TarotCard[];

	$: lastDrawnCard = last(cards);
	$: shadows = cards.map(() => toRandomShadow());
</script>

{#each cards as card, i (card.id)}
	<DrawnTarotCard {card} shadow={shadows[i]} />
	{#if card !== lastDrawnCard}
		<hr />
	{/if}
{/each}
<hr />
<div class="big">
	{#each cards as card, i (card.id)}
		<TarotCardImage {card} shadow={shadows[i]} />
		<TarotCardImage {card} shadow={!shadows[i]} />
	{/each}
</div>

<style>
	.big {
		display: flex;
		flex-direction: column;
	}
	/* TODO hmm best way? */
	.big :global(img) {
		width: 100%;
	}
</style>
