<script lang="ts">
	import type {TarotCard} from './tarot.js';

	export let card: TarotCard;
</script>

<img class="card" src="/tarot/images/{card.id}.jpg" alt={card.name} on:click />

<style>
	.card {
		max-width: 200px;
	}
</style>
