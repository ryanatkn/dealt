// TODO generate
declare module '$lib/corpora/natures.json' {
	export type Nature = 'neutral' | 'good' | 'evil';
	const data: {
		summary: string;
		source: string[];
		natures: Nature[];
	};
	export default data;
}
