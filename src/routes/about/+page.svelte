<script lang="ts">
	import {base} from '$app/paths';
	import Community_Links_Panel from '@ryanatkn/fuz/Community_Links_Panel.svelte';
	import Package_Detail from '@ryanatkn/fuz/Package_Detail.svelte';
	import {parse_package_meta} from '@ryanatkn/gro/package_meta.js';

	import Footer from '$routes/Footer.svelte';
	import Header from '$routes/Header.svelte';
	import {package_json, src_json} from '$routes/package.js';

	const pkg = parse_package_meta(package_json, src_json);
</script>

<main class="width_md px_lg pb_xl9">
	<Header>
		{#snippet icon()}
			<!-- svelte-ignore a11y_distracting_elements -->
			<div class="flex size_xl7">
				<marquee> 🔮 </marquee>
				<marquee class="flip_x w_100"> 🔮 </marquee>
			</div>
		{/snippet}
		<h1 class="mt_xl2">about Dealt</h1>
	</Header>
	<section class="w_100">
		<p>
			Dealt is a toy 2D web game engine with a focus on topdown action RPGs. It's in early
			development and being built in public. For more, see:
		</p>
		<ul>
			<li>
				the
				<a href="https://github.com/ryanatkn/dealt">readme</a>
			</li>
			<li><a href="{base}/editor">editor</a></li>
			<li><a href="{base}/demo">demos</a></li>
			<li>
				soon, a <a href="https://www.youtube.com/playlist?list=PLio_5jgyVNVkmyxBTqZrZfHSehMFz8w3A"
					>YouTube playlist</a
				>
			</li>
			<li><a href="https://github.com/ryanatkn/dealt">source code</a> on Github</li>
		</ul>
	</section>
	<section class="w_100">
		<div class="panel p_md width_md">
			<Package_Detail {pkg} />
		</div>
	</section>
	<Community_Links_Panel />
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
