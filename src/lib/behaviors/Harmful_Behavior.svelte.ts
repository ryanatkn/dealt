import {Behavior, type Behavior_Json} from '$lib/behavior.svelte.js';
import type {Behavior_Name} from '$lib/behaviors.js';

// TODO @many should behaviors remain singletons or should they be more composable?

// TODO @many maybe the properties specify the kind of harms?

export interface Harmful_Behavior_Json {
	name: Behavior_Name;
}

export class Harmful_Behavior extends Behavior<Harmful_Behavior_Json> {
	name = 'Harmful_Behavior' as const;

	override toJSON(): Harmful_Behavior_Json & Behavior_Json {
		return {
			name: this.name,
		};
	}
}
