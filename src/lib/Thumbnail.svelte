<script lang="ts">
	export let href: string;
</script>

<a {href} class="thumbnail">
	<slot />
</a>

<style>
	.thumbnail {
		margin: 20px;
	}
</style>
