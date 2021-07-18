<script lang="ts">
	import Tar_Canvas from '$lib/tar/Tar_Canvas.svelte';

	let height: number;
	let width: number;

	const on_keydown = (e: KeyboardEvent) => {
		console.log('e.key', e.key);
	};
</script>

<!-- TODO window width/height -->
<Tar_Canvas {width} {height} />

<svelte:window bind:innerHeight={height} bind:innerWidth={width} on:keydown={on_keydown} />
