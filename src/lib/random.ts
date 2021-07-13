import {browser} from '$app/env';

// TODO upstream to felt -- implements deterministic random numbers for SSR

export interface To_Random_Number {
	(): number;
}
export interface To_To_Random_Number {
	(i?: number): To_Random_Number;
}

export const VARY_RANDOM = 0.42;

export const to_random_float: To_Random_Number = () => Math.random();
// TODO get a good small seeded implementation or something
export const to_to_deterministic_random_float: To_To_Random_Number =
	(i = 0) =>
	() =>
		VARY_RANDOM + i++ / 10000000000;

export const random_float: To_Random_Number = browser
	? to_random_float
	: to_to_deterministic_random_float();

// mutates `array` - clone first for immutability
export const shuffle: <T>(array: T[], random?: To_Random_Number) => T[] = (
	array,
	random = random_float,
) => {
	const len = array.length;
	const max = len - 1;
	for (let i = 0; i < len; i++) {
		const dest_index = random_int(0, max, random);
		if (i === dest_index) continue;
		const destItem = array[dest_index];
		array[dest_index] = array[i];
		array[i] = destItem;
	}
	return array;
};

export const random_bool: (random?: To_Random_Number) => boolean = (random = random_float) =>
	random() > 0.5;

export const random_int: (min: number, max: number, random?: To_Random_Number) => number = (
	min,
	max,
	random = random_float,
) => Math.floor(random() * (max - min + 1)) + min;

export const random_item: <T>(arr: T[], random?: To_Random_Number) => T = (
	arr,
	random = random_float,
) => arr[random_int(0, arr.length - 1, random)];

// TODO might need another version that doesn't use a `Set` -- `random_items_with_duplicates`
export const random_items = <T>(items: T[], count: number, random = random_item) => {
	if (count >= items.length) return items;
	const results = new Set<T>();
	while (results.size < count) {
		results.add(random(items));
	}
	return Array.from(results);
};
