/** Bounded progression: arrive early, then keep the reading composition stable. */
export function readingProgress(value: number, start = 0, end = .68): number {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

/** Scroll-mapped focus handover, with readable holds between the three actions. */
export function processFocusPose(progress: number, index: number): { opacity: number; y: number } {
  const first = readingProgress(progress, .22, .38);
  const second = readingProgress(progress, .6, .76);
  if (index === 0) return { opacity: 1 - first, y: -96 * first };
  if (index === 1) return { opacity: first * (1 - second), y: 96 * (1 - first) - 96 * second };
  return { opacity: second, y: 96 * (1 - second) };
}

/** A chapter's end cannot lie beyond the document's physical scroll limit. */
export function chapterProgress(scrollY: number, top: number, height: number, documentHeight: number, viewportHeight: number): number {
  const maximum = Math.max(0, documentHeight - viewportHeight);
  if (maximum === 0) return 1;
  const end = Math.max(0, Math.min(top + height, maximum));
  // A final section shorter than the viewport is already entering before its
  // top can reach the viewport top. Use that visible interval, not a zero span.
  const start = Math.max(0, Math.min(top >= end ? top - viewportHeight : top, end));
  if (end === start) return scrollY >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
}
