import {getContext, setContext} from 'svelte';

import {random} from '$lib/random';

const shadowKey = {};

export const provideShadow = (initial = toRandomShadow()): void => {
	setContext(shadowKey, initial);
};

export const useShadow = (): boolean => {
	return getContext(shadowKey);
};

export const toRandomShadow = (): boolean => random() > 0.5;
