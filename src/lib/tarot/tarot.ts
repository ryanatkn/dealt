import {randomItem} from '@feltcoop/gro/dist/utils/random.js';

export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'coins';

export interface TarotCard {
	id: number;
	name: string;
	rank: number;
	suit: TarotSuit;
	fortunes: string[];
	keywords: string[];
	meanings: {
		light: string[];
		shadow: string[];
	};
}

export const drawCards = (cards: TarotCard[], count: number): TarotCard[] => {
	if (count >= cards.length) return cards;
	const drawn = new Set<TarotCard>();
	while (drawn.size < count) {
		drawn.add(randomItem(cards)!);
	}
	return Array.from(drawn);
};
