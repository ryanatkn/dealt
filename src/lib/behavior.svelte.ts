import type {Serializable} from '$lib/serializable.js';
import type {Behavior_Name} from '$lib/behaviors.js';

export interface Behavior_Json {
	name: Behavior_Name;
}

// TODO do behaviors need ids?
export abstract class Behavior<T extends Behavior_Json = any> implements Serializable<T> {
	abstract name: Behavior_Name;

	abstract toJSON(): T;
}
