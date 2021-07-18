import {getContext, setContext} from 'svelte';

import {random_float} from '$lib/util/random';

export const to_random_shadow = (): boolean => random_float() > 0.5;

const SHADOW_KEY = {};
export const set_shadow = (initial = to_random_shadow()): void => {
	setContext(SHADOW_KEY, initial);
};
export const get_shadow = (): boolean => getContext(SHADOW_KEY);

// TODO hmm
const SHADOW2_KEY = {};
export const set_shadow2 = (initial = to_random_shadow()): void => {
	setContext(SHADOW2_KEY, initial);
};
export const get_shadow2 = (): boolean => getContext(SHADOW2_KEY);
