declare module '$lib/corpora/events.json' {
	import type {Nature} from '$lib/corpora/natures.json';
	const data: {
		summary: string;
		source: string[];
		events: {name: string; synonyms: string[]; qualities: string[]; nature: Nature}[];
	};
	export default data;
}
