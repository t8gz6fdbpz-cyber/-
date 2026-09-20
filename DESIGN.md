---
name: "Personal Notes — Four Chapters"
description: "A restrained personal archive whose shared frame opens into four distinct editorial chapter languages."
colors:
  sports-paper: "#f3f2eb"
  sports-ink: "#17382f"
  sports-accent: "#e15825"
  sports-focus: "#e6632e"
  travel-paper: "#ede3d4"
  travel-ink: "#382d25"
  travel-accent: "#9c4229"
  travel-focus: "#a74428"
  singing-paper: "#241d1f"
  singing-ink: "#eee7df"
  singing-accent: "#c98b73"
  singing-focus: "#dc9b83"
  reading-paper: "#e8e8e2"
  reading-ink: "#172124"
  reading-accent: "#147168"
  reading-focus: "#157a72"
typography:
  sports-display:
    fontFamily: "Georgia, 'Noto Serif SC', serif"
    fontSize: "clamp(104px, 17vw, 250px)"
    fontWeight: 400
    lineHeight: 0.72
    letterSpacing: "-0.1em"
  chapter-display:
    fontFamily: "'Songti SC', SimSun, serif"
    fontSize: "clamp(58px, 7.4vw, 110px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.065em"
  section-title:
    fontFamily: "'Songti SC', SimSun, serif"
    fontSize: "clamp(40px, 5vw, 72px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Kanit, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
spacing:
  page-gutter: "clamp(22px, 5vw, 78px)"
  mobile-page-gutter: "20px"
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

- **Sports Display:** Monumental, tightly tracked, and unusually low in line height; reserved for the sports title.
- **Chapter Display:** Tall, calm Songti headlines for travel, singing, and reading; line breaks are deliberate compositional decisions.
- **Section Title:** Songti headings establish long-form chapter structure without resembling UI cards.
- **Body:** Comfortable sans-serif prose with generous leading; introductions widen in size, while captions stay compact.
- **Label:** Small, bold, uppercase or numeric folios with wide tracking for eyebrows, proof labels, and navigation metadata.

### Named Rules

**The Serif Leads, Sans Indexes Rule.** Use serif type for voice and meaning; use sans-serif type for navigation, numbering, metadata, and explanatory evidence.

**The Deliberate Break Rule.** Preserve authored headline breaks on large compositions, then choose new readable breaks for mobile rather than scaling the same line shape down.

## Layout

The shared frame uses a fluid page gutter and a 44px minimum interaction target. Desktop chapters work on wide editorial canvases capped between 1340px and 1480px, with 12-column arrangements used where image rhythm needs controlled asymmetry.

Sports becomes a single-screen, absolutely positioned collage at 1280px and above; below that it returns to a staggered sequence. Travel keeps a loose 12-column stream with varied image ratios and deliberate vertical gaps. Singing pairs an offset hero, rehearsal trio, and wide closing banner. Reading separates methodology, written output, and system evidence into clearly labeled zones rather than mixing process with results.

At 760px and below, the header stacks, the four chapter links become an equal four-column strip, and complex grids become readable sequences. Alternating 88–92% widths preserve rhythm and whitespace; they are not scaled-down desktop collages.

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

- **Character:** A bright breathing collage with six independently sized entries and compact numbered captions.
- **Desktop:** At wide desktop it is a composed one-screen collage without photo shadows.
- **Mobile:** Entries become a staggered vertical sequence with alternating alignment and solid offset shadows.

### Travel Stream

- **Character:** Warm, loose place notes with varied ratios, restrained image saturation, and generous intervals.
- **Caption:** A hairline rule leads into the index, place name, and short observation; the text never becomes a destination card.

### Singing Rehearsal Book

- **Character:** A dark, warm, quiet record of breath, rehearsal, and stage positions.
- **Photography:** Neutral outlined placeholders preserve the requested ratios until real personal photos are available; labels state what should replace them.
- **Signal:** The narrow copper meter is the only expressive graphic motif.

### Reading Workbench

- **Character:** A rational evidence system that makes the learning process legible.
- **Method Rows:** Number, step title, and explanation form ruled rows; mobile moves the explanation under the title.
- **Proof Figures:** Article output and learning-system evidence remain in separate, explicitly labeled sections with neutral placeholders until real screenshots exist.

## Do's and Don'ts

### Do:

- **Do** preserve the shared return, four-chapter index, footer, and chapter-aware focus color on every interest route.
- **Do** let real photographs, replacement-ready proof frames, and whitespace dominate the visual hierarchy.
- **Do** keep sports as a one-screen collage at 1280px and above and a staggered sequence on mobile.
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
