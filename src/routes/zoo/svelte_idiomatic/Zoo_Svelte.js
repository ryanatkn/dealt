// @ts-nocheck
import 'svelte/internal/disclose-version';
import * as $ from 'svelte/internal/client';
import {onMount, onDestroy} from 'svelte';
import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
import Dealt from '$lib/Dealt.svelte';
import {serialize_points} from '$lib/point_helpers.js';
import {Zoo_State} from './zoo_svelte_state.svelte.ts';

var root_4 = $.ns_template(`<circle></circle>`);
var root_6 = $.ns_template(`<polygon></polygon>`);
var root_1 = $.template(
	`<div class="p_md"><header class="pb_md"><!></header> <h1>Zoo - Svelte Idiomatic</h1> <p class="mb_md">Pure Svelte 5 implementation with $state runes.</p> <form class="width_md mb_md"><div class="row mb_sm"><label><span>simulation speed</span> <input type="number"></label> <input type="range"></div> <fieldset><div class="row mb_sm"><label><span>agent count</span> <input type="number"></label> <input type="range"></div> <div class="row mb_sm"><label><span>agent scale</span> <input type="number"></label> <input type="range"></div></fieldset> <div class="row"><button type="button"> </button></div></form> <p class="mb_sm"> </p> <svg></svg></div>`,
);

export default function Zoo_Svelte($$anchor, $$props) {
	$.push($$props, true);

	const zoo = new Zoo_State($$props.options);
	// Controls
	const speed_min = 0;
	const speed_max = 3;
	const speed_step = 0.002;
	const agent_count_min = 1;
	const agent_count_max = 1000;
	const agent_scale_min = 0.1;
	const agent_scale_max = 5;
	const agent_scale_step = 0.01;
	// Recreate agents when count or scale changes
	let prev_count = zoo.agent_count;
	let prev_scale = zoo.agent_scale;

	$.user_effect(() => {
		const count = zoo.agent_count;
		const scale = zoo.agent_scale;

		if (count !== prev_count || scale !== prev_scale) {
			prev_count = count;
			prev_scale = scale;
			zoo.create_agents();
		}
	});

	onMount(() => {
		zoo.init();
	});

	onDestroy(() => {
		zoo.destroy();
	});

	{
		const global_controls = ($$anchor) => {};
		const app_contextmenu = ($$anchor) => {};

		Dealt($$anchor, {
			global_controls,
			app_contextmenu,
			children: ($$anchor, $$slotProps) => {
				var div = root_1();
				var header = $.child(div);
				var node = $.child(header);

				Breadcrumb(node, {
					children: ($$anchor, $$slotProps) => {
						$.next();

						var text = $.text('svelte_idiomatic');

						$.append($$anchor, text);
					},
					$$slots: {default: true},
				});

				$.reset(header);

				var form = $.sibling(header, 6);
				var div_1 = $.child(form);
				var label = $.child(div_1);
				var input = $.sibling($.child(label), 2);

				$.remove_input_defaults(input);
				$.set_attribute(input, 'step', speed_step);
				$.set_attribute(input, 'min', speed_min);
				$.set_attribute(input, 'max', speed_max);
				$.reset(label);

				var input_1 = $.sibling(label, 2);

				$.remove_input_defaults(input_1);
				$.set_attribute(input_1, 'step', speed_step);
				$.set_attribute(input_1, 'min', speed_min);
				$.set_attribute(input_1, 'max', speed_max);
				$.reset(div_1);

				var fieldset = $.sibling(div_1, 2);
				var div_2 = $.child(fieldset);
				var label_1 = $.child(div_2);
				var input_2 = $.sibling($.child(label_1), 2);

				$.remove_input_defaults(input_2);
				$.set_attribute(input_2, 'min', agent_count_min);
				$.set_attribute(input_2, 'max', agent_count_max);
				$.reset(label_1);

				var input_3 = $.sibling(label_1, 2);

				$.remove_input_defaults(input_3);
				$.set_attribute(input_3, 'min', agent_count_min);
				$.set_attribute(input_3, 'max', agent_count_max);
				$.reset(div_2);

				var div_3 = $.sibling(div_2, 2);
				var label_2 = $.child(div_3);
				var input_4 = $.sibling($.child(label_2), 2);

				$.remove_input_defaults(input_4);
				$.set_attribute(input_4, 'step', agent_scale_step);
				$.set_attribute(input_4, 'min', agent_scale_min);
				$.set_attribute(input_4, 'max', agent_scale_max);
				$.reset(label_2);

				var input_5 = $.sibling(label_2, 2);

				$.remove_input_defaults(input_5);
				$.set_attribute(input_5, 'step', agent_scale_step);
				$.set_attribute(input_5, 'min', agent_scale_min);
				$.set_attribute(input_5, 'max', agent_scale_max);
				$.reset(div_3);
				$.reset(fieldset);

				var div_4 = $.sibling(fieldset, 2);
				var button = $.child(div_4);

				button.__click = () => zoo.toggle();

				var text_1 = $.child(button, true);

				$.reset(button);
				$.reset(div_4);
				$.reset(form);

				var p = $.sibling(form, 2);
				var text_2 = $.child(p);

				$.reset(p);

				var svg = $.sibling(p, 2);
				let styles;

				$.each(
					svg,
					21,
					() => zoo.agents,
					(agent) => agent.id,
					($$anchor, agent) => {
						var fragment_1 = $.comment();
						var node_1 = $.first_child(fragment_1);

						{
							var consequent = ($$anchor) => {
								var circle = root_4();

								$.template_effect(
									($0) => {
										$.set_attribute(circle, 'cx', $.get(agent).x);
										$.set_attribute(circle, 'cy', $.get(agent).y);
										$.set_attribute(circle, 'r', $0);
										$.set_attribute(circle, 'fill', $.get(agent).color);
									},
									[() => $.get(agent).radius * Math.abs($.get(agent).scale)],
								);

								$.append($$anchor, circle);
							};

							var alternate = ($$anchor, $$elseif) => {
								{
									var consequent_1 = ($$anchor) => {
										var polygon = root_6();

										$.template_effect(
											($0) => {
												$.set_attribute(polygon, 'points', $0);
												$.set_attribute(polygon, 'fill', $.get(agent).color);
											},
											[
												() =>
													serialize_points(
														$.get(agent).x,
														$.get(agent).y,
														$.get(agent).transformed_points,
													),
											],
										);

										$.append($$anchor, polygon);
									};

									$.if(
										$$anchor,
										($$render) => {
											if ($.get(agent).transformed_points.length >= 3) $$render(consequent_1);
										},
										$$elseif,
									);
								}
							};

							$.if(node_1, ($$render) => {
								if ($.get(agent).type === 'circle') $$render(consequent);
								else $$render(alternate, false);
							});
						}

						$.append($$anchor, fragment_1);
					},
				);

				$.reset(svg);
				$.reset(div);

				$.template_effect(
					($0, $1) => {
						$.set_text(text_1, zoo.running ? 'pause' : 'play');

						$.set_text(
							text_2,
							`${zoo.agents.length ?? ''} agents -
			${$0 ?? ''} circles,
			${$1 ?? ''} polygons | fps: ${zoo.fps ?? ''}`,
						);

						$.set_attribute(svg, 'width', zoo.width);
						$.set_attribute(svg, 'height', zoo.height);

						styles = $.set_style(svg, '', styles, {
							border: '1px solid #444',
							'background-color': zoo.colors.background,
						});
					},
					[
						() => zoo.agents.filter((a) => a.type === 'circle').length,
						() => zoo.agents.filter((a) => a.type === 'polygon').length,
					],
				);

				$.bind_value(
					input,
					() => zoo.simulation_speed,
					($$value) => (zoo.simulation_speed = $$value),
				);
				$.bind_value(
					input_1,
					() => zoo.simulation_speed,
					($$value) => (zoo.simulation_speed = $$value),
				);
				$.bind_value(
					input_2,
					() => zoo.agent_count,
					($$value) => (zoo.agent_count = $$value),
				);
				$.bind_value(
					input_3,
					() => zoo.agent_count,
					($$value) => (zoo.agent_count = $$value),
				);
				$.bind_value(
					input_4,
					() => zoo.agent_scale,
					($$value) => (zoo.agent_scale = $$value),
				);
				$.bind_value(
					input_5,
					() => zoo.agent_scale,
					($$value) => (zoo.agent_scale = $$value),
				);
				$.append($$anchor, div);
			},
			$$slots: {
				global_controls: true,
				app_contextmenu: true,
				default: true,
			},
		});
	}

	$.pop();
}

$.delegate(['click']);
