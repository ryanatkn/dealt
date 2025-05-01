<script lang="ts">
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import {parse_package_meta} from '@ryanatkn/gro/package_meta.js';
	import Docs_Footer from '@ryanatkn/fuz/Docs_Footer.svelte';
	import type {Snippet} from 'svelte';
	import {page} from '$app/state';

	import {package_json, src_json} from '$routes/package.js';

	const pkg = parse_package_meta(package_json, src_json);

	interface Props {
		children?: Snippet;
	}

	export const {children}: Props = $props();

	const at_root = $derived(page.url.pathname === '/');
</script>

<section>
	{#if children}
		{@render children()}
	{:else if !at_root}
		<div class="mb_xl5" style:--size="var(--size_xl)">
			<Breadcrumb>🔮</Breadcrumb>
		</div>
	{/if}
	<Docs_Footer {pkg} />
</section>
