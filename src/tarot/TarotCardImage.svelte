<script lang="ts">
	import type {TarotCard} from './tarot.js';

	export let card: TarotCard;
	export let shadow = false;
</script>

<img class:shadow src="/tarot/images/{card.id}.jpg" alt={card.name} />

<style>
	img {
		margin: 20px;
	}
	img.shadow {
		transform: rotate(180deg);
	}
</style>
