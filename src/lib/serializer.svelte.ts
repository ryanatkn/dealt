export interface Serializer_Options<T> {
	serialize?: (value: T) => string;
	parse?: (serialized: string) => T;
}

// TODO what if this was a thunked serializer, so `T` was a function (or optionally a function)
// and then the parents could use `derived`, could be `get_value`

export class Serializer<T> {
	value: T = $state()!;

	serialize!: (value: T) => string;

	parse: (serialized: string) => T; // TODO maybe change API to not throw

	serialized: string = $derived(this.serialize(this.value));

	constructor(value: T, options?: Serializer_Options<T>) {
		this.value = value;
		this.serialize = options?.serialize ?? ((d) => JSON.stringify(d, null, 2));
		this.parse = options?.parse ?? JSON.parse;
	}

	set_from_serialized(value: string): void {
		this.value = this.parse(value);
	}
}
