import {random_float} from '$lib/random';

export const random_zodiac: () => number = () => random_int(0, 11);

// TODO copypasta from tarot/tarot.js
export const random_int = (min: number, max: number): number =>
	Math.floor(random_float() * (max - min + 1)) + min;
