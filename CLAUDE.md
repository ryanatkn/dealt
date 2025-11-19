# Dealt - 2D Game Engine

## Overview

**Dealt** is a toy 2D web game engine focused on topdown action RPGs, built with SvelteKit and TypeScript.

## Core Architecture

### Pluggable Renderer System

The engine uses a renderer abstraction that allows swapping between different rendering backends:

- **pixi** - WebGL via PixiJS (most performant)
- **svelte** - Svelte components rendering SVG
- **canvas** - Canvas 2D API
- **html** - Raw HTML/SVG string insertion
- **ripple** - RippleJS framework (experimental)

**Pattern:**
```typescript
type Renderer_Component = Component<{scene: Scene; renderer: Renderer}>;
```

Each renderer implements this interface in a `Scene_Renderer_*` component that's registered in `renderer_components.ts`.

### Scene & Unit System

**Units** are game objects (circles or polygons) with reactive properties:
- Transform: `x`, `y`, `rotation`, `scale`
- Shape: `type` ('circle' | 'polygon'), `radius`, `points`
- Visual: `color` (derived from behaviors)

**Scenes** manage collections of units and orchestrate updates via the simulation loop.

**Reactivity:** Units use Svelte 5 runes (`$state`, `$derived`) for reactive properties with getter/setter callbacks for external renderers (PixiJS) to subscribe to changes.

### Physics & Collisions

- Custom arcade physics with velocity-based movement
- BVH (Bounding Volume Hierarchy) for efficient collision detection
- Supports circles and convex/concave polygons

### Spawn Demo

Located at `/demo/spawn` - physics simulation showcasing:
- Configurable unit count, scale, and simulation speed
- Units bounce off each other and boundaries
- Renderer switching to compare implementations

## Ripple Integration (Experimental)

### Architecture

**Challenge:** Ripple uses `track()` for reactivity which only works in `.ripple` files. Svelte uses `$state` runes. These don't interoperate directly.

**Current Approach:**
```
Svelte wrapper (.svelte)
  ↓ mount() with props
Ripple components (.ripple)
  ↓ render once (static)
SVG output
```

**Files:**
- `Scene_Renderer_Ripple.svelte` - Svelte wrapper, handles lifecycle
- `ripple/Scene_Renderer_Ripple_Internal.ripple` - Main Ripple scene component
- `ripple/Unit_Renderer_Ripple.ripple` - Renders individual units

**Status:** Static rendering implemented, reactivity TBD.

### Key Constraints

1. **Cannot use `track()` or `@` in `.svelte` files** - Ripple syntax only works in `.ripple` files
2. **`track()` requires component context** - can't be at module level
3. **Props passed from Svelte are plain values** - not Ripple tracked objects
4. **Reactivity boundary** - need strategy to sync Svelte state → Ripple rendering

### Integration with SvelteKit

- Uses `vite-plugin-ripple` for `.ripple` file support
- Ripple components imported into Svelte via `mount()` API
- Clean separation: Svelte for app structure, Ripple for rendering

## Development

### File Structure

```
src/
├── lib/
│   ├── renderer.svelte.ts         - Renderer types & abstractions
│   ├── renderer_components.ts     - Renderer registry
│   ├── scene.svelte.ts             - Scene class
│   ├── unit.svelte.ts              - Unit class
│   ├── Scene_Renderer_*.svelte     - Renderer implementations
│   └── ripple/                     - Ripple components
│       ├── Scene_Renderer_Ripple_Internal.ripple
│       └── Unit_Renderer_Ripple.ripple
├── routes/
│   └── demo/spawn/                 - Spawn demo
└── ...
```

### Running

```bash
npm install
npm run dev  # or: gro dev
```

## Project Goals

- Educational toy for exploring 2D game engine concepts
- Testbed for comparing rendering approaches (SVG, Canvas, WebGL, Ripple)
- Clean architecture with pluggable systems
- TypeScript-first with strong typing
