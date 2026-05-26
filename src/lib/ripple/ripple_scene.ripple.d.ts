/**
 * Type declarations for ripple_scene.ripple
 */

import type {Unit_Json} from '$lib/unit_types.js';
import type {Renderer_Colors} from '$lib/renderer.svelte.js';

interface RippleSceneProps {
	width: number;
	height: number;
	units_json: Array<Unit_Json>;
	colors: Renderer_Colors;
	get_simulation_speed: () => number;
	register_update_callback?: (callback: ((dt: number) => void) | null) => void;
	on_export?: (units_json: Array<Unit_Json>) => void;
}

export function RippleScene(props: RippleSceneProps): any;
