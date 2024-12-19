import {Bench} from 'tinybench';

// import * as c1 from '$lib/Collisions.js';
// import * as c2 from '$lib/Collisions.js';
// import {Spawn} from './spawn.js';

// TODO do the stress test version of this with a bunch of objects bouncing around

const bench = new Bench({warmupIterations: 2, iterations: 5});

// const benchmark = (c: typeof c1) => {
// 	// TODO prebake the values so random isn't being called
// 	const stress = new Spawn(c);

// 	// TODO drive
// 	for (let i = 0; i < 1000; i++) {
// 		stress.onframe();
// 	}
// };

bench
	.add('c1', () => {
		// benchmark(c1);
	})
	.add('c2', () => {
		// benchmark(c2);
	});
// .todo('unimplemented bench');

await bench.run();

console.table(bench.table());
