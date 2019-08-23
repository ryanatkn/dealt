import './styles.css';
import App from './App.svelte';

const rootElId = 'root';
const root = document.getElementById(rootElId);
if (!root) throw Error(`Cannot find app target element with id '${rootElId}'`);

export const app = new App({
	target: root,
	props: {
		name: 'tarot', // TODO! config..
	},
});

(window as any).app = app;
