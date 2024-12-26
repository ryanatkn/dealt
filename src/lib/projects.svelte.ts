import {
	parse_project_json,
	type Project,
	type Project_Id,
	type Project_Json,
	type Project_Metadata,
	type Project_Metadata_Json,
} from '$lib/project.svelte.js';

export interface Projects_Json {
	all: Array<Project_Metadata_Json>;
	current_id: Project_Id;
}

export interface Projects_Options {
	//
}

export const default_project_jsons = [parse_project_json(null)];

export const default_projects_json = {
	all: default_project_jsons,
	current_id: default_project_jsons[0].id,
};

export const parse_projects_json = (v: any): Projects_Json => {
	console.log(`[parse_app_json]`, v);
	const all =
		v?.all === undefined
			? default_projects_json.all
			: (v.all as Array<Project_Metadata_Json>).map(parse_project_json); // TODO would be more robust with schemas
	return {
		all,
		current_id:
			v?.current_id === undefined || !all.some((p) => p.id === v.current_id)
				? all[0].id
				: v.current_id,
	};
};

export class Projects {
	all: Array<Project_Metadata> = [];

	current: Project = $state();

	toJSON(): Projects_Json {
		return {
			all: $state.snapshot(this.all),
			current_id: this.current.id,
		};
	}

	set_json(value: Projects_Json): void {
		// TODO is this correct? how about pattern with project.scene?
		const current_json = this.all.find((p) => p.id === value.current_id);
		if (current_json) this.current.set_json(current_json);
	}

	// TODO move project methods to the app? maybe make a `Project_Manager` or `Projects` class?
	create_project = (partial?: Project_Json, select = true): void => {
		if (partial?.id && this.all.some((p) => p.id === partial.id)) {
			throw Error('project id already exists');
		}
		const project_json = parse_project_json(partial);
		this.all.push(project_json);
		if (select) this.select_project(this.current.id);
	};

	select_project = (project_id: Project_Id): void => {
		this.current_id = project_id;
		const project_json = this.all.find((p) => p.id === project_id);
		if (project_json) this.current.set_json(project_json);
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
		if (this.current_id === project_id) {
			const closest_index = Math.min(index, this.all.length - 1);
			this.current_id = this.all[closest_index].id;
		}
	};
}
