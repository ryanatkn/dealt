import type {Serializable} from '$lib/serializable.js';
import type {Project} from './project.svelte.js';

// TODO implement - need to clarify relationship with `Project` and `Editor`

export interface Game_Options {
	project: Project;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Game_Json {
	// TODO should it reference projects and scenes by id?
}

export class Game implements Serializable<Game_Json> {
	readonly project: Project;

	constructor(options: Game_Options) {
		this.project = options.project;
	}

	toJSON(): Game_Json {
		return {
			// TODO
		};
	}

	// set_json(json: Game_Json): void {
	// 	// TODO
	// }
}
