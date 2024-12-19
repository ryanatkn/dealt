<script lang="ts">
	interface Props {
		play?: boolean;
		no_movement?: boolean;
		edit?: boolean;
	}

	const {play = false, no_movement = false, edit = false}: Props = $props();
</script>

<!-- TODO hacky just to get released -->
Controls: {#if play}
	<strong>` Backtick</strong> to toggle playing,
{/if}
{#if !no_movement}
	<strong>WASD</strong> and <strong>arrow keys</strong> to move,
{/if} <strong>r</strong> to reset, <strong>spacebar</strong> to toggle the clock{#if edit}, <strong
		>~ Shift+Backtick</strong
	>
	to toggle editing, edit with mouse and <strong>Ctrl</strong>/<strong>Shift</strong>/<strong
		>Alt</strong
	>{/if}
