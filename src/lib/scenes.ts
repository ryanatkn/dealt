import {random_id} from '$lib/id.js';
import type {Scene_Json} from '$lib/scene.svelte.js';

export const create_scene_empty = (): Scene_Json => ({
	id: random_id(),
	name: 'empty scene',
	glyph: '▩',
	units: [],
});

export const create_scene_simple = (): Scene_Json => ({
	id: random_id(),
	name: 'simple scene',
	glyph: '▧',
	units: [
		{type: 'circle', x: 50, y: 50, radius: 10},
		{type: 'circle', x: 85, y: 85, radius: 20},
		{
			type: 'polygon',
			x: 137,
			y: 144,
			rotation: -0.429,
			scale: 1.53,
			points: [
				{x: -34, y: -5},
				{x: 28, y: -24},
				{x: 11, y: 32},
			],
		},
	],
});

export const create_scene_adventure = (): Scene_Json => ({
	id: random_id(),
	name: 'adventure',
	glyph: '⛰',
	units: [
		{
			name: 'player',
			type: 'circle',
			x: 151,
			y: 172,
			radius: 9,
			behaviors: [{name: 'Player_Controller_Behavior'}],
		},
		{
			name: 'portal',
			type: 'circle',
			x: 14,
			y: 249,
			scale: 1.5,
			radius: 5,
			behaviors: [{name: 'Goal_Behavior'}],
		},
		{
			type: 'polygon',
			x: 40,
			y: 40,
			rotation: 0.2,
			scale: 1.9,
			points: [
				{x: -10, y: 40},
				{x: -100, y: 20},
				{x: 10, y: -55},
				{x: 50, y: 20},
			],
		},
		{
			type: 'polygon',
			x: 260,
			y: 260,
			rotation: 1.8,
			scale: 1.5,
			points: [
				{x: -10, y: 50},
				{x: -50, y: 20},
				{x: -40, y: -10},
				{x: 10, y: -30},
				{x: 50, y: 20},
			],
		},
		{type: 'circle', x: 235, y: 115, radius: 5},
		{type: 'circle', x: 275, y: 75, radius: 5},
		{type: 'circle', x: 255, y: 110, radius: 5},
		{type: 'circle', x: 260, y: 135, radius: 5},
		{type: 'circle', x: 240, y: 80, radius: 5},
		{type: 'circle', x: 230, y: 65, radius: 5},
		{type: 'circle', x: 260, y: 85, radius: 5},
		{type: 'circle', x: 275, y: 97, radius: 5},
		{type: 'circle', x: 280, y: 115, radius: 5},
		{type: 'circle', x: 265, y: 122, radius: 5},
		{type: 'circle', x: 245, y: 100, radius: 5},
		{type: 'circle', x: 285, y: 128, radius: 5},
		{type: 'circle', x: 300, y: 135, radius: 5},
		{type: 'circle', x: 290, y: 85, radius: 5},
		{type: 'circle', x: 295, y: 105, radius: 5},
		{type: 'circle', x: 35, y: 210, radius: 24, behaviors: [{name: 'Harmful_Behavior'}]},
		{
			type: 'polygon',
			x: 95,
			y: 250,
			rotation: 1.1,
			scale: 1.7,
			points: [
				{x: -10, y: 50},
				{x: -8, y: -15},
				{x: 10, y: -30},
				{x: 50, y: 20},
			],
			behaviors: [{name: 'Harmful_Behavior'}],
		},
	],
});

export const create_scene_another_adventure = (): Scene_Json => ({
	id: random_id(),
	name: 'another_adventure',
	glyph: '🏔',
	units: [
		{type: 'circle', x: 206, y: 91, radius: 5},
		{type: 'circle', x: 213, y: 120, radius: 5},
		{type: 'circle', x: 223, y: 128, radius: 5},
		{type: 'circle', x: 266, y: 53, radius: 5},
		{type: 'circle', x: 232, y: 133, radius: 5},
		{type: 'circle', x: 241, y: 137, radius: 5},
		{type: 'circle', x: 225, y: 72, radius: 5},
		{type: 'circle', x: 237, y: 66, radius: 5},
		{type: 'circle', x: 280, y: 48, radius: 5},
		{type: 'circle', x: 252, y: 59, radius: 5},
		{type: 'circle', x: 214, y: 78, radius: 5},
		{type: 'circle', x: 209, y: 105, radius: 5},
		{type: 'circle', x: 77, y: 159, radius: 24},
		{type: 'circle', x: 175, y: 164, radius: 24},
		{
			type: 'polygon',
			x: 155,
			y: 98,
			rotation: -0.1,
			points: [
				{x: -10, y: 40},
				{x: -100, y: 20},
				{x: 10, y: -55},
				{x: 50, y: 20},
			],
		},
		{
			type: 'polygon',
			x: 123,
			y: 201,
			rotation: -0.2,
			points: [
				{x: -10, y: 50},
				{x: -50, y: 20},
				{x: -40, y: -10},
				{x: 10, y: -30},
				{x: 50, y: 20},
			],
		},
	],
});

export interface Scene_Creator {
	name: string;
	glyph: string;
	create: () => Scene_Json;
}

// TODO duplicates the source of truth for `name` and `glyph`
export const scene_creators: Array<Scene_Creator> = [
	{name: 'empty', glyph: '▩', create: create_scene_empty},
	{name: 'simple', glyph: '▧', create: create_scene_simple},
	{name: 'adventure', glyph: '⛰', create: create_scene_adventure},
	{name: 'another_adventure', glyph: '🏔', create: create_scene_another_adventure},
];
