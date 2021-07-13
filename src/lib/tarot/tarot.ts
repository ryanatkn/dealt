import {random_int} from '$lib/random.js';

export type Tarot_Suit = 'major' | 'wands' | 'cups' | 'swords' | 'coins';

export interface Tarot_Card {
	id: number;
	name: string;
	rank: number;
	suit: Tarot_Suit;
	keywords: string[];
	meanings: {
		light: string[];
		shadow: string[];
	};
}

const TAROT_COUNT = 78;

export const random_card_index = () => random_int(0, TAROT_COUNT - 1);

// TODO replace this with generated metadata
export const TAROT_CARD_MIN_WIDTH = 234;
export const TAROT_CARD_MIN_HEIGHT = 350;
