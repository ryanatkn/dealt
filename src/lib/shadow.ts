import {getContext, setContext} from 'svelte';
import {browser} from '$app/env';

const shadowKey = {};

export const provideShadow = (initial = randomShadow()) => {
	setContext(shadowKey, initial);
};

export const useShadow = (): boolean => {
	return getContext(shadowKey);
};

export const randomShadow = (): boolean => (browser ? Math.random() > 0.5 : false);
