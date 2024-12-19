// generated by src/routes/package.gen.ts

import type {Package_Json} from '@ryanatkn/gro/package_json.js';
import type {Src_Json} from '@ryanatkn/gro/src_json.js';

export const package_json = {
	name: '@ryanatkn/dealt',
	version: '0.0.1',
	description: 'toy 2D web game engine with a focus on topdown action RPGs',
	motto: 'giving meaning a chance',
	glyph: '🔮',
	logo: 'logo.svg',
	logo_alt: 'a friendly pixelated spider facing you',
	public: true,
	homepage: 'https://www.dealt.dev/',
	repository: 'https://github.com/ryanatkn/dealt',
	scripts: {
		start: 'gro dev',
		dev: 'gro dev',
		build: 'gro build',
		check: 'gro check',
		test: 'gro test',
		preview: 'vite preview',
		deploy: 'gro deploy',
		benchmark: 'npm run benchmark1',
		benchmark1: 'gro run src/benchmark/spawn.benchmark.ts',
	},
	type: 'module',
	engines: {node: '>=20.17'},
	devDependencies: {
		'@ryanatkn/belt': '^0.29.0',
		'@ryanatkn/eslint-config': '^0.6.0',
		'@ryanatkn/fuz': '^0.131.4',
		'@ryanatkn/gro': '^0.148.0',
		'@ryanatkn/moss': '^0.21.0',
		'@sveltejs/adapter-static': '^3.0.6',
		'@sveltejs/kit': '^2.12.1',
		'@sveltejs/vite-plugin-svelte': '^4.0.1',
		'@types/node': '^22.10.2',
		eslint: '^9.17.0',
		'eslint-plugin-svelte': '^2.46.1',
		'esm-env': '^1.2.1',
		'pixi.js': '^8.6.6',
		prettier: '^3.4.2',
		'prettier-plugin-svelte': '^3.3.2',
		svelte: '^5.14.4',
		'svelte-check': '^4.1.1',
		tinybench: '^3.0.7',
		tslib: '^2.8.1',
		typescript: '^5.7.2',
		'typescript-eslint': '^8.18.1',
		uvu: '^0.5.6',
	},
	prettier: {
		plugins: ['prettier-plugin-svelte'],
		useTabs: true,
		printWidth: 100,
		singleQuote: true,
		bracketSpacing: false,
		overrides: [{files: 'package.json', options: {useTabs: false}}],
	},
	sideEffects: ['**/*.css'],
	files: ['dist'],
} satisfies Package_Json;

export const src_json = {name: '@ryanatkn/dealt', version: '0.0.1'} satisfies Src_Json;

// generated by src/routes/package.gen.ts
