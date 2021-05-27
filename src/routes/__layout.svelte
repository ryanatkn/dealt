<script>
	import {provideShadow, provideShadow2} from '$lib/shadow';
	import '../app.css';

	provideShadow();
	provideShadow2();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<noscript>
	<section style="display: flex; justify-content: center;">
		<div style="max-width: 300px; padding-right: 10px;">
			<p>JavaScript is disabled. If you enable it, fun and surprising things could happen!</p>
			<p>
				This website tries to respect you and your machines, and its
				<a href="https://github.com/ryanatkn/dealt">source code</a>
				is open for inspection and criticism.
			</p>
		</div>
	</section>
</noscript>

<main>
	<slot />
</main>

<style>
	main {
		height: 100%;
		overflow-y: scroll;
		overflow-x: auto;
		padding: 20px;
		margin: 0 auto;
	}
</style>
