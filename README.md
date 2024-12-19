# Dealt

> toy 2D web game engine with a focus on topdown action RPGs 🔮

[**dealt.dev**](https://www.dealt.dev/)

> ⚠️ Dealt is pre-alpha and still experimenting with different patterns. (it's messy)
> If you're interested in the code or design I'm seeking collaborators!
> The first release took about a month of full-time work spread over 5 months,
> and I plan to work on it long-term as a hobby and make games.

## About

Dealt is a toy 2D web game engine that's designed primarily for topdown action RPGs.
It's in early development and being built in public.

Dealt's goal is to be flexible for a variety of usecases,
and have batteries included for super fun 2D action RPGs.
These batteries can be ignored to create completely custom experiences
like visualizations and simulations and websites with zap.
The plan is to create a compelling game at the same time as its engine and editor.

Players can create custom levels and mods along with full games,
both with a drag-and-drop interface and using Dealt as a library in a dev environment.

The tech:

- UI with [Svelte](https://github.com/sveltejs/svelte)
- TypeScript with a static SvelteKit frontend
- GPU-accelerated rendering with [PixiJS](https://github.com/pixijs/pixijs)
- efficient customizable arcade physics
  based on [`collisions`](https://github.com/sinova/collisions)
  and [`poly-decomp`](https://github.com/schteppe/poly-decomp.js)
  (as integrated custom forks)
- best-effort rendering compatibility with SVG in Svelte, raw SVG, and
  [2D canvas](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

For programmers, Dealt is also an open source library (not yet published, will be soon)
that exports its internals for custom usage in TypeScript and Svelte.
Despite its focus on a particular kind of action RPG,
Dealt also aims to be a flexible tool for making many kinds of experiences.
Don't let my choices limit you!
(hard limits include my choosing the web, two dimensions,
Svelte, TypeScript, and <a href="https://pixijs.com/">PixiJS</a>)

Visit [dealt.dev](https://www.dealt.dev/) to play around 🔮

## Limitations

- this is a toy, not a professional-grade game engine,
  but in the distant future I hope to release commercial games with it
- the editor will not support mobile devices and small screens for development,
  but it will be possible to make mobile-friendly experiences for players
- 2D rendering and physics

## Goals

- create and share games in the browser with no server needed,
  including arbitrary code extensions
- unify the development and play experiences,
  where the editor can be attached to a running game for realtime modifications,
  but players don't pay the cost of the editor by default
- snapshot game state and resume from any point (for development, debugging, and gameplay)
- seamless UX between gameplay and web content (like the game wiki could be ingame,
  and websites can be made with the game content rendered in various ways)
- fun

## Credits 🐢<sub>🐢</sub><sub><sub>🐢</sub></sub>

Adapts [`collisions`](https://github.com/sinova/collisions)
by Sinova ([@sinova](https://github.com/sinova),
[MIT](https://github.com/Sinova/Collisions/blob/master/LICENSE))
and [`poly-decomp`](https://github.com/schteppe/poly-decomp.js) by
by Stefan Hedman ([@schteppe](https://github.com/schteppe),
[MIT](https://github.com/schteppe/poly-decomp.js/blob/master/LICENSE),
[steffe.se](https://steffe.se)).

[PixiJS](https://github.com/pixijs/pixijs) ∙
[Svelte](https://github.com/sveltejs/svelte) ∙
[SvelteKit](https://github.com/sveltejs/kit) ∙
[Vite](https://github.com/vitejs/vite) ∙
[esbuild](https://github.com/evanw/esbuild) ∙
[uvu](https://github.com/lukeed/uvu) ∙
[TypeScript](https://github.com/microsoft/TypeScript) ∙
[ESLint](https://github.com/eslint/eslint) ∙
[Prettier](https://github.com/prettier/prettier) ∙
[Moss](https://github.com/ryanatkn/moss) ∙
[Fuz](https://github.com/ryanatkn/fuz) ∙
[Gro](https://github.com/ryanatkn/gro) ∙
[@ryanatkn/belt](https://github.com/ryanatkn/belt) ∙
[Zod](https://github.com/colinhacks/zod) ∙
& [more](package.json)

## License [🐦](https://wikipedia.org/wiki/Free_and_open-source_software)

[MIT](LICENSE)
