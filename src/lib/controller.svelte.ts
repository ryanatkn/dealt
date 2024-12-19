import {SvelteSet} from 'svelte/reactivity';

// TODO comment below
/*
This is semantically too specific for the `Controller`, need to rethink all of this.
Maybe a `Game_Controller` that derives a bunch of stuff from the `Controller`.
`Inputs` or `Player_Inputs`?

Things to support:

- separation between raw inputs exposed as signals, and the semantics of the inputs for the g
- dynamic mappings
- multiple controllers (for both multiplayer players and multiple inputs into one player's controller)
	- `Controllers` and `Controller` as two different classes? The former being the same as a `Controller_Manager`
		- this would keep the interface to most usage simple as a single controller instance, instead of exposing the multiplicity

*/

export class Controller {
	moving_left = $state(false);
	moving_right = $state(false);
	moving_up = $state(false);
	moving_down = $state(false);

	// TODO hack, make a system for this
	teleporting_x: number | null = null;
	teleporting_y: number | null = null;

	// TODO hack
	gamepad_moving_x = $state(0);
	gamepad_moving_y = $state(0);
	just_pressed_button_a = false;
	just_pressed_button_b = false;
	just_pressed_button_x = false;
	just_pressed_button_y = false;
	pressing_button_a = false;
	pressing_button_b = false;
	pressing_button_x = false;
	pressing_button_y = false;

	moving_x = $derived(
		this.gamepad_moving_x || (this.moving_left ? -1 : 0) + (this.moving_right ? 1 : 0),
	); // TODO @many should these be arrays/collections for multiple inputs?
	moving_y = $derived(
		this.gamepad_moving_y || (this.moving_up ? -1 : 0) + (this.moving_down ? 1 : 0),
	); // TODO @many should these be arrays/collections for multiple inputs?

	// TODO maybe change to a map of key instances by `key`	name that have a reactive `pressed` signal?
	pressing_shift = $state(false);
	pressing_ctrl = $state(false);
	pressing_alt = $state(false);

	pointer_down = false;
	// TODO isnt being used
	set_pointer_down(down: boolean): void {
		this.pointer_down = down;
	}

	moving: boolean = $derived(this.pointer_down || this.moving_x !== 0 || this.moving_y !== 0);

	pointer_screen_x: number | null = null;
	pointer_screen_y: number | null = null;
	// TODO isnt being used
	set_pointer_location(x: number | null, y: number | null): void {
		this.pointer_screen_x = x;
		this.pointer_screen_y = y;
	}

	// TODO maybe make a reactive `Svelte_Gamepad`? but we don't need that overhead in normal usage, just for the UI
	// TODO ideally this would store references to the `Gamepad` objects, but Chrome doesn't update them in place like Firefox?
	/** @see https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API */
	connected_gamepads: SvelteSet<number> = new SvelteSet();

	/**
	 * Minimum threshold to detect axis movement, fixes drift for slightly misaligned devices.
	 * Ideally this value is the lowest that it can be for any particular controller,
	 * because it allows for the most precise control.
	 */
	gamepad_axis_sensitivity = 0.04; // TODO player-configurable, depends on the controller

	teleport_distance_md = 12; // TODO game-configurable
	teleport_distance_lg = this.teleport_distance_md * 4; // TODO game-configurable
	teleport_distance_xl = this.teleport_distance_lg * 4; // TODO game-configurable

	update(_dt: number): void {
		this.#update_gamepads();

		// TODO refactor, is all a quick hack
		const teleporting_distance =
			(this.just_pressed_button_a && this.pressing_button_x) ||
			(this.just_pressed_button_x && this.pressing_button_a)
				? this.teleport_distance_xl
				: this.just_pressed_button_x
					? this.teleport_distance_lg
					: this.just_pressed_button_a
						? this.teleport_distance_md
						: 0;
		this.teleporting_x =
			teleporting_distance === 0 || this.moving_x === 0
				? null
				: this.moving_x * teleporting_distance;
		this.teleporting_y =
			teleporting_distance === 0 || this.moving_y === 0
				? null
				: this.moving_y * teleporting_distance;
	}

	// TODO the point here is to provide an interface that's mapped to game semantics,
	// that's easy to use in the game loop, but also to provide a way to expose the raw inputs to the UI for configuration
	#update_gamepads(): void {
		if (!this.connected_gamepads.size) return;
		// TODO what if instead of copying these here, we can have a `Svelte_Gamepads`
		// that has its own `update` function that can be called by a configuring UI
		// so we avoid the cost during the game loop -
		// we still need to solve the problem of semantic mapping
		const gamepads = navigator.getGamepads();
		// console.log(`gamepads`, gamepads.timestamp, gamepad.buttons[0].pressed);
		for (const gamepad of gamepads) {
			if (!gamepad) continue;
			const [l_x, l_y] = gamepad.axes; // TODO , r_x, r_y
			this.gamepad_moving_x = Math.abs(l_x) > this.gamepad_axis_sensitivity ? l_x : 0;
			this.gamepad_moving_y = Math.abs(l_y) > this.gamepad_axis_sensitivity ? l_y : 0;

			const [button_a, button_b, button_x, button_y] = gamepad.buttons;
			// TODO hack
			// uses the old `pressing_` values to detect the `just_pressed_` values
			this.just_pressed_button_a = button_a.pressed ? !this.pressing_button_a : false;
			this.just_pressed_button_b = button_b.pressed ? !this.pressing_button_b : false;
			this.just_pressed_button_x = button_x.pressed ? !this.pressing_button_x : false;
			this.just_pressed_button_y = button_y.pressed ? !this.pressing_button_y : false;

			// update the new `pressing_` values
			this.pressing_button_a = button_a.pressed;
			this.pressing_button_b = button_b.pressed;
			this.pressing_button_x = button_x.pressed;
			this.pressing_button_y = button_y.pressed;

			// console.log(`gamepad.axes`, gamepad.timestamp, gamepad.axes);
			// console.log(`this.moving_x, this.moving_y`, this.moving_x, this.moving_y);
			// gamepad.axes;
			// gamepad.buttons;
			// gamepad.index;
			// gamepad.timestamp;
		}
	}

	// TODO maybe an `update` with a `dt` and `time` tracked as a signal on the controller? could also track `time_seconds` and other scheduling stuff, and then use that pattern (probably on the clock) in the fps counter

	// TODO use the `pressed` bools that are set for one tick
	/**
	 * Returns `true` if the key is pressed, `false` otherwise.
	 */
	handle_keydown(key: string): boolean {
		// TODO @many probably refactor so that all keys are captured in a $state object
		switch (key) {
			case 'Shift':
				this.pressing_shift = true;
				return true;
			case 'Control':
				this.pressing_ctrl = true;
				return true;
			case 'Alt':
				this.pressing_alt = true;
				return true;
			case 'ArrowLeft':
			case 'a': {
				this.moving_left = true;
				return true;
			}
			case 'ArrowRight':
			case 'd': {
				this.moving_right = true;
				return true;
			}
			case 'ArrowUp':
			case 'w': {
				this.moving_up = true;
				return true;
			}
			case 'ArrowDown':
			case 's': {
				this.moving_down = true;
				return true;
			}
			default: {
				// console.log('unhandled keydown', key);
				return false;
			}
		}
	}

	/**
	 * Returns `true` if the key is pressed, `false` otherwise.
	 */
	handle_keyup(key: string): boolean {
		// TODO @many probably refactor so that all keys are captured in a $state object
		switch (key) {
			case 'Shift':
				this.pressing_shift = false;
				return true;
			case 'Control':
				this.pressing_ctrl = false;
				return true;
			case 'Alt':
				this.pressing_alt = false;
				return true;
			case 'ArrowLeft':
			case 'a': {
				this.moving_left = false;
				return true;
			}
			case 'ArrowRight':
			case 'd': {
				this.moving_right = false;
				return true;
			}
			case 'ArrowUp':
			case 'w': {
				this.moving_up = false;
				return true;
			}
			case 'ArrowDown':
			case 's': {
				this.moving_down = false;
				return true;
			}
			default: {
				// console.log('unhandled keyup', key);
				return false;
			}
		}
	}

	handle_gamepad_connected(gamepad: Gamepad): void {
		console.log(`[controller] handle_gamepad_connected gamepad`, gamepad);
		this.connected_gamepads.add(gamepad.index);
	}

	handle_gamepad_disconnected(gamepad: Gamepad): void {
		console.log(`[controller] handle_gamepad_disconnected gamepad`, gamepad);
		this.connected_gamepads.delete(gamepad.index);
	}

	// TODO @many hack - keyup isn't running with the alert, so this is just a quick fix
	reset(): void {
		this.moving_left = false;
		this.moving_right = false;
		this.moving_up = false;
		this.moving_down = false;
		this.teleporting_x = null;
		this.teleporting_y = null;
		this.pressing_shift = false;
		this.pressing_ctrl = false;
		this.pressing_alt = false;
		this.just_pressed_button_a = false;
		this.just_pressed_button_b = false;
		this.just_pressed_button_x = false;
		this.just_pressed_button_y = false;
		this.pressing_button_a = false;
		this.pressing_button_b = false;
		this.pressing_button_x = false;
		this.pressing_button_y = false;
	}
}
