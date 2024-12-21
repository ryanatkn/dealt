import {Container, Graphics} from 'pixi.js';

import type {Change_Unsubscriber, Unit} from '$lib/unit.svelte.js';
import type {Renderer_Scene_Pixi} from '$lib/renderer_scene_pixi.svelte.js';

export class Renderer_Unit_Pixi {
	container: Container;
	graphics: Graphics;

	unsubscribers: Array<Change_Unsubscriber> = [];

	constructor(
		public readonly scene_renderer: Renderer_Scene_Pixi,
		public readonly unit: Unit,
	) {
		this.container = new Container();
		this.graphics = new Graphics();

		// console.log(`[unit_renderer_pixi] created`, this);

		// TODO try to rework this pattern without effects, dunno how though, maybe still sync in deriveds but with per-unit components
		// Bind unit changes to the Pixi container
		this.unsubscribers.push(
			unit.on_change_x((x) => {
				this.container.x = x;
			}),
			unit.on_change_y((y) => {
				this.container.y = y;
			}),
			unit.on_change_rotation((rotation) => {
				this.container.rotation = rotation;
			}),
			unit.on_change_scale((scale) => {
				this.container.scale.set(scale, scale);
			}),
			unit.on_change_radius(() => {
				this.#update_graphics();
			}),
			unit.on_change_points(() => {
				this.#update_graphics();
			}),
		);

		// Init the Pixi objects
		this.#update_graphics();
		this.container.addChild(this.graphics);
		this.scene_renderer.pixi_app.stage.addChild(this.container);

		// TODO this is the only state syncing we do for Pixi,
		// the other cases use setters on the `unit` with the registered callbacks above.
		// What's the best way to handle both cases without effects?
		// Perhaps a Svelte component that subscribes to the properties is a better way and syncing state in `$derived`?
		this.cleanup_syncing_effect = $effect.root(() => {
			$effect(() => {
				this.graphics.tint = unit.color;
			});
		});
	}

	cleanup_syncing_effect: () => void;

	destroyed = false;

	destroy(): void {
		if (this.destroyed) throw Error('already destroyed unit renderer');
		this.destroyed = true;

		this.container.destroy({children: true});

		for (const u of this.unsubscribers) u();
		this.unsubscribers.length = 0;

		this.cleanup_syncing_effect();
	}

	/**
	 * @expensive
	 */
	#update_graphics(): void {
		// console.log(`[unit_renderer_pixi.update_graphics]`, this);
		const {graphics, unit} = this;
		graphics.clear();

		if (unit.type === 'circle') {
			graphics.circle(0, 0, unit.radius);
		} else {
			graphics.poly(unit.points);
		}

		graphics.fill(0xffffff);
		graphics.tint = unit.color;
	}
}
