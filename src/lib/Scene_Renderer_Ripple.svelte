<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {mount} from 'ripple';

	import type {Renderer} from '$lib/renderer.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';
	import {editor_context} from '$lib/editor.svelte.js';
	// @ts-expect-error - Ripple files use .ripple extension, TypeScript doesn't recognize them
	import {RippleScene} from '$lib/ripple/ripple_scene.ripple';
	import type {Unit_Json} from '$lib/unit_types.js';

	interface Props {
		renderer: Renderer;
		scene: Scene;
	}

	const {renderer, scene}: Props = $props();

	let el: HTMLDivElement | undefined;
	let unmount_ripple: (() => void) | undefined;
	let unwatch_clock: (() => void) | undefined;

	// Store reference to Ripple's update callback
	let ripple_update_callback: ((dt: number) => void) | null = null;

	// Store reference to Ripple's state getter (lazy serialization)
	let get_ripple_state: (() => Array<Unit_Json>) | null = null;

	// Store editor's clock callback so we can restore it later
	let editor_unwatch_clock: (() => void) | undefined;

	const editor = editor_context.get();

	onMount(() => {
		if (el) {
			// Reset clock timing to prevent dt spike from renderer switch
			scene.clock.reset_timing();

			// Temporarily disable Svelte's simulation while Ripple owns it
			// TODO: Refactor to use ref counting or capability tokens for robustness
			// Current approach fragile if multiple renderers mount simultaneously
			if (editor.unwatch_clock) {
				editor_unwatch_clock = editor.unwatch_clock;
				editor.unwatch_clock();
				editor.unwatch_clock = undefined;
			}

			// Serialize Svelte units to JSON
			const units_json = scene.units.map((u) => u.toJSON());

			// Mount Ripple scene with callback registration
			unmount_ripple = mount(RippleScene, {
				target: el,
				props: {
					width: renderer.width,
					height: renderer.height,
					units_json,
					colors: renderer.colors,
					// Use getter so Ripple always reads current Svelte state
					get_simulation_speed: () => scene.simulation.speed,
					// Register callback so we can call Ripple's update from clock
					register_update_callback: (callback: ((dt: number) => void) | null) => {
						ripple_update_callback = callback;
					},
					// Register lazy state getter (called before unmount)
					on_get_state: (getter: (() => Array<Unit_Json>) | null) => {
						get_ripple_state = getter;
					},
				},
			});

			// Subscribe to clock and drive Ripple's simulation
			unwatch_clock = scene.clock.watch((dt) => {
				if (ripple_update_callback) {
					ripple_update_callback(dt);
				}
			});
		}
	});

	onDestroy(() => {
		// Unsubscribe from clock
		if (unwatch_clock) {
			unwatch_clock();
			unwatch_clock = undefined;
		}

		// Get current Ripple state BEFORE unmounting (lazy serialization)
		const exported_units = get_ripple_state ? get_ripple_state() : undefined;

		// Unmount Ripple component
		if (unmount_ripple) {
			try {
				unmount_ripple();
			} catch (e) {
				// Ripple might throw if DOM elements are already removed by Svelte
				console.warn('[Scene_Renderer_Ripple] Error during unmount:', e);
			}
			unmount_ripple = undefined;
		}

		// Update existing Svelte units from Ripple export (don't reset scene!)
		if (exported_units && exported_units.length > 0) {
			// Create a map of exported units by ID for fast lookup
			const exported_by_id = new Map(exported_units.map((u) => [u.id, u]));

			// Update existing units with Ripple's final state
			for (const unit of scene.units) {
				const exported = exported_by_id.get(unit.id);
				if (exported) {
					unit.set_json(exported);
				}
			}
		}

		// Re-enable Svelte simulation (if it was running before)
		if (editor_unwatch_clock && !editor.unwatch_clock) {
			editor.unwatch_clock = scene.clock.watch(editor.update);
			editor_unwatch_clock = undefined;
		}
	});
</script>

<div
	bind:this={el}
	class="scene_renderer_ripple"
	style:width="{renderer.width}px"
	style:height="{renderer.height}px"
	style:background-color={renderer.colors.background ?? 'transparent'}
></div>
