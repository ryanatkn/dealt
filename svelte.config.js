import {typescript} from 'svelte-preprocess-esbuild';
import staticAdapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: typescript(),
	kit: {
		adapter: staticAdapter(),
		target: '#root',
		files: {assets: 'src/static'},
		vite: {
			ssr: {
				noExternal: ['@feltcoop/felt', '@ryanatkn/collisions'],
			},
			optimizeDeps: {
				exclude: ['@feltcoop/felt', '@ryanatkn/collisions'],
			},
		},
	},
};
