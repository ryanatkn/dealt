import {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';
import {ripple} from 'vite-plugin-ripple';

export default defineConfig({
	plugins: [sveltekit(), ripple()],
});
