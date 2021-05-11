<script lang="ts">
	import {StressSimulation} from './StressSimulation';

	let wrapperEl: HTMLElement;
	let canvasEl: HTMLCanvasElement;

	let displayBVH = false;

	let stress: StressSimulation;
	$: {
		if (wrapperEl && canvasEl && !stress) {
			stress = new StressSimulation(wrapperEl, canvasEl);
			console.log('stress', stress);
			(window as any).stress = stress;
		}
	}

	$: stress && (stress.displayBVH = displayBVH);
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
