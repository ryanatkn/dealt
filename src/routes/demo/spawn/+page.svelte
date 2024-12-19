<script lang="ts">
	import {browser} from '$app/environment';
	import {effect_with_count} from '@ryanatkn/fuz/rune_helpers.svelte.js';

	import Spawn_Demo from '$routes/demo/spawn/Spawn_Demo.svelte';
	import {
		parse_spawn_demo_state_from_hash,
		serialize_spawn_demo_state_to_hash,
		Spawn_Demo_State,
	} from '$routes/demo/spawn/spawn_demo.svelte.js';

	const spawn_demo = new Spawn_Demo_State(
		browser ? parse_spawn_demo_state_from_hash(location.hash) : undefined,
	);

	// Sync the hash with the state, avoiding unnecessary writes
	let json_prev = browser ? spawn_demo.toJSON() : undefined;
	effect_with_count((count) => {
		const {json} = spawn_demo;
		if (count !== 1 && json !== json_prev) {
			json_prev = json;
			console.log('[spawn page] writing to hash');
			history.replaceState(null, '', '#' + serialize_spawn_demo_state_to_hash(json));
		}
	});
</script>

<svelte:head>
	<title>Dealt: spawn demo</title>
</svelte:head>

<Spawn_Demo {spawn_demo} />
