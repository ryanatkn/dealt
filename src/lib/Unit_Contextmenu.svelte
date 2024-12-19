<script lang="ts">
	import Contextmenu_Entry from '@ryanatkn/fuz/Contextmenu_Entry.svelte';
	import Contextmenu_Submenu from '@ryanatkn/fuz/Contextmenu_Submenu.svelte';
	import {contextmenu_action} from '@ryanatkn/fuz/contextmenu_state.svelte.js';
	import type {Snippet} from 'svelte';

	import Unit_Icon from '$lib/Unit_Icon.svelte';
	import type {Unit} from '$lib/unit.svelte.js';
	import type {Scene} from '$lib/scene.svelte.js';

	interface Props {
		scene: Scene;
		unit: Unit | null;
		children: Snippet;
	}

	const {scene, unit, children}: Props = $props();
</script>

{#if unit}
	<div class="display_contents" data-unit={unit.id} use:contextmenu_action={contextmenu_entries}>
		{@render children()}
	</div>
{:else}
	{@render children()}
{/if}

{#snippet contextmenu_entries()}
	{#if unit}
		<Contextmenu_Submenu>
			{#snippet menu()}
				<Contextmenu_Entry
					icon="⎘"
					run={() => {
						const cloned = unit.clone();
						cloned.x += 10;
						cloned.y += 10;
						scene.add_unit(cloned);
					}}
				>
					Duplicate unit
				</Contextmenu_Entry>
				{#if unit.type === 'polygon'}
					<Contextmenu_Entry
						icon="◎"
						run={() => {
							// TODO this should insert between the closest points to the pointer position, if any - need to track that info
							unit.create_new_point();
						}}
					>
						Add point to polygon
					</Contextmenu_Entry>
				{/if}
				<Contextmenu_Entry
					icon="⌸"
					run={async () => {
						const str = JSON.stringify(unit.json);
						await navigator.clipboard.writeText(str);
					}}
				>
					Copy data to clipboard
				</Contextmenu_Entry>

				<Contextmenu_Entry
					icon="✕"
					run={() => {
						// TODO undo
						scene.remove_unit(unit);
					}}
				>
					Delete unit
				</Contextmenu_Entry>
			{/snippet}
			Unit {#if unit.name}{unit.name}{:else}<small><code>{unit.id_string}</code></small>{/if}
			{#snippet icon()}
				<Unit_Icon {unit} />
			{/snippet}
		</Contextmenu_Submenu>
	{/if}
{/snippet}
