export interface Serializable<T_Data> {
	toJSON: () => T_Data;

	// set_json: (value: Partial<T_Data>) => void;

	// Optional static methods that implementations can provide
	// static create_default?(): T_Data;
	// static parse?(value: unknown): T_Data;
	// static validate?(value: T_Data): Array<string> | null; // Returns validation errors if any
}
