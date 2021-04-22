export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'coins';

export interface TarotCard {
	id: number;
	name: string;
	rank: number;
	suit: TarotSuit;
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

const TAROT_COUNT = 78;

export const randomCardIndex = () => randomInt(0, TAROT_COUNT - 1);
// TODO import these from Gro - problem with Vite importing the undeclared exports
export const randomInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;
export const randomItem = <T>(arr: T[]): T | undefined => arr[randomInt(0, arr.length - 1)];
export const last = <T>(array: T[]): T | undefined => array[array.length - 1];
