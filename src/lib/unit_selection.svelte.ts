import {SvelteSet} from 'svelte/reactivity';
import {EMPTY_ARRAY} from '@ryanatkn/belt/array.js';

import type {Unit} from '$lib/unit.svelte.js';

// TODO maybe instead of extending the class, `selected: SvelteSet<Unit> = new SvelteSet();`
export class Unit_Selection extends SvelteSet<Unit> {
	latest: Unit | null = $state()!;

	constructor(initial_units: Array<Unit> = EMPTY_ARRAY) {
		super(initial_units);
		this.latest = initial_units[0] ?? null;
	}

	set(units: Unit | Array<Unit>): void {
		this.clear();
		if (Array.isArray(units)) {
			for (const unit of units) {
				this.add(unit);
			}
			this.latest = units[0] ?? null;
		} else {
			this.add(units);
			this.latest = units;
		}
	}

	override add(value: Unit): this {
		super.add(value);
		this.latest = value;
		return this;
	}

	override delete(value: Unit): boolean {
		const deleted = super.delete(value);
		if (deleted && this.latest === value) {
			this.latest = (this.size ? this.values().next().value : null) ?? null;
		}
		return deleted;
	}

	override clear(): void {
		super.clear();
		this.latest = null;
	}
}
