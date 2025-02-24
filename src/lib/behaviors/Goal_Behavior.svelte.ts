import {Behavior, type Behavior_Json} from '$lib/behavior.svelte.js';
import type {Behavior_Name} from '$lib/behaviors.js';

// TODO @many should behaviors remain singletons or should they be more composable?

// TODO tradeoffs of making this a usage of a `Trigger_Behavior`? maybe it should compose a trigger behavior?

export interface Goal_Behavior_Json extends Behavior_Json {
	name: Behavior_Name;
}

export class Goal_Behavior extends Behavior<Goal_Behavior_Json> {
	name = 'Goal_Behavior' as const;

	override toJSON(): Goal_Behavior_Json {
		return {name: this.name};
	}

	override set_json(_json: Goal_Behavior_Json): void {
		// TODO
	}
}
