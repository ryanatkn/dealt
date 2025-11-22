/**
 * Gen file to compile .ripple files to JavaScript.
 *
 * This bypasses the vite-plugin-ripple SSR bundling issue by pre-compiling
 * Ripple components to JS at generation time. The compiled output is also
 * useful for comparing framework outputs directly.
 *
 * Pattern: `ripple.gen.ts` outputs multiple files via array return.
 */

import {readFile, readdir} from 'node:fs/promises';
import {compile} from 'ripple/compiler';
import type {Gen} from '@ryanatkn/gro';

export const gen: Gen = async ({origin_id}) => {
	const dir = origin_id.replace(/\/[^/]+$/, '');

	// Find all .ripple files in this directory
	const all_files = await readdir(dir);
	const files = all_files.filter((f) => f.endsWith('.ripple'));

	// Compile each to client-side JS
	return Promise.all(
		files.map(async (filename) => {
			const source = await readFile(`${dir}/${filename}`, 'utf-8');
			const result = compile(source, filename, {mode: 'client'});
			const output_filename = filename.replace(/\.ripple$/, '.js');

			return {
				content: '// @ts-nocheck\n' + result.js.code,
				filename: output_filename,
			};
		}),
	);
};
