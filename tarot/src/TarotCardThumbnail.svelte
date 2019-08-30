<script lang="ts">
	export let cardId: number;
	export let card; // TODO type
</script>

<img class="card" src="images/{cardId}.jpg" alt={card.name} on:click />

<style>
	.card {
		max-width: 200px;
	}
</style>
