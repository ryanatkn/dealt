import {create_context} from '@ryanatkn/fuz/context_helpers.js';

import {load_from_storage, set_in_storage} from '$lib/storage.js';
import type {Renderer} from '$lib/renderer.svelte.js';
import {Clock} from '$lib/clock.svelte.js';
import {Collisions} from '$lib/collisions.js';
import {Simulation} from '$lib/simulation.svelte.js';
import {Controller} from '$lib/controller.svelte.js';
import type {Thunked} from '$lib/helpers.js';
import type {Serializable} from '$lib/serializable.js';
import {
	parse_project_json,
	Project,
	type Project_Id,
	type Project_Json,
} from '$lib/project.svelte.js';

// TODO maybe a `@batched` or `@action` decorator instead of manual `batch`?

// TODO refactor all storage calls, and rethink in signals instead of all top-level orchestration (that's less reusable)

export const app_context = create_context<App>();

export interface App_Json {
	projects: Array<Project_Json>;
	selected_project_id: Project_Id;
	show_main_menu: boolean;
}

const default_project_jsons = [parse_project_json(null)];

export const default_app_json: Thunked<App_Json> = {
	projects: () => default_project_jsons,
	selected_project_id: () => default_project_jsons[0].id, // TODO what if the param was a partial?
	show_main_menu: () => false,
};

const parse_app_json = (v: any): App_Json => {
	console.log(`[parse_app_json]`, v);
	const projects =
		v?.projects === undefined ? default_app_json.projects() : v.projects.map(parse_project_json); // TODO better typesafety for callers
	return {
		projects,
		selected_project_id:
			v?.selected_project_id === undefined ? projects[0].id : v.selected_project_id,
		show_main_menu:
			typeof v?.show_main_menu === 'boolean' ? v.show_main_menu : default_app_json.show_main_menu(),
	};
};

const STORAGE_KEY = 'app';

export interface App_Options {
	renderer: Renderer;
	clock?: Clock;
	collisions?: Collisions;
	simulation?: Simulation;
	controller?: Controller;
	app_json?: App_Json;
}

// TODO maybe `extends Serializable<App_Json>`?
export class App implements Serializable<App_Json> {
	// TODO wheres the source of truth?
	// currently manually syncing the same changes to both `app_json` `projects` --
	// mixing serialization concerns with runtime representations

	readonly clock: Clock;
	readonly renderer: Renderer;
	readonly simulation: Simulation;
	readonly collisions: Collisions;
	readonly controller: Controller;

	// TODO maybe a map?
	projects: Array<Project_Json> = $state()!;
	// TODO BLOCK maybe `projects` as a class and derive `project` from `this.projects.current`

	// TODO `selected_` prefix for these?
	selected_project_id: Project_Id = $state()!;
	readonly project!: Project;

	show_main_menu: boolean = $state(false);

	json: App_Json = $derived($state.snapshot(this));

	constructor(options: App_Options) {
		console.log(`[app] new with options`, options);
		const {
			renderer,
			clock = new Clock(),
			simulation = new Simulation(new Collisions()),
			controller = new Controller(),
			project = new Project({app}),
			app_json = App.load(),
		}: App_Options = options;

		this.renderer = renderer;
		this.clock = clock;
		this.collisions = simulation.collisions;
		this.simulation = simulation;
		this.controller = controller;

		console.log(`[app] app_json`, app_json);
		this.set_json(app_json);
	}

	// returns a stable reference to data that's immutable by convention
	// TODO @many omit defaults - option? separate method?
	toJSON(): App_Json {
		return {
			projects: $state.snapshot(this.projects),
			selected_project_id: this.selected_project_id,
			show_main_menu: this.show_main_menu,
		};
	}

	set_json(value: App_Json): void {
		console.log(`[app] set_json`, value);
		this.selected_project_id = value.selected_project_id;
		this.projects = value.projects;
		// TODO is this correct? how about pattern with project.scene?
		const project_json = this.projects.find((p) => p.id === value.selected_project_id);
		if (project_json) this.project.set_json(project_json);
		this.show_main_menu = value.show_main_menu;
	}

	// TODO storage should be an external conern, maybe use hooks or deriveds?
	save(data: App_Json = this.json): void {
		console.log('[app] save');
		set_in_storage(STORAGE_KEY, data);
	}

	static load(storage_key = STORAGE_KEY): App_Json {
		console.log(`[app] loading app`);
		return load_from_storage(storage_key, () => parse_app_json(null), parse_app_json, true);
	}

	toggle_main_menu = (): void => {
		if (this.show_main_menu) {
			this.close_main_menu();
		} else {
			this.open_main_menu();
		}
	};

	open_main_menu = (): void => {
		this.show_main_menu = true;
	};

	close_main_menu = (): void => {
		this.show_main_menu = false;
	};
}
