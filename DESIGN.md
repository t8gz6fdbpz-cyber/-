---
name: "Personal Notes — Four Chapters"
description: "A restrained personal archive whose shared frame opens into four distinct editorial chapter languages."
colors:
  sports-paper: "#f3f2eb"
  sports-ink: "#17382f"
  sports-accent: "#e15825"
  sports-focus: "#c44417"
  travel-paper: "#ede3d4"
  travel-ink: "#382d25"
  travel-accent: "#9c4229"
  travel-focus: "#a74428"
  travel-photo-placeholder: "#d8c9b5"
  singing-paper: "#241d1f"
  singing-ink: "#eee7df"
  singing-accent: "#c98b73"
  singing-focus: "#dc9b83"
  reading-paper: "#e8e8e2"
  reading-ink: "#172124"
  reading-accent: "#147168"
  reading-focus: "#157a72"
  reading-equation-ink: "#145f58"
  photo-placeholder: "rgba(0, 0, 0, 0.08)"
typography:
  chapter-display:
    fontFamily: "'Songti SC', SimSun, serif"
    fontSize: "clamp(3rem, 6.5vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  section-title:
    fontFamily: "'Songti SC', SimSun, serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.3
  photo-title:
    fontFamily: "'Songti SC', SimSun, serif"
    fontSize: "clamp(1.5rem, 2.2vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.3
  intro:
    fontSize: "clamp(1.125rem, 1.6vw, 1.25rem)"
    lineHeight: 1.75
  body:
    fontFamily: "Kanit, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  caption:
    fontSize: "0.875rem"
    lineHeight: 1.6
  label:
    fontFamily: "Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.5
spacing:
  page-gutter: "clamp(20px, 5vw, 72px)"
  mobile-page-gutter: "20px"
  tight: "8px"
  text: "16px"
  group: "32px"
  grid: "32px"
  section: "clamp(40px, 4vw, 64px)"
  tap-target: "44px"
components:
  back-link:
    height: "{spacing.tap-target}"
  chapter-nav-link:
    height: "{spacing.tap-target}"
    padding: "12px 0"
  eyebrow:
    typography: "{typography.label}"
---

# Design System: Personal Notes — Four Chapters

Travel refinement: homepage and chapter navigation use “旅行”; the detail title remains “旅行日记”. A broad opening landscape pairs with a smaller native-ratio portrait; the remaining images flow through three balanced columns in numbered, top-to-bottom reading order. Six of the thirteen photos are native portraits, including five replacements photographed in 2025–2026; Shanghai and Chongqing provide especially tall frames. Photo dates, sourcing notices and licensing disclosures are kept out of the gallery body. Verified shooting dates, author and license credits remain accessible through the information icon linking to `/travel-image-info.html`.

## Overview

**Creative North Star: "One Archive, Four Chapter Voices"**

The experience is a restrained, high-end personal archive. A quiet return link, numbered chapter navigation, disciplined footer, generous page edges, and serif-led editorial typography make every route feel like part of one collected volume. Photography and whitespace carry more meaning than interface chrome.

Inside that frame, each interest keeps a distinct language: sports is bright and breathing, travel is warm and loosely sequenced, singing is a deep burgundy rehearsal book, and reading is a precise research workbench. These are coordinated chapters, not a repeated page template with cosmetic color swaps. Motion is light, focus is exact, and smaller screens recompose the editorial order instead of miniaturizing desktop arrangements.

**Key Characteristics:**

- Shared return, chapter navigation, image-ratio, and footer grammar.
- Four chapter-specific paper, ink, accent, typography, and composition systems.
- Photography, evidence, and whitespace before interface decoration.
- Editorial sequences instead of card walls.
- Quiet interaction with explicit focus and reduced-motion behavior.
- Mobile compositions that reorganize rather than shrink.

## Colors

Each chapter uses one controlled accent against its own paper-and-ink pair; color identifies editorial voice without becoming decoration.

### Primary

- **Kinetic Persimmon:** Marks sports eyebrows, sequence numbers, pulse indicators, and focus.
- **Travel Rust:** Marks travel folios and place-note indices with a warm archival character.
- **Rehearsal Copper:** Carries singing labels, meter lines, and understated stage notation.
- **Research Teal:** Identifies reading methodology, output labels, sequence numbers, and process notation.

### Neutral

- **Breathing Chalk:** Sports paper; bright but softer than white so saturated photography remains comfortable.
- **Deep Field Green:** Sports ink; gives the bright chapter a physical, outdoor gravity.
- **Warm Map Paper:** Travel paper; supports a loose, collected-notebook atmosphere.
- **Earthbound Brown:** Travel ink; keeps captions and place names grounded and low-contrast.
- **Warm Burgundy Black:** Singing paper; a dark rehearsal-room field rather than concert-stage black.
- **Stage Linen:** Singing ink; a warm light value that avoids the glare of pure white.
- **Workbench Grey:** Reading paper; a neutral working surface for process and evidence.
- **Graphite Teal:** Reading ink; precise and calm without feeling clinical.

### Named Rules

**The One Accent per Chapter Rule.** Use the active chapter accent for labels, indices, focus, and tiny signals; do not introduce a second competing accent.

**The Paper, Not Canvas Rule.** Backgrounds should read as paper or a rehearsal-room field, never as glass, neon space, or a gradient spectacle.

## Typography

**Sports Display Font:** Georgia (with Noto Serif SC and generic serif fallbacks)
**Chapter Display Font:** Songti SC (with SimSun and generic serif fallbacks)
**Body Font:** Kanit (with generic sans-serif fallback)
**Label Font:** Arial (with generic sans-serif fallback)

**Character:** Large, lightly weighted Chinese serif display type supplies the archive's cultural and editorial voice. Compact sans-serif labels, folios, captions, and navigation act as indexing machinery around it.

### Hierarchy

- **Chapter Display:** One shared Songti size, weight, tracking, and leading for sports, travel, singing, and reading. Long titles may wrap; page identity never changes the role scale.
- **Section Title:** Songti headings establish long-form chapter structure without resembling UI cards.
- **Body:** All four chapters use 16px body text with 1.75 leading; introductions use the same 18–20px scale, captions use 14px / 1.6, and metadata uses 12px / 1.5.
- **Label:** Small, bold, uppercase or numeric folios with wide tracking for eyebrows, proof labels, and navigation metadata.

### Named Rules

**The Serif Leads, Sans Indexes Rule.** Use serif type for voice and meaning; use sans-serif type for navigation, numbering, metadata, and explanatory evidence.

**The Deliberate Break Rule.** Preserve authored headline breaks on large compositions, then choose new readable breaks for mobile rather than scaling the same line shape down.

## Layout

The shared frame uses a fluid page gutter and a 44px minimum interaction target. Desktop chapters work on wide editorial canvases capped between 1340px and 1480px, with 12-column arrangements used where image rhythm needs controlled asymmetry.

Sports uses a naturally flowing 12-column editorial composition: four native-ratio portraits share the opening row, followed by two broad landscapes. Travel is a compact 13-entry diary with a landscape/portrait opening and balanced native-ratio columns that avoid large empty grid rows beneath long images. Both use fluid 20–32px horizontal gaps and fixed 24px folio columns so captions align consistently. Singing pairs two real stage portraits at different scales and heights. Reading separates methodology, written output, and system evidence into clearly labeled zones rather than mixing process with results.

At 1100px and below, sports and the travel stream become two columns. The travel opening retains its landscape/portrait pairing until 760px. At 760px and below, the header stacks, the four chapter links become an equal four-column strip, and complex grids become readable sequences. Sports and travel use the full reading width, with the opening travel portrait capped at 320px and aligned right. Singing retains its alternating widths.

### Named Rules

**The Recompose, Never Shrink Rule.** At mobile width, change reading order, widths, alignment, and line breaks; never compress a desktop collage until it merely fits.

**The Whitespace Is Content Rule.** Large gaps establish pacing and chapter boundaries. Do not fill them with ornamental modules or extra copy.

## Elevation & Depth

The archive is flat by default. Depth comes from paper/ink contrast, fine current-color rules, image crops, varied scale, and spatial overlap rather than floating panels. Sports alone uses solid offset photo shadows in its staggered sequence; the wide desktop collage removes them, and the other chapters remain shadowless.

### Shadow Vocabulary

- **Sports Offset Right:** A pale green solid offset behind most sports photos; reduced on mobile.
- **Sports Offset Left:** A pale sand solid offset behind selected sports photos; reduced on mobile.

### Named Rules

**The Flat Archive Rule.** Do not add ambient card shadows. A shadow is allowed only as the established sports photo-offset device.

## Shapes

The form language is rectilinear and editorial. Photos are clipped to a small, explicit set of portrait, square, landscape, and wide ratios; they do not use rounded corners. Hairline rules organize captions, sections, navigation state, and the footer. Circles are reserved for the three sports pulse dots, so their rarity reads as rhythm rather than decoration.

**The Ratio Carries Rhythm Rule.** Vary photo proportions and placement to pace a chapter; do not normalize every image into the same card silhouette.

## Components

### Content Performance Ribbon

- `/cases/wujiahao` reuses the approved `artifacts/material-strip-study/demo/strip.js` WebGL effect, not the demo's other-case photography or editorial copy. Keep the nine existing content-performance screenshots, source order, black/gold styling, 22–30px heading, count/arrows and fine rules; no second thumbnail row. The following operations chapter retains its 56px gap.
- The ribbon is now the local visual subject: 440–640px desktop / 340–430px mobile. Native screenshot ratios set panel widths, with a normalized .016 gap and partial images at both ends. Forty-eight horizontal mesh segments map each image onto one continuous inward cylinder. The centre is flatter/further back; both edges become taller/closer. Every panel's deformation is computed from its live position. Desktop bend .55, mobile .36, perspective distance 1.2; geometry and background are component parameters.
- Default to stillness with no autoplay. The approved .042s dragging / .065s released following and .42s exponential inertia act on one phase. New pointerdown takes over the displayed position immediately; moves beyond 6px suppress opening. Touch leaves vertical scrolling native. Arrows and Home/End use this same position state, while projected mesh picking maps loop copies back to original IDs.
- Lazy-load near the viewport; stop rendering at rest, offscreen, hidden or inside the lightbox. Reduced motion makes the strip flat, switches immediately and disables inertia. Cleanup deletes textures, shaders and buffers and removes observers/listeners. WebGL failure exposes a native horizontal flat-image fallback. Full-image dialogs use original JPGs, retain complete proportions and allow previous/next, keyboard, Escape, focus restoration and a native-resolution image link.

### Back Link

- **Character:** A quiet, always-visible return control that belongs to the shared archive frame.
- **Shape:** Text and a small left arrow with a minimum 44px target; no enclosing pill or card.
- **Hover / Focus:** The arrow shifts left by 3px on hover. Keyboard focus uses a 3px chapter-colored outline with 4px offset.

### Chapter Navigation

- **Character:** Four numbered chapter titles presented as an editorial index.
- **Default / Active:** Inactive links sit at reduced opacity. Hover and the current page restore full opacity and add a one-pixel current-color underline.
- **Mobile:** Links become an equal four-column row beneath the return control; all remain visible.

### Photo Figure

- **Character:** The photograph or proof image is primary; captions behave like archival notation.
- **Ratios:** Portrait, square, landscape, and wide frames are chosen by content rather than normalized.
- **Crop:** Images fill their frame with `object-fit: cover`; alt text remains specific and meaningful.

### Sports Sequence

- **Character:** A bright photo journal with compact numbered captions and predictable reading order.
- **Desktop:** Four equal-width near-square/portrait frames open the sequence, followed by two equal-width landscapes. All six retain native proportions and supplied order, without absolute positioning or forced crops.
- **Mobile:** Entries become a full-width vertical sequence with consistent caption gutters and spacing.

### Travel Stream

- **Character:** Warm place notes with mixed landscape and portrait ratios, including 2.2:1 tall photographs. Photo colors remain original; no saturation reduction, sepia, or muted opacity. Images have verified 2025–2026 capture dates and public-photo attribution accessible through the information link.
- **Caption:** A hairline rule leads into the index, place name, and short observation; the text never becomes a destination card.

### Singing Rehearsal Book

- **Character:** A dark, warm, quiet record of breath, rehearsal, and stage positions.
- **Photography:** Two supplied personal stage portraits replace all former placeholders. Preserve the complete frame and original color; captions do not claim an unprovided venue, date, or award.
- **Signal:** The narrow copper meter is the only expressive graphic motif.

### Reading Workbench

- **Character:** A rational evidence system that makes the learning process legible.
- **Method Rows:** Number, step title, and explanation form ruled rows; mobile moves the explanation under the title.
- **Proof Figures:** Article output and learning-system evidence remain in separate, explicitly labeled sections with neutral placeholders until real screenshots exist.

## Do's and Don'ts

### Floating Navigation — Reference-Matched Refinement

- Navigation destinations are 首页 (home), 履历 (the existing case-studies section), and 兴趣 (the interests section).
- Preserve the supplied black/yellow artwork and its original pixel texture. Exact contour masks separate W, J, H, the upper curves, and the face; the black navigation surface stays stationary and shadow-free.
- Keep the animated mark visually connected: all yellow parts share one center and upward stretch (72 artwork units, 12.5–13.5% uniform scale), with W/H separating outward by only 40–44 units and J kept 18 units lower than the shared trajectory to protect the face. No independent rotation or letter deformation. Letter handoffs are lightly staggered by 45ms, taking 640ms on open and 700ms when idle; opening starts after 180ms. Start interrupted sequences from the current transform; exit restores within 200ms. The closed mark animates after 2.2–2.8 seconds, then pauses 4.5–6.5 seconds between gestures without pointer or scroll input. Pause in hidden tabs and disable decorative movement under reduced-motion preferences.
- Match Bill Chien's single clipped black surface: desktop 80px height at 20px inset, 10px corner radius, logo anchored on the right of expanded links. No shadow on the surface, links, or logo.
- Desktop hover starts at 992px: open in 250ms with outBack, close in 200ms with outQuad; logo shrinks from 80px to 54px in 100ms. Link arrows enter over 500ms, with a 100ms opacity change.
- Below 992px use click; below 480px use the reference's 60px trigger at 8px inset and 200px vertical menu. Open in 300ms outBack; close in 200ms ease after a 100ms delay; retain 40px bottom breathing room.
- Keep keyboard access, Escape dismissal, outside-click dismissal, and reduced-motion support without changing pointer interaction.

### Floating Contact Copy

- Homepage only: a shadow-free black circular button with a filled yellow envelope, matching the contact interaction at https://www.billchien.net/ rather than scrolling to the footer.
- Click or keyboard activation copies `13999854204`. Successful copying expands the surface leftward into a capsule, keeps the envelope anchored on the right, shows “联系方式已复制”, and closes after 2.4 seconds. Expand in 350ms, close in 240ms; a bounded 400ms envelope pulse acknowledges the action. Repeated clicks replay the pulse and renew the feedback timer.
- Copy errors never display a success receipt. Keep native button semantics, a live status, keyboard focus and safe-area insets. Reduced motion removes resizing transitions, pulses and hover scaling but retains the copy feedback. Cleanup cancels feedback timers on route changes/unmount. The footer's small “联系” label is removed; its heading and channel list remain.

### Do:

- **Do** preserve the shared return, four-chapter index, footer, and chapter-aware focus color on every interest route.
- **Do** let real photographs, replacement-ready proof frames, and whitespace dominate the visual hierarchy.
- **Do** keep typography roles identical across chapters while allowing picture scale and placement to vary.
- **Do** preserve original photo saturation and native proportions, with natural document flow at all widths.
- **Do** keep reading process evidence separate from finished article output.
- **Do** preserve visible focus states and collapse animation and transitions under reduced-motion preferences.
- **Do** recompose complex layouts at 760px and below so text and evidence retain their intended order.

### Don't:

- **Don't** turn the archive into a repeated card grid or generic portfolio template.
- **Don't** add glass panels, neon accents, complex gradients, ambient card shadows, or effect-heavy motion.
- **Don't** force the four chapters into one interchangeable composition or palette.
- **Don't** invent achievements, article titles, or screenshots where the implementation intentionally shows replacement-ready evidence placeholders.
- **Don't** round every image, wrap text in decorative containers, or fill deliberate whitespace.
- **Don't** shrink desktop collages into miniature mobile layouts.
