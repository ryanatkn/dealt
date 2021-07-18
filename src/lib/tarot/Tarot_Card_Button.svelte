<script lang="ts">
	import Tarot_Card_Thumbnail from '$lib/tarot/Tarot_Card_Thumbnail.svelte';
	import type {Tarot_Card} from '$lib/tarot/tarot.js';
	import {random_bool} from '$lib/util/random';

	export let card: Tarot_Card;
	export let shadow = false;
	export let click: (card: Tarot_Card) => void; // TODO `onClick`? `act`?
	export let odd = random_bool();
</script>

<button
	class="card"
	class:shadow
	class:odd
	on:click={() => click(card)}
	on:mouseover={() => (odd = random_bool())}
>
	<Tarot_Card_Thumbnail {card} />
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
