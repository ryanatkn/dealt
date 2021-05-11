<script lang="ts">
	import AboutLink from '$lib/AboutLink.svelte';
	import StressTest from '../../tar/StressTest.svelte';

	const onKeyDown = (e: KeyboardEvent) => {
		console.log('e.key', e.key);
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<section>
	<StressTest />
</section>
<section>
	<AboutLink />
</section>
