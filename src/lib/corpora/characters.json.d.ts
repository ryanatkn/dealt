declare module '$lib/corpora/characters.json' {
	import type {Nature} from '$lib/corpora/natures.json';
	const data: {
		summary: string;
		source: string[];
		characters: {name: string; synonyms: string[]; qualities: string[]; nature: Nature}[];
	};
	export default data;
}
