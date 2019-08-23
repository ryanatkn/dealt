<script>
	import TarotCardThumbnail from './TarotCardThumbnail.svelte';

	// TODO move with index constant
	const TAROT_COUNT = 78;
</script>

<style>
	.cards {
		margin: 20px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
</style>

<div class="cards">
	{#each {length: TAROT_COUNT} as _, i (i)}
		<TarotCardThumbnail index={i} />
	{/each}
</div>
