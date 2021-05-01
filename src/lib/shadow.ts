import {getContext, setContext} from 'svelte';

import {randomFloat} from '$lib/random';

export const toRandomShadow = (): boolean => randomFloat() > 0.5;

const SHADOW_KEY = {};
export const provideShadow = (initial = toRandomShadow()): void => {
	setContext(SHADOW_KEY, initial);
};
export const useShadow = (): boolean => getContext(SHADOW_KEY);

// TODO hmm
const SHADOW2_KEY = {};
export const provideShadow2 = (initial = toRandomShadow()): void => {
	setContext(SHADOW2_KEY, initial);
};
export const useShadow2 = (): boolean => getContext(SHADOW2_KEY);
