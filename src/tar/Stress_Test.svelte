<script lang="ts">
	import {Stress_Simulation} from './Stress_Simulation';

	let wrapperEl: HTMLElement;
	let canvasEl: HTMLCanvasElement;

	let displayBVH = false;

	let sim: Stress_Simulation;
	$: {
		if (wrapperEl && canvasEl && !sim) {
			sim = new Stress_Simulation(wrapperEl, canvasEl);
			console.log('sim', sim);
			(window as any).sim = sim;
		}
	}

	$: sim && (sim.displayBVH = displayBVH);
</script>

<section>
	<label
		><input type="checkbox" bind:checked={displayBVH} />
		show bounding volume hierarchy
	</label>
</section>
<section bind:this={wrapperEl}><canvas bind:this={canvasEl} /></section>

<style>
	section {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
