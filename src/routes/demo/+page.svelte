<script lang="ts">
	import {base} from '$app/paths';
	import Card from '@ryanatkn/fuz/Card.svelte';

	import Footer from '$routes/Footer.svelte';
	import Header from '$routes/Header.svelte';
</script>

<svelte:head>
	<title>Dealt: demos</title>
</svelte:head>

<main class="width_md mx_auto box px_lg pb_xl9">
	<Header />
	<section class="display_flex gap_lg flex_column">
		<Card href="{base}/demo/spawn" icon="🌋">spawn demo</Card>
		<Card href="{base}/demo/vehicle" icon="🐢">vehicle demo</Card>
		<Card href="{base}/demo/sandbox" icon="🌄">sandbox demo</Card>
	</section>
	<section class="box gap_lg">
		<Card href="{base}/editor" icon="🏞" align="right">project editor</Card>
		<Card href="{base}/about" icon="🔮" align="right">about</Card>
	</section>
	<Footer />
</main>
