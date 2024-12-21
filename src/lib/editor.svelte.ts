import {create_context} from '@ryanatkn/fuz/context_helpers.js';

import {
	parse_project_json,
	Project,
	type Project_Json,
	type Project_Id,
} from '$lib/project.svelte.js';
import {load_from_storage, set_in_storage} from '$lib/storage.js';
import type {Unit} from '$lib/unit.svelte.js';
import type {Renderer} from '$lib/renderer.svelte.js';
import type {Clock} from '$lib/clock.svelte.js';
import type {Collisions} from '$lib/collisions.js';
import type {Simulation} from '$lib/simulation.svelte.js';
import type {Controller} from '$lib/controller.svelte.js';
import {Unit_Selection} from '$lib/unit_selection.svelte.js';
import type {Thunked} from '$lib/helpers.js';
import type {App} from '$lib/app.svelte.js';
import {SvelteSet} from 'svelte/reactivity';
import type {Scene_Interaction_Surface_State} from '$lib/Scene_Interaction_Surface.svelte';
import type {Serializable} from '$lib/serializable.js';
import {Player_Controller_Behavior} from '$lib/behaviors/Player_Controller_Behavior.svelte.js';

// TODO should be optional, created/destroyed at runtime

// TODO maybe a `@batched` or `@action` decorator instead of manual `batch`?

// TODO refactor all storage calls, and rethink in signals instead of all top-level orchestration (that's less reusable)

export const editor_context = create_context<Editor>();

export interface Editor_Json {
	projects: Array<Project_Json>;
	selected_project_id: Project_Id;
	show_scene_menu: boolean;
	editing: boolean;
	playing: boolean;
}

const default_editor_json_projects = [parse_project_json(null)];

// experimenting with patterns for default values
export const default_editor_json: Thunked<Editor_Json> = {
	projects: () => default_editor_json_projects,
	selected_project_id: () => default_editor_json_projects[0].id, // TODO what if the param was a partial?
	show_scene_menu: () => false,
	editing: () => true,
	playing: () => false,
};

export const parse_editor_json = (v: any): Editor_Json => {
	console.log(`[parse_editor_json]`, v);
	const projects =
		v?.projects === undefined ? default_editor_json.projects() : v.projects.map(parse_project_json); // TODO better typesafety for callers
	return {
		projects,
		selected_project_id:
			v?.selected_project_id === undefined ? projects[0].id : v.selected_project_id,
		show_scene_menu:
			typeof v?.show_scene_menu === 'boolean'
				? v.show_scene_menu
				: default_editor_json.show_scene_menu(),
		editing: typeof v?.editing === 'boolean' ? v.editing : default_editor_json.editing(),
		playing: typeof v?.playing === 'boolean' ? v.playing : default_editor_json.playing(),
	};
};

const STORAGE_KEY = 'editor';

export interface Editor_Options {
	app: App;
	project?: Project;
	editor_json?: Editor_Json;
}

export class Editor implements Serializable<Editor_Json> {
	// TODO wheres the source of truth?
	// currently manually syncing the same changes to both `editor_json` `projects` --
	// mixing serialization concerns with runtime representations

	readonly app: App;
	readonly clock: Clock;
	readonly renderer: Renderer;
	readonly collisions: Collisions;
	readonly simulation: Simulation;
	readonly controller: Controller;

	// TODO maybe a map?
	projects: Array<Project_Json> = $state()!;

	// TODO `selected_` prefix for these?
	selected_project_id: Project_Id = $state()!;
	readonly project!: Project;

	show_scene_menu: boolean = $state(false);

	editing: boolean = $state()!;

	// TODO @many move unit_selection to the right abstraction, maybe an `Editor`?
	unit_selection = new Unit_Selection();

	// TODO @many refactor surface/selection state
	scene_interaction_surface_state: Scene_Interaction_Surface_State = $state({
		hovering_unit: null,
		hovered_unit: null,
		hovering_handle: false,
		pointer_x: 0,
		pointer_y: 0,
		pointer_down: false,
		pointing: false,
		drag_start_x: null,
		drag_start_y: null,
		dragging_unit: null,
		dragging_selection: false,
		drag_start_client_x: null,
		drag_start_client_y: null,
		pointer_last_client_x: null,
		pointer_last_client_y: null,
	});

	// TODO this does not stay in sync with `scene.layers`
	collapsed_layers: SvelteSet<Unit> = new SvelteSet();

	#playing: boolean = $state()!;
	get playing(): boolean {
		return this.#playing;
	}
	set playing(value: boolean) {
		this.#playing = value;
		if (this.#playing) {
			// TODO move/refactor?
			if (!this.players?.length) {
				if (this.project.scene.units.length) {
					// TODO start by refactoring to a `player`/`controller` flag/config instead of `name`
					const unit = this.project.scene.units[0];
					unit.name = 'player';
					unit.add_behavior(new Player_Controller_Behavior());
				}
			}

			// TODO @many hacky but seems to be the right UX
			this.project.scene.clock.watch(this.update);
			this.project.scene.clock.start();
		} else {
			// TODO @many hacky but seems to be the right UX
			this.project.scene.clock.unwatch(this.update);
			this.project.scene.clock.stop();
		}
	}

	json: Editor_Json = $derived($state.snapshot(this));

	constructor(options: Editor_Options) {
		console.log(`[editor] new with options`, options);
		const {
			app,
			project = new Project({app, editor: this}),
			editor_json = Editor.load(),
		}: Editor_Options = options;

		this.app = app;
		this.clock = app.clock;
		this.renderer = app.renderer;
		this.collisions = app.collisions;
		this.simulation = app.simulation;
		this.controller = app.controller;
		this.project = project;

		console.log(`[editor] editor_json`, editor_json);
		this.set_json(editor_json);
	}

	// returns a stable reference to data that's immutable by convention
	// TODO @many omit defaults - option? separate method?
	toJSON(): Editor_Json {
		return {
			projects: $state.snapshot(this.projects),
			selected_project_id: this.selected_project_id,
			show_scene_menu: this.show_scene_menu,
			editing: this.editing,
			playing: this.playing,
		};
	}

	set_json(value: Editor_Json): void {
		console.log(`[editor] set_json`, value);
		this.selected_project_id = value.selected_project_id;
		this.projects = value.projects;
		// TODO is this correct? how about pattern with project.scene?
		const project_json = this.projects.find((p) => p.id === value.selected_project_id);
		if (project_json) this.project.set_json(project_json);
		this.show_scene_menu = value.show_scene_menu;
		this.editing = value.editing;
		this.playing = value.playing;
	}

	// TODO maybe flat function helper with these interfaces? mutation?
	save(data: Editor_Json = this.json): void {
		console.log('[editor] save');
		set_in_storage(STORAGE_KEY, data);
	}

	static load(storage_key = STORAGE_KEY): Editor_Json {
		console.log(`[editor] loading editor`);
		return load_from_storage(storage_key, () => parse_editor_json(null), parse_editor_json, true);
	}

	destroy(): void {
		this.collapsed_layers.clear();
	}

	// TODO refactor (with demos too)
	// TODO need to separate fixed and framerate-based updaters
	update = (dt: number): void => {
		this.project.scene.update(dt);
	};

	play_level = (): void => {
		if (this.playing) {
			console.error('[editor.play_level] already playing');
			return;
		}
		this.playing = true;
	};

	stop_playing_level = (): void => {
		if (!this.playing) {
			console.error('[editor.stop_playing_level] not playing');
			return;
		}
		this.playing = false;
	};

	// TODO what if this was a set that efficiently updated?
	// TODO move/refactor to `Scene`?
	players: Array<Unit> | undefined = $derived(
		this.project.scene.filter_units_by_behavior('Player_Controller_Behavior'),
	);

	player_input_enabled = $state(true); // TODO @many hack to disable player input for some demos

	toggle_playing = (): void => {
		if (this.playing) {
			this.stop_playing_level();
		} else {
			this.play_level();
		}
	};

	create_project = (partial?: Project_Json, select = true): void => {
		if (partial?.id && this.projects.some((p) => p.id === partial.id)) {
			throw Error('project id already exists');
		}
		const project_json = parse_project_json(partial);
		this.projects.push(project_json);
		if (select) this.select_project(this.project.id);
	};

	select_project = (project_id: Project_Id): void => {
		this.selected_project_id = project_id;
		const project_json = this.projects.find((p) => p.id === project_id);
		if (project_json) this.project.set_json(project_json);
	};

	delete_project = (project_id: Project_Id): void => {
		// TODO ?
		// if (this.project.id === project_id) {
		// }

		const index = this.projects.findIndex((p) => p.id === project_id);
		if (index === -1) {
			console.error(
				'[editor.delete_project] cannot find project to delete in editor.projects',
				project_id,
			);
		} else {
			this.projects.splice(index, 1);
		}
		if (this.projects.length === 0) {
			this.create_project();
		}
		if (this.selected_project_id === project_id) {
			const closest_index = Math.min(index, this.projects.length - 1);
			this.selected_project_id = this.projects[closest_index].id;
		}
	};
}
