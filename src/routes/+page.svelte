<script lang="ts">
	import {base} from '$app/paths';
	import Card from '@ryanatkn/fuz/Card.svelte';

	import Footer from '$routes/Footer.svelte';
	import Header from '$routes/Header.svelte';
</script>

<main class="width_md px_lg pb_xl9">
	<Header />
	<section class="width_sm">
		<p>Dealt is a toy 2D web game engine with a focus on topdown action RPGs.</p>
		<p>
			This is an early proof of concept - see the links below and the <a
				href="https://github.com/ryanatkn/dealt">readme</a
			>
			and <a href="{base}/about">about</a> page.
		</p>
		<aside>
			⚠️ Dealt's editor will not support mobile devices, but it will be possible to make
			mobile-friendly experiences with it.
		</aside>
	</section>
	<section>
		<section class="box gap_lg">
			<Card href="{base}/editor" icon="🏞" align="right">project editor</Card>
			<Card href="{base}/demo" icon="🗻">demos</Card>
			<Card href="{base}/about" icon="🔮" align="right">about</Card>
		</section>
	</section>
	<Footer />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}
</style>
