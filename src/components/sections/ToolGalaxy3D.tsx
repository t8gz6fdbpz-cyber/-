import { Html, Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

export type ToolCategory = "AI 创作" | "内容制作" | "平台运营";

export type ToolGalaxyTool = {
  id: string;
  name: string;
  category: ToolCategory;
  icon?: string;
  initials?: string;
  description: string;
  tags: string[];
  orbitIndex: number;
  orbitRadius: number;
  orbitTilt: [number, number, number];
  baseAngle: number;
  speed: number;
  phase: number;
  layoutAnchor?: [number, number];
  mobileLayoutAnchor?: [number, number];
};

type ToolGalaxy3DProps = {
  activeCategory: ToolCategory | null;
  focusedToolId: string | null;
  reducedMotion: boolean;
  selectedToolId: string | null;
  tools: ToolGalaxyTool[];
  onClearFocus: () => void;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
};

const twoPi = Math.PI * 2;
const categoryOrder: ToolCategory[] = ["AI 创作", "内容制作", "平台运营"];
const tempPosition = new THREE.Vector3();
const tempEuler = new THREE.Euler();
const defaultProjectionSpread = { x: 1, y: 1, z: 1 };
const iconTextureSize = 192;
const iconCornerRatio = 0.382;
type PlanetPositionRegistry = MutableRefObject<Map<string, THREE.Vector3>>;
type LoadedIconImage = CanvasImageSource & {
  height?: number;
  naturalHeight?: number;
  naturalWidth?: number;
  width?: number;
};

const layoutPresets: Array<{
  baseAngle: number;
  orbitIndex: number;
  radius: number;
  tilt: [number, number, number];
  phase: number;
}> = [
  { orbitIndex: 0, baseAngle: 158, radius: 3.38, tilt: [-8, -14, 4], phase: 0.1 },
  { orbitIndex: 1, baseAngle: 24, radius: 3.72, tilt: [-6, 18, -4], phase: 0.8 },
  { orbitIndex: 2, baseAngle: 96, radius: 3.48, tilt: [-34, 8, -10], phase: 1.6 },
  { orbitIndex: 3, baseAngle: 284, radius: 3.82, tilt: [-36, -8, 12], phase: 2.4 },
  { orbitIndex: 4, baseAngle: 212, radius: 3.66, tilt: [18, -32, 16], phase: 0.45 },
  { orbitIndex: 5, baseAngle: 30, radius: 3.44, tilt: [-18, 32, -16], phase: 1.2 },
  { orbitIndex: 6, baseAngle: 66, radius: 3.9, tilt: [-42, -4, 20], phase: 2.0 },
  { orbitIndex: 7, baseAngle: 150, radius: 3.54, tilt: [28, 18, -22], phase: 2.8 },
  { orbitIndex: 8, baseAngle: 225, radius: 3.78, tilt: [-18, -26, 10], phase: 0.65 },
  { orbitIndex: 9, baseAngle: 306, radius: 3.58, tilt: [12, 34, -18], phase: 1.45 },
  { orbitIndex: 10, baseAngle: 44, radius: 3.36, tilt: [-40, 16, 24], phase: 2.25 },
  { orbitIndex: 11, baseAngle: 8, radius: 3.96, tilt: [34, -18, -16], phase: 3.05 },
];

const layoutAnchors: Array<[number, number]> = [
  [-0.68, 0.34],
  [0.06, 0.3],
  [0.66, 0.32],
  [-0.48, -0.02],
  [0.26, -0.04],
  [0.72, -0.14],
  [-0.64, -0.42],
  [-0.08, -0.34],
  [0.46, -0.38],
  [-0.24, 0.48],
  [0.42, 0.46],
  [0.02, -0.02],
];

const mobileLayoutAnchors: Array<[number, number]> = [
  [-0.7, 0.58],
  [-0.12, 0.54],
  [0.48, 0.58],
  [-0.62, 0.24],
  [0.02, 0.2],
  [0.64, 0.24],
  [0.48, -0.16],
  [-0.08, -0.18],
  [0.76, -0.36],
  [-0.64, -0.36],
  [0.02, -0.48],
  [0.54, -0.55],
];

const mobileFocusAnchors: Array<[number, number]> = [
  [-0.78, 0.9],
  [-0.32, 0.86],
  [0.18, 0.9],
  [0.68, 0.84],
  [-0.62, 0.72],
  [-0.12, 0.68],
  [0.42, 0.72],
  [0.78, 0.66],
  [-0.74, 0.54],
  [-0.24, 0.5],
  [0.28, 0.54],
  [0.72, 0.48],
];

const defaultFocusAvoidAngles = [
  205, 238, 172, 120, 100, 88, 260, 145, 330, 62, 120, 285,
].map(THREE.MathUtils.degToRad);

const focusAvoidOffsets: Array<[number, number]> = [
  [0.22, -0.08],
  [-0.18, 0.12],
  [0.28, 0.12],
  [-0.24, -0.12],
  [-0.34, 0.1],
  [-0.34, -0.24],
  [0, 0],
  [0.34, -0.2],
  [-0.36, 0.18],
  [0.28, -0.24],
  [0.38, 0.24],
  [-0.26, 0.28],
];

const focusAvoidAngleTable = [
  [205, 100, 90, 0, 100, 140, 260, 60, 30, 70, 130, 150],
  [110, 238, 170, 0, 100, 120, 260, 50, 40, 90, 180, 285],
  [40, 100, 172, 120, 100, 120, 260, 50, 30, 90, 180, 180],
  [60, 280, 172, 120, 100, 340, 260, 140, 30, 62, 120, 190],
  [205, 100, 90, 0, 100, 140, 260, 60, 30, 62, 130, 150],
  [60, 100, 172, 10, 100, 88, 260, 145, 330, 100, 120, 180],
  [300, 110, 10, 70, 100, 240, 260, 0, 120, 80, 110, 130],
  [205, 110, 180, 140, 330, 140, 260, 145, 30, 100, 70, 285],
  [50, 100, 10, 40, 100, 140, 260, 60, 330, 80, 100, 130],
  [205, 10, 172, 120, 60, 130, 260, 40, 330, 62, 120, 285],
  [70, 270, 110, 120, 90, 80, 260, 50, 30, 62, 120, 160],
  [205, 0, 140, 0, 70, 88, 260, 150, 30, 80, 120, 285],
].map((row) => row.map(THREE.MathUtils.degToRad));

function normalizeAngle(angle: number) {
  return ((angle % twoPi) + twoPi) % twoPi;
}

function shortestAngleDelta(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function projectToScreen(
  position: THREE.Vector3,
  camera: THREE.Camera,
  size: { height: number; width: number },
  target: THREE.Vector3,
) {
  target.copy(position).project(camera);

  return {
    x: (target.x * 0.5 + 0.5) * size.width,
    y: (-target.y * 0.5 + 0.5) * size.height,
  };
}

function moveTowardScreenPoint(
  position: THREE.Vector3,
  camera: THREE.Camera,
  size: { height: number; width: number },
  screenX: number,
  screenY: number,
  strength: number,
  target: THREE.Vector3,
) {
  target.copy(position).project(camera);
  const nextX = THREE.MathUtils.lerp(
    (target.x * 0.5 + 0.5) * size.width,
    screenX,
    strength,
  );
  const nextY = THREE.MathUtils.lerp(
    (-target.y * 0.5 + 0.5) * size.height,
    screenY,
    strength,
  );

  target.set(
    (nextX / Math.max(size.width, 1)) * 2 - 1,
    -((nextY / Math.max(size.height, 1)) * 2 - 1),
    target.z,
  );
  target.unproject(camera);
  position.x = target.x;
  position.y = target.y;
}

function applySoftBounds(
  position: THREE.Vector3,
  xLimit: number,
  yLimit: number,
) {
  const softZoneX = Math.max(0.18, xLimit * 0.1);
  const softZoneY = Math.max(0.14, yLimit * 0.1);
  const softX = Math.max(0, xLimit - softZoneX);
  const softY = Math.max(0, yLimit - softZoneY);

  if (Math.abs(position.x) > softX) {
    const direction = Math.sign(position.x) || 1;
    const overflow = Math.abs(position.x) - softX;
    position.x = direction * (softX + overflow * 0.42);
  }

  if (Math.abs(position.y) > softY) {
    const direction = Math.sign(position.y) || 1;
    const overflow = Math.abs(position.y) - softY;
    position.y = direction * (softY + overflow * 0.42);
  }

  position.x = THREE.MathUtils.clamp(position.x, -xLimit, xLimit);
  position.y = THREE.MathUtils.clamp(position.y, -yLimit, yLimit);
}

function separateFromNeighbors({
  camera,
  compact,
  focusActive,
  focused,
  minDistancePx,
  position,
  registry,
  size,
  toolId,
  toolIndex,
  worldPerPixelX,
  worldPerPixelY,
  xLimit,
  yLimit,
}: {
  camera: THREE.Camera;
  compact: boolean;
  focusActive: boolean;
  focused: boolean;
  minDistancePx: number;
  position: THREE.Vector3;
  registry: Map<string, THREE.Vector3>;
  size: { height: number; width: number };
  toolId: string;
  toolIndex: number;
  worldPerPixelX: number;
  worldPerPixelY: number;
  xLimit: number;
  yLimit: number;
}) {
  if (focused) return;

  const projection = new THREE.Vector3();
  const neighborProjection = new THREE.Vector3();
  const passes = focusActive ? 5 : 4;
  const pushStrength = compact ? 0.82 : 0.96;

  for (let pass = 0; pass < passes; pass += 1) {
    registry.forEach((neighborPosition, neighborId) => {
      if (neighborId === toolId) return;

      const current = projectToScreen(position, camera, size, projection);
      const neighbor = projectToScreen(
        neighborPosition,
        camera,
        size,
        neighborProjection,
      );
      let dx = current.x - neighbor.x;
      let dy = current.y - neighbor.y;
      let distance = Math.hypot(dx, dy);

      if (distance >= minDistancePx) return;

      if (distance < 0.001) {
        const angle = seededUnit(`${toolId}-${neighborId}-${toolIndex}`) * twoPi;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        distance = 1;
      }

      const pushPx = (minDistancePx - distance) * pushStrength;
      position.x += (dx / distance) * pushPx * worldPerPixelX;
      position.y += (dy / distance) * pushPx * worldPerPixelY;
      applySoftBounds(position, xLimit, yLimit);
    });
  }
}

function setOrbitPosition(
  target: THREE.Vector3,
  tool: ToolGalaxyTool,
  angle: number,
  spread = defaultProjectionSpread,
) {
  target.set(
    Math.cos(angle) * tool.orbitRadius,
    Math.sin(angle * 1.6 + tool.phase) * 0.38,
    Math.sin(angle) * tool.orbitRadius * 0.58,
  );
  tempEuler.set(
    THREE.MathUtils.degToRad(tool.orbitTilt[0]),
    THREE.MathUtils.degToRad(tool.orbitTilt[1]),
    THREE.MathUtils.degToRad(tool.orbitTilt[2]),
  );
  target.applyEuler(tempEuler);
  target.set(target.x * spread.x, target.y * spread.y, target.z * spread.z);

  return target;
}

function getFocusAngle(tool: ToolGalaxyTool) {
  const probe = new THREE.Vector3();
  let bestAngle = tool.baseAngle;
  let bestScore = -Infinity;

  for (let index = 0; index < 240; index += 1) {
    const angle = (index / 240) * twoPi;
    setOrbitPosition(probe, tool, angle);
    const score = probe.x * 0.95 + probe.z * 0.48 - Math.abs(probe.y) * 0.36;
    if (score > bestScore) {
      bestScore = score;
      bestAngle = angle;
    }
  }

  return bestAngle;
}

function seededUnit(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967295;
}

function roundedRectPath(
  context: CanvasRenderingContext2D,
  size: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(radius, 0);
  context.lineTo(size - radius, 0);
  context.quadraticCurveTo(size, 0, size, radius);
  context.lineTo(size, size - radius);
  context.quadraticCurveTo(size, size, size - radius, size);
  context.lineTo(radius, size);
  context.quadraticCurveTo(0, size, 0, size - radius);
  context.lineTo(0, radius);
  context.quadraticCurveTo(0, 0, radius, 0);
  context.closePath();
}

function getIconContainerBackground(icon: string) {
  if (icon.includes("chatgpt")) return "#f3eee3";
  if (icon.includes("canva")) return "#fff8e8";
  if (icon.includes("claude")) return "#fff4e3";
  if (icon.includes("tiktok")) return "#050505";

  return null;
}

function getIconDrawInset(icon: string) {
  if (
    icon.includes("chatgpt") ||
    icon.includes("canva") ||
    icon.includes("claude") ||
    icon.includes("tiktok")
  ) {
    return iconTextureSize * 0.18;
  }

  return 0;
}

function createRoundedIconTexture(
  image: LoadedIconImage,
  icon: string,
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const sourceWidth = image.naturalWidth ?? Number(image.width);
  const sourceHeight = image.naturalHeight ?? Number(image.height);
  const sourceSize = Math.min(sourceWidth, sourceHeight);
  const insetRatio = icon.includes("photoshop") ? 0.125 : 0;
  const cropSize = sourceSize * (1 - insetRatio * 2);
  const sourceX = (sourceWidth - cropSize) / 2;
  const sourceY = (sourceHeight - cropSize) / 2;
  const destinationInset = getIconDrawInset(icon);
  const destinationSize = iconTextureSize - destinationInset * 2;

  canvas.width = iconTextureSize;
  canvas.height = iconTextureSize;

  if (!context) return null;

  context.clearRect(0, 0, iconTextureSize, iconTextureSize);
  roundedRectPath(
    context,
    iconTextureSize,
    iconTextureSize * iconCornerRatio,
  );
  context.clip();
  const background = getIconContainerBackground(icon);
  if (background) {
    context.fillStyle = background;
    context.fillRect(0, 0, iconTextureSize, iconTextureSize);
  }
  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    destinationInset,
    destinationInset,
    destinationSize,
    destinationSize,
  );

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createStableGalaxyLayout(tools: ToolGalaxyTool[]) {
  const grouped = new Map<ToolCategory, ToolGalaxyTool[]>();
  tools.forEach((tool) => {
    const group = grouped.get(tool.category) ?? [];
    group.push(tool);
    grouped.set(tool.category, group);
  });

  const categories = categoryOrder.filter((category) => grouped.has(category));

  return categories.flatMap((category, categoryIndex) => {
    const group = [...(grouped.get(category) ?? [])].sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    return group.map((tool, toolIndex) => {
      const presetIndex = (categoryIndex * 4 + toolIndex) % layoutPresets.length;
      const preset = layoutPresets[presetIndex];
      const cycle = Math.floor((categoryIndex * 4 + toolIndex) / layoutPresets.length);
      const globalIndex = categoryIndex * 4 + toolIndex;
      const anchor = layoutAnchors[globalIndex % layoutAnchors.length];
      const mobileAnchor =
        mobileLayoutAnchors[globalIndex % mobileLayoutAnchors.length];
      const cycleOffset =
        cycle > 0 ? (cycle / Math.max(group.length, 1)) * twoPi : 0;

      return {
        ...tool,
        orbitIndex: preset.orbitIndex,
        orbitRadius: preset.radius + cycle * 0.18,
        orbitTilt: preset.tilt,
        baseAngle: normalizeAngle(
          THREE.MathUtils.degToRad(preset.baseAngle) + cycleOffset,
        ),
        speed: 0.026,
        phase: preset.phase,
        layoutAnchor: anchor,
        mobileLayoutAnchor: mobileAnchor,
      };
    });
  });
}

function createOrbitPoints(
  radius: number,
  tilt: [number, number, number],
  spread = defaultProjectionSpread,
) {
  const points: THREE.Vector3[] = [];
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(tilt[0]),
    THREE.MathUtils.degToRad(tilt[1]),
    THREE.MathUtils.degToRad(tilt[2]),
  );

  for (let index = 0; index <= 192; index += 1) {
    const angle = (index / 192) * Math.PI * 2;
    const point = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle * 2) * 0.12,
      Math.sin(angle) * radius * 0.58,
    );

    point.applyEuler(euler);
    point.set(point.x * spread.x, point.y * spread.y, point.z * spread.z);
    points.push(point);
  }

  return points;
}

function OrbitLine({
  active,
  radius,
  spread,
  tilt,
}: {
  active: boolean;
  radius: number;
  spread: typeof defaultProjectionSpread;
  tilt: [number, number, number];
}) {
  const points = useMemo(
    () => createOrbitPoints(radius, tilt, spread),
    [radius, spread, tilt],
  );

  return (
    <Line
      points={points}
      color={active ? "#ffd175" : "#8a5a18"}
      lineWidth={active ? 0.82 : 0.52}
      opacity={active ? 0.3 : 0.14}
      transparent
    />
  );
}

function IconPlane({
  fallback,
  icon,
  opacity,
  renderOrder,
}: {
  fallback: string;
  icon: string;
  opacity: number;
  renderOrder: number;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let currentTexture: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();

    setFailed(false);
    setTexture(null);
    loader.load(
      icon,
      (loadedTexture) => {
        if (!active) {
          loadedTexture.dispose();
          return;
        }
        const roundedTexture = createRoundedIconTexture(
          loadedTexture.image as LoadedIconImage,
          icon,
        );
        loadedTexture.dispose();

        if (!roundedTexture) {
          if (active) setFailed(true);
          return;
        }

        currentTexture = roundedTexture;
        setTexture(roundedTexture);
      },
      undefined,
      (error) => {
        console.warn("[ToolGalaxy3D] Icon texture failed to load", {
          icon,
          error,
        });
        if (active) setFailed(true);
      },
    );

    return () => {
      active = false;
      currentTexture?.dispose();
    };
  }, [icon]);

  if (!texture || failed) {
    return (
      <InitialsPlane
        initials={fallback}
        opacity={opacity}
        renderOrder={renderOrder}
      />
    );
  }

  return (
    <sprite position={[0, 0, 0.26]} scale={[0.36, 0.36, 1]} renderOrder={renderOrder}>
      <spriteMaterial
        alphaTest={0.05}
        map={texture}
        opacity={opacity}
        toneMapped={false}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </sprite>
  );
}

function InitialsPlane({
  initials,
  opacity = 1,
  renderOrder = 8,
}: {
  initials: string;
  opacity?: number;
  renderOrder?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    groupRef.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.058]}>
      <Html center zIndexRange={[12, 0]}>
        <span className="tool-galaxy-initials" style={{ opacity }}>
          {initials}
        </span>
      </Html>
    </group>
  );
}

function ToolPlanet({
  activeCategory,
  compact,
  focusActive,
  focusedToolIndex,
  focused,
  projectionSpread,
  positionRegistry,
  reducedMotion,
  selected,
  toolIndex,
  tool,
  onSelectTool,
}: {
  activeCategory: ToolCategory | null;
  compact: boolean;
  focusActive: boolean;
  focusedToolIndex: number;
  focused: boolean;
  projectionSpread: typeof defaultProjectionSpread;
  positionRegistry: PlanetPositionRegistry;
  reducedMotion: boolean;
  selected: boolean;
  toolIndex: number;
  tool: ToolGalaxyTool;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
}) {
  const angleRef = useRef(normalizeAngle(tool.baseAngle));
  const groupRef = useRef<THREE.Group>(null);
  const hoveredRef = useRef(false);
  const focusDriftRef = useRef(tool.phase + toolIndex * 0.71);
  const initializedRef = useRef(false);
  const lastPositionRef = useRef(new THREE.Vector3());
  const screenAnchorRef = useRef(new THREE.Vector3());
  const previousFocusActiveRef = useRef(focusActive);
  const returningToOrbitRef = useRef(false);
  const { camera, gl, size, viewport } = useThree();
  const categoryActive = activeCategory === null || tool.category === activeCategory;
  const iconOpacity = focusActive
    ? focused
      ? 1
      : 0.42
    : categoryActive
      ? 1
      : 0.48;
  const focusAngle = useMemo(
    () => getFocusAngle(tool),
    [tool.baseAngle, tool.orbitRadius, tool.orbitTilt, tool.phase],
  );
  const avoidAngle = normalizeAngle(
    (focusAvoidAngleTable[focusedToolIndex]?.[toolIndex] ??
      defaultFocusAvoidAngles[toolIndex % defaultFocusAvoidAngles.length]) +
      toolIndex * 0.018,
  );
  const renderOrder = focused ? 48 : selected ? 32 : categoryActive ? 18 : 8;

  const setHovered = (value: boolean) => {
    hoveredRef.current = value;
    gl.domElement.style.cursor = value ? "pointer" : "";
  };

  useEffect(() => () => {
    if (hoveredRef.current) {
      gl.domElement.style.cursor = "";
    }
  }, [gl]);

  useEffect(
    () => () => {
      positionRegistry.current.delete(tool.id);
    },
    [positionRegistry, tool.id],
  );

  useEffect(() => {
    if (previousFocusActiveRef.current && !focusActive) {
      returningToOrbitRef.current = true;
    }
    previousFocusActiveRef.current = focusActive;
  }, [focusActive]);

  useFrame((_, delta) => {
    const hovered = hoveredRef.current;

    if (focused) {
      angleRef.current = normalizeAngle(
        angleRef.current +
          shortestAngleDelta(angleRef.current, focusAngle) *
            (reducedMotion ? 1 : 1 - Math.exp(-delta * 6.8)),
      );
    } else if (focusActive) {
      returningToOrbitRef.current = false;
      if (!reducedMotion) {
        focusDriftRef.current += delta * (0.82 + toolIndex * 0.035);
      }
      const movingAvoidAngle = reducedMotion
        ? avoidAngle
        : normalizeAngle(
            avoidAngle +
              Math.sin(focusDriftRef.current) * 0.1 +
              Math.sin(focusDriftRef.current * 0.47 + tool.phase) * 0.04,
          );
      angleRef.current = normalizeAngle(
        angleRef.current +
          shortestAngleDelta(angleRef.current, movingAvoidAngle) *
            (reducedMotion ? 1 : 1 - Math.exp(-delta * 4.4)),
      );
    } else if (returningToOrbitRef.current) {
      const returnDelta = shortestAngleDelta(angleRef.current, tool.baseAngle);
      angleRef.current = normalizeAngle(
        angleRef.current +
          returnDelta * (reducedMotion ? 1 : 1 - Math.exp(-delta * 5.6)),
      );
      if (Math.abs(returnDelta) < 0.015) {
        angleRef.current = normalizeAngle(tool.baseAngle);
        returningToOrbitRef.current = false;
      }
    } else if (!reducedMotion) {
      angleRef.current = normalizeAngle(
        angleRef.current + tool.speed * delta * 0.72,
      );
    }

    setOrbitPosition(tempPosition, tool, angleRef.current, projectionSpread);
    if (focusActive && !focused) {
      const [offsetX, offsetY] =
        focusAvoidOffsets[toolIndex % focusAvoidOffsets.length];
      const compactBoost = projectionSpread.y > 1 ? 1.34 : 0.72;
      tempPosition.x += offsetX * compactBoost;
      tempPosition.y += offsetY * compactBoost;
    }

    const currentViewport = viewport.getCurrentViewport(camera, tempPosition);
    const safePixels = focused ? (compact ? 86 : 112) : compact ? 66 : 82;
    const safeX = Math.min(
      currentViewport.width * 0.26,
      Math.max(0.34, (safePixels / Math.max(size.width, 1)) * currentViewport.width),
    );
    const safeY = Math.min(
      currentViewport.height * 0.26,
      Math.max(0.34, (safePixels / Math.max(size.height, 1)) * currentViewport.height),
    );
    const xLimit = Math.max(0.4, currentViewport.width / 2 - safeX);
    const yLimit = Math.max(0.34, currentViewport.height / 2 - safeY);
    const anchor = compact
      ? focusActive && !focused
        ? mobileFocusAnchors[toolIndex % mobileFocusAnchors.length]
        : tool.mobileLayoutAnchor ?? tool.layoutAnchor
      : tool.layoutAnchor;
    if (anchor && !focused) {
      const orbitDriftX = Math.sin(angleRef.current * 0.74 + tool.phase) * xLimit * 0.08;
      const orbitDriftY =
        Math.cos(angleRef.current * 0.92 + tool.phase + toolIndex) * yLimit * 0.08;
      const anchorStrength = compact
        ? focusActive
          ? 0.96
          : 0.9
        : focusActive
          ? 0.34
          : 0.24;
      if (compact) {
        const screenMargin = focusActive ? 62 : 54;
        const screenX = THREE.MathUtils.clamp(
          size.width * (0.5 + anchor[0] * 0.42) +
            Math.sin(angleRef.current * 0.74 + tool.phase) * 8,
          screenMargin,
          size.width - screenMargin,
        );
        const screenY = THREE.MathUtils.clamp(
          size.height * (0.5 - anchor[1] * 0.42) +
            Math.cos(angleRef.current * 0.92 + tool.phase + toolIndex) * 8,
          screenMargin,
          size.height - screenMargin,
        );
        moveTowardScreenPoint(
          tempPosition,
          camera,
          size,
          screenX,
          screenY,
          anchorStrength,
          screenAnchorRef.current,
        );
      } else {
        tempPosition.x = THREE.MathUtils.lerp(
          tempPosition.x,
          anchor[0] * xLimit + orbitDriftX,
          anchorStrength,
        );
        tempPosition.y = THREE.MathUtils.lerp(
          tempPosition.y,
          anchor[1] * yLimit + orbitDriftY,
          anchorStrength,
        );
      }
    }
    applySoftBounds(tempPosition, xLimit, yLimit);
    separateFromNeighbors({
      camera,
      compact,
      focusActive,
      focused,
      minDistancePx: focusActive ? (compact ? 66 : 92) : compact ? 64 : 92,
      position: tempPosition,
      registry: positionRegistry.current,
      size,
      toolId: tool.id,
      toolIndex,
      worldPerPixelX: currentViewport.width / Math.max(size.width, 1),
      worldPerPixelY: currentViewport.height / Math.max(size.height, 1),
      xLimit,
      yLimit,
    });
    applySoftBounds(tempPosition, xLimit, yLimit);

    const scale = focused
      ? 1.42
        : hovered
          ? 1.08
          : focusActive
          ? compact
            ? 0.56
            : 0.78
          : categoryActive
            ? 1
            : 0.82;

    if (groupRef.current) {
      if (!initializedRef.current) {
        groupRef.current.position.copy(tempPosition);
        initializedRef.current = true;
      } else {
        groupRef.current.position.lerp(
          tempPosition,
          reducedMotion ? 1 : 1 - Math.exp(-delta * 6.2),
        );
      }

      const nextScale = THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        scale,
        reducedMotion ? 1 : 1 - Math.exp(-delta * 5),
      );
      groupRef.current.scale.setScalar(nextScale);
      lastPositionRef.current.copy(groupRef.current.position);
      positionRegistry.current.set(tool.id, lastPositionRef.current);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation();
        onSelectTool(tool, true);
      }}
      renderOrder={renderOrder}
    >
      {tool.icon ? (
        <IconPlane
          fallback={tool.initials ?? tool.name.slice(0, 2)}
          icon={tool.icon}
          opacity={iconOpacity}
          renderOrder={renderOrder + 1}
        />
      ) : (
        <InitialsPlane
          initials={tool.initials ?? tool.name.slice(0, 2)}
          opacity={iconOpacity}
          renderOrder={renderOrder + 1}
        />
      )}
      <Html center zIndexRange={[20, 0]}>
        <button
          type="button"
          className="tool-galaxy-a11y-button"
          aria-label={`${tool.name}，${tool.category}，${tool.tags.join("，")}`}
          aria-pressed={selected}
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onSelectTool(tool, true);
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectTool(tool, true);
            }
          }}
        />
      </Html>
    </group>
  );
}

function StarField() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let index = 0; index < 70; index += 1) {
      positions.push(
        (seededUnit(`star-x-${index}`) - 0.5) * 6.4,
        (seededUnit(`star-y-${index}`) - 0.5) * 3.8,
        (seededUnit(`star-z-${index}`) - 0.5) * 3.4,
      );
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return pointsGeometry;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#ffd175"
        opacity={0.22}
        size={0.012}
        transparent
      />
    </points>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    camera.fov = size.width < 520 ? 60 : 44;
    camera.position.set(
      0,
      size.width < 520 ? 0.18 : 0.24,
      size.width < 520 ? 10.4 : 6.1,
    );
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

function GalaxyScene({
  activeCategory,
  focusedToolId,
  reducedMotion,
  selectedToolId,
  tools,
  onClearFocus,
  onSelectTool,
}: ToolGalaxy3DProps) {
  const { size } = useThree();
  const positionRegistry = useRef(new Map<string, THREE.Vector3>());
  const projectionSpread = useMemo(
    () => (size.width < 520 ? { x: 0.78, y: 1.86, z: 1 } : defaultProjectionSpread),
    [size.width],
  );
  const focusedToolIndex = useMemo(
    () => tools.findIndex((tool) => tool.id === focusedToolId),
    [focusedToolId, tools],
  );
  const orbitConfigs = useMemo(
    () =>
      [...new Map(tools.map((tool) => [tool.orbitIndex, tool])).values()]
        .sort((a, b) => a.orbitIndex - b.orbitIndex)
        .map((tool) => ({
          index: tool.orbitIndex,
          radius: tool.orbitRadius,
          tilt: tool.orbitTilt,
          active: tools.some(
            (item) =>
              item.orbitIndex === tool.orbitIndex &&
              (activeCategory === null || item.category === activeCategory),
          ),
        })),
    [activeCategory, tools],
  );

  return (
    <>
      <ambientLight intensity={1.3} />
      <ResponsiveCamera />
      <pointLight color="#ffd175" intensity={3.8} position={[0, 0.6, 2.6]} />
      <spotLight
        angle={0.55}
        color="#f3b34d"
        intensity={1.6}
        penumbra={0.9}
        position={[2.4, 2.2, 3.4]}
      />
      <group position={[0, 0, 0]}>
        <StarField />
        {orbitConfigs.map((orbit) => (
          <OrbitLine
            key={orbit.index}
            active={orbit.active}
            radius={orbit.radius}
            spread={projectionSpread}
            tilt={orbit.tilt}
          />
        ))}
        {tools.map((tool) => (
          <ToolPlanet
            key={tool.id}
            activeCategory={activeCategory}
            compact={size.width < 520}
            focusActive={focusedToolId !== null}
            focusedToolIndex={focusedToolIndex}
            focused={focusedToolId === tool.id}
            projectionSpread={projectionSpread}
            positionRegistry={positionRegistry}
            reducedMotion={reducedMotion}
            selected={selectedToolId === tool.id}
            toolIndex={tools.findIndex((item) => item.id === tool.id)}
            tool={tool}
            onSelectTool={onSelectTool}
          />
        ))}
      </group>
      <mesh
        position={[0, 0, -2.8]}
        onClick={(event) => {
          event.stopPropagation();
          onClearFocus();
        }}
      >
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

export const ToolGalaxy3D = memo(function ToolGalaxy3D({
  activeCategory,
  focusedToolId,
  reducedMotion,
  selectedToolId,
  tools,
  onClearFocus,
  onSelectTool,
}: ToolGalaxy3DProps) {
  const layoutTools = useMemo(() => createStableGalaxyLayout(tools), [tools]);

  return (
    <div
      className="tool-galaxy-stage"
      aria-label="3D 原子轨道式工具星系"
    >
      <Canvas
        camera={{ fov: 44, position: [0, 0.24, 6.1] }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={onClearFocus}
      >
        <GalaxyScene
          activeCategory={activeCategory}
          focusedToolId={focusedToolId}
          reducedMotion={reducedMotion}
          selectedToolId={selectedToolId}
          tools={layoutTools}
          onClearFocus={onClearFocus}
          onSelectTool={onSelectTool}
        />
      </Canvas>
    </div>
  );
});
