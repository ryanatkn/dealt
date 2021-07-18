declare module '$lib/tarot/tarot.json' {
	import type {Tarot_Card} from '$lib/tarot/tarot.js';
	const activity_streams_examples: {summary: string; source: string[]; cards: Tarot_Card[]};
	export default activity_streams_examples;
}
