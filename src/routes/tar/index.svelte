<script lang="ts">
	import {Collisions} from '@ryanatkn/collisions';

	import AboutLink from '$lib/AboutLink.svelte';

	console.log('collisions', Collisions);

	const onKeyDown = (e: KeyboardEvent) => {
		console.log('e.key', e.key);
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<section>collisions</section>
<section>
	<AboutLink />
</section>
