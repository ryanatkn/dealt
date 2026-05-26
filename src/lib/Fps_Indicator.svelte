<script lang="ts">
	import {type Clock, clock_context} from '$lib/clock.svelte.js';

	interface Props {
		clock?: Clock;
	}

	const {clock: props_clock}: Props = $props();

	const clock = $derived(props_clock ?? clock_context.get());
</script>

<div class="display:flex align-items:end font-weight:700 px_md font_family_mono">
	<div class="text-align:right pr_xs" style:width="4rem">{clock.average_fps}</div>
	<div class="text_color_4">fps</div>
</div>
