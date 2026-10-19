import * as THREE from "three";
import type { ToolGalaxyTool } from "./ToolGalaxy3D";

export const galaxyCameraZoom = (width: number) => width < 520 ? 75 : 100;

/** Exact extrema of the rotated ellipse, including its centre and full hit target.
 * No sampling at the current phase: the bound holds for an entire revolution. */
export function galaxyProjection(tools: ToolGalaxyTool[], width: number, height: number) {
  const compact = width < 520;
  const zoom = galaxyCameraZoom(width);
  const margin = compact ? 46 : 76;
  let x = 1;
  let y = compact ? 1.35 : 1;
  for (const tool of tools) {
    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      ...tool.orbitTilt.map(THREE.MathUtils.degToRad) as [number, number, number],
    ));
    const a = new THREE.Vector3(tool.orbitRadiusX ?? tool.orbitRadius, 0, 0).applyQuaternion(rotation);
    const b = new THREE.Vector3(0, tool.orbitRadius * (tool.orbitVerticalRatio ?? .365), tool.orbitRadius * .11).applyQuaternion(rotation);
    const center = tool.orbitCenter ?? [0, 0, 0];
    x = Math.min(x, Math.max(0, width / 2 - margin - Math.abs(center[0]) * zoom) / (Math.hypot(a.x, b.x) * zoom));
    y = Math.min(y, Math.max(0, height / 2 - margin - Math.abs(center[1]) * zoom) / (Math.hypot(a.y, b.y) * zoom));
  }
  return { x, y, z: .9 };
}
