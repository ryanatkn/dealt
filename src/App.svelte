<script>
	import Thumbnail from './Thumbnail.svelte';
	import TarotThumbnail from './TarotThumbnail.svelte';
</script>

<style>
	.thumbnails {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
</style>

<div class="thumbnails">
	<TarotThumbnail />
	<Thumbnail href="https://github.com/ryanatkn/dealt">
		<img
			src="characters/octocat.png"
			alt="source code on GitHub"
			style="opacity: 0.78;" />
	</Thumbnail>
</div>
