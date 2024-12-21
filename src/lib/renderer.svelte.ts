import type {Component} from 'svelte';
import type {Themer} from '@ryanatkn/fuz/theme.svelte.js';

import type {Scene} from '$lib/scene.svelte.js';

export type Renderer_Type = 'pixi' | 'svelte' | 'canvas' | 'html';

export const renderer_types: Array<Renderer_Type> = ['pixi', 'svelte', 'canvas', 'html'];

export const renderer_summaries: Record<Renderer_Type, string> = {
	pixi: "The Pixi renderer uses WebGL via PixiJS. It's the most performant renderer available.",
	svelte: 'The Svelte renderer uses Svelte components to create SVG elements.',
	canvas: 'The canvas renderer draws to a canvas element with CanvasRenderingContext2D.',
	html: 'The HTML renderer generates a raw string of HTML and inserts it into the DOM to create SVG elements.',
};

export interface Renderer_Colors {
	/**
	 * Hex color for the renderer's background. `null` is transparent.
	 */
	background: string | null;
	unit: string;
	dead: string;
	player: string;
	harmful: string;
	goal: string;
	concave: string;
	selfintersecting: string;
}

export const colors_default: Renderer_Colors = {
	background: '#000000',
	unit: '#94643d',
	dead: '#ffffff',
	player: '#3ebb3e', // color_b_4
	harmful: '#a82424', // color_c_6
	goal: '#8e6ecf', // color_d_4
	concave: '#8866cc', // ~color_d_5
	selfintersecting: '#e03e81', // color_g_5
};

export type Renderer_Component = Component<{scene: Scene; renderer: Renderer}>;

export class Renderer {
	type: Renderer_Type = $state()!; // TODO rename? `name`?

	renderer_components: Record<Renderer_Type, Renderer_Component>;

	Component: Renderer_Component = $derived.by(() => {
		const Component = this.renderer_components[this.type];
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!Component) {
			throw Error(`Renderer component not found for type '${this.type}'`);
		}
		return Component;
	});

	width: number = $state()!; // TODO maybe init to `-1` or `0` to avoid a wasteful renderer resize on mount?
	height: number = $state()!;

	// TODO currently only available to canvas renderer
	show_bvh = $state(false);

	// TODO reactive?
	bvh_color = '#0a08';

	themer: Themer | null = $state(null);

	colors: Renderer_Colors;

	constructor(
		renderer_components: Record<Renderer_Type, Renderer_Component>,
		type: Renderer_Type,
		width: number,
		height: number,
		themer: Themer | null = null,
		colors: Renderer_Colors = colors_default,
	) {
		this.renderer_components = renderer_components;
		this.type = type;
		this.width = width;
		this.height = height;
		this.themer = themer;
		this.colors = colors;
	}
}
