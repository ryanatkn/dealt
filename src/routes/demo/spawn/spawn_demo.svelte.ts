import {EMPTY_OBJECT} from '@ryanatkn/belt/object.js';
import {BROWSER} from 'esm-env';

import type {Renderer_Type} from '$lib/renderer.svelte.js';

export interface Spawn_Demo_State_Json {
	width: number;
	height: number;
	unit_count: number;
	unit_scale: number;
	renderer_type: Renderer_Type;
	simulation_speed: number;
}

export class Spawn_Demo_State {
	width: number = $state()!;
	height: number = $state()!;
	unit_count: number = $state()!;
	unit_scale: number = $state()!;
	renderer_type: Renderer_Type = $state()!;
	simulation_speed: number = $state()!;

	constructor(json: Partial<Spawn_Demo_State_Json> = EMPTY_OBJECT) {
		const {
			width = 800,
			height = 600,
			unit_count = BROWSER ? 72 : 0,
			unit_scale = 1,
			renderer_type = 'pixi',
			simulation_speed = 1,
		} = json;
		this.width = width;
		this.height = height;
		this.unit_count = unit_count;
		this.unit_scale = unit_scale;
		this.renderer_type = renderer_type;
		this.simulation_speed = simulation_speed;
	}

	// TODO what if this had `derived.by` read from objects?
	json = $derived(this.toJSON());

	toJSON(): Spawn_Demo_State_Json {
		return {
			width: this.width,
			height: this.height,
			unit_count: this.unit_count,
			unit_scale: this.unit_scale,
			renderer_type: this.renderer_type,
			simulation_speed: this.simulation_speed,
		};
	}
}

// TODO replace with generic helper with `parse` function (schema param)
export const parse_spawn_demo_state_from_hash = (
	hash: string,
): Partial<Spawn_Demo_State_Json> | undefined => {
	if (!hash) return undefined;

	const h = hash.startsWith('#') ? hash.substring(1) : hash;
	let parsed;
	try {
		parsed = JSON.parse(decodeURIComponent(h));
	} catch (error) {
		console.error('Failed to parse hash:', h, error);
	}
	console.log(`parsed`, parsed);
	return parsed;
};

export const serialize_spawn_demo_state_to_hash = (json: Spawn_Demo_State_Json): string => {
	return encodeURIComponent(JSON.stringify(json));
};
