<script lang="ts">
	export let card; // TODO type
</script>

<img class="card" src="images/{card.id}.jpg" alt={card.name} on:click />

<style>
	.card {
		max-width: 200px;
	}
</style>
