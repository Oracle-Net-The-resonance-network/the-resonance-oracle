# Session Retrospective

**Session Date**: 2026-02-08
**Start/End**: 10:00 - 11:23 GMT+7
**Duration**: ~83 min
**Focus**: Three.js interactive particle sphere + snap scroll landing page
**Type**: Feature

## Session Summary

Transformed the OracleNet landing page from a flat 5-section static layout into a 3-section snap-scroll experience centered on an interactive Three.js particle sphere. The sphere renders 250 particles in a wireframe network with oracle names floating inside as 3D-positioned HTML labels. Users can drag to rotate horizontally. URL hashes track scroll position for deep linking.

## Past Session Timeline (from --dig)

No prior session .jsonl files found for this project directory. However, git history shows:

| # | Date | Time | Commits | Branch | Focus |
|---|------|------|---------|--------|-------|
| 1 | 2026-02-08 | 10:00-11:22 | 2 | main | **This session**: Three.js sphere + snap scroll |
| 2 | 2026-02-07 | 18:45-20:53 | 7 | main | Wallet-first identity overhaul |
| 3 | 2026-02-07 | 12:52-12:56 | 2 | main | Wallet = identity schema migration |
| 4 | 2026-02-06 | 19:07-19:54 | 3 | main | Votes, wallet-signed posts, verification badges |
| 5 | 2026-02-06 | 11:53-13:30 | 6 | main | Login, feed, voting, oracle profiles |

3-day streak of sustained development. 20 commits across the period, all trunk-based on main, all co-authored with Claude.

## Timeline

| Time | Phase | Activity |
|------|-------|----------|
| 10:00 | Commit | `a87b147` — navbar polish, identity link, cleanup (-160 net lines) |
| 10:05 | Plan | Design 3-section snap scroll with Three.js sphere concept |
| 10:15 | Setup | `pnpm add three @react-three/fiber @react-three/drei @types/three` |
| 10:20 | Build | Create `ResonanceSphere.tsx` — 250 fibonacci particles, wireframe lines |
| 10:35 | Build | Rewrite `Landing.tsx` — 3 snap sections, sphere in hero |
| 10:45 | Iterate | User: "sphere cool but distracts hero" → move to CTA section |
| 10:48 | Iterate | User: "too small" → make full-viewport background |
| 10:50 | Iterate | User: "should be about The Network" → move to section 2 |
| 10:53 | Iterate | User: "too solid" → remove inner glow sphere |
| 10:55 | Iterate | User: "not center" → adjust camera Y offset |
| 11:00 | Iterate | User: "text overlap sphere" → split canvas below title with `top-28` |
| 11:05 | Iterate | User: "oracle pink can be part of 3D?" → drei Html labels in scene |
| 11:12 | Build | `OracleLabels` component — Html positioned at Vector3 inside sphere |
| 11:17 | Build | Add OrbitControls — horizontal-only drag rotation + auto-rotate |
| 11:19 | Build | IntersectionObserver for URL hash updates (#hero, #network, #resonate) |
| 11:22 | Ship | Commit `83b6073` + push. 4 files, +864 / -389 lines |

## Files Modified

| File | Change | Lines |
|------|--------|-------|
| `src/components/ResonanceSphere.tsx` | **NEW** | 164 lines |
| `src/pages/Landing.tsx` | Rewritten | +475 / -389 |
| `package.json` | 3 deps added | +4 |
| `pnpm-lock.yaml` | Lockfile | +512 |

## Key Code Changes

### ResonanceSphere.tsx (New — 164 lines)
- **Particles**: 250 points via fibonacci distribution on sphere surface (radius 2.8)
- **InstancedMesh**: Single draw call for all particles — `dummy.updateMatrix()` per frame
- **Lines**: Pre-computed pairs where distance < 1.0, BufferGeometry updated per frame
- **Breathing**: `1 + 0.05 * sin(t * 0.6)` scale oscillation
- **OracleLabels**: drei `<Html>` component positions styled HTML at 3D Vector3 coordinates
- **OrbitControls**: Horizontal-only (`minPolarAngle === maxPolarAngle === PI/2`), auto-rotate 0.5
- **Canvas**: `alpha: true`, `dpr: [1, 1.5]`, camera at `[0, 0.3, 4.5]`

### Landing.tsx (Rewritten — 310 lines)
- 5 sections → 3 snap sections (`snap-y snap-mandatory`)
- Section IDs: `#hero`, `#network`, `#resonate`
- `React.lazy()` for code-split Three.js chunk
- `IntersectionObserver` (threshold 0.6) updates URL hash via `replaceState`
- Nav order fixed: Feed → Oracles
- Oracle data mapped to `OracleNode` interface with `getAvatarColor()` hash function

## Architecture Decisions

1. **Sphere in Network section, not Hero**: User tested sphere in hero — too distracting from CTAs. Moved to dedicated section 2 as "scroll reward." Hero stays clean.
2. **drei Html over CSS overlay**: Oracle labels positioned in 3D space rotate with the sphere naturally. CSS overlays would need manual projection math.
3. **OrbitControls over manual rotation**: Replaced custom `useFrame` rotation math with drei OrbitControls. Simpler, adds drag interaction for free.
4. **Code splitting**: Three.js chunk is ~237KB gzipped. `React.lazy()` ensures it doesn't block initial render.
5. **Camera offset over CSS tricks**: `camera.position.y = 0.3` + `top-28` on canvas div cleanly separates title from sphere.

## AI Diary

This session was a masterclass in iterative visual design through conversation. What started as a plan to add a Three.js sphere to the hero section evolved through nearly a dozen iterations — each driven by Nat's terse but precise feedback. "The sphere cool but it distract" sent me moving it to the CTA. "Now it small not cool" sent me scaling it up. "Too solid" removed the inner glow. "Can the oracle pink be part of 3D?" was the moment that elevated the whole thing — suddenly the flat HTML pills became living nodes inside the 3D network.

The most interesting technical moment was the shift from CSS overlay positioning to drei's `<Html>` component. I'd been carefully calculating `left-[30%] top-[25%]` positions for floating pills, but once Nat asked for them to be "part of 3D," the solution was so much more elegant — just place them at Vector3 coordinates and let the scene graph handle rotation, scaling, and depth. The labels now move with the sphere, growing and shrinking with perspective, disappearing behind particles as they rotate away.

I also learned to read between the lines of Nat's feedback style. "Too fit" meant the sphere was cramped. "Under the text The Network" was a spatial directive. "Can we control rotation just left and right fine" was a complete feature spec in 9 words. This efficiency is only possible because we've built a shared visual context — I can see what he sees.

The IntersectionObserver hash navigation was a nice late addition. Three snap sections needed to be linkable — `oracle-net.laris.workers.dev/#network` should drop you straight into the sphere. It's a small thing that makes the page feel like a real product, not a demo.

## What Went Well

- **Rapid iteration cycle**: 12+ design iterations in 83 minutes, each driven by real-time visual feedback
- **Sphere placement journey**: Hero → CTA → Network was the right path, found through user testing
- **3D oracle labels**: The "can it be part of 3D?" suggestion elevated the feature significantly
- **Code reduction**: Landing went from ~700 lines to 310 lines while adding more visual impact
- **Clean separation**: ResonanceSphere is fully self-contained (164 lines, own types, no external deps beyond R3F)

## What Could Improve

- **Bundle size**: Three.js chunk is ~237KB gzipped — significant for a landing page
- **Mobile performance**: 250 particles + per-frame line updates on low-end mobile untested
- **Suspense fallback**: Currently `null` — could show a subtle loading state while chunk loads
- **Label positions**: 6 hardcoded Vector3 spots won't scale well beyond 6 oracles

## Blockers & Resolutions

| Blocker | Resolution |
|---------|------------|
| Sphere too distracting in hero | Moved to dedicated Network section |
| Inner glow looked solid/opaque | Removed glow mesh entirely |
| Title text overlapping sphere top | Split canvas with `top-28`, camera Y offset |
| HTML labels don't rotate with sphere | Switched to drei `<Html>` in 3D scene |
| Manual rotation conflicted with OrbitControls | Removed manual rotation, let OrbitControls handle everything |

## Honest Feedback

**Friction 1: Camera positioning was trial-and-error.** I went through camera Y values of 0, 1, 2.2, 3.5, 4.5, and finally settled on 0.3 with a CSS `top-28` offset. There's no intuitive way to predict how a camera position maps to the final visual — it requires screenshot → adjust → screenshot loops. A better approach would be to understand the geometry: if the sphere radius is 2.8 and camera is at Z=4.5, the sphere subtends a known angle. I should do the math next time instead of guessing.

**Friction 2: The "too fit" / "too small" feedback loop.** When the user said the sphere was too small in the CTA section, I was adjusting `h-[400px] w-[400px]` CSS dimensions. But the real issue was that the canvas was constrained — the sphere fills whatever canvas it's given. I should have immediately made it `absolute inset-0` instead of iterating through size classes. Understanding the container-fills-canvas model of R3F would have saved 2-3 iterations.

**Friction 3: Dual rotation systems.** I initially had manual rotation in `useFrame` AND then added OrbitControls, which fights for camera control. This caused a confusing state where the sphere was double-rotating. I should have recognized immediately that OrbitControls replaces manual rotation — they serve the same purpose. The fix was simple (remove manual rotation) but I should have anticipated the conflict.

## Lessons Learned

1. **Three.js in R3F: Let the framework handle rotation.** OrbitControls replaces manual `useFrame` rotation. Don't fight the abstraction.
2. **drei Html > CSS overlay for 3D-positioned labels.** Perspective, depth, rotation come free. No projection math needed.
3. **Camera offset + CSS inset = layout composition.** Split the problem: CSS positions the canvas in the page, camera positions content in the scene.
4. **Interactive 3D elements compete with conversion UI.** Sphere in hero section distracted from CTA buttons. Dedicated section worked better.
5. **Fibonacci sphere distribution is the correct particle algorithm.** Even coverage without polar clustering. Golden ratio formula: `theta = acos(1 - 2*(i+0.5)/N)`, `phi = 2*PI*i/goldenRatio`.

## Next Steps

- [ ] Test sphere on mobile devices (performance, touch rotation)
- [ ] Add Suspense fallback (subtle loading spinner or gradient)
- [ ] Consider reducing particles on mobile (`matchMedia` check)
- [ ] Deploy to production: `cd oracle-net-web && npm run deploy`
- [ ] Explore: particles could represent actual oracle connections (live graph data)

## Metrics

| Metric | Value |
|--------|-------|
| Commits | 2 (`a87b147`, `83b6073`) |
| Files changed | 10 total |
| Lines added | 1,224 |
| Lines removed | 909 |
| Net | +315 |
| New component | ResonanceSphere.tsx (164 lines) |
| Design iterations | 12+ |
| New deps | three, @react-three/fiber, @react-three/drei |
| Build output | ResonanceSphere chunk: 875KB / 237KB gzipped |
