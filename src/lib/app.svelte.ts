import {create_context} from '@ryanatkn/fuz/context_helpers.js';

import {load_from_storage, set_in_storage} from '$lib/storage.js';
import type {Renderer} from '$lib/renderer.svelte.js';
import {Clock} from '$lib/clock.svelte.js';
import {Collisions} from '$lib/collisions.js';
import {Simulation} from '$lib/simulation.svelte.js';
import {Controller} from '$lib/controller.svelte.js';
import type {Thunked} from '$lib/helpers.js';
import type {Serializable} from '$lib/serializable.js';
import type {Editor} from '$lib/editor.svelte.js';
import {default_projects_json, Projects, type Projects_Json} from '$lib/projects.svelte.js';

// TODO maybe a `@batched` or `@action` decorator instead of manual `batch`?

// TODO refactor all storage calls, and rethink in signals instead of all top-level orchestration (that's less reusable)

export const app_context = create_context<App>();

export interface App_Json {
	projects: Projects_Json;
	show_main_menu: boolean;
}

// TODO @many what pattern for defaults? sometimes the data is interrelated, making per-property defaults less useful
export const default_app_json: Thunked<App_Json> = {
	projects: () => default_projects_json,
	show_main_menu: () => false,
};

export const parse_app_json = (v: any): App_Json => {
	console.log(`[parse_app_json]`, v);
	return {
		projects: v?.projects ?? default_app_json.projects(),
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

	projects = new Projects();

	project = $derived(this.projects.current);

	editor: Editor | null = $state(null); // TODO BLOCK create/destroy on demand

	show_main_menu: boolean = $state(false);

	json: App_Json = $derived($state.snapshot(this));

	constructor(options: App_Options) {
		console.log(`[app] new with options`, options);
		const {
			renderer,
			clock = new Clock(),
			simulation = new Simulation(new Collisions()),
			controller = new Controller(),
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
			show_main_menu: this.show_main_menu,
		};
	}

	set_json(value: App_Json): void {
		console.log(`[app] set_json`, value);
		this.projects.set_json(value.projects);
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
