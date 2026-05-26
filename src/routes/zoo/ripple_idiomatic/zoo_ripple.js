// @ts-nocheck
import * as _$_ from 'ripple/internal/client';

var root = _$_.template(
	`<div class="ripple-bxd7m7 zoo-ripple"><form class="ripple-bxd7m7 controls"><div class="ripple-bxd7m7 row"><label class="ripple-bxd7m7"><span>simulation speed</span><input type="number" class="ripple-bxd7m7"></label><input type="range" class="ripple-bxd7m7"></div><fieldset class="ripple-bxd7m7"><div class="ripple-bxd7m7 row"><label class="ripple-bxd7m7"><span>agent count</span><input type="number" class="ripple-bxd7m7"></label><input type="range" class="ripple-bxd7m7"></div><div class="ripple-bxd7m7 row"><label class="ripple-bxd7m7"><span>agent scale</span><input type="number" class="ripple-bxd7m7"></label><input type="range" class="ripple-bxd7m7"></div></fieldset><div class="ripple-bxd7m7 row"><button type="button"> </button></div></form><p class="ripple-bxd7m7 stats"> </p><svg></svg></div>`,
	1,
);
var root_1 = _$_.template(`<!>`, 33);
var root_3 = _$_.template(`<!>`, 33);
var root_4 = _$_.template(`<polygon></polygon>`, 32);
var root_2 = _$_.template(`<circle></circle>`, 32);

import {track, effect, untrack} from 'ripple';
import {random_float, random_int} from '@ryanatkn/belt/random.js';
import {create_random_alea} from '@ryanatkn/belt/random_alea.js';
import {transform_points, serialize_points} from '$lib/point_helpers.js';
import {compute_unit_color} from '$lib/unit_logic.js';
import '$lib/renderer.svelte.js';
import {Collisions} from '$lib/collisions.js';
import {colliding} from '$lib/colliding.js';
import {cr} from '$lib/collision_result.js';
import {physics_apply_bounce} from '$lib/physics.js';
import {SPEED_DEFAULT} from '$lib/unit_types.js';
import {BOUNDS_SIZE, WALL_AGENT} from './zoo_ripple_agent.js';

export function ZooRipple(__anchor, props, __block) {
	_$_.push_component();

	var fragment = root();
	var div_2 = _$_.child_frag(fragment);
	var form_1 = _$_.child(div_2);
	var div_1 = _$_.child(form_1);
	var label_1 = _$_.child(div_1);
	var span_1 = _$_.child(label_1);
	var input_1 = _$_.sibling(span_1);
	var input_2 = _$_.sibling(label_1);
	var fieldset_1 = _$_.sibling(div_1);
	var div_3 = _$_.child(fieldset_1);
	var label_2 = _$_.child(div_3);
	var span_2 = _$_.child(label_2);
	var input_3 = _$_.sibling(span_2);
	var input_4 = _$_.sibling(label_2);
	var div_4 = _$_.sibling(div_3);
	var label_3 = _$_.child(div_4);
	var span_3 = _$_.child(label_3);
	var input_5 = _$_.sibling(span_3);
	var input_6 = _$_.sibling(label_3);
	var div_5 = _$_.sibling(fieldset_1);
	var button_1 = _$_.child(div_5);
	var text = _$_.child(button_1);
	var p_1 = _$_.sibling(form_1);
	var text_1 = _$_.child(p_1);
	var svg_1 = _$_.sibling(p_1);
	let simulation_speed = track(1, void 0, void 0, __block);
	let agent_count = track(72, void 0, void 0, __block);
	let agent_scale = track(1, void 0, void 0, __block);
	let running = track(true, void 0, void 0, __block);
	let fps = track(0, void 0, void 0, __block);
	const speed_min = 0;
	const speed_max = 3;
	const speed_step = 0.002;
	const count_min = 1;
	const count_max = 1000;
	const scale_min = 0.1;
	const scale_max = 5;
	const scale_step = 0.01;
	let collisions = _$_.with_scope(__block, () => new Collisions());
	const agents = _$_.tracked_array([], __block);
	let frame_id = null;
	let last_time = null;
	let frame_count = 0;
	let fps_total = 0;

	function create_agent(
		id,
		type,
		x,
		y,
		radius,
		points,
		rotation,
		scale,
		speed,
		direction_x,
		direction_y,
	) {
		const transformed_points =
			type === 'polygon'
				? _$_.with_scope(__block, () => transform_points(points, rotation, scale))
				: [];

		const color = _$_.with_scope(__block, () =>
			compute_unit_color(false, type, true, false, [], props.colors),
		);

		return _$_.tracked_object(
			{
				id,
				dead: false,
				type,
				x,
				y,
				rotation,
				scale,
				speed,
				direction_x,
				direction_y,
				radius,
				points,
				transformed_points,
				color,
				body: undefined,
			},
			__block,
		);
	}

	function create_bounds(width, height) {
		const top = _$_.with_scope(__block, () =>
			collisions.create_polygon(0, 0, [
				{x: 0, y: 0},
				{x: 0, y: -BOUNDS_SIZE},
				{x: width, y: -BOUNDS_SIZE},
				{x: width, y: 0},
			]),
		);

		top.is_wall = true;

		const right = _$_.with_scope(__block, () =>
			collisions.create_polygon(0, 0, [
				{x: width, y: 0},
				{x: width + BOUNDS_SIZE, y: 0},
				{x: width + BOUNDS_SIZE, y: height},
				{x: width, y: height},
			]),
		);

		right.is_wall = true;

		const bottom = _$_.with_scope(__block, () =>
			collisions.create_polygon(0, 0, [
				{x: width, y: height},
				{x: width, y: height + BOUNDS_SIZE},
				{x: 0, y: height + BOUNDS_SIZE},
				{x: 0, y: height},
			]),
		);

		bottom.is_wall = true;

		const left = _$_.with_scope(__block, () =>
			collisions.create_polygon(0, 0, [
				{x: 0, y: height},
				{x: -BOUNDS_SIZE, y: height},
				{x: -BOUNDS_SIZE, y: 0},
				{x: 0, y: 0},
			]),
		);

		left.is_wall = true;
	}

	function create_agents(count, scale) {
		agents.length = 0;
		collisions = _$_.with_scope(__block, () => new Collisions());

		const random_alea = _$_.with_scope(__block, () => create_random_alea(count, scale));
		const random = (min, max) => _$_.with_scope(__block, () => random_float(min, max, random_alea));

		create_bounds(props.width, props.height);

		const size = 5;

		for (let i = 0; i < count; i++) {
			const large = _$_.with_scope(__block, random_alea) > 0.5 ? i % 16 === 0 : false;
			const min_size = size * 1 * (large ? 4.2 * scale : scale);
			const max_size = size * 2.5 * (large ? 4.2 * scale : scale);
			const x = random(0, props.width);
			const y = random(0, props.height);
			const direction = (random(0, 360) * Math.PI) / 180;
			const direction_x = _$_.with_scope(__block, () => Math.cos(direction));
			const direction_y = _$_.with_scope(__block, () => Math.sin(direction));
			let agent;

			if (_$_.with_scope(__block, random_alea) > 0.7) {
				const radius = random(min_size, max_size);

				agent = create_agent(
					i,
					'circle',
					x,
					y,
					radius,
					[],
					0,
					1,
					SPEED_DEFAULT * random(0.1, 1),
					direction_x,
					direction_y,
				);
				agent.body = _$_.with_scope(__block, () => collisions.create_circle(x, y, radius, 1));
			} else {
				let points = [
					{
						x: -random(min_size, max_size),
						y: -random(min_size, max_size),
					},

					{
						x: random(min_size, max_size),
						y: -random(min_size, max_size),
					},

					{x: random(min_size, max_size), y: random(min_size, max_size)},

					{
						x: -random(min_size, max_size),
						y: random(min_size, max_size),
					},
				];

				if (_$_.with_scope(__block, random_alea) > 0.17) {
					const index_to_remove = _$_.with_scope(__block, () =>
						random_int(0, points.length - 1, random_alea),
					);

					points = _$_.with_scope(__block, () =>
						points.filter((_, idx) => idx !== index_to_remove),
					);
				}

				const rotation = (random(0, 360) * Math.PI) / 180;

				agent = create_agent(
					i,
					'polygon',
					x,
					y,
					0,
					points,
					rotation,
					1,
					SPEED_DEFAULT * random(0.1, 1),
					direction_x,
					direction_y,
				);
				agent.body = _$_.with_scope(__block, () =>
					collisions.create_polygon(x, y, points, rotation, 1, 1),
				);
			}

			if (agent.body) {
				agent.body.agent = agent;
			}

			_$_.with_scope(__block, () => agents.push(agent));
		}
	}

	function update(dt) {
		if (!_$_.with_scope(__block, () => untrack(() => _$_.get(running)))) return;

		const speed = _$_.with_scope(__block, () => untrack(() => _$_.get(simulation_speed)));
		const final_dt = dt * speed;

		_$_.with_scope(__block, () => collisions.update());

		for (const agent of agents) {
			if (!agent.body || agent.dead) continue;

			const unit_speed = agent.speed * final_dt;

			if (unit_speed !== 0) {
				if (agent.direction_x !== 0) {
					agent.x += agent.direction_x * unit_speed;
					agent.body.x = agent.x;
				}

				if (agent.direction_y !== 0) {
					agent.y += agent.direction_y * unit_speed;
					agent.body.y = agent.y;
				}
			}
		}

		for (const agent of agents) {
			if (!agent.body) continue;

			for (const other_body of _$_.with_scope(__block, () => agent.body.potentials())) {
				const other_agent = other_body.agent;
				const is_wall = other_body.is_wall;

				if (_$_.with_scope(__block, () => colliding(agent.body, other_body, cr))) {
					if (is_wall) {
						_$_.with_scope(__block, () => physics_apply_bounce(agent, WALL_AGENT, cr, 1));
						agent.body.x = agent.x;
						agent.body.y = agent.y;
					} else if (other_agent) {
						_$_.with_scope(__block, () => physics_apply_bounce(agent, other_agent, cr));
						agent.body.x = agent.x;
						agent.body.y = agent.y;

						if (other_agent.body) {
							other_agent.body.x = other_agent.x;
							other_agent.body.y = other_agent.y;
						}
					}
				}
			}
		}

		frame_count++;
		fps_total += 1000 / dt;

		if (frame_count > 100) {
			_$_.set(
				fps,
				_$_.with_scope(__block, () => Math.round(fps_total / frame_count)),
			);
			frame_count = 1;
			fps_total = _$_.get(fps);
		}
	}

	function tick() {
		const now = _$_.with_scope(__block, () => performance.now());

		if (last_time !== null) {
			const dt = now - last_time;

			if (dt < 1000) {
				update(dt);
			}
		}

		last_time = now;
		frame_id = _$_.with_scope(__block, () => requestAnimationFrame(tick));
	}

	function start() {
		if (frame_id !== null) return;

		last_time = null;
		tick();
	}

	function stop() {
		if (frame_id !== null) {
			_$_.with_scope(__block, () => cancelAnimationFrame(frame_id));
			frame_id = null;
		}
	}

	function toggle() {
		_$_.set(running, !_$_.get(running));
	}

	_$_.with_scope(__block, () =>
		effect(() => {
			const count = _$_.get(agent_count);
			const scale = _$_.get(agent_scale);

			_$_.with_scope(__block, () => untrack(() => create_agents(count, scale)));
		}),
	);

	_$_.with_scope(__block, () =>
		effect(() => {
			start();

			return () => stop();
		}),
	);

	let stats = track(
		() => {
			let circles = 0;

			for (const a of agents) {
				if (a.type === 'circle') circles++;
			}

			return {circles, polygons: agents.length - circles};
		},
		void 0,
		void 0,
		__block,
	);

	{
		{
			{
				{
					input_1.__input = (e) => _$_.set(simulation_speed, +e.target.value);
					_$_.set_attribute(input_1, 'step', speed_step);
					_$_.set_attribute(input_1, 'min', speed_min);
					_$_.set_attribute(input_1, 'max', speed_max);
				}

				input_2.__input = (e) => _$_.set(simulation_speed, +e.target.value);
				_$_.set_attribute(input_2, 'step', speed_step);
				_$_.set_attribute(input_2, 'min', speed_min);
				_$_.set_attribute(input_2, 'max', speed_max);
			}

			{
				{
					{
						input_3.__input = (e) => _$_.set(agent_count, +e.target.value);
						_$_.set_attribute(input_3, 'min', count_min);
						_$_.set_attribute(input_3, 'max', count_max);
					}

					input_4.__input = (e) => _$_.set(agent_count, +e.target.value);
					_$_.set_attribute(input_4, 'min', count_min);
					_$_.set_attribute(input_4, 'max', count_max);
				}

				{
					{
						input_5.__input = (e) => _$_.set(agent_scale, +e.target.value);
						_$_.set_attribute(input_5, 'step', scale_step);
						_$_.set_attribute(input_5, 'min', scale_min);
						_$_.set_attribute(input_5, 'max', scale_max);
					}

					input_6.__input = (e) => _$_.set(agent_scale, +e.target.value);
					_$_.set_attribute(input_6, 'step', scale_step);
					_$_.set_attribute(input_6, 'min', scale_min);
					_$_.set_attribute(input_6, 'max', scale_max);
				}
			}

			{
				button_1.__click = toggle;
			}
		}

		{
			_$_.for(
				svg_1,
				() => agents,
				(__anchor, agent) => {
					var fragment_1 = root_1();
					var node = _$_.child_frag(fragment_1);

					{
						var consequent = (__anchor) => {
							var circle_1 = root_2();

							_$_.render(
								(__prev) => {
									var __a = agent.x;

									if (__prev.a !== __a) {
										_$_.set_attribute(circle_1, 'cx', (__prev.a = __a));
									}

									var __b = agent.y;

									if (__prev.b !== __b) {
										_$_.set_attribute(circle_1, 'cy', (__prev.b = __b));
									}

									var __c = agent.radius * _$_.with_scope(__block, () => Math.abs(agent.scale));

									if (__prev.c !== __c) {
										_$_.set_attribute(circle_1, 'r', (__prev.c = __c));
									}

									var __d = agent.color;

									if (__prev.d !== __d) {
										_$_.set_attribute(circle_1, 'fill', (__prev.d = __d));
									}
								},
								{a: void 0, b: void 0, c: void 0, d: void 0},
							);

							_$_.append(__anchor, circle_1);
						};

						var alternate = (__anchor) => {
							var fragment_2 = root_3();
							var node_1 = _$_.child_frag(fragment_2);

							{
								var consequent_1 = (__anchor) => {
									var polygon_1 = root_4();

									_$_.render(
										(__prev) => {
											var __a = _$_.with_scope(__block, () =>
												serialize_points(agent.x, agent.y, agent.transformed_points),
											);

											if (__prev.a !== __a) {
												_$_.set_attribute(polygon_1, 'points', (__prev.a = __a));
											}

											var __b = agent.color;

											if (__prev.b !== __b) {
												_$_.set_attribute(polygon_1, 'fill', (__prev.b = __b));
											}
										},
										{a: void 0, b: void 0},
									);

									_$_.append(__anchor, polygon_1);
								};

								_$_.if(node_1, (__render) => {
									if (agent.transformed_points.length >= 3) __render(consequent_1);
								});
							}

							_$_.append(__anchor, fragment_2);
						};

						_$_.if(node, (__render) => {
							if (agent.type === 'circle') __render(consequent);
							else __render(alternate, false);
						});
					}

					_$_.append(__anchor, fragment_1);
				},
				4,
			);
		}

		_$_.render(
			(__prev) => {
				var __a = _$_.get(running) ? 'pause' : 'play';

				if (__prev.a !== __a) {
					_$_.set_text(text, (__prev.a = __a));
				}

				var __b = `${agents.length} agents - ${_$_.get(stats).circles} circles, ${_$_.get(stats).polygons} polygons | fps: ${_$_.get(fps)}`;

				if (__prev.b !== __b) {
					_$_.set_text(text_1, (__prev.b = __b));
				}

				var __c = props.width;

				if (__prev.c !== __c) {
					_$_.set_attribute(svg_1, 'width', (__prev.c = __c));
				}

				var __d = props.height;

				if (__prev.d !== __d) {
					_$_.set_attribute(svg_1, 'height', (__prev.d = __d));
				}

				var __e = {
					border: '1px solid #444',
					backgroundColor: props.colors.background ?? 'transparent',
				};

				if (__prev.e !== __e) {
					_$_.set_style(svg_1, __e, __prev.e);
					__prev.e = __e;
				}

				_$_.set_value(input_1, _$_.get(simulation_speed));
				_$_.set_value(input_2, _$_.get(simulation_speed));
				_$_.set_value(input_3, _$_.get(agent_count));
				_$_.set_value(input_4, _$_.get(agent_count));
				_$_.set_value(input_5, _$_.get(agent_scale));
				_$_.set_value(input_6, _$_.get(agent_scale));
			},
			{a: ' ', b: ' ', c: void 0, d: void 0, e: void 0},
		);
	}

	_$_.append(__anchor, fragment);
	_$_.pop_component();
}

_$_.delegate(['input', 'click']);
