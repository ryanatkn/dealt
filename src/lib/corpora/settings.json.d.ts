declare module '$lib/corpora/settings.json' {
	import type {Nature} from '$lib/corpora/natures.json';
	const data: {
		summary: string;
		source: string[];
		settings: {name: string; synonyms: string[]; qualities: string[]; nature: Nature}[];
	};
	export default data;
}
