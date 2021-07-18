<script lang="ts">
	import Tar_Canvas from '$lib/tar/Tar_Canvas.svelte';

	let height: number;
	let width: number;

	// TODO game loop

	const player = {name: 'player', x: 100, y: 100, speed: 10};
	const entities = [player];

	const on_keydown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			player.x -= player.speed;
		} else if (e.key === 'ArrowRight') {
			player.x += player.speed;
		} else if (e.key === 'ArrowUp') {
			player.y -= player.speed;
		} else if (e.key === 'ArrowDown') {
			player.y += player.speed;
		} else {
			console.log('e.key', e.key);
		}
	};
</script>

<!-- TODO window width/height -->
<Tar_Canvas {width} {height} {entities} />

<svelte:window bind:innerHeight={height} bind:innerWidth={width} on:keydown={on_keydown} />
