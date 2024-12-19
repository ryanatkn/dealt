import {BROWSER} from 'esm-env';

// TODO upstream to belt?

/**
 * Loads `key` and falls back to `default_value`.
 * If `parse` is provided and throws, it removes the `key` and returns `undefined`.
 * @param key - The `localStorage` key.
 * @param default_value - Can be a lazily called function to avoid waste.
 * @param parse
 * @param storage - Defaults to `localStorage`.
 */
export const load_from_storage = <T>(
	key: string,
	default_value: T | (() => T),
	parse: (value: unknown) => T,
	init = false,
	storage?: typeof localStorage,
	serialize: (value: T) => string = JSON.stringify,
): T => {
	const is_fn = typeof default_value === 'function';
	if (!BROWSER) return is_fn ? (default_value as any)() : default_value;
	console.log(`load_from_storage key`, key);
	const s = storage ?? localStorage; // can't make this the default value during SSR
	try {
		const stored = s.getItem(key);
		if (stored == null) {
			const v = is_fn ? (default_value as any)() : default_value;
			if (init) set_in_storage(key, v, storage, serialize);
			return v;
		}
		return parse(JSON.parse(stored));
	} catch (_err) {
		s.removeItem(key);
		return is_fn ? (default_value as any)() : default_value;
	}
};

/**
 * Sets `value` at `key`.
 * Importantly, if `value` is `undefined` the `key` is removed,
 * but a `value` of `null` is stored.
 */
export const set_in_storage = <T>(
	key: string,
	value: T,
	storage?: typeof localStorage,
	serialize: (value: T) => string = JSON.stringify,
): string | undefined | Error => {
	if (!BROWSER) return;
	console.log(`set_in_storage`, key, value);
	const s = storage ?? localStorage; // can't make this the default value during SSR
	try {
		if (value === undefined) {
			s.removeItem(key);
			return;
		} else {
			const serialized = serialize(value);
			s.setItem(key, serialized);
			return serialized;
		}
	} catch (err) {
		return err;
	}
};
