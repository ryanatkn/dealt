import type {Entity} from '$lib/tar/entity';

export class Simulation {
	player: Entity = {name: 'player', x: 100, y: 100, speed: 10};
	entities: Entity[] = [this.player];

	// TODO
	// update(dt: number) {}

	// TODO extract to input manager
	handle_input(e: KeyboardEvent) {
		const {key} = e;
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.player.x -= this.player.speed;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.player.x += this.player.speed;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.player.y -= this.player.speed;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.player.y += this.player.speed;
				break;
			}
			default: {
				console.log('key', key);
			}
		}
	}
}
