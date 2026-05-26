/**
 * Core Unit type definitions and constants.
 * Pure TypeScript with no Svelte dependencies - can be used in both Svelte and Ripple.
 */

import type {Flavored} from '@ryanatkn/belt/types.js';
import {identity} from '@ryanatkn/belt/function.js';

import type {I_Point} from '$lib/point_helpers.js';
import type {Behavior_Json} from '$lib/behavior.svelte.js';
import type {Id} from '$lib/id.js';

// Constants
export const HANDLE_SIZE = 24;

export const RADIUS_MIN = 0;
export type Unit_Radius = Flavored<number, 'Unit_Radius'>;
export const parse_radius = (value: number): Unit_Radius => Math.max(RADIUS_MIN, value);

export type Unit_Scale = Flavored<number, 'Unit_Scale'>;
export const parse_scale: (value: number) => Unit_Scale = identity;

/**
 * `rotation` in radians.
 */
export type Unit_Rotation = Flavored<number, 'Unit_Rotation'>;
export const parse_rotation = (value: number): Unit_Rotation => value % (Math.PI * 2);

export const STRENGTH_DEFAULT: Unit_Strength = 1;
export const STRENGTH_MAX: Unit_Strength = 100_000_000_000;
export const STRENGTH_MIN: Unit_Strength = 0.001;
export type Unit_Strength = Flavored<number, 'Unit_Strength'>;

export const SPEED_FASTEST = 1;
export const SPEED_FASTER = 0.62;
export const SPEED_FAST = 0.38;
export const SPEED_MEDIUM = 0.24;
export const SPEED_SLOW = 0.15;
export const SPEED_SLOWER = 0.09;
export const SPEED_SLOWEST = 0.056;
export const SPEED_ALMOST_ZERO = 0.0022;
export const SPEED_DEFAULT = SPEED_MEDIUM;

export type Unit_Id = Id | Flavored<number, 'Unit_Id'>;
export type Unit_Name = Flavored<string, 'Unit_Name'>;
export type Unit_Type = 'circle' | 'polygon';

/**
 * Serializable Unit data structure.
 * Can be used to create Svelte Units or Ripple units.
 */
export interface Unit_Json {
	id: Unit_Id;
	name: Unit_Name;
	behaviors: Array<Behavior_Json>;
	dead: boolean;
	type: Unit_Type;
	x: number;
	y: number;
	rotation: Unit_Rotation;
	velocity: number;
	speed: number;
	strength: number;
	movement_multiplier: number;
	direction_x: number;
	direction_y: number;
	teleporting_x: number;
	teleporting_y: number;
	scale: Unit_Scale;
	// polygon
	points: Array<I_Point>;
	// circle
	radius: Unit_Radius;
}

/**
 * Default values for Unit_Json.
 * Note: `id` throws an error - must be explicitly set.
 */
export const default_unit_json = (): Unit_Json => ({
	get id(): Unit_Id {
		throw Error('cannot access `id` of default_unit_json, use `random_id()` instead');
	},
	name: '',
	behaviors: [],
	dead: false,
	type: 'circle',
	x: 0,
	y: 0,
	rotation: 0,
	velocity: 0,
	speed: SPEED_DEFAULT,
	strength: STRENGTH_DEFAULT,
	movement_multiplier: 1,
	direction_x: 0,
	direction_y: 0,
	teleporting_x: 0,
	teleporting_y: 0,
	scale: 1,
	points: [],
	radius: 10,
});
