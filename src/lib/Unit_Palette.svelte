<script lang="ts">
	import type {Scene} from '$lib/scene.svelte.js';
	import {Unit} from '$lib/unit.svelte.js';

	interface Props {
		scene: Scene;
		add_unit?: (unit: Unit) => void; // TODO hacky
	}

	const {scene, add_unit = (t) => scene.add_unit(t)}: Props = $props();

	// TODO draw images for each instead of the text glyphs ⬤ and ▰ (need to normalize the scale)

	let add_count = 0;

	const add_circle = () => {
		add_unit(
			new Unit(scene, {
				type: 'circle',
				x: 100 + Math.cos(add_count) * ((add_count + 10) * 2),
				y: 100 + Math.sin(add_count) * ((add_count + 10) * 2),
				radius: 10,
			}),
		);
		add_count++;
	};
	const add_polygon = () => {
		add_unit(
			new Unit(scene, {
				type: 'polygon',
				x: 100 + Math.cos(add_count) * ((add_count + 10) * 2),
				y: 100 + Math.sin(add_count) * ((add_count + 10) * 2),
				rotation: add_count * 0.8,
				points: [
					{x: -20, y: 12},
					{x: 30, y: -15},
					{x: 17, y: 17},
				],
			}),
		);
		add_count++;
	};
</script>

<div class="unit_palette">
	<button type="button" title="add circle" onclick={add_circle}>add circle ⬤</button>
	<button type="button" title="add polygon" onclick={add_polygon}>add polygon ▰</button>
	<!-- TODO reset, undo, redo, history view -->
</div>

<style>
	.unit_palette {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space_xs);
	}

	button {
		justify-content: flex-start;
	}
</style>
