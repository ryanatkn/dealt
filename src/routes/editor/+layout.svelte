<script lang="ts">
	import type {Snippet} from 'svelte';
	import {BROWSER} from 'esm-env';

	import Dealt from '$lib/Dealt.svelte';
	import App_Contextmenu from '$lib/App_Contextmenu.svelte';
	import {App, app_context} from '$lib/app.svelte.js';
	import {Renderer} from '$lib/renderer.svelte.js';
	import {clock_context} from '$lib/clock.svelte.js';
	import Editor_Menu from '$lib/Editor_Menu.svelte';
	import Scene_Menu from '$lib/Scene_Menu.svelte';
	import {Editor, editor_context} from '$lib/editor.svelte.js';
	import {renderer_components} from '$lib/renderer_components.js';

	interface Props {
		children: Snippet;
	}

	const {children}: Props = $props();

	const renderer = new Renderer(renderer_components, 'pixi', 300, 300);

	const app = app_context.set(new App({renderer}));
	clock_context.set(app.clock);
	if (BROWSER) (globalThis as any).app = app;

	const editor = editor_context.set(new Editor({app}));

	// import {create_scene_adventure} from '$lib/scenes.js';

	// sync with storage
	let inited_app_save = false;
	$effect(() => {
		const app_json = app.json;
		if (inited_app_save) {
			console.log('[layout] saving app json', app_json);
			app.save(app_json);
		} else {
			console.log('[layout] initing app json', app_json);
			inited_app_save = true;
		}
	});
</script>

<svelte:head>
	<title>Dealt: editor</title>
</svelte:head>

<App_Contextmenu />

<Dealt>
	{@render children()}

	<Editor_Menu {app} />
	<Scene_Menu {editor} />
</Dealt>
