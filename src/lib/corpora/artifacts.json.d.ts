declare module '$lib/corpora/artifacts.json' {
	import type {Nature} from '$lib/corpora/natures.json';
	const data: {
		summary: string;
		source: string[];
		artifacts: {name: string; synonyms: string[]; qualities: string[]; nature: Nature}[];
	};
	export default data;
}
