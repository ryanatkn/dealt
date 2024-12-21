<script lang="ts">
	import {slide} from 'svelte/transition';

	import {check_scene_glyph, type Scene} from '$lib/scene.svelte.js';
	import Scene_Delete_Button from '$lib/Scene_Delete_Button.svelte';

	interface Props {
		scene: Scene;
	}

	const {scene}: Props = $props();

	let glyph_error_message: string | null = $state(null);
</script>

<form class="flex flex_column gap_md width_sm">
	<!-- TODO store in app/site/project data -->
	<fieldset>
		<label>
			<div class="title">name</div>
			<input bind:value={scene.name} placeholder="scene name" title="scene name" />
		</label>
		<label>
			<div class="title">glyph</div>
			<input
				value={scene.glyph}
				placeholder="scene glyph"
				title="scene glyph for {scene.name}"
				oninput={(e) => {
					// TODO think about this pattern
					// TODO parse function with efficient unwrapped value? maybe objects with a special symbol key?
					const {value} = e.currentTarget;
					glyph_error_message = check_scene_glyph(value);
					if (glyph_error_message === null) {
						scene.glyph = value;
					}
				}}
			/>
			{#if glyph_error_message}
				<div transition:slide>
					<strong class="color_c_5">{glyph_error_message}</strong>
				</div>
			{/if}
		</label>
		<label>
			<div class="title">id</div>
			<input disabled title="scene id" value={scene.id} />
		</label>
	</fieldset>
	<fieldset class="gap_md">
		<!-- TODO this button is only to save changes to units -->
		<button type="button" onclick={() => scene.save()} class="color_a"> save scene </button>
		<button type="button" onclick={() => scene.project.duplicate_scene(scene)}>
			duplicate scene
		</button>
	</fieldset>
	<fieldset>
		<h3 class="color_c_5">Delete scene</h3>
		<Scene_Delete_Button {scene} />
	</fieldset>
</form>
