declare module '$lib/corpora/emotions.json' {
	const data: {summary: string; source: string[]; emotions: {emotion: string; states: string[]}[]};
	export default data;
}
