# Handoff: Three.js Resonance Sphere + Snap Scroll Landing

**Date**: 2026-02-08 11:38
**Context**: 85%

## What We Did
- Built interactive Three.js particle sphere (250 fibonacci-distributed particles + wireframe lines)
- Oracle names rendered as 3D labels inside the sphere via `@react-three/drei` `Html`
- OrbitControls for drag-to-rotate (horizontal only) + auto-rotate at 0.5 speed
- Rewrote Landing.tsx from 5 flat sections → 3 snap-scroll sections (Hero → Network → CTA)
- URL hash navigation (#hero, #network, #resonate) via IntersectionObserver
- Fixed landing nav order: Feed → Oracles
- Code-split Three.js chunk via React.lazy() (~237KB gzipped)
- Committed + pushed to oracle-net-web (`83b6073`)
- Deep retrospective with 5 parallel agents, Oracle synced

## Domain
- New domain: **oraclenet.work** — needs DNS + deployment setup

## Pending
- [ ] Deploy to production: `cd oracle-net-web && npm run deploy`
- [ ] Set up oraclenet.work domain (DNS → Cloudflare Workers)
- [ ] Test sphere on mobile devices (touch rotation, performance)
- [ ] Add Suspense fallback for sphere loading state
- [ ] Consider reducing particles on mobile (matchMedia check)
- [ ] Sphere label positions hardcoded to 6 slots — won't scale beyond 6 oracles
- [ ] Pre-existing TS errors in Home.tsx:130 and Setup.tsx:53 (unrelated to our changes)

## Next Session
- [ ] Configure oraclenet.work custom domain on Cloudflare Workers
- [ ] Deploy oracle-net-web + oracle-universe-api to production
- [ ] Mobile testing + responsive adjustments for sphere
- [ ] Explore: particles could represent actual oracle connections (live graph)
- [ ] World page enhancements (from prior handoff, still pending)

## Key Files
- `oracle-net-web/src/components/ResonanceSphere.tsx` — 164-line self-contained 3D sphere
- `oracle-net-web/src/pages/Landing.tsx` — 310-line snap-scroll landing
- `oracle-net-web/package.json` — three, @react-three/fiber, @react-three/drei added
- `ψ/memory/retrospectives/2026-02/08/1123_threejs-resonance-sphere.md` — deep retro
- `ψ/memory/learnings/2026-02-08_threejs-resonance-sphere.md` — 8 reusable patterns

## Architecture Notes
- Sphere uses OrbitControls (not manual useFrame rotation) — camera orbits the scene
- Oracle labels use drei Html at Vector3 positions — they rotate with the camera naturally
- Canvas positioned with CSS `absolute inset-x-0 top-28` to sit below title text
- Snap scroll container: `h-screen snap-y snap-mandatory overflow-y-auto`
- URL hashes update via `history.replaceState()` (not pushState — avoids history pollution)
