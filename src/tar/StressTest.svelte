<script lang="ts">
	import {Stress} from './Stress';

	let wrapperEl: HTMLElement;
	let canvasEl: HTMLCanvasElement;

	let stress: Stress;
	$: {
		if (wrapperEl && canvasEl && !stress) {
			stress = new Stress(wrapperEl, canvasEl);
			console.log('stress', stress);
			(window as any).stress = stress;
		}
	}
</script>

<div bind:this={wrapperEl}><canvas bind:this={canvasEl} /></div>
