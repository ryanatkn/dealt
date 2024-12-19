import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {Circle} from '$lib/circle.js';
import {colliding} from '$lib/colliding.js';
import {Collision_Result} from '$lib/collision_result.js';

test('colliding two circles at the same position', () => {
	const x = 10;
	const y = 17;
	const a = new Circle(x, y, 15);
	const b = new Circle(x, y, 15);
	const cr = new Collision_Result();
	colliding(a, b, cr);
	assert.is(cr.overlap_x, 0);
});

test.run();
