import {is_editable} from '@ryanatkn/belt/dom.js';

// TODO this is currently broken for buttons with controls like spacebar,
// but the problem is we want most global controls to work when buttons are selected,
// I think, or we'll have to add a lot of exceptions to improve the UX
export const enable_global_hotkeys = (target: unknown): boolean => !target || !is_editable(target);
