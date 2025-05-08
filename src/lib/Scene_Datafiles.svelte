<script lang="ts">
	import Details from '@ryanatkn/fuz/Details.svelte';
	import Copy_To_Clipboard from '@ryanatkn/fuz/Copy_To_Clipboard.svelte';

	import Import_Data_Form from '$lib/Import_Data_Form.svelte';
	import type {Scene, Scene_Json} from '$lib/scene.svelte.js';
	import {Serializer} from '$lib/serializer.svelte.js';

	interface Props {
		scene: Scene;
		onimport?: (data: Scene_Json, serialized: string) => void;
	}

	const {scene, onimport}: Props = $props();

	const scene_json = $derived($state.snapshot(scene));

	const serializer = $derived(new Serializer(scene_json));
</script>

<h2 class="mt_xl">Scene data</h2>
<section>
	<Import_Data_Form
		data={serializer}
		title="scene data"
		name="Scene"
		onimport={(json, serialized) => {
			scene.reset(json); // TODO parse_scene_json?
			onimport?.(json, serialized);
		}}
	/>
</section>
<Details>
	{#snippet summary()}
		View raw scene data
	{/snippet}
	<div class="panel position_relative">
		<pre class="p_xs mb_0">{serializer.serialized}</pre>
		<div
			class="position_absolute"
			style:right="var(--font_size_lg)"
			style:top="var(--font_size_lg)"
		>
			<Copy_To_Clipboard text={serializer.serialized} />
		</div>
	</div>
</Details>

<style>
	pre {
		max-height: 50vh;
	}
</style>
