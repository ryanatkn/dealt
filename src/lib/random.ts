import {browser} from '$app/env';

export const VARY_RANDOM = 0.42;

// TODO copypasta from `corpus-activity-streams` then refactored
// TODO import random utils from `felt` using `uid` probably
export const toRandomFloat: ToRandomFloat = () => Math.random();
export interface ToRandomFloat {
	(): number;
}
export interface ToToRandomFloat {
	(i?: number): ToRandomFloat;
}
// TODO get a good small seeded implementation or something
export const toToDeterministicRandomFloat: ToToRandomFloat = (i = 0) => () =>
	VARY_RANDOM + i++ / 10000000000;

export const randomFloat: ToRandomFloat = browser ? toRandomFloat : toToDeterministicRandomFloat();

export const identity: <T>(t: T) => T = (t) => t;

// TODO upstream to `felt`
// mutates `array` - clone first for immutability
export const shuffle: <T>(array: T[], random?: ToRandomFloat) => T[] = (
	array,
	random = randomFloat,
) => {
	const len = array.length;
	const max = len - 1;
	for (let i = 0; i < len; i++) {
		const destIndex = randomInt(0, max, random);
		if (i === destIndex) continue;
		const destItem = array[destIndex];
		array[destIndex] = array[i];
		array[i] = destItem;
	}
	return array;
};

// TODO replace from gro
export const randomInt: (min: number, max: number, random?: ToRandomFloat) => number = (
	min,
	max,
	random = randomFloat,
) => Math.floor(random() * (max - min + 1)) + min;

export const randomItem: <T>(arr: T[], random?: ToRandomFloat) => T | undefined = (
	arr,
	random = randomFloat,
) => arr[randomInt(0, arr.length - 1, random)];
