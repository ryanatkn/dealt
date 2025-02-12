import type {Flavored} from '@ryanatkn/belt/types.js';
import {count_graphemes} from '@ryanatkn/belt/string.js';
import {EMPTY_OBJECT} from '@ryanatkn/belt/object.js';

import type {Serializable} from '$lib/serializable.js';
import {parse_scene_metadata_json} from '$lib/scene.svelte.js';
import type {Renderer, Renderer_Type} from '$lib/renderer.svelte.js';
import {random_id, type Id} from '$lib/id.js';
import type {Thunked} from '$lib/helpers.js';
import type {Clock} from '$lib/clock.svelte.js';
import type {Collisions} from '$lib/collisions.js';
import type {Simulation} from '$lib/simulation.svelte.js';
import type {Controller} from '$lib/controller.svelte.js';
import type {App} from '$lib/app.svelte.js';
import {load_from_storage, set_in_storage} from '$lib/storage.js';
import {default_scenes_json, Scenes, type Scenes_Json} from '$lib/scenes.svelte.js';

export type Project_Id = Id | Flavored<number, 'Project_Id'>;

// type Name = string; // TODO like `Id`?
export type Project_Name = Flavored<string, 'Project_Name'>;

export type Project_Glyph = Flavored<string, 'Project_Glyph'>;

export const PROJECT_NAME_DEFAULT = 'untitled project';

export interface Project_Metadata_Json {
	id: Project_Id;
	name: Project_Name;
	glyph: Project_Glyph;
}

export interface Project_Json {
	id: Project_Id;
	name: Project_Name;
	glyph: string;
	renderers: Record<Renderer_Type, boolean>;
	scenes: Scenes_Json;
}

export const default_project_json: Thunked<Project_Json> = {
	id: () => random_id(),
	name: () => PROJECT_NAME_DEFAULT,
	glyph: () => '▦',
	renderers: () => parse_project_renderers(null),
	scenes: () => default_scenes_json,
};

const parse_project_renderers = (v: any): Record<Renderer_Type, boolean> => ({
	pixi: v?.pixi ?? true,
	svelte: v?.svelte ?? false,
	canvas: v?.canvas ?? false,
	html: v?.html ?? false,
});

export const parse_project_metadata_json = (v: any): Project_Metadata_Json => {
	return {
		id: typeof v?.id === 'number' && !Number.isNaN(v.id) ? v.id : default_project_json.id(),
		name: typeof v?.name === 'string' ? v.name : default_project_json.name(),
		glyph:
			typeof v?.glyph === 'string' && count_graphemes(v.glyph) === 1
				? v.glyph
				: default_project_json.glyph(),
	};
};

export const parse_project_json = (v: any): Project_Json => {
	// TODO parse_scene_metadata
	const scenes =
		v && Array.isArray(v.scenes)
			? v.scenes.map(parse_scene_metadata_json)
			: default_project_json.scenes();
	return {
		id: typeof v?.id === 'number' && !Number.isNaN(v.id) ? v.id : default_project_json.id(),
		name: typeof v?.name === 'string' ? v.name : default_project_json.name(),
		glyph: typeof v?.glyph === 'string' ? v.glyph : default_project_json.glyph(),
		renderers: parse_project_renderers(v?.renderers),
		scenes,
	};
};

export const get_next_project_name = (projects: Array<{name: Project_Name}>): Project_Name => {
	let name = PROJECT_NAME_DEFAULT;
	let i = 1;
	while (projects.some((p) => p.name === name)) {
		name = PROJECT_NAME_DEFAULT + ' ' + ++i;
	}
	return name;
};

export interface Project_Options {
	app: App;
	project_json?: Project_Json;
}

// TODO maybe split this into a `Scene` class? maybe combining a scene plus renderer(s)
export class Project implements Serializable<Project_Json> {
	id: Project_Id = $state()!;
	name: Project_Name = $state()!;
	glyph: string = $state()!;

	readonly app: App;
	// These are all copied from the `app` for convenience.
	readonly scenes: Scenes;
	readonly renderer: Renderer;
	readonly clock: Clock;
	readonly collisions: Collisions;
	readonly simulation: Simulation;
	readonly controller: Controller;

	json: Project_Json = $derived($state.snapshot(this));
	serialized = $derived(JSON.stringify(this.json));

	renderers: Record<Renderer_Type, boolean> = $state()!;
	renderer_count: number = $derived(
		(this.renderers.pixi ? 1 : 0) +
			(this.renderers.svelte ? 1 : 0) +
			(this.renderers.canvas ? 1 : 0) +
			(this.renderers.html ? 1 : 0),
	);

	constructor(options: Project_Options) {
		console.log(`[project] new with options`, options);
		const {app, project_json: project_json_option} = options;
		const project_json = parse_project_json(project_json_option);

		this.app = app;
		this.scenes = new Scenes({app, scenes_json: project_json.scenes});
		this.renderer = app.renderer;
		this.clock = app.clock;
		this.collisions = app.collisions;
		this.simulation = app.simulation;
		this.controller = app.controller;
		this.set_json(project_json); // TODO @many should we always init with empty values or conditionally? e.g. `some_json = parse_some_json(null)`
	}

	toJSON(): Project_Json {
		return {
			id: this.id,
			name: this.name,
			glyph: this.glyph,
			renderers: $state.snapshot(this.renderers), // TODO is this snapshot correct?
			scenes: $state.snapshot(this.scenes),
		};
	}

	// TODO @many maybe a `set_json` and `set_json_partial`? or always take a partial?
	set_json(value: Project_Json): void {
		console.log(`[project] set_json`, value);
		this.id = value.id;
		this.name = value.name;
		this.glyph = value.glyph;
		this.renderers = value.renderers;
		this.scenes.set_json(value.scenes);
	}

	loaded = $state(false); // TODO see usage, messy

	load(): void {
		if (this.loaded) return;
		this.set_json(Project.load(this.id));
		this.loaded = true;
	}

	static load(project_id: Project_Id): Project_Json {
		console.log(`[project] loading project_id`, project_id);
		return load_from_storage(
			Project.get_storage_key(project_id),
			() => parse_project_json(null), // TODO either add `id` or refactor - should this return `undefined` instead of having a default?
			parse_project_json,
			true, // init the data in storage so it can be looked up from metadata
		);
	}

	static save(project_json: Project_Json): string | undefined | Error {
		console.log('[project] saving json', project_json);
		return set_in_storage(Project.get_storage_key(project_json.id), project_json);
	}

	static get_storage_key(project_id: Project_Id): string {
		return 'project_' + project_id;
	}

	destroy(): void {
		this.scenes.destroy();
	}

	toggle_renderer(renderer_type: Renderer_Type): void {
		this.renderers[renderer_type] = !this.renderers[renderer_type];
	}
}

export interface Project_Metadata_Options {
	project_metadata_json?: Project_Metadata_Json; // TODO accept a partial?
}

export class Project_Metadata implements Serializable<Project_Metadata_Json> {
	id: Project_Id = $state()!;
	name: Project_Name = $state()!;
	glyph: string = $state()!;

	json: Project_Metadata_Json = $derived($state.snapshot(this));

	constructor(options: Project_Metadata_Options = EMPTY_OBJECT) {
		const {project_metadata_json = parse_project_metadata_json(null)} = options;

		this.set_json(project_metadata_json); // TODO load like with app data
	}

	// TODO @many omit defaults - option? separate method?
	toJSON(): Project_Metadata_Json {
		return {id: this.id, name: this.name, glyph: this.glyph};
	}

	set_json(value: Project_Metadata_Json): void {
		console.log(`[project_metadata] set_json`, value);
		this.id = value.id;
		this.name = value.name;
		this.glyph = value.glyph;
	}
}

// TODO refactor - return an error message?
export const check_project_glyph = (value: any): string | null => {
	if (typeof value !== 'string') return 'glyph is required';
	if (count_graphemes(value) !== 1) return 'glyph must be a single character';
	return null;
};
