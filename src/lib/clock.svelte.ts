import {create_context} from '@ryanatkn/fuz/context_helpers.js';

export const clock_context = create_context<Clock>();

export type Clock_Callback = (dt: number, clock: Clock) => void;

export class Clock {
	running = $state(false);

	dt_max: number = $state(1000); // discard frames that are greater than this value

	average_fps = $state(0);

	frame_count = 0;
	fps_total = 0;
	time: number | null = null; // TODO @many reset? on start or on explicit reset? pause vs stop?
	dt: number | null = null; // TODO @many reset? on start or on explicit reset? pause vs stop?

	// TODO refactor, include dt
	callbacks: Array<Clock_Callback> = [];

	start = (): void => {
		if (this.running) return;
		this.running = true;
		this.time = null;
		requestAnimationFrame(this.ontick); // TODO enable other scheduling, so we could reuse the Pixi Ticker
	};

	stop = (): void => {
		if (!this.running) return;
		this.running = false;
	};

	toggle = (): void => {
		if (this.running) {
			this.stop();
		} else {
			this.start();
		}
	};

	ontick = (): void => {
		// TODO handle with explicit time (composing a clock interface?) fixed time step?
		// console.log(`ontick r`, r);
		if (!this.running) return;

		const current_time = performance.now();

		if (this.time !== null) {
			const dt = current_time - this.time;
			if (dt < this.dt_max) {
				this.dt = dt;
				this.update(dt);
			}
		}

		this.time = current_time;

		requestAnimationFrame(this.ontick);
	};

	update(dt: number): void {
		this.frame_count++;
		this.fps_total += 1000 / dt;

		if (this.frame_count > 100) {
			this.average_fps = Math.round(this.fps_total / this.frame_count);
			this.frame_count = 1;
			this.fps_total = this.average_fps;
		}

		for (const cb of this.callbacks) {
			cb(dt, this);
		}
	}

	watch(callback: Clock_Callback): () => void {
		this.callbacks.push(callback);
		return () => {
			const index = this.callbacks.indexOf(callback);
			if (index === -1) throw Error('callback not found');
			this.callbacks.splice(index, 1);
		};
	}
}
