<script lang="ts">
	import type {TarotCard} from './tarot.js';
	import {shuffle} from '$lib/random';
	import TarotCardImage from './TarotCardImage.svelte';

	// TODO consider a different version of this component for small screens
	// breakpoints just don't give the best UX without a ton of complexity

	export let card: TarotCard;

	$: lightMeanings = shuffle(card.meanings.light);
	$: shadowMeanings = shuffle(card.meanings.shadow);
</script>

<div class="tarot-card-detail">
	<img src="/tarot/images/{card.id}.jpg" alt={card.name} />
	<div class="content">
		<h1>{card.name}</h1>
		<p class="keywords">{card.keywords.join(', ')}</p>
		<section class="meanings light">
			<ul>
				{#each lightMeanings as meaning (meaning)}
					<li>{meaning}</li>
				{/each}
			</ul>
		</section>
		<section class="meanings shadow">
			<ul>
				{#each shadowMeanings as meaning (meaning)}
					<li>{meaning}</li>
				{/each}
			</ul>
		</section>
	</div>
	<div style="display: contents; --tarot_card_min_width: 100%;">
		<TarotCardImage {card} />
		<TarotCardImage {card} shadow={true} />
	</div>
</div>

<style>
	.tarot-card-detail {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start; /* prevents aspect ratio changes */
		padding: 20px;
	}
	img {
		/* TODO generated metadata */
		min-width: var(--tarot_card_min_width);
		min-height: var(--tarot_card_min_height);
		margin-bottom: 20px;
	}
	.content {
		min-width: 240px;
		margin-left: 20px;
		margin-bottom: 20px;
		flex: 1;
	}
	h1 {
		/* TODO globally style all headings */
		margin-top: 0;
	}
	section {
		margin-bottom: 20px;
	}
	section:last-child {
		margin-bottom: 0;
	}
	.meanings {
		border: 1px solid var(--border-color);
		background-color: var(--bg-color-fg);
		padding: 0 10px;
	}
	.light {
		box-shadow: 10px 10px 40px 15px var(--bg-color-fg) inset;
	}
	.shadow {
		box-shadow: 10px 10px 40px 15px var(--bg-color-backdrop) inset;
	}
	li {
		list-style: circle;
	}
</style>
