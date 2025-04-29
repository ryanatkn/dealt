import {create_context} from '@ryanatkn/fuz/context_helpers.js';

import type {Project} from '$lib/project.svelte.js';
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
	show_scene_menu: boolean;
	editing: boolean;
	playing: boolean;
}

// experimenting with patterns for default values
export const default_editor_json: Thunked<Editor_Json> = {
	show_scene_menu: () => false,
	editing: () => true,
	playing: () => false,
};

export const parse_editor_json = (v: any): Editor_Json => {
	console.log(`[parse_editor_json]`, v);
	return {
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

	readonly app: App; // TODO add project/scene to avoid pointer depth? problem is $derived uses before initialized, maybe just assert with !
	readonly clock: Clock;
	readonly renderer: Renderer;
	readonly collisions: Collisions;
	readonly simulation: Simulation;
	readonly controller: Controller;

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

	unwatch_clock: (() => void) | undefined;

	#playing: boolean = $state()!;
	get playing(): boolean {
		return this.#playing;
	}
	set playing(value: boolean) {
		this.#playing = value;
		if (this.#playing) {
			// TODO move/refactor?
			if (!this.app.projects.current.scenes.current.players?.length) {
				if (this.app.projects.current.scenes.current.units.length) {
					// TODO start by refactoring to a `player`/`controller` flag/config instead of `name`
					const unit = this.app.projects.current.scenes.current.units[0];
					unit.name = 'player';
					unit.add_behavior(new Player_Controller_Behavior());
				}
			}

			// TODO @many hacky but seems to be the right UX
			if (!this.unwatch_clock) {
				this.unwatch_clock = this.app.projects.current.scenes.current.clock.watch(this.update);
			}
			this.app.projects.current.scenes.current.clock.start();
		} else {
			// TODO @many hacky but seems to be the right UX
			if (this.unwatch_clock) {
				this.unwatch_clock();
				this.unwatch_clock = undefined;
			}
			this.app.projects.current.scenes.current.clock.stop();
		}
	}

	json: Editor_Json = $derived($state.snapshot(this));

	constructor(options: Editor_Options) {
		console.log(`[editor] new with options`, options);
		const {app, editor_json = Editor.load()}: Editor_Options = options;

		this.app = app;
		this.clock = app.clock;
		this.renderer = app.renderer;
		this.collisions = app.collisions;
		this.simulation = app.simulation;
		this.controller = app.controller;

		console.log(`[editor] editor_json`, editor_json);
		this.set_json(editor_json);
	}

	// returns a stable reference to data that's immutable by convention
	// TODO @many omit defaults - option? separate method?
	toJSON(): Editor_Json {
		return {show_scene_menu: this.show_scene_menu, editing: this.editing, playing: this.playing};
	}

	set_json(value: Editor_Json): void {
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
		this.app.projects.current.scenes.current.update(dt);
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

	player_input_enabled = $state(true); // TODO @many hack to disable player input for some demos

	toggle_playing = (): void => {
		if (this.playing) {
			this.stop_playing_level();
		} else {
			this.play_level();
		}
	};
}
