import {random} from '$lib/random';

export const randomZodiac: () => number = () => randomInt(0, 11);

// TODO copypasta from tarot/tarot.js
export const randomInt = (min: number, max: number): number =>
	Math.floor(random() * (max - min + 1)) + min;
