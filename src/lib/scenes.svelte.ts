import {
	get_next_scene_name,
	parse_scene_json,
	Scene,
	Scene_Metadata,
	type Scene_Id,
	type Scene_Json,
	type Scene_Metadata_Json,
} from '$lib/scene.svelte.js';
import type {App} from '$lib/app.svelte.js';
import {create_scene_empty} from '$lib/scenes.js';

export interface Scenes_Json {
	all: Array<Scene_Metadata_Json>;
	current_id: Scene_Id;
}

export interface Scenes_Options {
	app: App;
	scenes_json?: Scenes_Json;
}

// const scenes = value.scenes.length ? value.scenes : [create_scene_empty()];
export const default_scene_jsons = [parse_scene_json(null)];

export const default_scenes_json = {
	all: default_scene_jsons,
	current_id: default_scene_jsons[0].id,
};

export const parse_scenes_json = (v: any): Scenes_Json => {
	console.log(`[parse_app_json]`, v);
	const all = !v?.all
		? default_scenes_json.all
		: (v.all as Array<Scene_Metadata_Json>).map(parse_scene_json); // TODO would be more robust with schemas
	return {
		all,
		current_id:
			!v?.current_id || !all.some((p) => p.id === v.current_id) ? all[0].id : v.current_id,
	};
};

export class Scenes {
	readonly app: App;

	all!: Array<Scene_Metadata>;

	current: Scene = $state()!;

	json: Scenes_Json = $derived($state.snapshot(this));
	serialized: string | undefined | Error = $state();

	json_initial: Scenes_Json; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects

	constructor(options: Scenes_Options) {
		const {app, scenes_json} = options;

		this.app = app;

		const parsed_json = parse_scenes_json(scenes_json);
		this.json_initial = parsed_json;
		this.set_json(parsed_json);
	}

	toJSON(): Scenes_Json {
		return {all: $state.snapshot(this.all), current_id: this.current.id};
	}

	set_json(value: Scenes_Json): void {
		// TODO is this correct? how about pattern with scene.scene?
		const {all, current_id} = value;

		const current_scene_metadata = all.find((p) => p.id === current_id);

		this.all = all.map((p) => new Scene_Metadata({scene_metadata_json: p}));

		// TODO @many hacky check for `this.current`, goal is to always have a `scene` instance without being wasteful
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.current?.id === current_id) {
			// TODO @many maybe a `set_json` and `set_json_partial`? or always take a partial?
			this.current.set_json(parse_scene_json(current_scene_metadata));
		} else {
			this.select_scene(current_id);
		}
	}

	destroy(): void {
		this.all.length = 0;
		this.current.destroy();
	}

	select_scene(scene_id: Scene_Id): void {
		// TODO @many hacky check for `this.current`, goal is to always have a `scene` instance without being wasteful
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.current?.id === scene_id) {
			throw Error(`Scene id ${scene_id} is already selected`);
		}
		const scene_metadata = this.all.find((p) => p.id === scene_id);
		if (!scene_metadata) {
			throw Error(`Unable to find scene with id ${scene_id}, if this was intended create it first`);
		}
		// TODO @many hacky check for `this.current`, goal is to always have a `scene` instance without being wasteful
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.current) {
			this.current.destroy();
		}
		const scene_json = Scene.load(scene_id);
		this.current = new Scene({app: this.app, scene_json});
	}

	delete_scene(scene_id: Scene_Id): void {
		const index = this.all.findIndex((p) => p.id === scene_id);
		console.log(`index`, this.all, index);
		if (index === -1) {
			console.error(
				'[project.delete_scene] cannot find scene to delete in project.scenes',
				scene_id,
			);
		} else {
			const scene_metadata = this.all[index];
			if (scene_metadata.id === this.current.id) {
				this.current.destroy();
			}
			this.all.splice(index, 1);
		}
		if (this.all.length === 0) {
			this.create_scene(create_scene_empty());
		}
		console.log(`[delete_scene] scene_id`, scene_id);
		console.log(`[delete_scene] this.current`, this.current);
		if (this.current.id === scene_id) {
			const closest_index = Math.min(index, this.all.length - 1);
			this.select_scene(this.all[closest_index].id);
		}
	}

	create_scene(partial: Partial<Scene_Json>): void {
		const scene_json = parse_scene_json($state.snapshot(partial));
		scene_json.name = get_next_scene_name(this.all, scene_json);
		const scene = new Scene({app: this.app, scene_json});
		scene.save(); // TODO @many is this best? change APIs?
		this.all.push(scene);
		this.select_scene(scene.id); // TODO @many hacky
		scene.load(); // TODO @many is this best? change APIs?
	}

	duplicate_scene(source: Scene): void {
		const scene = source.clone({name: get_next_scene_name(this.all, source.json)});
		scene.save(); // TODO @many is this best? change APIs?
		this.all.push(scene);
		console.log(`[project] duplicate_scene`, scene);
		this.select_scene(scene.id); // TODO @many hacky
		scene.load(); // TODO @many is this best? change APIs?
	}
}
