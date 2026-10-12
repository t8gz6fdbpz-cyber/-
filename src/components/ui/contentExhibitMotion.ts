/** Geometry and time constants from artifacts/material-strip-study/demo/strip.js. */
export const wrap = (value: number, length: number) => ((value % length) + length) % length;
export const nearestPhase = (phase: number, index: number, count: number) => index + Math.round((phase - index) / count) * count;
export type StripSettings = {
  bend: number; mobileBend: number; perspective: number; gap: number;
  halfHeight: number; mobileHalfHeight: number; inertia: number;
  panelAspect?: number; background: string;
};
export const defaultStripSettings: StripSettings = {
  bend: .55, mobileBend: .36, perspective: 1.2, gap: .016,
  halfHeight: .69, mobileHalfHeight: .64, inertia: .42, background: "#0b0a08",
};
export function stripGeometry(width: number, height: number, aspects: readonly number[], settings: StripSettings) {
  const mobile = width < 650, halfHeight = mobile ? settings.mobileHalfHeight : settings.halfHeight;
  const widths = aspects.map(aspect => 2 * halfHeight * height * (settings.panelAspect ?? aspect) / width);
  return { halfHeight, widths, step: Math.max(...widths) + settings.gap, bend: mobile ? settings.mobileBend : settings.bend };
}
/** Exact shader projection: shared by rendering, picking and geometry tests. */
export function projectSurface(s: number, y: number, bend: number, distance: number) {
  const radius = 1 / Math.max(bend, .0001), theta = s / radius;
  const depth = 2 * radius * Math.sin(theta * .5) ** 2, w = Math.max(.28, 1 - depth / distance);
  return { x: radius * Math.sin(theta) / w, y: y / w, w };
}
export type StripMotion = { phase: number; target: number; velocity: number; dragging: boolean };
export function advanceMotion(state: StripMotion, dt: number, reduced: boolean, inertia = .42): StripMotion {
  if (reduced) return { ...state, phase: state.target, velocity: 0 };
  let { target, velocity } = state;
  if (!state.dragging) {
    target += velocity * dt; velocity *= Math.exp(-dt / inertia);
    if (Math.abs(velocity) < .003) velocity = 0;
  }
  let phase = state.phase + (target - state.phase) * (1 - Math.exp(-dt / (state.dragging ? .042 : .065)));
  if (Math.abs(target - phase) < .0002) phase = target;
  return { ...state, phase, target, velocity };
}
export function normalizeMotion(state: StripMotion, count: number) {
  if (Math.abs(state.phase) <= 500) return state;
  const cycles = Math.trunc(state.phase / count) * count;
  return { ...state, phase: state.phase - cycles, target: state.target - cycles };
}
export type StripPanel = { copy: number; index: number; center: number; width: number; halfHeight: number };
export function visiblePanels(phase: number, count: number, geometry: ReturnType<typeof stripGeometry>): StripPanel[] {
  const base = Math.floor(phase), range = Math.ceil(1.8 / geometry.step) + 1, result: StripPanel[] = [];
  for (let copy = base - range; copy <= base + range; copy++) {
    const center = (copy - phase) * geometry.step;
    if (Math.abs(center) > 1.65) continue;
    const index = wrap(copy, count);
    result.push({ copy, index, center, width: geometry.widths[index], halfHeight: geometry.halfHeight });
  }
  return result;
}
/** Invert the same projection as the 48-column mesh, not a rectangular DOM proxy. */
export function hitPanel(x: number, y: number, panels: readonly StripPanel[], bend: number, distance: number) {
  for (const panel of [...panels].reverse()) {
    let left = panel.center - panel.width / 2, right = panel.center + panel.width / 2;
    if (x < projectSurface(left, 0, bend, distance).x || x > projectSurface(right, 0, bend, distance).x) continue;
    for (let i = 0; i < 28; i++) {
      const middle = (left + right) / 2;
      if (projectSurface(middle, 0, bend, distance).x < x) left = middle; else right = middle;
    }
    if (Math.abs(y) <= projectSurface((left + right) / 2, panel.halfHeight, bend, distance).y) return panel;
  }
  return null;
}
