---
title: Three.js Interactive Sphere Landing Page Patterns:
tags: [three.js, react-three-fiber, landing-page, 3d-visualization, performance, code-splitting, snap-scroll, orbit-controls, fibonacci, particles]
created: 2026-02-08
source: rrr --deep: oracle-net-web
---

# Three.js Interactive Sphere Landing Page Patterns:

Three.js Interactive Sphere Landing Page Patterns:

1. FIBONACCI SPHERE: Golden ratio distribution evenly places N points on sphere (no polar clustering). Formula: theta=acos(1-2*(i+0.5)/N), phi=2*PI*i/goldenRatio.

2. INSTANCEDMESH: 250 particles in single draw call. Per-frame: dummy.position.set() → dummy.updateMatrix() → setMatrixAt(). Always set instanceMatrix.needsUpdate=true.

3. DREI HTML > CSS OVERLAY: For 3D-positioned labels, drei's Html component handles perspective, depth, rotation automatically. Never manually project 3D to 2D CSS.

4. ORBITCONTROLS REPLACES MANUAL ROTATION: Never combine useFrame rotation with OrbitControls — they fight. Lock horizontal: minPolarAngle === maxPolarAngle === PI/2.

5. 3D COMPETES WITH CONVERSION UI: Interactive 3D in hero section distracts from CTA buttons. Give 3D its own dedicated section as a "scroll reward."

6. REACT.LAZY FOR THREE.JS: Code-split heavy 3D deps (~237KB gzipped). Named export needs .then(m => ({ default: m.Component })) wrapper.

7. CAMERA + CSS COMPOSITION: CSS positions canvas in page layout, camera positions content in 3D scene. Two separate coordinate systems.

8. INTERSECTION OBSERVER + REPLACE STATE: For snap scroll URL hashes. Use replaceState (not pushState) to avoid history pollution. Threshold 0.6 works well.

---
*Added via Oracle Learn*
