import type {Flavored} from '@ryanatkn/belt/types.js';

export type Id = Flavored<number, 'Id'>;

export const random_id = (random = Math.random): Id => {
	let v = parseInt(random().toString().substring(2), 10);
	while (!Number.isSafeInteger(v)) {
		v = Math.round(v / 2);
	}
	return v;
};
