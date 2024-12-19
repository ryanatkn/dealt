import type {Scene_Json} from '$lib/scene.svelte.js';
import {scene_json as scene_json_vehicle} from '$routes/demo/vehicle/scene_data.js';

export const scene_json: Scene_Json = {
	id: 7464772085109328,
	name: 'sandbox demo',
	glyph: '?',
	units: [
		{
			id: 34124912695862064,
			name: 'player',
			type: 'circle',
			x: 409,
			y: 302,
			angle: 0.2,
			strength: 20,
			behaviors: [{name: 'Player_Controller_Behavior'}],
		},
		...scene_json_vehicle.units.slice(1),
	],
};
