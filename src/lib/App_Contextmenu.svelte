<script lang="ts">
	import {
		contextmenu_action,
		type Contextmenu_Params,
	} from '@ryanatkn/fuz/contextmenu_state.svelte.js';

	import {type App, app_context} from '$lib/app.svelte.js';

	interface Props {
		app?: App;
		contextmenu_params_before?: Contextmenu_Params | Array<Contextmenu_Params>;
		contextmenu_params_after?: Contextmenu_Params | Array<Contextmenu_Params>;
	}

	const {
		app = app_context.get(),
		contextmenu_params_before,
		contextmenu_params_after,
	}: Props = $props();

	const contextmenu_params = $derived.by(() => {
		let params: Array<Contextmenu_Params> = [
			{
				snippet: 'text',
				props: {
					content: 'Main menu',
					icon: '?',
					run: () => {
						app.toggle_main_menu();
					},
				},
			},
			{
				snippet: 'text',
				props: {
					content: 'Reload',
					icon: '⟳',
					run: () => {
						location.reload();
					},
				},
			},
		];
		if (contextmenu_params_before) {
			if (Array.isArray(contextmenu_params_before)) {
				params = contextmenu_params_before.concat(params);
			} else {
				params.unshift(contextmenu_params_before);
			}
		}
		if (contextmenu_params_after) {
			if (Array.isArray(contextmenu_params_after)) {
				params = params.concat(contextmenu_params_after);
			} else {
				params.push(contextmenu_params_after);
			}
		}
		return params;
	});
</script>

<svelte:body use:contextmenu_action={contextmenu_params} />
