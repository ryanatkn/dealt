<script lang="ts">
	import {shuffle} from '$lib/random';
	import type {TarotCard} from './tarot.js';
	import TarotCardImage from './TarotCardImage.svelte';

	// TODO consider a different version of this component for small screens
	// breakpoints just don't give the best UX without a ton of complexity

	export let card: TarotCard;
	export let shadow = false;

	$: meanings = shuffle(shadow ? card.meanings.shadow : card.meanings.light);
</script>

<div class="tarot-card" class:shadow>
	<div class="image">
		<TarotCardImage {card} {shadow} />
	</div>
	<div class="content">
		<h1>{card.name}</h1>
		<p class="keywords">{card.keywords.join(', ')}</p>
		<div class="meanings" class:shadow class:light={!shadow}>
			<ul>
				{#each meanings as meaning (meaning)}
					<li>{meaning}</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.tarot-card {
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start; /* prevents aspect ratio changes */
	}
	.keywords {
		color: var(--light_text_color);
	}
	.image {
		display: flex;
		padding: 10px;
	}
	.tarot-card.shadow .keywords {
		color: var(--shadow_text_color);
	}
	.content {
		min-width: 240px;
		padding: 10px;
		flex: 1;
	}
	.meanings {
		border: 1px solid var(--light_border_color);
		background-color: var(--bg-color-fg);
		padding: 0 10px;
	}
	.meanings.shadow {
		border-color: var(--shadow_border_color);
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
