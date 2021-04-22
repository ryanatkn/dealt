import {getContext, setContext} from 'svelte';

const shadowKey = {};

export const provideShadow = (initial: boolean) => {
	setContext(shadowKey, initial);
};

export const useShadow = (): boolean => {
	return getContext(shadowKey);
};
