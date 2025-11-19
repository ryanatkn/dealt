# Dealt Architecture

## Code Sharing Strategy

### ✅ Currently Shared (Good)

These are framework-agnostic and should remain shared:

**Pure Functions:**
- `physics.ts` - Collision physics algorithms
  - `physics_apply_bounce()` - arcade bounce physics
  - `physics_apply_reflection()` - velocity reflection
  - `physics_apply_separation()` - overlap separation
  - `physics_apply_strength_separation()` - editor physics
- `collision_behavior.ts` - Game behavior logic (Player/Harmful/Goal)
- `collisions.ts` - BVH collision detection system
- `colliding.ts` - Collision detection predicates
- `point_helpers.ts` - Point and vector math
- `polygon_helpers.ts` - Polygon algorithms (simplicity check, decomposition)

**Interfaces and Types:**
- `Has_Direction` - Objects with direction_x, direction_y
- `Has_Position` - Objects with x, y
- `Has_Body` - Objects with collision body reference
- `Unit_Json` - Serialization format
- `Collision_Result` - Collision data structure
- `Renderer_Colors` - Color scheme configuration

**Framework-Agnostic Systems:**
- `Collisions` class - BVH spatial partitioning (no reactivity)
- `Clock` class - Timing and RAF management

---

## ⚠️ Currently Shared (Problematic)

These are Svelte-specific but used by Ripple:

**Svelte-Specific Classes:**

1. **`Unit` class** (`unit.svelte.ts`)
   - Uses Svelte 5 runes: `$state`, `$derived`
   - Uses `SvelteMap` for behaviors
   - Has getter/setter callbacks for external renderers
   - **Problem:** Ripple creates JSON from Svelte Units, then converts to `Ripple_Unit`

2. **`Scene` class** (`scene.svelte.ts`)
   - Uses Svelte 5 runes throughout
   - Tightly coupled to Editor/Project
   - **Problem:** Ripple receives Svelte Scene, serializes to JSON, creates Ripple units

3. **Simulation loop duplication**
   - `Simulation.update()` (simulation.svelte.ts:40-65)
   - `RippleScene.update()` (ripple_scene.ripple:92-145)
   - Both do: movement → collision → response
   - **Status:** Acceptable duplication (different reactivity systems)

---

## 🎯 Refactoring Roadmap

### Phase 1: Fix Spawn Demo Monkey-Patching ✅ DONE

**Status:** Complete

**Changes:**
- Added `Scene.collision_handler` property (configurable physics)
- Removed method replacement in spawn demo
- Spawn demo now cleanly swaps physics model via property

### Phase 2: Document Architecture Goals ✅ DONE

**Status:** Complete

**Changes:**
- Updated CLAUDE.md with Architecture Principles
- Created this ARCHITECTURE.md
- Clarified code sharing philosophy

### Phase 3: Create Ripple-Native Data Structures (TODO)

**Goal:** Ripple should not use Svelte's Unit/Scene classes

**Approach:**

1. **Create `ripple_simulation.ripple`:**
   ```ripple
   // Owns units array, simulation loop, no Svelte dependencies
   export component RippleSimulation(props: {
       width: number;
       height: number;
       units_json: Array<Unit_Json>;
       colors: Renderer_Colors;
   }) {
       const units = TrackedArray.from(
           props.units_json,
           (json) => create_ripple_unit(json, props.colors)
       );

       // Full simulation loop here (no Svelte Scene)
   }
   ```

2. **Remove Scene dependency from Ripple:**
   - `Scene_Renderer_Ripple.svelte` currently passes entire Scene
   - Should only pass: `width`, `height`, `units_json`, `colors`

3. **Update Scene_Renderer_Ripple:**
   ```svelte
   onMount(() => {
       const units_json = scene.units.map(u => u.toJSON());
       unmount_ripple = mount(RippleSimulation, {
           target: el,
           props: { width, height, units_json, colors }
       });
   });
   ```

**Benefit:** Ripple is fully independent, no Svelte reactivity overhead

---

### Phase 4: Evaluate Scene/Editor Decoupling (Future)

**Question:** Should demos use the full Editor/Project/Scene stack?

**Current spawn demo dependencies:**
```
Spawn_Demo
  └─ Editor
      └─ App (Clock, Renderer, Collisions, Simulation, Controller)
          └─ Project
              └─ Scene (copies App objects)
```

**Possible future:**
```
Spawn_Demo
  ├─ Clock (timing)
  ├─ Renderer (display)
  ├─ Collisions (physics)
  └─ units: Unit[] (just data)
```

**Decision point:** After Phase 3, evaluate if this simplification is needed.

---

## Implementation Notes

### Svelte Implementation

**Strengths:**
- Uses Svelte 5 runes idiomatically
- Reactive derived properties (`$derived`)
- Efficient change tracking (getter/setter callbacks for external renderers)

**Optimization opportunities:**
- PixiJS renderer could cache geometries (currently recreates on every change)
- Could use sprite sheets for static shapes

### Ripple Implementation

**Strengths:**
- Clean separation (own simulation loop in ripple_scene.ripple)
- Uses TrackedObject/TrackedArray idiomatically
- Lazy serialization (only converts to JSON when switching renderers)

**Current limitations:**
- Still depends on Svelte's Scene/Unit classes (via JSON)
- Could be more performant with native Ripple data structures

**After Phase 3:**
- Fully independent from Svelte
- No JSON serialization overhead
- Maximum Ripple idioms and performance

---

## File Organization

```
src/lib/
├── collision_behavior.ts     ← Shared: Game behavior logic
├── physics.ts                 ← Shared: Physics algorithms
├── collisions.ts              ← Shared: BVH spatial partitioning
├── unit.svelte.ts             ← Svelte: Unit class with $state
├── scene.svelte.ts            ← Svelte: Scene class with $derived
├── simulation.svelte.ts       ← Svelte: Simulation loop
└── ripple/
    ├── ripple_scene.ripple    ← Ripple: Full scene implementation
    └── ripple_unit.ripple     ← Ripple: Unit factory and types
```

---

## Principles in Practice

### Good Example: Physics Functions

**Shared pure function works with both:**

```typescript
// physics.ts - framework-agnostic
export function physics_apply_bounce(
    a: Has_Position & Has_Direction,
    b: Has_Position & Has_Direction,
    cr: Collision_Result
): void {
    // Pure algorithm, no framework dependencies
}

// Used by Svelte
simulation.update(units, dt, (a, b, cr) => physics_apply_bounce(a, b, cr));

// Used by Ripple
if (colliding(unit.body, other.body, cr)) {
    physics_apply_bounce(unit, other, cr);
}
```

### Bad Example: Shared Reactive Classes

**Svelte Unit class used by Ripple (current, needs refactoring):**

```svelte
// Svelte Unit (unit.svelte.ts)
export class Unit {
    #x: number = $state()!;  // Svelte rune
    behaviors: SvelteMap<...> = new SvelteMap();  // Svelte collection
}

// Ripple Scene (ripple_scene.ripple)
const units_json = scene.units.map(u => u.toJSON());  // ❌ Serialization overhead
const units = TrackedArray.from(units_json, create_ripple_unit);
```

**Should be:**

```ripple
// Ripple gets data directly, no Svelte classes
const units_json = props.units_json;  // ✅ Plain data
const units = TrackedArray.from(units_json, create_ripple_unit);
```

---

## Performance Philosophy

**Rule:** Framework idioms > code reuse

**Example 1: Simulation loops are separate**

Svelte's `Simulation.update()` and Ripple's `update()` function duplicate logic because:
- Svelte uses `$state` mutations triggering reactivity
- Ripple uses `TrackedObject` property assignments
- Each is idiomatic to its framework

**Result:** Better performance than shared abstraction

**Example 2: Collision behavior is shared**

`behavior_handle_collision()` uses duck-typing to work with both:
- Accepts both `behaviors: SvelteMap` and `behavior_names: string[]`
- Pure logic with no reactivity
- No performance cost to sharing

**Result:** DRY without performance compromise
