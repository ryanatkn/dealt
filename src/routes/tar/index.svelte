<script lang="ts">
	import Footer from '$lib/Footer.svelte';
	import Stress_Test from '../../tar/Stress_Test.svelte';
	import {icons} from '@feltcoop/felt';
	const on_keydown = (e: KeyboardEvent) => {
		console.log('e.key', e.key);
	};
</script>

<svelte:window on:keydown={on_keydown} />

<section>
	<Stress_Test />
</section>
<section>
	<Footer />
</section>
<section style="text-align: center;">
	{icons.felt}
</section>
