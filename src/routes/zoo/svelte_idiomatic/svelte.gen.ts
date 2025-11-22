/**
 * Gen file to compile .svelte and .svelte.ts files to JavaScript.
 *
 * This produces compiled output for comparison with the Ripple-compiled
 * zoo_ripple.js. Useful for understanding framework differences.
 *
 * Pattern: `svelte.gen.ts` outputs multiple files via array return.
 */

import {readFile, readdir} from 'node:fs/promises';
import {compile, compileModule} from 'svelte/compiler';
import ts_blank_space from 'ts-blank-space';
import type {Gen} from '@ryanatkn/gro';

export const gen: Gen = async ({origin_id}) => {
	const dir = origin_id.replace(/\/[^/]+$/, '');

	const all_files = await readdir(dir);

	// Find .svelte files (exclude +page.svelte which is just a wrapper)
	const svelte_files = all_files.filter((f) => f.endsWith('.svelte') && !f.startsWith('+'));

	// Find .svelte.ts files (runes modules)
	const module_files = all_files.filter((f) => f.endsWith('.svelte.ts'));

	// Compile .svelte components
	const svelte_results = await Promise.all(
		svelte_files.map(async (filename) => {
			const source = await readFile(`${dir}/${filename}`, 'utf-8');
			const result = compile(source, {
				filename,
				generate: 'client',
			});
			const output_filename = filename.replace(/\.svelte$/, '.js');

			return {
				content: '// @ts-nocheck\n' + result.js.code,
				filename: output_filename,
			};
		}),
	);

	// Compile .svelte.ts modules (strip TypeScript first)
	const module_results = await Promise.all(
		module_files.map(async (filename) => {
			const ts_source = await readFile(`${dir}/${filename}`, 'utf-8');
			const source = ts_blank_space(ts_source);
			const result = compileModule(source, {
				filename,
				generate: 'client',
			});
			const output_filename = filename.replace(/\.svelte\.ts$/, '.svelte.js');

			return {
				content: '// @ts-nocheck\n' + result.js.code,
				filename: output_filename,
			};
		}),
	);

	return [...svelte_results, ...module_results];
};
