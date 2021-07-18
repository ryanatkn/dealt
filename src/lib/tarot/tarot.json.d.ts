declare module '$lib/tarot/tarot.json' {
	import type {Tarot_Card} from '$lib/tarot/tarot.js';
	const data: {summary: string; source: string[]; cards: Tarot_Card[]};
	export default data;
}
