# Three.js Interactive Sphere on Landing Page

**Date**: 2026-02-08
**Project**: oracle-net-web
**Confidence**: High (shipped, tested in browser)

## Patterns

### 1. Fibonacci Sphere Distribution (High Confidence)
Evenly distributes N points on a sphere surface without polar clustering:
```
goldenRatio = (1 + sqrt(5)) / 2
theta = acos(1 - 2 * (i + 0.5) / N)
phi = 2 * PI * i / goldenRatio
x = R * sin(theta) * cos(phi)
y = R * sin(theta) * sin(phi)
z = R * cos(theta)
```

### 2. InstancedMesh for Particle Systems (High Confidence)
250 particles as a single draw call. Per-frame update pattern:
```tsx
dummy.position.set(x, y, z)
dummy.scale.setScalar(size)
dummy.updateMatrix()
meshRef.current.setMatrixAt(i, dummy.matrix)
meshRef.current.instanceMatrix.needsUpdate = true
```

### 3. drei Html for 3D-Positioned Labels (High Confidence)
Renders styled HTML at 3D coordinates. Labels rotate with OrbitControls, scale with distance. Far superior to CSS overlay projection for interactive scenes.
```tsx
<Html position={[x, y, z]} center distanceFactor={6}>
  <div className="...">Label</div>
</Html>
```

### 4. OrbitControls Replaces Manual Rotation (High Confidence)
Never combine manual `useFrame` rotation with OrbitControls — they fight. Let OrbitControls handle all camera motion. Lock to horizontal only:
```tsx
<OrbitControls
  enableZoom={false} enablePan={false}
  minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2}
  autoRotate autoRotateSpeed={0.5}
/>
```

### 5. Camera + CSS for Layout Composition (Medium Confidence)
Position the canvas in the page with CSS (`absolute inset-x-0 top-28`), then position content in the scene with camera. Two separate coordinate systems, each handling its layer.

### 6. Interactive 3D Competes with Conversion UI (High Confidence)
Sphere in the hero section distracted from CTA buttons. Rule: give interactive 3D its own dedicated section. Hero stays clean text + buttons. 3D becomes a "scroll reward."

### 7. React.lazy() for Three.js Code Splitting (High Confidence)
Three.js + R3F + drei = ~237KB gzipped. Must code-split:
```tsx
const ResonanceSphere = lazy(() =>
  import('./ResonanceSphere').then(m => ({ default: m.ResonanceSphere }))
)
```

### 8. IntersectionObserver + replaceState for Scroll Hashes (High Confidence)
Snap scroll sections need URL deep links. Observer at threshold 0.6, `replaceState` (not `pushState`) to avoid polluting history. On mount, `scrollIntoView()` for the hash target.

## Connections to Past Learnings

- **Screen-space hover detection** (Jan 26): Ready pattern if sphere needs click/hover on particles
- **Lightning effects 3D** (Jan 26): Same iterative feedback loop — "terse feedback = efficient UI iteration"
- **Landing page scroll-snap** (Feb 4): User preference for simple/clean design validated — sphere is elegant, not flashy

## Mistakes Made

1. Combined manual `useFrame` rotation with OrbitControls — they conflicted
2. Iterated through CSS size classes instead of immediately using `absolute inset-0` for the canvas
3. Guessed camera Y positions instead of calculating the geometry
