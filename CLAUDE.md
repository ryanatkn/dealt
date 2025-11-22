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

## Ripple Integration

**Approach:** Ripple has its own complete implementation (units, simulation loop, rendering) separate from Svelte's. The two share only pure functions and types.

**Key files:**
- `ripple/ripple_scene.ripple` - Full Ripple scene with simulation loop
- `ripple/ripple_unit.ripple` - Ripple unit factory using `TrackedObject`
- `Scene_Renderer_Ripple.svelte` - Svelte wrapper, lifecycle bridge

**Integration:**
- Uses `vite-plugin-ripple` for `.ripple` file support
- Ripple components imported via `mount()` API
- Spawn demo: Unified clock (Svelte's RAF drives Ripple's update function)
- Zoo: Ripple owns everything including RAF loop
- Lazy serialization: Only converts to JSON when switching renderers

**Critical Pattern - `untrack()` for mutating effects:**
```ripple
// When effect() calls code that mutates reactive collections, wrap in untrack()
effect(() => {
  const count = @agent_count;           // dependency
  untrack(() => create_agents(count));  // mutations don't re-trigger effect
});
```

**Status:** Fully functional with reactive rendering. See `/zoo/ripple_idiomatic` for standalone Ripple implementation.

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
│       ├── ripple_scene.ripple     - Scene with simulation loop
│       └── ripple_unit.ripple      - Unit factory
├── routes/
│   ├── demo/spawn/                 - Spawn demo (switchable renderers)
│   └── zoo/                        - Framework comparison testbed
│       ├── svelte_idiomatic/       - Pure Svelte 5 implementation
│       └── ripple_idiomatic/       - Pure Ripple implementation (owns RAF)
│           ├── Zoo_Ripple.svelte   - Minimal mount wrapper
│           ├── zoo_ripple.ripple   - Component (state, RAF, simulation, UI)
│           └── zoo_ripple_agent.ts - Agent types and constants
└── ...
```

### Running

```bash
npm install
gro typecheck    # type checking
gro test         # run tests
gro lint         # lint code
```

**Note:** Always use `gro` commands directly (not `npx @ryanatkn/gro`).

## Architecture Principles

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.**

Dealt prioritizes **idiomatic, performant implementations** over code reuse:

**Code Sharing Strategy:**
- ✅ **Share:** Pure functions, interfaces/types, framework-agnostic algorithms
- ❌ **Don't share:** Reactive classes, framework-specific patterns, simulation loops

**Performance over DRY.** Each framework owns its idioms. Duplication is acceptable when it enables better performance or cleaner framework-specific code.

## Project Goals

- Educational toy for exploring 2D game engine concepts
- Testbed for comparing rendering approaches (SVG, Canvas, WebGL, Ripple)
- Clean architecture with pluggable systems
- Maximize performance through idiomatic framework usage
- TypeScript-first with strong typing
