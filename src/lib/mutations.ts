import type {Action} from '$lib/actions.js';
import type {Editor} from '$lib/editor.svelte.js';

// TODO @many implement actions/mutations

// TODO enforce JSON serializability (but what about ephemeral ids for ui entities that aren't saved? e.g. closing a menu)
// an alternative design to this is to make the methods of objects
// optionally compose a centralized action dispatcher,
// with hooks into the process (just inverting the authoring experience,
// and making it so you don't have to change how the plain functions are used in your UI layer)

export const mutate = (action: Action, editor: Editor): void => {
	console.log(`[mutate] action`, action);
	switch (action.kind) {
		case 'play_level': {
			editor.stop_playing_level();
			break;
		}
		case 'stop_playing_level': {
			editor.stop_playing_level();
			break;
		}
		case 'update_unit': {
			// editor.scene.update_unit(action.unit, action.value);
			// update_unit = (unit_id: Unit_Id, value: Partial<Unit_Json>): void => {
			// 	const unit = this.units.get(unit_id);
			// 	if (unit) {
			// 		for (const k in value) {
			// 			(unit as any)[k] = (value as any)[k];
			// 		}
			// 	}
			// };
			break;
		}
	}
};
