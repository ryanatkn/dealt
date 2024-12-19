<script lang="ts">
	import Details from '@ryanatkn/fuz/Details.svelte';
	import Copy_To_Clipboard from '@ryanatkn/fuz/Copy_To_Clipboard.svelte';

	import {parse_project_json, type Project, type Project_Json} from '$lib/project.svelte.js';
	import Import_Data_Form from '$lib/Import_Data_Form.svelte';
	import {Serializer} from '$lib/serializer.svelte.js';

	interface Props {
		project: Project;
		onimport?: (data: Project_Json, serialized: string) => void;
	}

	const {project, onimport}: Props = $props();

	const serializer = $derived(new Serializer(project.json));
</script>

<h2 class="mt_xl">Project data</h2>
<section>
	<Import_Data_Form
		data={serializer}
		title="project data"
		name="Project"
		onimport={(data, serialized) => {
			project.set_json(parse_project_json(data));
			onimport?.(data, serialized);
		}}
	/>
</section>
<Details>
	{#snippet summary()}
		View raw project data
	{/snippet}
	<div class="panel relative">
		<pre class="p_xs mb_0">{serializer.serialized}</pre>
		<div class="absolute" style:right="var(--size_lg)" style:top="var(--size_lg)">
			<Copy_To_Clipboard text={serializer.serialized} />
		</div>
	</div>
</Details>

<style>
	pre {
		max-height: 50vh;
	}
</style>
