<script lang="ts">
	import TarotCardThumbnail from './TarotCardThumbnail.svelte';
	import type {TarotCard} from './tarot.js';
	import {randomBoolean} from '$lib/random';

	export let card: TarotCard;
	export let shadow = false;
	export let click: (card: TarotCard) => void; // TODO `onClick`? `act`?
	export let odd = randomBoolean();
</script>

<button
	class="card"
	class:shadow
	class:odd
	on:click={() => click(card)}
	on:mouseover={() => (odd = randomBoolean())}
>
	<TarotCardThumbnail {card} />
</button>

<style>
	button.card {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin: 0;
		background: none;
		border: 0;
	}
	button.card:hover {
		transform: rotate(1deg);
	}
	button.card:active {
		transform: rotate(-1deg);
	}
	button.card.odd:hover {
		transform: rotate(-1deg);
	}
	button.card.odd:active {
		transform: rotate(1deg);
	}
</style>
