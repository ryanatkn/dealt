import {Player_Controller_Behavior} from '$lib/behaviors/Player_Controller_Behavior.svelte.js';
import {Harmful_Behavior} from '$lib/behaviors/Harmful_Behavior.svelte.js';
import {Goal_Behavior} from '$lib/behaviors/Goal_Behavior.svelte.js';
import type {Behavior, Behavior_Json} from '$lib/behavior.svelte.js';

// TODO these are hardcoded, is that fine? any refactoring needed?
export type Behavior_Name = 'Player_Controller_Behavior' | 'Harmful_Behavior' | 'Goal_Behavior';

export type Behavior_Constructor = new () => Behavior<Behavior_Json>;

export const behavior_class_by_name: Record<Behavior_Name, Behavior_Constructor> = {
	Player_Controller_Behavior,
	Harmful_Behavior,
	Goal_Behavior,
};
