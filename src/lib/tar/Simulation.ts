import {Collisions} from '@ryanatkn/collisions';

import type {Entity} from '$lib/tar/entity';

const result = Collisions.createResult();

export class Simulation {
	collisions = new Collisions();
	bodies: Entity[] = [];
	player: Entity;

	width: number = -1;
	height: number = -1;

	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;

	constructor() {
		const {collisions, bodies} = this;

		// TODO factor this out
		// create the controllable player
		const player: Entity = collisions.createCircle(100, 100, 5) as any;
		player.speed = 0.2;
		player.direction_x = 0;
		player.direction_y = 0;
		bodies.push(player);
		this.player = player;

		// create some obstacles
		const thing1: Entity = collisions.createCircle(200, 100, 30) as any;
		thing1.speed = 0.1;
		thing1.direction_x = 0;
		thing1.direction_y = 0;
		const thing2: Entity = collisions.createCircle(180, 180, 30) as any;
		thing2.speed = 0.1;
		thing2.direction_x = 0;
		thing2.direction_y = 0;
		const thing3: Entity = collisions.createCircle(100, 200, 30) as any;
		thing3.speed = 0.1;
		thing3.direction_x = 0;
		thing3.direction_y = 0;
		this.bodies.push(thing1, thing2, thing3);
	}

	// TODO remove 2d canvas, use WebGL instead -- Pixi?
	set_canvas(canvas: HTMLCanvasElement): void {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		if (!this.ctx) throw Error('Failed to get canvas context');
		if (this.width !== -1 && this.height !== -1) {
			canvas.width = this.width;
			canvas.height = this.height;
		}
	}
	unset_canvas(): void {
		this.canvas = null;
		this.ctx = null;
	}
	set_dimensions(width: number, height: number): void {
		console.log('set_dimensions, width, height', width, height);
		this.width = width;
		this.height = height;
		if (this.canvas) {
			this.canvas.width = width;
			this.canvas.height = height;
		}
	}

	// TODO
	update(dt: number) {
		this.collisions.update();
		const {bodies} = this;

		// update player direction from input
		this.player.direction_x = this.moving_left ? -1 : this.moving_right ? 1 : 0;
		this.player.direction_y = this.moving_up ? -1 : this.moving_down ? 1 : 0;

		let speed: number;
		let direction_x: number;
		let direction_y: number;
		let dot: number;
		let potentials: Entity[];
		let body: Entity;

		// apply collisions
		for (let i = 0; i < bodies.length; ++i) {
			body = bodies[i];

			speed = body.speed * dt;
			direction_x = body.direction_x;
			direction_y = body.direction_y;

			body.x += direction_x * speed;
			body.y += direction_y * speed;

			// TODO fix these types in the collisions library
			potentials = body.potentials() as any; // TODO pass in array arg, like the pattern with `result`

			for (const body2 of potentials) {
				if (body.collides(body2 as any, result)) {
					body.x -= result.overlap! * result.overlap_x;
					body.y -= result.overlap! * result.overlap_y;

					dot = direction_x * result.overlap_y + direction_y * -result.overlap_x;

					body.direction_x = 2 * dot * result.overlap_y - direction_x;
					body.direction_y = 2 * dot * -result.overlap_x - direction_y;

					dot = body2.direction_x * result.overlap_y + body2.direction_y * -result.overlap_x;

					body2.direction_x = 2 * dot * result.overlap_y - body2.direction_x;
					body2.direction_y = 2 * dot * -result.overlap_x - body2.direction_y;
				}
			}
		}

		const {ctx, width, height} = this;
		if (!ctx) throw Error('Expected rendering context');

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = 'cornflowerblue';
		ctx.beginPath();
		this.collisions.draw(ctx); // TODO probably extract out of the library
		ctx.stroke();
		ctx.closePath();
	}

	// TODO extract to input manager and rewrite
	moving_left = false;
	moving_right = false;
	moving_up = false;
	moving_down = false;
	handle_keydown(key: string) {
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.moving_left = true;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.moving_right = true;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.moving_up = true;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.moving_down = true;
				break;
			}
			default: {
				console.log('unhandled keydown', key);
			}
		}
	}
	handle_keyup(key: string) {
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.moving_left = false;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.moving_right = false;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.moving_up = false;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.moving_down = false;
				break;
			}
			default: {
				console.log('unhandled keyup', key);
			}
		}
	}
}
