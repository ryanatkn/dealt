<script lang="ts">
	import collisions from '@ryanatkn/collisions';

	import AboutLink from '$lib/AboutLink.svelte';

	console.log('collisions', collisions);

	const onKeyDown = (e: KeyboardEvent) => {
		console.log('e.key', e.key);
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<section>collisions</section>
<section>
	<AboutLink />
</section>
