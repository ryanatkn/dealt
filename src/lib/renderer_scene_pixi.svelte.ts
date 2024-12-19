import {Application, type ApplicationOptions} from 'pixi.js';
import {SvelteMap} from 'svelte/reactivity';

import type {Unit} from '$lib/unit.svelte.js';
import {Renderer_Unit_Pixi} from '$lib/renderer_unit_pixi.svelte.js';
import type {Renderer} from '$lib/renderer.svelte.js';
import type {Scene} from '$lib/scene.svelte.js';

export class Renderer_Scene_Pixi {
	pixi_app: Application;

	unit_renderers: SvelteMap<Unit, Renderer_Unit_Pixi> = new SvelteMap();

	constructor(
		public readonly renderer: Renderer,
		public readonly scene: Scene,
	) {
		this.pixi_app = new Application();
	}

	async init(opts: Partial<ApplicationOptions> = {}): Promise<HTMLCanvasElement> {
		const default_opts: Partial<ApplicationOptions> = {
			antialias: true,
			width: this.renderer.width,
			height: this.renderer.height,
			sharedTicker: true,
			eventMode: 'none',
			eventFeatures: {
				click: false,
				globalMove: false,
				move: false,
				wheel: false,
			},
		};

		if (this.renderer.colors.background === null) {
			default_opts.backgroundAlpha = 0;
		} else {
			default_opts.background = this.renderer.colors.background;
		}

		await this.pixi_app.init({...default_opts, ...opts});

		// Create renderers for existing units
		for (const unit of this.scene.units) {
			this.create_unit_renderer(unit);
		}

		return this.pixi_app.canvas;
	}

	update(): void {
		// TODO this isn't needed, because of the init?
		// this.pixi_app.render();
	}

	resize(width: number, height: number): void {
		this.pixi_app.renderer.resize(width, height);
		this.update();
	}

	destroy(): void {
		for (const renderer of this.unit_renderers.values()) {
			renderer.destroy();
		}
		this.unit_renderers.clear();
		this.pixi_app.destroy({removeView: true}, true);
	}

	create_unit_renderer(unit: Unit): void {
		const renderer = new Renderer_Unit_Pixi(this, unit);
		this.unit_renderers.set(unit, renderer);
	}

	delete_unit_renderer(unit: Unit): void {
		const renderer = this.unit_renderers.get(unit);
		if (renderer) {
			renderer.destroy();
			this.unit_renderers.delete(unit);
		}
	}
}
