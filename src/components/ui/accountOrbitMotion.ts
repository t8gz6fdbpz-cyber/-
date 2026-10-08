export interface OrbitViewport { width: number; height: number }

const clamp = (value: number) => Math.min(1, Math.max(0, value));

// 对照原站 index.js 的 getPos / ScrollTrigger，禁止用碰撞避让改写轨迹。
export const ORBIT_STAGGER = .09;
export const ORBIT_SLICE_COUNT = 10;
export const ORBIT_REFERENCE_CAPACITY = 8;
export const orbitCapacity = (viewport: OrbitViewport) => viewport.width <= 768 ? 4 : ORBIT_REFERENCE_CAPACITY;

export function orbitStatementBounds(viewport: OrbitViewport) {
  const mobile = viewport.width <= 768;
  const width = mobile ? viewport.width * .85 : Math.min(900, viewport.width * .7);
  const font = mobile ? 24 : Math.min(51.2, Math.max(25.6, viewport.width * .035));
  const height = font * 1.3 * (mobile ? 4 : 3);
  return { left: (viewport.width - width) / 2, right: (viewport.width + width) / 2,
    top: (viewport.height - height) / 2, bottom: (viewport.height + height) / 2, font, width };
}

export function orbitGeometry(viewport: OrbitViewport) {
  const mobile = viewport.width <= 768;
  const width = mobile ? 120 : Math.min(210, Math.max(120, viewport.width * .14));
  return { width, height: width * 2 / 3, depth: mobile ? 180 : 500,
    tilt: mobile ? 80 : 180, centerY: viewport.height / 2, horizontalRadius: viewport.width * .34 };
}

export function orbitCurve(viewport: OrbitViewport) {
  const { width } = orbitGeometry(viewport);
  const radius = (viewport.width * .34 + 500) / 2;
  return { radius, count: ORBIT_SLICE_COUNT, sliceWidth: width / ORBIT_SLICE_COUNT,
    sliceAngle: width / radius / ORBIT_SLICE_COUNT };
}

export function orbitPose(value: number, viewport: OrbitViewport) {
  const t = clamp(value);
  const { depth, tilt, horizontalRadius } = orbitGeometry(viewport);
  const orbitT = clamp((t - .12) / .76);
  const angle = Math.PI / 2 - orbitT * Math.PI * 2;
  let x = Math.cos(angle) * horizontalRadius;
  let z = Math.sin(angle) * depth;
  let y = z / depth * tilt;
  if (t <= .12) {
    const entry = t / .12;
    x = -viewport.width * .85 * (1 - entry);
    z = depth * entry;
    y = tilt;
  } else if (t > .88) {
    const exit = (t - .88) / .12;
    x = viewport.width * .85 * exit;
    z = depth * (1 - exit);
    y = tilt;
  }
  return { x, y, z, rotation: orbitT * 360, zIndex: Math.round(z + 600),
    opacity: value <= 0 || value >= 1 ? 0 : Math.min(clamp(t / .06), clamp((1 - t) / .06)) };
}

export function orbitPhrase(progress: number) {
  const p = clamp((progress - .25) / .5);
  return { y: 200 * (.5 - p), opacity: progress <= .25 || progress >= .75 ? 0
    : p < .1 ? p / .1 : p > .75 ? (1 - p) / .25 : 1 };
}

export function orbitWord(progress: number, index: number, count: number) {
  const p = clamp((progress - .25) / .5);
  const reveal = p < .4 ? clamp((p / .4 * (count + 4) - index) / 3) : 1;
  return { opacity: reveal, blur: 8 * (1 - reveal) };
}

/** 曲面实际投影，仅用于记录与诊断；不能把正常 3D 前后遮挡当作二维盒子碰撞。 */
export function orbitProjectedBounds(value: number, viewport: OrbitViewport) {
  const pose = orbitPose(value, viewport), geometry = orbitGeometry(viewport), curve = orbitCurve(viewport);
  const rotation = pose.rotation * Math.PI / 180;
  const points: { x: number; y: number }[] = [];
  for (let slice = 0; slice < curve.count; slice++) {
    const angle = (slice - (curve.count - 1) / 2) * curve.sliceAngle;
    for (const edge of [-1, 1]) for (const vertical of [-1, 1]) {
      const localX = curve.radius * Math.sin(angle) + edge * (curve.sliceWidth + 1.5) / 2 * Math.cos(angle);
      const localZ = curve.radius * (Math.cos(angle) - 1) - edge * (curve.sliceWidth + 1.5) / 2 * Math.sin(angle);
      const x = localX * Math.cos(rotation) + localZ * Math.sin(rotation) + pose.x;
      const z = -localX * Math.sin(rotation) + localZ * Math.cos(rotation) + pose.z;
      const scale = 1200 / (1200 - z);
      points.push({ x: viewport.width / 2 + x * scale,
        y: viewport.height / 2 + (pose.y + vertical * geometry.height / 2) * scale });
    }
  }
  return { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)),
    top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)), opacity: pose.opacity };
}
