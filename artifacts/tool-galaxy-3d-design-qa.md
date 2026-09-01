# Tool Galaxy 3D Design QA

## Evidence

- Source visual truth: `C:\Users\mmhm\Documents\Codex\作品\artifacts\tool-galaxy-desktop-final.png`
- Rendered implementation: `C:\Users\mmhm\Documents\Codex\作品\artifacts\tool-galaxy-3d-current-qa-stable.png`
- Full-view comparison: `C:\Users\mmhm\Documents\Codex\作品\artifacts\tool-galaxy-3d-baseline-comparison.png`
- Focused orbit comparison: `C:\Users\mmhm\Documents\Codex\作品\artifacts\tool-galaxy-3d-focused-comparison.png`
- Continuous-motion captures: `artifacts/tool-galaxy-3d-current-00s.png`, `artifacts/tool-galaxy-3d-current-10s.png`, `artifacts/tool-galaxy-3d-current-30s.png`
- Mobile capture: `C:\Users\mmhm\Documents\Codex\作品\artifacts\tool-galaxy-3d-current-mobile-2.png`
- Source and implementation bitmap size: 1759 x 1111 px.
- Measured CSS viewport: 1600 x 1000 px; browser capture density was approximately 1.1x.
- State: default category, free orbit. The source and implementation are at different continuous-orbit phases, so icon coordinates are expected to differ while orbit ownership and composition remain comparable.

## Findings

- [P1] Interrupted return paths can briefly overlap an orbiting planet.
  - Location: rapid cross-tool switching while the first tool is still focusing.
  - Evidence: all 12 rapid switches preserved one panel and one visual owner, but the projection audit recorded transient center distances of 25.60-51.91 px for several interrupted returns. Example: TikTok returning at focus blend 0.435 passed within 25.60 px of Photoshop. The regular free orbit minimum is 89.11 px on desktop and 67.33 px on mobile.
  - Mathematical check: the actual orthographic camera and cubic return path have an exact projected intersection between returning Xiaohongshu and orbiting TikTok at global phase 237.957 degrees and focus blend 0.6385; numerical residual is `8.53e-14 px`. Restoring all four tracks to the flat pre-3D tilt also has an exact intersection between returning Jimeng and orbiting Claude, with residual `1.61e-13 px`.
  - Parameter search: 600 deterministic fixed-tilt candidates within mild rotation limits were filtered by a desktop free-orbit minimum of at least 80 px. The three best coarse candidates still converged to 0.15-0.22 px return-path intersections under a 1,440-phase, 61-blend scan.
  - Impact: this violates the explicit acceptance rule that planets must not overlap or pass through one another, even though the detail card hides some of these moments.
  - Fix: requires a narrowly scoped interrupted-transition ownership or return-path rule. Fixed orbit tilt and Z depth alone cannot guarantee separation for arbitrary click timing because the old planet's card-to-orbit path sweeps across moving orbit projections.

## Required Fidelity Surfaces

- Fonts and typography: unchanged from the source implementation; no new font, weight, size, line-height, wrapping, or letter-spacing drift was introduced.
- Spacing and layout rhythm: section structure, heading, category controls, horizontal orbit scale, icon count, and orbit count are preserved. The comparison uses the same bitmap dimensions; the focused crop aligns the moving orbit region for inspection.
- Colors and visual tokens: warm yellow background, black-gold controls, icon brand colors, and restrained orbit-line palette remain unchanged.
- Image quality and asset fidelity: all 12 existing icon assets render sharply with their current rounded masks. No black base, halo, duplicate sprite, blur, trail, or transparency edge was observed in the 0/10/30-second captures.
- Copy and content: unchanged.
- Responsiveness: desktop and 390 px mobile runs reported zero planet boundary violations. Mobile free-orbit visible icon gap remained positive in a 115,200-phase audit.
- Accessibility and controls: semantic tool buttons, close buttons, and desktop category filters remain operable. Mobile intentionally hides the desktop category strip.

## Interaction Coverage

- Desktop: all 12 tools passed first click, focused card ownership, close, and free-orbit restoration.
- Desktop: all 12 tools passed repeated double-click without duplicate cards or icons.
- Desktop: all 12 adjacent rapid-switch pairs ended on the correct card with one controller and no state corruption; transient return-path overlap remains the blocker above.
- Mobile: all 12 tools passed first click, focus, close, and restoration.
- Category filters: all three categories and the return to `All` passed without layout regeneration, ownership errors, or boundary violations.
- Hover: moving across four planets for 3.6 seconds left the orbit rate at `0.054`, phase at `free`, position authority at `fixed-orbit`, and boundary violations at zero.
- Production TypeScript and Vite builds passed.
- Browser console: zero errors. One existing Three.js deprecation warning (`THREE.Clock`) remains and is unrelated to this visual pass.

## Comparison History

### Pass 1

- Earlier finding: none for typography, color, asset quality, copy, or default free-orbit composition.
- Behavioral finding: rapid interrupted returns produced sub-icon-width projection distances.
- Fix made: none. The requested edit boundary permits only fixed 3D tilt and Z changes; hiding, serializing, or rerouting an interrupted return would change interaction ownership or transition behavior.
- Post-check evidence: regular free orbit, single-click transitions, repeated-click transitions, mobile transitions, and category filters all pass. Exact-root analysis proves the rapid-switch contradiction exists in both the current 3D planes and the flat 2D baseline, while deterministic fixed-tilt search found no separation-preserving candidate.

## Final Result

final result: blocked

Blocker: the absolute no-overlap requirement during arbitrary rapid cross-tool switching cannot be proven or met using only fixed orbit tilt and Z depth while preserving the existing focus/return path and state machine.
