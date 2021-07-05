<script lang="ts">
	import {Stress_Simulation} from './Stress_Simulation';

	let wrapper_el: HTMLElement;
	let canvas_el: HTMLCanvasElement;

	let display_bvh = false;

	let sim: Stress_Simulation;
	$: {
		if (wrapper_el && canvas_el && !sim) {
			sim = new Stress_Simulation(wrapper_el, canvas_el);
			console.log('sim', sim);
			(window as any).sim = sim;
		}
	}

	$: sim && (sim.display_bvh = display_bvh);
</script>

<section>
	<label
		><input type="checkbox" bind:checked={display_bvh} />
		show bounding volume hierarchy
	</label>
</section>
<section bind:this={wrapper_el}><canvas bind:this={canvas_el} /></section>

<style>
	section {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
