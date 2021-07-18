// TODO generate
declare module '$lib/corpora/settings.json' {
	export type Nature = 'neutral' | 'good' | 'evil';
	const data: {
		summary: string;
		source: string[];
		natures: Nature[];
	};
	export default data;
}
