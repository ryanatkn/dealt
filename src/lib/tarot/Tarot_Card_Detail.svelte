<script lang="ts">
	import type {Tarot_Card} from './tarot.js';
	import {shuffle} from '$lib/random';
	import Tarot_Card_Image from './Tarot_Card_Image.svelte';

	// TODO consider a different version of this component for small screens
	// breakpoints just don't give the best UX without a ton of complexity

	export let card: Tarot_Card;

	$: light_meanings = shuffle(card.meanings.light);
	$: shadow_meanings = shuffle(card.meanings.shadow);
</script>

<div class="tarot-card-detail">
	<div class="info">
		<img src="/tarot/images/{card.id}.jpg" alt={card.name} />
		<div class="content">
			<h1>{card.name}</h1>
			<p class="keywords">{card.keywords.join(', ')}</p>
			<section class="meanings light">
				<ul>
					{#each light_meanings as meaning (meaning)}
						<li>{meaning}</li>
					{/each}
				</ul>
			</section>
			<section class="meanings shadow">
				<ul>
					{#each shadow_meanings as meaning (meaning)}
						<li>{meaning}</li>
					{/each}
				</ul>
			</section>
		</div>
	</div>
	<hr />
	<div style="display: contents; --tarot_card_min_width: 100%;">
		<Tarot_Card_Image {card} />
		<Tarot_Card_Image {card} shadow={true} />
	</div>
</div>

<style>
	.tarot-card-detail {
		display: flex;
		flex-direction: column;
	}
	.info {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start; /* prevents aspect ratio changes */
		padding: 10px;
	}
	img {
		/* TODO generated metadata */
		min-width: var(--tarot_card_min_width);
		min-height: var(--tarot_card_min_height);
		padding: 10px;
	}
	.content {
		min-width: 240px;
		padding: 10px;
		flex: 1;
	}
	.meanings {
		border: 1px solid var(--border_color);
		background-color: var(--bg_color_fg);
		padding: 0 10px;
	}
	.light {
		box-shadow: 10px 10px 40px 15px var(--bg_color_fg) inset;
	}
	.shadow {
		box-shadow: 10px 10px 40px 15px var(--bg_color_backdrop) inset;
	}
	li {
		list-style: circle;
	}
	section:last-child {
		margin-bottom: 0;
	}
</style>
