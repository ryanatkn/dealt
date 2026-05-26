# Zoo Route - High Level Design

## Purpose

The zoo is a testbed for comparing **idiomatic implementations** across different frameworks. Unlike the spawn demo (one scene with switchable renderers), the zoo has **completely separate code paths** for each framework.

## Architecture

```
/zoo
├── +page.svelte              # Landing page
├── svelte_idiomatic/         # Pure Svelte 5 implementation
│   ├── Zoo_Svelte.svelte     # Component + controls + SVG rendering
│   └── zoo_svelte_state.svelte.ts  # Zoo_Agent class, Zoo_State class
└── ripple_idiomatic/         # Pure Ripple implementation
    ├── Zoo_Ripple.svelte     # Minimal Svelte wrapper (just mounts Ripple)
    ├── zoo_ripple.ripple     # Self-contained Ripple component (owns RAF)
    └── zoo_ripple_agent.ts   # Agent types and constants
```

## Design Principles

### 1. Idiomatic Over Shared

Each framework owns its reactive patterns:

| Concern              | Svelte                           | Ripple                     |
| -------------------- | -------------------------------- | -------------------------- |
| **Agent State**      | `Zoo_Agent` class with `$state`  | `#{}` TrackedObject        |
| **Agent Collection** | `Array<Zoo_Agent>` with `$state` | `#[]` TrackedArray         |
| **Simulation Loop**  | `requestAnimationFrame` in class | Internal RAF in component  |
| **Position Sync**    | Setters update collision body    | Manual sync after mutation |

### 2. Shared Pure Functions Only

From `$lib/` (no perf/design impact):

- `physics.ts` → `physics_apply_bounce`
- `collisions.ts` → BVH collision system
- `colliding.ts`, `collision_result.ts` → SAT collision detection
- `unit_types.ts` → `SPEED_DEFAULT` and other constants
- `unit_logic.ts` → `compute_unit_color`
- `point_helpers.ts` → `transform_points`, `serialize_points`

**NOT shared:** Unit/Scene classes, simulation loops, reactive state

### 3. MVP Scope

Current features:

- Circles and polygons with random sizes
- Bounce physics (separation + reflection)
- Boundary walls
- Configurable: agent count, scale, simulation speed
- Play/pause
- FPS display

## Svelte Implementation

```
Zoo_State (owns everything)
├── agents: Array<Zoo_Agent>     # $state array
├── collisions: Collisions       # BVH system
├── RAF loop                     # Drives simulation
└── create_agents()              # Populates on init/config change

Zoo_Agent (reactive entity)
├── x, y with setters            # Sync to collision body
├── direction_x, direction_y     # Movement vector
├── speed, radius, points        # Shape properties
└── body: Some_Body              # Collision body reference
```

## Ripple Implementation

**Ripple owns everything** - Svelte is just a minimal mount wrapper:

```
Zoo_Ripple.svelte (minimal wrapper)
├── Mounts ZooRipple via mount()
├── Passes static props (width, height, colors)
└── Handles unmount cleanup

zoo_ripple_agent.ts (pure TypeScript)
├── Zoo_Ripple_Agent interface
├── BOUNDS_SIZE constant
└── WALL_AGENT constant (hot path optimization)

ZooRipple component (zoo_ripple.ripple)
├── State (track())
│   ├── simulation_speed, agent_count, agent_scale
│   ├── running, fps
│   └── agents: #[] (TrackedArray of #{} TrackedObjects)
├── RAF loop (tick/start/stop, owned by Ripple)
├── Simulation (update function)
├── Controls (rendered with onInput handlers)
└── effect() for lifecycle (init agents, start/stop RAF)
```

**Key Ripple patterns used:**

- `track()` for reactive primitives with `@` operator
- `#[]` for TrackedArray, `#{}` for TrackedObject
- `effect()` for side effects and cleanup (including RAF lifecycle)
- `untrack()` to read without subscribing

**Critical: `untrack()` for mutating effects**

When an `effect()` calls code that mutates reactive collections, wrap mutations in `untrack()`:

```ripple
// ❌ Wrong - infinite loop! Mutations re-trigger the effect
effect(() => {
  const count = @agent_count;
  create_agents(count);  // mutates agents TrackedArray
});

// ✅ Correct - only depends on agent_count, not internal mutations
effect(() => {
  const count = @agent_count;
  untrack(() => create_agents(count));
});
```

## Simulation Flow (Both Implementations)

```
1. RAF tick (dt)
2. Apply simulation_speed multiplier
3. collisions.update()           # Rebuild BVH
4. PHASE 1: Movement
   └── For each agent: x += direction_x * speed * dt
5. PHASE 2: Collision Response
   └── For each potential collision:
       ├── colliding() → SAT test
       └── physics_apply_bounce() → separation + reflection
6. Render (framework reactivity handles this)
```

## Future Directions

- **Editing:** Select/drag agents, modify properties
- **Behaviors:** Wander, follow, flee, flock (pluggable per agent)
- **Performance:** Compare frameworks at scale
- **Persistence:** URL hash or localStorage state
