import type {Flavored} from '@ryanatkn/belt/types.js';

import type {Unit_Json, Unit_Id} from '$lib/unit.svelte.js';
import type {Id} from '$lib/id.js';
import type {Scene_Id} from '$lib/scene.svelte.js';

// TODO @many implement actions/mutations

export type Action_Id = Id | Flavored<number, 'Action_Id'>;

export interface Base_Action {
	kind: string;
	action_id: Action_Id;
}

export type Action = update_unit_action | play_level_action | stop_playing_level_action;

export interface update_unit_action extends Base_Action {
	kind: 'update_unit';
	unit: Unit_Id;
	value: Partial<Unit_Json>;
}

export interface play_level_action extends Base_Action {
	kind: 'play_level';
	level_id: Scene_Id;
}

export interface stop_playing_level_action extends Base_Action {
	kind: 'stop_playing_level';
}

export interface create_unit_action extends Base_Action {
	kind: 'create_unit';
	unit: Unit_Id;
}

// TODO or just use create_unit?
export interface duplicate_unit_action extends Base_Action {
	kind: 'duplicate_unit';
	unit: Unit_Id;
}

export const actions = {};

// TODO mutations to handle actions
// TODO action history
// TODO undo/redo stack
// TODO action serialization - classes or pojos?
// TODO action replay
// TODO action batching
