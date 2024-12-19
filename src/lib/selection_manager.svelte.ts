import {Unreachable_Error} from '@ryanatkn/belt/error.js';

export interface Selection_Helpers<T> {
	find_top_item: (x: number, y: number) => T | null;
	find_all_items: (x: number, y: number, width: number, height: number) => Array<T>;
}

export type Selection_Mode = 'normal' | 'additive' | 'subtractive';

export interface Selection_State {
	selecting: boolean;
	selection_start_x: number;
	selection_start_y: number;
	selection_width: number;
	selection_height: number;
	initial_pointer_x: number;
	initial_pointer_y: number;
}

export const create_selection_state = (): Selection_State => ({
	selecting: false,
	selection_start_x: 0,
	selection_start_y: 0,
	selection_width: 0,
	selection_height: 0,
	initial_pointer_x: 0,
	initial_pointer_y: 0,
});

// TODO @many refactor surface/selection state
export class Selection_Manager<T> {
	selection_threshold = 0; // TODO maybe a better UX is a value of 2 to 4?

	// shared selection state that can be accessed by parent components
	state: Selection_State = $state(create_selection_state());

	// internal state used by the selection logic
	#selected: Set<T> = $state(new Set());
	#initial_selection: Set<T> = $state(new Set());

	constructor(private readonly helpers: Selection_Helpers<T>) {}

	has(item: T): boolean {
		return this.#selected.has(item);
	}

	add(item: T): void {
		this.#selected.add(item);
	}

	delete(item: T): void {
		this.#selected.delete(item);
	}

	clear(): void {
		this.#selected.clear();
	}

	get_selected_items(): Array<T> {
		return Array.from(this.#selected);
	}

	handle_selection_start(x: number, y: number, mode: Selection_Mode): void {
		const item = this.helpers.find_top_item(x, y);
		const is_selected = item && this.has(item);

		this.state.initial_pointer_x = x;
		this.state.initial_pointer_y = y;
		this.#initial_selection = new Set(this.#selected);

		if (mode === 'subtractive' && is_selected) {
			this.delete(item);
			return;
		}

		if (item && mode !== 'subtractive') {
			if (mode === 'normal') {
				this.clear();
			}
			this.add(item);
		} else if (mode === 'normal') {
			this.clear();
		}
	}

	start_drag(x: number, y: number): void {
		this.state.selecting = true;
		this.state.selection_start_x = x;
		this.state.selection_start_y = y;
		this.state.selection_width = 0;
		this.state.selection_height = 0;
	}

	update_drag(x: number, y: number, mode: Selection_Mode): void {
		if (!this.state.selecting) return;

		// Update selection rect
		this.state.selection_width = x - this.state.selection_start_x;
		this.state.selection_height = y - this.state.selection_start_y;

		// Get the normalized selection bounds
		const sel_x = this.state.selection_width >= 0 ? this.state.selection_start_x : x;
		const sel_y = this.state.selection_height >= 0 ? this.state.selection_start_y : y;
		const sel_w = Math.abs(this.state.selection_width);
		const sel_h = Math.abs(this.state.selection_height);

		// Calculate which items are in the selection rect
		const items_in_selection = this.helpers.find_all_items(sel_x, sel_y, sel_w, sel_h);

		// Update the selection based on mode
		switch (mode) {
			case 'additive':
				// Add new items while keeping initial selection
				this.#selected = new Set(this.#initial_selection);
				for (const item of items_in_selection) {
					this.add(item);
				}
				break;
			case 'subtractive':
				// Remove items from initial selection
				this.#selected = new Set(this.#initial_selection);
				for (const item of items_in_selection) {
					this.delete(item);
				}
				break;
			case 'normal':
				// Replace with new selection
				this.clear();
				for (const item of items_in_selection) {
					this.add(item);
				}
				break;
			default:
				throw new Unreachable_Error(mode);
		}
	}

	end_drag(x: number, y: number, mode: Selection_Mode): void {
		const dx = x - this.state.initial_pointer_x;
		const dy = y - this.state.initial_pointer_y;
		const moved = Math.sqrt(dx * dx + dy * dy) > this.selection_threshold;

		if (this.state.selecting && moved) {
			this.update_drag(x, y, mode);
		}

		this.state.selecting = false;
		this.state.selection_width = 0;
		this.state.selection_height = 0;
		this.#initial_selection.clear();
	}
}
