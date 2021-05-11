<script lang="ts">
	import Footer from '$lib/Footer.svelte';
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
	<Footer />
</section>
