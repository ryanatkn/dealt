import type {Body} from '@ryanatkn/collisions';

export interface Entity extends Body {
	speed: number;
	direction_x: number;
	direction_y: number;
}
