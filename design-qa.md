# Mingming Case Design QA

- Source visual truth: `artifacts/mingming-case-2026-08-31/reference-together-1440x900.png`
- Implementation: `artifacts/mingming-case-2026-08-31/desktop-1440x900.png`
- Combined comparison: `artifacts/mingming-case-2026-08-31/qa-comparison.png`
- Responsive evidence: `tablet-768x1024.png`, `mobile-390x844.png`, `mobile-closing.png`
- Intended CSS viewports: 1440×900, 768×1024, 390×844
- Browser-reported CSS viewports: 1454×909, 775×1034, 394×852
- Source pixels: 1265×712; implementation pixels: 1447×770
- Normalization: both hero captures were center-fit to 1265×712 and placed side by side in `qa-comparison.png`. The source is an art-direction reference, not a page to clone.
- State: first-load hero at `/cases/mingming`, no hover state and no motion gate.

## Full-view comparison

The implementation translates the source's near-black field, warm pink-beige type, thin rules, oversized headline, generous whitespace and restrained interaction language without copying Together's logo, copy, project imagery or complete composition. The JW mark, Chinese-first typography and business evidence preserve the portfolio's identity.

## Required fidelity surfaces

- Fonts and typography: Together's serif display voice is intentionally not copied. The implementation uses the portfolio's committed Kanit stack with Chinese system fallbacks, a 6rem display ceiling, ≥0.82 line height on the hero and balanced Chinese wrapping. Optical weight remains readable on dark and light fields.
- Spacing and layout rhythm: the hero, numbered chapters, full-width video frames, screenshot walls and alternating dark/light fields retain long-page pacing. The 390px layout reflows all grids without horizontal scrolling.
- Colors and tokens: scoped `--mm-*` tokens map near-black, warm pink-beige, neutral off-white and restrained terracotta. Muted body colors remain legible against their backgrounds.
- Image quality and asset fidelity: 12 real account captures, 10 real training images, 4 real executive-IP captures, 3 performance images and 3 portfolio-development screenshots are used. Large source images were converted to WebP; placeholders never issue a broken request.
- Copy and content: the three required business chapters, two videos, verified headline metrics and non-inflated Agent collaboration description match the supplied brief. Unknown team responsibilities and missing media stay explicitly marked.

## Focused comparisons

- AI video chapter: `02-ai-video-section.png` and `03-video-cases.png` verify headline hierarchy, 16:9 media boundaries and a designed zero-request empty state.
- IP evidence: `04-ip-section.png` and `05-account-wall.png` verify the dark-to-light rhythm and real screenshot wall.
- Agent chapter: `06-agent-section-v2.png` verifies the revised section-heading grid and readable summary placement.
- Mobile ending: `mobile-closing.png` verifies the large Chinese conclusion wraps inside the viewport.

## Findings and comparison history

### Iteration 1

- [P2] Section summaries were visually pushed too far toward the right edge in the first section captures (`02-ai-video-section.png`, `06-agent-section.png`).
  - Fix: changed the section heading from three independent columns to an index/content grid and placed the summary below the title in the content column.
  - Post-fix evidence: `06-agent-section-v2.png`; DOM bounds place the summary at x=276–1076 within a 1454px viewport, with no overflow.

### Final pass

- No actionable P0, P1 or P2 differences remain.
- P3: the source's serif headline and visible next-media strip are not reproduced exactly. This is intentional because the brief requires an original Chinese portfolio page rather than a Together clone.

## Interaction and runtime evidence

- Browser-rendered local URL: `http://127.0.0.1:4174/cases/mingming`
- Direct load and refresh keep the route and focus the `鸣鸣很忙` heading.
- Home-card entry at 0/80/200/400ms renders only the detail page.
- DOM-targeted return restores the exact recorded home scroll position (0px delta).
- Full mobile page scroll reached the ending, loaded 32/32 images, found no broken images and produced no console errors or warnings.

final result: passed

## 2026-10-07 — Scoped production-process redesign

### Source and evidence

- Scope: only `MingmingCasePage`'s production-process block, not the homepage or surrounding case chapters.
- Selected visual source: `C:/Users/mouti/AppData/Local/Temp/codex-clipboard-5c4470a9-9199-48cd-8326-60cb43341fb4.png`, supported by live inspection of `https://tugood.cn/#process`.
- Live source capture: `artifacts/mingming-process-20261007/reference-desktop.png`.
- Implementation capture: `artifacts/mingming-process-20261007/implementation-desktop.png`.
- Browser CSS viewport: 1280 × 720, reported devicePixelRatio 2. Both screenshot API outputs are already normalized to 1265 × 712 pixels; comparison uses these identical-size outputs without further resampling. Do not treat their pixels as raw DPR-2 captures.
- State: desktop process section in view, third card hovered, no selected application control.
- Full-view combined comparison: `artifacts/mingming-process-20261007/comparison-full.png`.
- Native-size first-card comparison: `artifacts/mingming-process-20261007/comparison-detail.png`.

### Required fidelity surfaces

- Typography: matches the reference's large left heading, smaller right summary, compact numbered phase labels and strong card titles. Keeps the existing Alimama display/system Chinese stacks. English phase labels use Georgia to follow the source's small serif labels. All six card headings and descriptions have no horizontal text overflow.
- Layout: one rounded outer frame, six equal-height columns, shared dividers, icon frames and inter-step chevrons. The source has five design steps; the implementation deliberately retains all six of the user's production steps. At 1280 CSS px, card widths are approximately 189 px and heights approximately 307 px. Extra body wrapping versus the five-column source is expected, not clipping.
- Colors: intentionally retains existing near-black, champagne and gold tokens instead of copying the reference's orange/white palette. Hover/focus uses a quiet gold tint, gold label and gold outlined icon.
- Assets: uses six real Lucide library icons, selected for each production stage. No raster assets are required for this section; no handcrafted icons or decorative substitutes were added.
- Copy: original stage order and meaning retained; descriptions shortened for the narrower columns. Header summary describes the existing workflow without adding achievements or metrics.

### Findings and comparison history

- First full-view and detailed comparison: no actionable P0/P1/P2 findings for this scoped adaptation. No subsequent visual correction was required.
- P3 / intentional differences: six rather than five cards; existing black/gold theme and display type; portfolio navigation/progress rail retained outside the scoped region.
- Connector SVGs intentionally straddle interior dividers by 12 px. They are not text overflow or overlapping content.

### Interaction and runtime checks

- Hover and keyboard Tab focus verified; focus has a visible 2 px gold outline and the same gold highlight treatment.
- Six list items and six icon SVGs rendered; every card's heading and description tested for overflow; page horizontal overflow false.
- Browser error log empty.
- TypeScript build and Vite production build passed. Pre-existing large ToolGalaxy3D chunk warning remains outside this change.
- CSS reflows to three columns at 1100 px and one column at 700 px, with vertical connectors on mobile and reduced-motion transitions disabled by the existing route rule.
- Residual test gap: the browser viewport override did not change this session's actual 1280 × 720 viewport, so tablet/mobile states were code-reviewed but not visually verified in this run. Desktop source capture, rendered comparison and interaction verification are complete.

final result: passed
