import type {SvelteComponent} from 'svelte';

import Aquarius from './Aquarius.svelte';
import Aries from './Aries.svelte';
import Cancer from './Cancer.svelte';
import Capricorn from './Capricorn.svelte';
import Gemini from './Gemini.svelte';
import Leo from './Leo.svelte';
import Libra from './Libra.svelte';
import Pisces from './Pisces.svelte';
import Sagittarius from './Sagittarius.svelte';
import Scorpio from './Scorpio.svelte';
import Taurus from './Taurus.svelte';
import Virgo from './Virgo.svelte';

export const zodiacComponents: typeof SvelteComponent[] = [
	Aquarius,
	Aries,
	Cancer,
	Capricorn,
	Gemini,
	Leo,
	Libra,
	Pisces,
	Sagittarius,
	Scorpio,
	Taurus,
	Virgo,
];
