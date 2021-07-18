// import {Collisions, Body} from '@ryanatkn/collisions';

import type {Entity} from '$lib/tar/entity';

// const result = Collisions.createResult();

export class Simulation {
	player: Entity = {name: 'player', x: 100, y: 100, speed: 10};
	entities: Entity[] = [this.player];

	width: number = -1;
	height: number = -1;

	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;

	constructor() {}

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
	update(_dt: number) {
		const {canvas, ctx, width, height, entities} = this;
		if (!canvas || !ctx) {
			throw Error('Expected canvas and rendering context');
		}

		ctx.clearRect(0, 0, width, height);
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'cornflowerblue';
		for (const entity of entities) {
			ctx.moveTo(entity.x - 1, entity.y - 1);
			ctx.lineTo(entity.x + 1, entity.y - 1);
			ctx.lineTo(entity.x + 1, entity.y + 1);
			ctx.lineTo(entity.x - 1, entity.y + 1);
			ctx.lineTo(entity.x - 1, entity.y - 1);
		}
		ctx.moveTo(0, height / 2);
		ctx.lineTo(100, 100);
		ctx.lineTo(120, 120);
		ctx.lineTo(80, 150);
		ctx.lineTo(100, 100);
		ctx.stroke();
		ctx.closePath();
	}

	// TODO extract to input manager
	handle_input(e: KeyboardEvent) {
		const {key} = e;
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.player.x -= this.player.speed;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.player.x += this.player.speed;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.player.y -= this.player.speed;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.player.y += this.player.speed;
				break;
			}
			default: {
				console.log('key', key);
			}
		}
	}
}
