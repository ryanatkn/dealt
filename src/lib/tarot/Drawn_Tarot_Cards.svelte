<script lang="ts">
	import {last} from '@feltcoop/felt/util/array.js';

	import type {Tarot_Card} from '$lib/tarot/tarot.js';
	import {to_random_shadow} from '$lib/ui/shadow';
	import Drawn_Tarot_Card from '$lib/tarot/Drawn_Tarot_Card.svelte';
	import Tarot_Card_Image from '$lib/tarot/Tarot_Card_Image.svelte';

	export let cards: Tarot_Card[];

	$: last_drawn_card = last(cards);
	$: shadows = cards.map(() => to_random_shadow());
</script>

{#each cards as card, i (card.id)}
	<Drawn_Tarot_Card {card} shadow={shadows[i]} />
	{#if card !== last_drawn_card}
		<hr />
	{/if}
{/each}
<hr />
<div class="big">
	{#each cards as card, i (card.id)}
		<Tarot_Card_Image {card} shadow={shadows[i]} />
		<Tarot_Card_Image {card} shadow={!shadows[i]} />
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
