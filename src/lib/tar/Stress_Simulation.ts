import {Collisions, Body} from '@ryanatkn/collisions';

const result = Collisions.createResult();
const width = 1280;
const height = 640;
const count = 500;
const speed = 1;
const size = 5;

let frame = 0;
let fps_total = 0;

interface Stress_Body extends Body {
	direction_x?: number;
	direction_y?: number;
}

export class Stress_Simulation {
	element: HTMLElement;
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	collisions = new Collisions();
	bodies: Stress_Body[] = [];
	polygons = 0;
	circles = 0;
	display_bvh = false;
	frame: number; // `requestAnimationFrame`

	constructor(element: HTMLElement, canvas: HTMLCanvasElement) {
		this.element = element;
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d')!;

		this.canvas.width = width;
		this.canvas.height = height;
		this.context.font = '24px Arial';

		// World bounds
		this.collisions.createPolygon(0, 0, [
			[0, 0],
			[width, 0],
		]);
		this.collisions.createPolygon(0, 0, [
			[width, 0],
			[width, height],
		]);
		this.collisions.createPolygon(0, 0, [
			[width, height],
			[0, height],
		]);
		this.collisions.createPolygon(0, 0, [
			[0, height],
			[0, 0],
		]);

		for (let i = 0; i < count; ++i) {
			this.create_shape(!random(0, 49));
		}

		this.element.innerHTML = `
			<div><b>Total:</b> ${count}</div>
			<div><b>Polygons:</b> ${this.polygons}</div>
			<div><b>Circles:</b> ${this.circles}</div>
		`;

		this.element.appendChild(this.canvas);

		const self = this;

		let time = performance.now();

		this.frame = requestAnimationFrame(function frame() {
			const current_time = performance.now();

			self.update(1000 / (current_time - time));
			self.frame = requestAnimationFrame(frame);

			time = current_time;
		});
	}

	update(fps: number): void {
		this.collisions.update();

		++frame;
		fps_total += fps;

		const average_fps = Math.round(fps_total / frame);

		if (frame > 100) {
			frame = 1;
			fps_total = average_fps;
		}

		for (let i = 0; i < this.bodies.length; ++i) {
			const body = this.bodies[i];

			body.x += body.direction_x! * speed;
			body.y += body.direction_y! * speed;

			const potentials: Stress_Body[] = body.potentials() as any;

			for (const body2 of potentials) {
				// TODO fix type to remove `as any`
				if (body.collides(body2 as any, result)) {
					body.x -= result.overlap! * result.overlap_x;
					body.y -= result.overlap! * result.overlap_y;

					let dot = body.direction_x! * result.overlap_y + body.direction_y! * -result.overlap_x;

					body.direction_x = 2 * dot * result.overlap_y - body.direction_x!;
					body.direction_y = 2 * dot * -result.overlap_x - body.direction_y!;

					dot = body2.direction_x! * result.overlap_y + body2.direction_y! * -result.overlap_x;

					body2.direction_x = 2 * dot * result.overlap_y - body2.direction_x!;
					body2.direction_y = 2 * dot * -result.overlap_x - body2.direction_y!;
				}
			}
		}

		// Clear the canvas
		this.context.fillStyle = '#000000';
		this.context.fillRect(0, 0, width, height);

		// Render the bodies
		this.context.strokeStyle = '#FFFFFF';
		this.context.beginPath();
		this.collisions.draw(this.context);
		this.context.stroke();

		// Render the BVH
		if (this.display_bvh) {
			this.context.strokeStyle = '#00FF00';
			this.context.beginPath();
			this.collisions.drawBVH(this.context);
			this.context.stroke();
		}

		// Render the FPS
		this.context.fillStyle = '#FFCC00';
		this.context.fillText(`${average_fps}fps`, 10, 30);
	}

	create_shape(large: boolean) {
		const min_size = size * 0.75 * (large ? 3 : 1);
		const max_size = size * 1.25 * (large ? 5 : 1);
		const x = random(0, width);
		const y = random(0, height);
		const direction = (random(0, 360) * Math.PI) / 180;

		let body: Stress_Body;

		if (random(0, 2)) {
			body = this.collisions.createCircle(x, y, random(min_size, max_size));

			++this.circles;
		} else {
			body = this.collisions.createPolygon(
				x,
				y,
				[
					[-random(min_size, max_size), -random(min_size, max_size)],
					[random(min_size, max_size), -random(min_size, max_size)],
					[random(min_size, max_size), random(min_size, max_size)],
					[-random(min_size, max_size), random(3, size)],
				],
				(random(0, 360) * Math.PI) / 180,
			);

			++this.polygons;
		}

		body.direction_x = Math.cos(direction);
		body.direction_y = Math.sin(direction);

		this.bodies.push(body);
	}
}

// TODO extract
function random(min: number, max: number): number {
	return Math.floor(Math.random() * max) + min;
}
