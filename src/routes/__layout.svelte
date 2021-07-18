<script>
	import {set_shadow, set_shadow2} from '$lib/ui/shadow';
	import '$lib/ui/style.css';

	set_shadow();
	set_shadow2();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<noscript>
	<section style="display: flex; justify-content: center;">
		<div style="max-width: 300px; padding-right: 10px;">
			<p>JavaScript is disabled. If you enable it, fun and surprising things could happen!</p>
			<p>
				This website tries to respect you and your machines, and its
				<a href="https://github.com/feltcoop/dealt">source code</a>
				is open for inspection and criticism.
			</p>
		</div>
	</section>
</noscript>

<slot />
