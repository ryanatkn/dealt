<script lang="ts">
	import type {TarotCard} from './tarot.js';

	// TODO consider a different version of this component for small screens
	// breakpoints just don't give the best UX without a ton of complexity

	export let card: TarotCard;
	export let shadow: boolean = Math.random() > 0.5;
</script>

<div class="tarot-card" class:shadow>
	<img src="/tarot/images/{card.id}.jpg" alt={card.name} />
	<div class="content">
		<h1>{card.name}</h1>
		<p class="keywords">{card.keywords.join(', ')}</p>
		{#if shadow}
			<section class="meanings shadow">
				<ul>
					{#each card.meanings.shadow as meaning (meaning)}
						<li>{meaning}</li>
					{/each}
				</ul>
			</section>
		{:else}
			<section class="meanings light">
				<ul>
					{#each card.meanings.light as meaning (meaning)}
						<li>{meaning}</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
</div>

<style>
	.tarot-card {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start; /* prevents aspect ratio changes */
	}
	img {
		margin: 20px;
	}
	.tarot-card.shadow img {
		transform: rotate(180deg);
	}
	.keywords {
		color: var(--light_text_color);
	}
	.tarot-card.shadow .keywords {
		color: var(--shadow_text_color);
	}
	.content {
		min-width: 240px;
		margin: 20px;
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
