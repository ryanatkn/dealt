import {
	parse_project_json,
	parse_project_metadata_json,
	Project,
	Project_Metadata,
	type Project_Id,
	type Project_Metadata_Json,
} from '$lib/project.svelte.js';
import type {App} from '$lib/app.svelte.js';

export interface Projects_Json {
	all: Array<Project_Metadata_Json>;
	current_id: Project_Id;
}

export interface Projects_Options {
	app: App;
	projects_json?: Projects_Json;
}

export const default_project_jsons = [parse_project_json(null)];

export const default_projects_json = {
	all: default_project_jsons,
	current_id: default_project_jsons[0].id,
};

export const parse_projects_json = (v: any): Projects_Json => {
	console.log(`[parse_app_json]`, v);
	const all = !v?.all
		? default_projects_json.all
		: (v.all as Array<Project_Metadata_Json>).map(parse_project_json); // TODO would be more robust with schemas
	return {
		all,
		current_id:
			!v?.current_id || !all.some((p) => p.id === v.current_id) ? all[0].id : v.current_id,
	};
};

export class Projects {
	readonly app: App;

	all: Array<Project_Metadata> = [];

	current: Project = $state()!;

	json: Projects_Json = $derived($state.snapshot(this));
	serialized: string | undefined | Error = $state();

	json_initial: Projects_Json; // TODO @many hacky, need to shake out the serialization/saving/initial data/resetting flows in all of the objects

	constructor(options: Projects_Options) {
		const {app, projects_json} = options;

		this.app = app;

		const parsed_json = parse_projects_json(projects_json);
		this.json_initial = parsed_json;
		this.set_json(parsed_json);
	}

	toJSON(): Projects_Json {
		return {
			all: $state.snapshot(this.all),
			current_id: this.current.id,
		};
	}

	set_json(value: Projects_Json): void {
		// TODO is this correct? how about pattern with project.scene?
		const {all, current_id} = value;

		const current_project_metadata = all.find((p) => p.id === current_id);

		this.all = all.map((p) => new Project_Metadata({project_metadata_json: p}));

		// TODO @many hacky check for `this.current`, goal is to always have a `project` instance without being wasteful
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.current?.id === current_id) {
			// TODO @many maybe a `set_json` and `set_json_partial`? or always take a partial?
			this.current.set_json(parse_project_json(current_project_metadata));
		} else {
			this.select_project(current_id);
		}
		// TODO BLOCK
		// if (project_metadata) this.current = new Project({json: project_metadata});
	}

	// TODO move project methods to the app? maybe make a `Project_Manager` or `Projects` class?
	create_project = (partial?: Project_Metadata_Json, select = true): void => {
		const id = partial?.id;
		if (id !== undefined && this.all.some((p) => p.id === id)) {
			throw Error(`Project id ${id} already exists`);
		}
		const project_metadata_json = parse_project_metadata_json(partial);
		this.all.push(new Project_Metadata({project_metadata_json}));
		if (select) this.select_project(this.current.id);
	};

	select_project = (project_id: Project_Id): void => {
		// TODO @many hacky check for `this.current`, goal is to always have a `project` instance without being wasteful
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.current?.id === project_id) {
			throw Error(`Project id ${project_id} is already selected`);
		}
		const project_metadata = this.all.find((p) => p.id === project_id);
		if (!project_metadata) {
			throw Error(
				`Unable to find project with id ${project_id}, if this was intended create it first`,
			);
		}
		// TODO @many hacky check for `this.current`, goal is to always have a `project` instance without being wasteful
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.current) {
			this.current.destroy();
		}
		const project_json = Project.load(project_id); // TODO BLOCK working pattern?
		this.current = new Project({app: this.app, project_json});
	};

	delete_project = (project_id: Project_Id): void => {
		// TODO ?
		// if (this.current.id === project_id) {
		// }

		const index = this.all.findIndex((p) => p.id === project_id);
		if (index === -1) {
			console.error(
				'[editor.delete_project] cannot find project to delete in app.projects',
				project_id,
			);
		} else {
			this.all.splice(index, 1);
		}
		if (this.all.length === 0) {
			this.create_project();
		}
		if (this.current.id === project_id) {
			const closest_index = Math.min(index, this.all.length - 1);
			this.current.id = this.all[closest_index].id;
		}
	};
}
