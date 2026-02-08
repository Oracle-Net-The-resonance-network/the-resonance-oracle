---
title: ## Three.js Interactive Sphere on Landing Page — Session Retrospective
tags: [three.js, react-three-fiber, landing-page, 3d-visualization, performance, code-splitting, snap-scroll, intersection-observer, oracle-net-web, particles, instanced-mesh]
created: 2026-02-08
source: Session Retrospective — Three.js Resonance Sphere
---

# ## Three.js Interactive Sphere on Landing Page — Session Retrospective

## Three.js Interactive Sphere on Landing Page — Session Retrospective

### Context
Built an interactive 3D particle sphere for OracleNet landing page. The sphere visualizes the oracle network with live data from PocketBase, floating oracle name labels inside the 3D scene, and drag-to-rotate interactivity.

### Key Patterns

**1. Fibonacci Sphere Distribution for Even Particle Coverage**
The golden ratio trick for distributing N points evenly on a sphere surface:
```typescript
const goldenRatio = (1 + Math.sqrt(5)) / 2
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const theta = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT)
  const phi = 2 * Math.PI * i / goldenRatio
  // spherical → cartesian
}
```
This avoids clustering at poles that naive lat/lon distribution causes.

**2. InstancedMesh for Particle Performance**
250 particles as individual meshes = 250 draw calls. InstancedMesh renders all 250 in a single draw call. Set matrix per-instance each frame:
```typescript
dummy.position.set(x, y, z)
dummy.updateMatrix()
meshRef.current.setMatrixAt(i, dummy.matrix)
meshRef.current.instanceMatrix.needsUpdate = true
```

**3. drei Html for 3D-Embedded Labels (not HTML overlay)**
Using `@react-three/drei`'s `<Html>` component places HTML elements _inside_ the 3D scene graph. They scale with distance (`distanceFactor={6}`), rotate with OrbitControls, and occlude naturally. This is fundamentally different from a CSS overlay positioned with `project()`.

**4. OrbitControls — Lock to Horizontal Rotation**
Set `minPolarAngle` and `maxPolarAngle` both to `Math.PI / 2` to lock vertical tilt. Combined with `enableZoom={false}` and `enablePan={false}`, the user can only rotate horizontally. Plus `autoRotate` with `autoRotateSpeed={0.5}` for ambient motion.

**5. Camera Offset to Avoid Text Overlap**
Canvas camera at `position: [0, 0.3, 4.5]` — the `0.3` Y offset pushes the sphere slightly below the text heading. The sphere div is `absolute inset-x-0 top-28 bottom-0` to leave room for the title above.

**6. Breathing Animation via useFrame**
Simple sine wave scaling (`1 + 0.05 * sin(t * 0.6)`) applied to all particle positions each frame. Subtle but gives the sphere a living, organic feel. Applied to both InstancedMesh positions AND line segment endpoints.

**7. React.lazy() for Three.js Code Splitting**
Three.js + R3F + drei = ~300KB+ of JS. Lazy-loading keeps the hero section instant:
```typescript
const ResonanceSphere = lazy(() =>
  import('@/components/ResonanceSphere').then(m => ({ default: m.ResonanceSphere }))
)
// Wrapped in <Suspense fallback={null}>
```
`fallback={null}` means the sphere fades in — no loading spinner needed.

**8. Snap Scroll + IntersectionObserver Hash Navigation**
CSS `snap-y snap-mandatory` on container, `snap-start` on each section. IntersectionObserver with `threshold: 0.6` fires when 60% of section is visible → updates URL hash via `replaceState`. On mount, reads hash and scrolls to it — enables deep linking to `/#network`.

### Design Decisions

**Sphere NOT in hero section** — initially placed in hero but it was too distracting from the CTA buttons. Moved to its own "Network" section (section 2 of 3). Hero stays clean text + buttons. The sphere becomes a "scroll reward."

**3 snap sections** — Hero (identity/CTA) → Network (sphere + live oracles) → Resonate (final CTA + footer links). Each is full viewport height.

**Live data in 3D** — The sphere pulls actual approved oracles from PocketBase and renders their names as labels inside the sphere. Makes the landing page feel alive rather than static mockup.

### Reusable Solutions

- Fibonacci sphere distribution: works for any N-point-on-sphere problem
- InstancedMesh + dummy Object3D pattern: standard for particle systems in R3F
- `minPolarAngle === maxPolarAngle` for locking orbit axis
- `React.lazy()` with named export: `.then(m => ({ default: m.NamedExport }))`
- IntersectionObserver + replaceState for scroll-tracking URL hash
- `dpr={[1, 1.5]}` on Canvas for retina without perf hit on low-end

### What Went Well
- 515-line Landing → 310 lines. Massive simplification by removing feature cards, step-by-step sections, and oracle grid. Replaced with the sphere as the single visual wow factor.
- Clean separation: ResonanceSphere.tsx (164 lines) is a self-contained component with its own types.

### Dependency Stack
```
three@^0.182.0
@react-three/fiber@^9.5.0
@react-three/drei@^10.7.7
@types/three@^0.182.0
```

---
*Added via Oracle Learn*
