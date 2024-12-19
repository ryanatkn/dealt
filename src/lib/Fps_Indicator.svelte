<script lang="ts">
	import {type Clock, clock_context} from '$lib/clock.svelte.js';

	interface Props {
		clock?: Clock;
	}

	const {clock: props_clock}: Props = $props();

	const clock = $derived(props_clock ?? clock_context.get());
</script>

<div class="flex align_items_end font_weight_700 px_md font_mono">
	<div class="text_align_right pr_xs" style:width="4rem">{clock.average_fps}</div>
	<div class="text_color_4">fps</div>
</div>
