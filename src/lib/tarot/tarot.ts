import {random_int} from '$lib/util/random';

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

export const TAROT_COUNT = 78;

// TODO extract to felt as `range`
export const card_indices: number[] = Array.from({length: TAROT_COUNT}, (_, i) => i);

export const random_card_index = () => random_int(0, TAROT_COUNT - 1);

// TODO replace this with generated metadata
export const TAROT_CARD_MIN_WIDTH = 234;
export const TAROT_CARD_MIN_HEIGHT = 350;
