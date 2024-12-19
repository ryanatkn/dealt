import Scene_Renderer_Pixi from '$lib/Scene_Renderer_Pixi.svelte';
import Scene_Renderer_Svelte from '$lib/Scene_Renderer_Svelte.svelte';
import Scene_Renderer_Html from '$lib/Scene_Renderer_Html.svelte';
import Scene_Renderer_Canvas from '$lib/Scene_Renderer_Canvas.svelte';
import type {Renderer_Component, Renderer_Type} from '$lib/renderer.svelte.js';

export const renderer_components: Record<Renderer_Type, Renderer_Component> = {
	pixi: Scene_Renderer_Pixi,
	svelte: Scene_Renderer_Svelte,
	canvas: Scene_Renderer_Canvas,
	html: Scene_Renderer_Html,
};
