/**
 * Svelte-idiomatic zoo implementation.
 * Uses Svelte 5 $state runes for reactivity.
 */

import {random_float, random_int} from '@ryanatkn/belt/random.js';
import {create_random_alea} from '@ryanatkn/belt/random_alea.js';

import {transform_points, type I_Point} from '$lib/point_helpers.js';
import {compute_unit_color} from '$lib/unit_logic.js';
import {type Renderer_Colors, colors_default} from '$lib/renderer.svelte.js';
import {Collisions, type Some_Body} from '$lib/collisions.js';
import {colliding} from '$lib/colliding.js';
import {cr} from '$lib/collision_result.js';
import {physics_apply_bounce} from '$lib/physics.js';
import {SPEED_DEFAULT} from '$lib/unit_types.js';

/**
 * Zoo agent - a simple entity in the zoo.
 * Uses Svelte 5 $state for reactive properties.
 */
export class Zoo_Agent {
	// Identity
	id: number;

	// State
	dead = $state(false);
	type: 'circle' | 'polygon';

	// Transform (reactive for rendering)
	#x = $state(0);
	#y = $state(0);
	rotation: number;
	scale: number;

	get x(): number {
		return this.#x;
	}
	set x(v: number) {
		this.#x = v;
		if (this.body) this.body.x = v;
	}

	get y(): number {
		return this.#y;
	}
	set y(v: number) {
		this.#y = v;
		if (this.body) this.body.y = v;
	}

	// Movement
	speed: number;
	direction_x = $state(0);
	direction_y = $state(0);

	// Shape (circle)
	radius: number;

	// Shape (polygon)
	points: Array<I_Point>;
	transformed_points: Array<I_Point>;

	// Derived
	color: string;

	// Collision body (managed externally)
	body: Some_Body | undefined;

	constructor(
		id: number,
		type: 'circle' | 'polygon',
		x: number,
		y: number,
		radius: number,
		points: Array<I_Point>,
		rotation: number,
		scale: number,
		speed: number,
		direction_x: number,
		direction_y: number,
		colors: Renderer_Colors,
	) {
		this.id = id;
		this.type = type;
		this.#x = x;
		this.#y = y;
		this.radius = radius;
		this.points = points;
		this.rotation = rotation;
		this.scale = scale;
		this.speed = speed;
		this.direction_x = direction_x;
		this.direction_y = direction_y;

		// Pre-compute transformed points for polygons
		this.transformed_points = type === 'polygon' ? transform_points(points, rotation, scale) : [];

		// Compute color once (won't change in this demo)
		this.color = compute_unit_color(false, type, true, false, [], colors);
	}
}

export interface Zoo_State_Options {
	width?: number;
	height?: number;
	agent_count?: number;
	agent_scale?: number;
	simulation_speed?: number;
}

const BOUNDS_SIZE = 100000;

/**
 * Zoo state manager - owns agents and simulation.
 */
export class Zoo_State {
	// Dimensions
	width = $state(800);
	height = $state(600);

	// Configuration
	agent_count = $state(72);
	agent_scale = $state(1);
	simulation_speed = $state(1);

	// State
	agents: Array<Zoo_Agent> = $state([]);
	running = $state(true);

	// Colors
	colors: Renderer_Colors = colors_default;

	// Collision system
	collisions = new Collisions();

	// Timing
	#frame_id: number | null = null;
	#last_time: number | null = null;
	frame_count = $state(0);
	fps = $state(0);
	#fps_total = 0;

	constructor(options: Zoo_State_Options = {}) {
		this.width = options.width ?? 800;
		this.height = options.height ?? 600;
		this.agent_count = options.agent_count ?? 72;
		this.agent_scale = options.agent_scale ?? 1;
		this.simulation_speed = options.simulation_speed ?? 1;
	}

	/**
	 * Initialize agents and start simulation.
	 */
	init(): void {
		this.create_agents();
		this.start();
	}

	/**
	 * Create agents based on current settings.
	 */
	create_agents(): void {
		// Clear existing
		this.agents = [];
		this.collisions = new Collisions();

		const random_alea = create_random_alea(this.agent_count, this.agent_scale);
		const random = (min: number, max: number): number => random_float(min, max, random_alea);

		// Create boundary walls
		this.#create_bounds();

		// Create agents
		const size = 5;
		for (let i = 0; i < this.agent_count; i++) {
			const large = random_alea() > 0.5 ? i % 16 === 0 : false;
			const min_size = size * 1 * (large ? 4.2 * this.agent_scale : this.agent_scale);
			const max_size = size * 2.5 * (large ? 4.2 * this.agent_scale : this.agent_scale);
			const x = random(0, this.width);
			const y = random(0, this.height);
			const direction = (random(0, 360) * Math.PI) / 180;
			const direction_x = Math.cos(direction);
			const direction_y = Math.sin(direction);

			let agent: Zoo_Agent;

			if (random_alea() > 0.7) {
				// Circle
				const radius = random(min_size, max_size);
				agent = new Zoo_Agent(
					i,
					'circle',
					x,
					y,
					radius,
					[],
					0,
					1,
					SPEED_DEFAULT * random(0.1, 1),
					direction_x,
					direction_y,
					this.colors,
				);
				agent.body = this.collisions.create_circle(x, y, radius, 1);
			} else {
				// Polygon
				let points: Array<I_Point> = [
					{x: -random(min_size, max_size), y: -random(min_size, max_size)},
					{x: random(min_size, max_size), y: -random(min_size, max_size)},
					{x: random(min_size, max_size), y: random(min_size, max_size)},
					{x: -random(min_size, max_size), y: random(min_size, max_size)},
				];
				if (random_alea() > 0.17) {
					const index_to_remove = random_int(0, points.length - 1, random_alea);
					points = points.filter((_, idx) => idx !== index_to_remove);
				}
				const rotation = (random(0, 360) * Math.PI) / 180;

				agent = new Zoo_Agent(
					i,
					'polygon',
					x,
					y,
					0,
					points,
					rotation,
					1,
					SPEED_DEFAULT * random(0.1, 1),
					direction_x,
					direction_y,
					this.colors,
				);
				agent.body = this.collisions.create_polygon(x, y, points, rotation, 1, 1);
			}

			// Store back-reference
			(agent.body as any).agent = agent;

			this.agents.push(agent);
		}
	}

	#create_bounds(): void {
		// Walls use clockwise winding (in screen coords) so normals point into playfield
		// Top wall
		const top = this.collisions.create_polygon(0, 0, [
			{x: 0, y: 0},
			{x: 0, y: -BOUNDS_SIZE},
			{x: this.width, y: -BOUNDS_SIZE},
			{x: this.width, y: 0},
		]);
		(top as any).is_wall = true;

		// Right wall
		const right = this.collisions.create_polygon(0, 0, [
			{x: this.width, y: 0},
			{x: this.width + BOUNDS_SIZE, y: 0},
			{x: this.width + BOUNDS_SIZE, y: this.height},
			{x: this.width, y: this.height},
		]);
		(right as any).is_wall = true;

		// Bottom wall
		const bottom = this.collisions.create_polygon(0, 0, [
			{x: this.width, y: this.height},
			{x: this.width, y: this.height + BOUNDS_SIZE},
			{x: 0, y: this.height + BOUNDS_SIZE},
			{x: 0, y: this.height},
		]);
		(bottom as any).is_wall = true;

		// Left wall
		const left = this.collisions.create_polygon(0, 0, [
			{x: 0, y: this.height},
			{x: -BOUNDS_SIZE, y: this.height},
			{x: -BOUNDS_SIZE, y: 0},
			{x: 0, y: 0},
		]);
		(left as any).is_wall = true;
	}

	/**
	 * Start the simulation loop.
	 */
	start(): void {
		if (this.#frame_id !== null) return;
		this.running = true;
		this.#last_time = null;
		this.#tick();
	}

	/**
	 * Stop the simulation loop.
	 */
	stop(): void {
		if (this.#frame_id !== null) {
			cancelAnimationFrame(this.#frame_id);
			this.#frame_id = null;
		}
		this.running = false;
	}

	/**
	 * Toggle simulation running state.
	 */
	toggle(): void {
		if (this.running) {
			this.stop();
		} else {
			this.start();
		}
	}

	#tick = (): void => {
		if (!this.running) return;

		const now = performance.now();
		if (this.#last_time !== null) {
			const dt = now - this.#last_time;
			if (dt < 1000) {
				// Skip large dt spikes
				this.#update(dt);

				// FPS tracking
				this.frame_count++;
				this.#fps_total += 1000 / dt;
				if (this.frame_count > 100) {
					this.fps = Math.round(this.#fps_total / this.frame_count);
					this.frame_count = 1;
					this.#fps_total = this.fps;
				}
			}
		}
		this.#last_time = now;

		this.#frame_id = requestAnimationFrame(this.#tick);
	};

	#update(dt: number): void {
		const final_dt = dt * this.simulation_speed;

		// Update collision system BVH
		this.collisions.update();

		// PHASE 1: Movement
		for (const agent of this.agents) {
			if (!agent.body || agent.dead) continue;

			const unit_speed = agent.speed * final_dt;
			if (unit_speed !== 0) {
				if (agent.direction_x !== 0) {
					agent.x += agent.direction_x * unit_speed;
				}
				if (agent.direction_y !== 0) {
					agent.y += agent.direction_y * unit_speed;
				}
			}
		}

		// PHASE 2: Collision detection and response
		for (const agent of this.agents) {
			if (!agent.body) continue;

			for (const other_body of agent.body.potentials()) {
				const other_agent = (other_body as any).agent as Zoo_Agent | undefined;
				const is_wall = (other_body as any).is_wall;

				if (colliding(agent.body, other_body, cr)) {
					if (is_wall) {
						// Bounce off wall - only move the agent, wall is immovable
						physics_apply_bounce(
							agent,
							{x: 0, y: 0, direction_x: 0, direction_y: 0} as Zoo_Agent,
							cr,
							1,
						);
					} else if (other_agent) {
						physics_apply_bounce(agent, other_agent, cr);
					}
				}
			}
		}
	}

	/**
	 * Cleanup when destroying.
	 */
	destroy(): void {
		this.stop();
	}
}
