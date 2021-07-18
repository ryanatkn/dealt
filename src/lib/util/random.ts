import {browser} from '$app/env';

// TODO upstream to felt -- implements deterministic random numbers for SSR

interface To_Random_Float {
	(): number;
}

export const to_random_float: To_Random_Float = () => Math.random();

// TODO find a small seeded prng library, because this returns very uniform values
export const VARY_RANDOM = 0.42;
export const to_to_deterministic_random_float: (i?: number) => To_Random_Float =
	(i = 0) =>
	() =>
		VARY_RANDOM + i++ / 100000000;

export const random_float: To_Random_Float = browser
	? to_random_float
	: to_to_deterministic_random_float();

export const to_random_int: (min: number, max: number, random?: To_Random_Float) => number = (
	min,
	max,
	random = random_float,
) => Math.floor(random() * (max - min + 1)) + min;

export const to_to_deterministic_random_int: (i?: number) => (min: number, max: number) => number =
	(i = 0) =>
	(min, max) => {
		let int = min + i++;
		if (int <= max) return int;
		const diff = max - min;
		while (int > max) {
			int -= diff;
		}
		return int;
	};

interface To_Random_Int {
	(min: number, max: number): number;
}

export const random_int: To_Random_Int = browser ? to_random_int : to_to_deterministic_random_int();

export const random_item: <T>(arr: T[], random?: To_Random_Int) => T = (arr, random = random_int) =>
	arr[random(0, arr.length - 1)];

// TODO might need another version that doesn't use a `Set` -- `random_items_with_duplicates`
export const random_items = <T>(items: T[], count: number, random = random_item) => {
	if (count >= items.length) return items;
	const results = new Set<T>();
	while (results.size < count) {
		results.add(random(items));
	}
	return Array.from(results);
};

// mutates `array` - clone first for immutability
export const shuffle: <T>(array: T[], random?: To_Random_Int) => T[] = (
	array,
	random = random_int,
) => {
	const len = array.length;
	const max = len - 1;
	for (let i = 0; i < len; i++) {
		const dest_index = random(0, max);
		if (i === dest_index) continue;
		const destItem = array[dest_index];
		array[dest_index] = array[i];
		array[i] = destItem;
	}
	return array;
};

export const random_bool: (random?: To_Random_Float) => boolean = (random = random_float) =>
	random() > 0.5;
