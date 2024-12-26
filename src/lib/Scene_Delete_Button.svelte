<script lang="ts">
	import {slide} from 'svelte/transition';

	import type {Scene} from '$lib/scene.svelte.js';

	interface Props {
		scene: Scene;
	}

	const {scene}: Props = $props();

	let deleting_scene = $state(false);

	$effect(() => {
		scene.id;
		deleting_scene = false; // TODO @many better pattern?
	});
</script>

<button type="button" class="w_100 color_c" onclick={() => (deleting_scene = !deleting_scene)}>
	delete scene
</button>
{#if deleting_scene}
	<div transition:slide>
		<button
			type="button"
			class="w_100 color_c selected deselectable"
			onpointerup={() => {
				scene.project.delete_scene(scene.id);
				deleting_scene = false;
			}}
		>
			<div class="size_xl3">✕</div>
			<div class="ml_lg text_align_left">
				permanently delete scene<br />{scene.glyph}
				{scene.name}
			</div>
		</button>
	</div>
{/if}
