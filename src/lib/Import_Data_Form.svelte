<script lang="ts" generics="T_Data">
	import Copy_To_Clipboard from '@ryanatkn/fuz/Copy_To_Clipboard.svelte';
	import {slide} from 'svelte/transition';
	import {tick} from 'svelte';

	import {Serializer} from '$lib/serializer.svelte.js';

	const {
		data,
		parse_error = 'failed to parse data - is it valid JSON?',
		title = 'data',
		name = '',
		onimport,
	}: {
		// TODO move this to a `Props` interface when generics support it
		// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
		data: T_Data | Serializer<T_Data>; // TODO maybe two different props?
		parse_error?: string;
		title?: string;
		name?: string;
		onimport?: (data: T_Data, serialized: string) => void;
	} = $props();

	const serializer = $derived(data && data instanceof Serializer ? data : new Serializer(data));
	const serialized = $derived(serializer.serialized);

	let local_serialized_el: HTMLTextAreaElement | undefined = $state();
	let local_serialized = $state('');
	let import_error: string | null = $state(null);

	const import_data = () => {
		if (!local_serialized) {
			local_serialized_el?.focus();
			return;
		}
		let parsed;
		try {
			parsed = serializer.parse(local_serialized);
		} catch (_err) {
			import_error = parse_error;
			return;
		}
		import_error = null;
		local_serialized = ''; // TODO maybe don't reset?
		onimport?.(parsed, local_serialized);
	};

	// TODO hacky way to clear the error
	$effect(() => {
		local_serialized;
		import_error = null;
	});

	// TODO disable import button if it's unchanged
</script>

<form>
	<div class="flex mb_md gap_md">
		<button type="button" onclick={import_data} disabled={local_serialized === serialized}>
			↦ import {title}
		</button>
		<Copy_To_Clipboard
			text={serialized}
			oncopy={async () => {
				local_serialized = serialized;
				await tick();
				local_serialized_el?.select();
				local_serialized_el?.focus();
			}}
		>
			⧉ copy {title}
		</Copy_To_Clipboard>
	</div>
	<textarea
		bind:this={local_serialized_el}
		bind:value={local_serialized}
		placeholder="{name ? name + ' ' : ''}JSON to import"
	></textarea>
	{#if import_error}
		<p transition:slide class="color_c_5"><strong>{import_error}</strong></p>
	{/if}
</form>
