// TODO delete or upstream to belt, wrote this to use with `to_compact_json` for efficient storage
export const omit_values = <T>(a: T, b: Partial<T>): Partial<T> => {
	var key: keyof typeof a,
		result: Partial<T> = {};
	for (key in a) {
		if (a[key] !== b[key]) {
			result[key] = a[key];
		}
	}
	return result;
};

export type Thunked<T extends Record<string, any>> = {
	[K in keyof T]: () => T[K];
};

// TODO delete or upstream
export const filter_or_undefined = <T>(
	items: Array<T>,
	filter: (item: T, index: number, items: Array<T>) => boolean,
): Array<T> | undefined => {
	var item, i, result: Array<T> | undefined;
	for (i = 0; i < items.length; i++) {
		item = items[i];
		if (filter(item, i, items)) {
			(result ??= []).push(item);
		}
	}
	return result;
};

export const reorder_list = (fragments: Array<any>, from_index: number, to_index: number): void => {
	if (from_index === to_index) return;
	if (
		from_index < 0 ||
		to_index < 0 ||
		from_index >= fragments.length ||
		to_index >= fragments.length
	) {
		throw Error('index out of bounds');
	}
	const [moved] = fragments.splice(from_index, 1);
	fragments.splice(to_index, 0, moved);
};
