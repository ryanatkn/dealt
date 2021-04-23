import {browser} from '$app/env';

export const VARY_RANDOM = 0.2;

// TODO copypasta from `corpus-activity-streams` then refactored
// TODO import random utils from `felt` using `uid` probably
export const toRandom: ToRandom = () => Math.random();
export interface ToRandom {
	(): number;
}
export interface ToToRandom {
	(i?: number): ToRandom;
}
export const toToDeterministicRandom: ToToRandom = (i = 0) => () => VARY_RANDOM + i++ / 10000000000;

export const random: ToRandom = browser ? toRandom : toToDeterministicRandom();
