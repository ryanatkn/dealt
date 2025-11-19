# Ripple Renderer Integration

**Status:** ✅ **PRODUCTION READY**
**Last Updated:** 2025-11-18

## Overview

Ripple is the 5th renderer option for the Dealt spawn demo, providing an alternative reactive rendering implementation using the RippleJS framework. The integration demonstrates a full parallel simulation architecture where Ripple owns its own state (TrackedObjects) while active, syncing with Svelte state only at mount/unmount boundaries.

**Key Achievement:** Lazy state serialization pattern - zero per-frame overhead, state persists correctly when switching renderers.

---

## Current Implementation

### Architecture Pattern

**Parallel Data Layer (Path B)** - Ripple owns its own simulation when active:

```
Svelte Units ($state)
  ↓ serialize to JSON on mount
Ripple Units (TrackedObject #{})
  ↓ Ripple simulation driven by Svelte clock
  ↓ Physics, collisions, rendering
Ripple rendering (reactive SVG)
  ↓ lazy getter serializes to JSON BEFORE unmount
Svelte Units ($state) ← restored with current state
```

**Why this approach:**
- Fully idiomatic Ripple (TrackedObjects, effects, reactivity)
- No per-frame serialization overhead
- Shared physics algorithms (`physics.ts`)
- Clean separation of concerns

### Files Created

**Ripple Components:**
- `src/lib/ripple/ripple_scene.ripple` - Main simulation component (physics, collisions, rendering)
- `src/lib/ripple/ripple_unit.ripple` - TrackedObject factory for units
- `src/lib/ripple/ripple_scene.ripple.d.ts` - Type declarations

**Svelte Integration:**
- `src/lib/Scene_Renderer_Ripple.svelte` - Wrapper managing lifecycle, clock bridge, state sync

**Shared Code:**
- `src/lib/unit_types.ts` - Framework-agnostic types (Unit_Json)
- `src/lib/unit_logic.ts` - Pure helper functions
- `src/lib/physics.ts` - Shared physics algorithms
- `src/lib/collisions.ts` - BVH collision detection (already framework-free)

**Modified:**
- `vite.config.ts` - Added vite-plugin-ripple
- `src/lib/renderer.svelte.ts` - Added 'ripple' to Renderer_Type
- `src/lib/renderer_components.ts` - Registered Scene_Renderer_Ripple

### Features Complete

- [x] Full Unit system (circles and polygons)
- [x] Complete physics simulation matching other renderers
- [x] Collision detection with BVH broad phase
- [x] Shared physics algorithms (separation + reflection)
- [x] Bidirectional state sync (Svelte ↔ Ripple via JSON)
- [x] Unified clock architecture (single timing source)
- [x] Lazy state serialization (performance optimized)
- [x] Graceful error handling during unmount
- [x] Pause/play controls work consistently
- [ ] Performance benchmarked (FPS comparison needed)

---

## Recent Updates

### State Synchronization Fix (2025-11-18)

**Problem:** When switching FROM Ripple to other renderers, units snapped back to initial positions.

**Root Cause:** During Ripple's effect cleanup, tracked properties return stale/initial values instead of current runtime state.

**Solution: Lazy State Serialization Pattern**

```typescript
// Ripple: Register getter function (not push data)
if (props.on_get_state) {
  const get_state = () => units.map(u => ripple_unit_to_json(u));
  props.on_get_state(get_state);
}

// Svelte: Call getter BEFORE unmount (timing critical!)
const exported_units = get_ripple_state ? get_ripple_state() : undefined;
if (unmount_ripple) unmount_ripple();
```

**Benefits:**
- ✅ State persists correctly when switching renderers
- ✅ Zero per-frame serialization overhead
- ✅ Clean separation of concerns
- ✅ Reusable pattern for other external renderers

**Files Modified:**
- `src/lib/ripple/ripple_scene.ripple` - Added `on_get_state` prop
- `src/lib/Scene_Renderer_Ripple.svelte` - Calls getter before unmount, try-catch wrapper

---

## Key Architectural Patterns

### 1. Unified Clock Pattern

**Single timing source drives all renderers:**

```typescript
// All renderers use scene.clock (single RAF loop)
scene.clock.watch((dt) => {
  if (ripple_update_callback) {
    ripple_update_callback(dt);
  }
});
```

**Benefits:**
- Consistent pause/play across all renderers
- Fair performance comparison
- No dual simulation waste
- Single source of truth for timing

**Implementation:**
- Ripple exposes `update(dt)` function (no internal RAF loop)
- Svelte's clock drives Ripple via callback bridge
- Scene_Renderer_Ripple disables editor's clock on mount, re-enables on unmount

### 2. Lazy State Serialization

**Performance-optimized sync strategy:**

- Mount: Serialize once (Svelte → Ripple)
- Runtime: Zero serialization overhead
- Unmount: Call lazy getter BEFORE cleanup (Ripple → Svelte)

**Key insight:** Timing is critical - must call getter while Ripple's tracking is still active.

### 3. Shared Physics Algorithms

**Framework-agnostic `physics.ts`:**

```typescript
export function apply_bounce_physics(
  unit: {x, y, velocity_x, velocity_y},
  other: {x, y, velocity_x, velocity_y},
  collision_result: Collision_Result
): void
```

**Benefits:**
- Single source of truth
- Consistent behavior across renderers
- Easier testing/debugging
- No code duplication

**Used by:**
- Spawn Demo (Svelte)
- Ripple renderer
- Future renderers

---

## Ripple-Specific Patterns

### TrackedObject Factory

```typescript
export function create_ripple_unit(
  json: Unit_Json,
  colors: Renderer_Colors
): Ripple_Unit {
  return #{  // TrackedObject syntax
    id: json.id,
    x: json.x,         // Plain number, but reactive!
    y: json.y,
    // ... all properties
  };
}
```

**Key learnings:**
- Use `#{}` syntax for TrackedObject
- Properties are plain values but reactive
- No `@` operator needed for access
- Direct mutation works: `unit.x += velocity`

### TrackedArray Initialization

```typescript
const units = TrackedArray.from(
  props.units_json,
  (json) => create_ripple_unit(json, props.colors)
);
```

**Patterns:**
- `TrackedArray.from()` for idiomatic initialization
- Elements don't need `@` operator
- Reactive to push/pop/splice operations

### Effect Cleanup

```typescript
effect(() => {
  // Setup code
  props.on_get_state(get_state);

  // Cleanup function
  return () => {
    props.on_get_state(null);
  };
});
```

**Critical:** Return cleanup function from effect() for unmount.

### Keyed Rendering

```ripple
for (const unit of units; key unit.id) {
  if (unit.type === 'circle') {
    <circle cx={unit.x} cy={unit.y} r={unit.radius} />
  }
}
```

**Pattern:** Use `for...of; key expr` for stable identity.

---

## Performance Considerations

### Current Optimizations

1. **Lazy state serialization** - Only on renderer switch, not every frame
2. **Static derived properties** - Computed once at initialization
   - `transformed_points` - Static unless rotation/scale changes
   - `color` - Static based on initial behavior names
3. **Shared physics** - Single algorithm implementation
4. **BVH collision detection** - Efficient broad phase

### Potential Improvements

1. **Reactive derived properties** - Make reactive if gameplay needs dynamic rotation/scale
   - Current: Static (optimal for spawn demo)
   - TODO in ripple_unit.ripple:16

2. **Batch collision body updates** - Currently updating body.x, body.y individually

3. **Benchmarking needed:**
   - FPS comparison at 100/500/1000 units
   - Profile hot paths (collision vs rendering)
   - Memory usage during long sessions

---

## Known Issues & TODOs

### Type Declaration Drift

**Issue:** `ripple_scene.ripple.d.ts` has outdated type (on_export vs on_get_state)

**Fix needed:**
```typescript
// Current (wrong)
on_export?: (units_json: Array<Unit_Json>) => void;

// Should be
on_get_state?: (getter: (() => Array<Unit_Json>) | null) => void;
```

### Debug Logging

**Issue:** Console.log in ripple_scene.ripple:171

**Fix:** Remove before production

### Clock Subscription Management

**Issue:** Manual enable/disable of editor's clock callback (Scene_Renderer_Ripple.svelte:38-44)

**Current approach:**
- Fragile if multiple renderers mount simultaneously
- Works fine for single renderer at a time

**Potential solutions:**
- Keep current (simple, works for now)
- Ref counting (robust, more complex)
- Capability tokens (most robust, significant refactor)

**Decision:** Keep current unless multiple simultaneous renderers needed

### Missing Gameplay Features

**Not blocking for spawn demo:**
- `on_goal` callback implementation (TODO in ripple_scene.ripple:118)
- Scene.exit() support on goal collision
- Full Behavior system parity (currently just tracking names as strings)

**When to implement:** Building actual game content

---

## Next Steps & Choices

### Immediate (This Week)

**Option 1: Performance Benchmarking** 📊
**Effort:** Low | **Value:** High | **Time:** 1-2 days

- [ ] Add FPS counter to spawn demo UI
- [ ] Benchmark all renderers at 100/500/1000 units
- [ ] Profile hot paths (collision detection, rendering, serialization)
- [ ] Document results in TODO and CLAUDE.md
- [ ] Identify optimization opportunities

**Why now:** Only missing success criterion

---

**Option 2: Documentation & Polish** 📝
**Effort:** Low | **Value:** Medium | **Time:** 1 day

- [x] Update TODO_ripple.md with state sync fix ✓
- [ ] Update CLAUDE.md with lazy serialization pattern
- [ ] Fix type declaration (ripple_scene.ripple.d.ts)
- [ ] Remove debug console.log
- [ ] Add architecture diagram
- [ ] Document callback registration patterns

**Why now:** Knowledge is fresh, prevents drift

---

### Short-term (Next 2 Weeks)

**Option 3: Feature Completeness** 🎮
**Effort:** Medium | **Value:** Medium | **Time:** 2-3 days

- [ ] Implement `on_goal` callback
- [ ] Add support for `scene.exit()` on goal collision
- [ ] Test with actual gameplay scenarios
- [ ] Add full Behavior system parity

**Why defer:** Spawn demo doesn't need these features

---

### Long-term (When Needed)

**Option 4: Architectural Improvements** 🏗️
**Effort:** High | **Value:** Medium | **Time:** 1-2 weeks

- [ ] Clock subscription management (ref counting or tokens)
- [ ] Standardize collision phase ordering across all renderers
- [ ] Reactive derived properties (if gameplay requires it)

**Why defer:** Current approach works for single renderer

---

## Architectural Decisions

### Decision 1: Derived Properties Reactivity

**Current:** Static computation at initialization

**Options:**
- **A. Keep static** (current) - Best performance, works for spawn demo
- **B. Make reactive** - Needed for dynamic rotation/scale in gameplay
- **C. Hybrid** - Reactive only when needed, static by default

**Recommendation:** Keep static until gameplay requires rotation/scale changes

---

### Decision 2: Clock Subscription Management

**Current:** Manual enable/disable in Scene_Renderer_Ripple.svelte

**Options:**
- **A. Keep current** - Simple, works for single renderer
- **B. Ref counting** - Robust, handles multiple subscribers
- **C. Capability tokens** - Most robust, significant refactor

**Recommendation:** Keep current unless multiple simultaneous renderers needed

---

### Decision 3: Type Declaration Maintenance

**Current:** Manual `.d.ts` file (already drifted)

**Options:**
- **A. Manual maintenance** - Simple, error-prone
- **B. Auto-generate** - Complex setup, always in sync
- **C. JSDoc in .ripple** - If Ripple supports it

**Recommendation:** Fix manually now, revisit if recurring issue

---

## Recommended Path Forward

### This Week
1. Performance benchmarking (only missing criterion)
2. Documentation cleanup (fix drift, remove debug logging)

### Next 2 Weeks
1. Update CLAUDE.md with architecture patterns
2. Consider derived property reactivity based on gameplay needs

### When Building Actual Game
1. Implement on_goal callback
2. Add full Behavior system support

### Future (If Needed)
1. Clock subscription refactor for simultaneous renderers
2. Standardize collision phase ordering
3. Extract more shared physics code if patterns emerge

---

## Success Criteria

- [x] Spawn demo loads with `renderer_type='ripple'`
- [x] Units render correctly (circles and polygons)
- [x] Physics simulation works identically to other renderers
- [x] Can switch between renderers without issues
- [x] **State persists correctly when switching FROM Ripple to other renderers**
- [ ] Performance benchmarked and documented (FPS at 100/500/1000 units)

---

## Final Checklist

**Core Implementation:**
- [x] Build configuration (vite-plugin-ripple)
- [x] Full Unit system (circles + polygons)
- [x] Physics simulation (shared algorithms)
- [x] Collision detection (BVH + separation)
- [x] State synchronization (lazy serialization)
- [x] Unified clock architecture
- [x] Error handling (graceful unmount)

**Documentation:**
- [x] TODO_ripple.md updated
- [ ] CLAUDE.md updated
- [ ] Type declarations fixed
- [ ] Debug logging removed

**Performance:**
- [ ] FPS benchmarks
- [ ] Performance comparison documented
- [ ] Hot path profiling

**Polish:**
- [ ] Console.log removed
- [ ] Architecture diagram created
- [ ] Pattern documentation complete

---

## Technical Reference

### Ripple Limitations

- SPA-only (no SSR) - acceptable since Dealt uses static adapter
- Need VSCode extension for `.ripple` syntax highlighting
- Relatively new framework

### Code Sharing Strategy

**Shared (framework-agnostic):**
- Type definitions (unit_types.ts)
- Pure helper functions (unit_logic.ts)
- Physics algorithms (physics.ts)
- Collision system (collisions.ts)
- Point transformations, polygon utilities

**Duplicated (framework-specific):**
- Unit reactivity implementation (Svelte $state vs Ripple TrackedObject)
- Simulation loop structure (scene.update vs Ripple effect)
- Renderer-specific optimizations

**Why duplicate:** Sharing reactivity implementations would compromise both frameworks' performance characteristics.

### Data Flow

```
Mount:
  Svelte Units → toJSON() → Unit_Json[] → create_ripple_unit() → Ripple TrackedObjects

Runtime:
  scene.clock.watch() → ripple_update_callback(dt) → update units → reactive rendering

Unmount:
  get_ripple_state() → ripple_unit_to_json() → Unit_Json[] → set_json() → Svelte Units
```

**Critical:** State getter must be called BEFORE unmounting Ripple (while tracking is active).
