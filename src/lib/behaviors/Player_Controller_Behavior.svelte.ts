import {Behavior, type Behavior_Json} from '$lib/behavior.svelte.js';
import type {Behavior_Name} from '$lib/behaviors.js';

// TODO @many should behaviors remain singletons or should they be more composable?

export interface Player_Controller_Behavior_Json extends Behavior_Json {
	name: Behavior_Name;
}

export class Player_Controller_Behavior extends Behavior<Player_Controller_Behavior_Json> {
	name = 'Player_Controller_Behavior' as const;

	override toJSON(): Player_Controller_Behavior_Json {
		return {name: this.name};
	}

	override set_json(_json: Player_Controller_Behavior_Json): void {
		// TODO
	}
}
