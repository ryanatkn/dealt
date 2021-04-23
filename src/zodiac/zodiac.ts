import {randomFloat} from '$lib/random';

export const randomZodiac: () => number = () => randomInt(0, 11);

// TODO copypasta from tarot/tarot.js
export const randomInt = (min: number, max: number): number =>
	Math.floor(randomFloat() * (max - min + 1)) + min;
