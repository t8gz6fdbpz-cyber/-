import { Html, Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

export type ToolCategory = "AI 创作" | "内容制作" | "平台运营";
export type GalaxyInteractionPhase =
  | "free"
  | "focusing"
  | "focused"
  | "releasing";

export type ToolGalaxyTool = {
  id: string;
  name: string;
  category: ToolCategory;
  icon?: string;
  initials?: string;
  description: string;
  focusAvoidOffset?: number;
  tags: string[];
  orbitIndex: number;
  orbitCenter?: [number, number, number];
  orbitRadius: number;
  orbitTilt: [number, number, number];
  baseAngle: number;
  mobileBaseAngle?: number;
  speed: number;
  phase: number;
};

type ToolGalaxy3DProps = {
  activeCategory: ToolCategory | null;
  focusedToolId: string | null;
  interactionPhase: GalaxyInteractionPhase;
  reducedMotion: boolean;
  selectedToolId: string | null;
  tools: ToolGalaxyTool[];
  detailPanelRef: MutableRefObject<HTMLElement | null>;
  onClearFocus: () => void;
  onFocusSettled: (toolId: string) => void;
  onReleaseSettled: (toolId: string) => void;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
};

const twoPi = Math.PI * 2;
const categoryOrder: ToolCategory[] = ["AI 创作", "内容制作", "平台运营"];
const tempPosition = new THREE.Vector3();
const tempProjectedPosition = new THREE.Vector3();
const defaultProjectionSpread = { x: 1, y: 1, z: 1 };
const desktopFreeOrbitPhaseRate = 0.32;
const mobileFreeOrbitPhaseRate = 0.24;
const freeOrbitSpeedMultiplier = 1.2;
const iconTextureSize = 192;
const iconCornerRatio = 0.382;
const iconTextureCache = new Map<string, THREE.Texture>();
const iconTextureRequests = new Map<string, Promise<THREE.Texture>>();
let iconTextureLoader: THREE.TextureLoader | null = null;
type LoadedIconImage = CanvasImageSource & {
  height?: number;
  naturalHeight?: number;
  naturalWidth?: number;
  width?: number;
};

const layoutPresets: Array<{
  center: [number, number, number];
  desktopPhase: number;
  mobilePhase: number;
  orbitIndex: number;
  radius: number;
  speed: number;
  tilt: [number, number, number];
  phase: number;
}> = [
  {
    orbitIndex: 0,
    center: [-0.12, 0.05, -0.35],
    desktopPhase: 3.458363,
    mobilePhase: 3.909011,
    radius: 3.65,
    speed: 0.045,
    tilt: [58, -16, 12],
    phase: 0,
  },
  {
    orbitIndex: 1,
    center: [0.08, -0.02, 0.15],
    desktopPhase: 5.202802,
    mobilePhase: 5.256916,
    radius: 3.35,
    speed: 0.045,
    tilt: [-46, 24, -18],
    phase: 0,
  },
  {
    orbitIndex: 2,
    center: [-0.05, 0.12, 0.42],
    desktopPhase: 4.133752,
    mobilePhase: 4.688229,
    radius: 3.85,
    speed: 0.045,
    tilt: [22, 54, 42],
    phase: 0,
  },
  {
    orbitIndex: 3,
    center: [0.12, -0.1, -0.08],
    desktopPhase: 2.059052,
    mobilePhase: 1.461396,
    radius: 3.55,
    speed: 0.045,
    tilt: [-24, -42, 68],
    phase: 0,
  },
];
const mobilePhaseSlotsDegrees = [
  199.374, 284.325, 30, 59.59, 308.675, 38.079, 115, 135, 25,
  169.553, 246.709, 290,
];
const desktopPhaseSlotsDegrees = [
  75, 154.006, 18.784, 0.578, 160, 255, 268.565, 130.774, 245,
  17.805, 110, 275,
];
const focusAvoidOffsets = new Map<string, number>([
  ["tiktok", THREE.MathUtils.degToRad(85 - 17.805)],
  ["wechat-channels", THREE.MathUtils.degToRad(115 - 110)],
]);

function normalizeAngle(angle: number) {
  return ((angle % twoPi) + twoPi) % twoPi;
}

function shortestAngleDelta(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function setOrbitPoint(
  target: THREE.Vector3,
  center: [number, number, number],
  radius: number,
  angle: number,
  spread: typeof defaultProjectionSpread,
  rotation: THREE.Quaternion,
) {
  target.set(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius * 0.72,
  );
  target.applyQuaternion(rotation);
  target.set(
    target.x * spread.x + center[0],
    target.y * spread.y + center[1],
    target.z * spread.z + center[2],
  );

  return target;
}

function setOrbitPosition(
  target: THREE.Vector3,
  tool: ToolGalaxyTool,
  angle: number,
  spread = defaultProjectionSpread,
  rotation: THREE.Quaternion,
) {
  return setOrbitPoint(
    target,
    tool.orbitCenter ?? [0, 0, 0],
    tool.orbitRadius,
    angle,
    spread,
    rotation,
  );
}

function setCubicBezier(
  target: THREE.Vector3,
  start: THREE.Vector3,
  controlA: THREE.Vector3,
  controlB: THREE.Vector3,
  end: THREE.Vector3,
  progress: number,
) {
  const inverse = 1 - progress;
  target
    .copy(start)
    .multiplyScalar(inverse * inverse * inverse)
    .addScaledVector(controlA, 3 * inverse * inverse * progress)
    .addScaledVector(controlB, 3 * inverse * progress * progress)
    .addScaledVector(end, progress * progress * progress);
}

type MorphPanelTarget = {
  canvasOffsetX: number;
  canvasOffsetY: number;
  height: number;
  left: number;
  logoX: number;
  logoY: number;
  padding: number;
  top: number;
  width: number;
};

function smoothRange(value: number, start: number, end: number) {
  const progress = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function measureMorphPanelTarget(
  panel: HTMLElement,
  canvas: HTMLCanvasElement,
): MorphPanelTarget | null {
  const offsetParent = panel.offsetParent;
  const logo = panel.querySelector<HTMLElement>(".tool-info-logo");
  if (!(offsetParent instanceof HTMLElement) || !logo) return null;

  const parentRect = offsetParent.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const style = window.getComputedStyle(panel);

  return {
    canvasOffsetX: canvasRect.left - parentRect.left,
    canvasOffsetY: canvasRect.top - parentRect.top,
    height: panel.offsetHeight,
    left: panel.offsetLeft,
    logoX: logo.offsetLeft + logo.offsetWidth / 2,
    logoY: logo.offsetTop + logo.offsetHeight / 2,
    padding: Number.parseFloat(style.paddingLeft) || 0,
    top: panel.offsetTop,
    width: panel.offsetWidth,
  };
}

function writeMorphPanelFrame(
  panel: HTMLElement,
  target: MorphPanelTarget,
  worldPosition: THREE.Vector3,
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
  progress: number,
  compact: boolean,
) {
  const projected = tempProjectedPosition.copy(worldPosition).project(camera);
  const centerX =
    target.canvasOffsetX + ((projected.x + 1) / 2) * canvas.clientWidth;
  const centerY =
    target.canvasOffsetY + ((1 - projected.y) / 2) * canvas.clientHeight;
  const shapeProgress = smoothRange(progress, 0.18, 0.9);
  const sourceSize = compact ? 66 : 76;
  const width = THREE.MathUtils.lerp(sourceSize, target.width, shapeProgress);
  const height = THREE.MathUtils.lerp(sourceSize, target.height, shapeProgress);
  const anchorX = THREE.MathUtils.lerp(
    sourceSize / 2,
    target.logoX,
    shapeProgress,
  );
  const anchorY = THREE.MathUtils.lerp(
    sourceSize / 2,
    target.logoY,
    shapeProgress,
  );
  const left = THREE.MathUtils.lerp(
    centerX - anchorX,
    target.left,
    shapeProgress,
  );
  const top = THREE.MathUtils.lerp(
    centerY - anchorY,
    target.top,
    shapeProgress,
  );
  const padding = THREE.MathUtils.lerp(0, target.padding, shapeProgress);
  const radius = THREE.MathUtils.lerp(
    sourceSize * iconCornerRatio,
    compact ? 22 : 28,
    shapeProgress,
  );

  panel.style.left = `${left}px`;
  panel.style.right = "auto";
  panel.style.top = `${top}px`;
  panel.style.bottom = "auto";
  panel.style.width = `${width}px`;
  panel.style.height = `${height}px`;
  panel.style.padding = `${padding}px`;
  panel.style.borderRadius = `${radius}px`;
  panel.style.opacity = `${smoothRange(progress, 0.06, 0.18)}`;
  panel.style.visibility = progress > 0.015 ? "visible" : "hidden";
  panel.style.pointerEvents = progress > 0.9 ? "auto" : "none";
  panel.style.overflow = progress > 0.985 ? "" : "hidden";
  panel.style.zIndex = progress >= 0.18 ? "6" : "0";
  panel.style.setProperty(
    "--morph-logo-progress",
    progress >= 0.18 ? "1" : "0",
  );
  panel.style.setProperty(
    "--morph-content-progress",
    `${smoothRange(progress, 0.62, 0.9)}`,
  );
  panel.style.setProperty(
    "--morph-content-offset",
    `${THREE.MathUtils.lerp(12, 0, smoothRange(progress, 0.62, 0.9))}px`,
  );
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
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.save();
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
  context.restore();

  const pixels = context.getImageData(
    0,
    0,
    iconTextureSize,
    iconTextureSize,
  );
  for (let index = 0; index < pixels.data.length; index += 4) {
    if (pixels.data[index + 3] > 2) continue;
    pixels.data[index] = 0;
    pixels.data[index + 1] = 0;
    pixels.data[index + 2] = 0;
    pixels.data[index + 3] = 0;
  }
  context.putImageData(pixels, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.premultiplyAlpha = true;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
}

function loadRoundedIconTexture(icon: string) {
  const cached = iconTextureCache.get(icon);
  if (cached) return Promise.resolve(cached);

  const pending = iconTextureRequests.get(icon);
  if (pending) return pending;

  iconTextureLoader ??= new THREE.TextureLoader();
  const request = new Promise<THREE.Texture>((resolve, reject) => {
    iconTextureLoader?.load(
      icon,
      (loadedTexture) => {
        const roundedTexture = createRoundedIconTexture(
          loadedTexture.image as LoadedIconImage,
          icon,
        );
        loadedTexture.dispose();

        if (!roundedTexture) {
          iconTextureRequests.delete(icon);
          reject(new Error(`Unable to create icon texture for ${icon}`));
          return;
        }

        iconTextureCache.set(icon, roundedTexture);
        iconTextureRequests.delete(icon);
        resolve(roundedTexture);
      },
      undefined,
      (error) => {
        iconTextureRequests.delete(icon);
        reject(error);
      },
    );
  });
  iconTextureRequests.set(icon, request);

  return request;
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
      const globalIndex = categoryIndex * 4 + toolIndex;
      const presetIndex = globalIndex % layoutPresets.length;
      const preset = layoutPresets[presetIndex];

      return {
        ...tool,
        focusAvoidOffset: focusAvoidOffsets.get(tool.id) ?? 0.07,
        orbitIndex: preset.orbitIndex,
        orbitCenter: preset.center,
        orbitRadius: preset.radius,
        orbitTilt: preset.tilt,
        baseAngle: THREE.MathUtils.degToRad(
          desktopPhaseSlotsDegrees[
            globalIndex % desktopPhaseSlotsDegrees.length
          ],
        ),
        mobileBaseAngle: THREE.MathUtils.degToRad(
          mobilePhaseSlotsDegrees[globalIndex % mobilePhaseSlotsDegrees.length],
        ),
        speed: preset.speed,
        phase: preset.phase,
      };
    });
  });
}

function createOrbitPoints(
  center: [number, number, number],
  radius: number,
  tilt: [number, number, number],
  spread = defaultProjectionSpread,
) {
  const points: THREE.Vector3[] = [];
  const depths: number[] = [];
  const rotation = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      THREE.MathUtils.degToRad(tilt[0]),
      THREE.MathUtils.degToRad(tilt[1]),
      THREE.MathUtils.degToRad(tilt[2]),
    ),
  );

  for (let index = 0; index <= 192; index += 1) {
    const angle = (index / 192) * Math.PI * 2;
    const point = setOrbitPoint(
      new THREE.Vector3(),
      center,
      radius,
      angle,
      spread,
      rotation,
    );
    points.push(point);
    depths.push(point.z);
  }

  return { depths, points };
}

function OrbitLine({
  active,
  center,
  radius,
  spread,
  tilt,
}: {
  active: boolean;
  center: [number, number, number];
  radius: number;
  spread: typeof defaultProjectionSpread;
  tilt: [number, number, number];
}) {
  const orbitGeometry = useMemo(
    () => createOrbitPoints(center, radius, tilt, spread),
    [center, radius, spread, tilt],
  );
  const vertexColors = useMemo(
    () => {
      const minDepth = Math.min(...orbitGeometry.depths);
      const maxDepth = Math.max(...orbitGeometry.depths);
      const depthSpan = Math.max(maxDepth - minDepth, 0.001);
      const back = new THREE.Color(active ? "#6f4513" : "#4f3210");
      const front = new THREE.Color(active ? "#c58a31" : "#8b5b1e");

      return orbitGeometry.depths.map((depth) => {
        const depthRatio = (depth - minDepth) / depthSpan;
        const color = back.clone().lerp(front, depthRatio);
        return [
          color.r,
          color.g,
          color.b,
          THREE.MathUtils.lerp(active ? 0.12 : 0.07, active ? 0.38 : 0.22, depthRatio),
        ] as [number, number, number, number];
      });
    },
    [active, orbitGeometry.depths],
  );

  return (
    <Line
      points={orbitGeometry.points}
      vertexColors={vertexColors}
      depthTest
      depthWrite={false}
      lineWidth={active ? 0.82 : 0.58}
      renderOrder={2}
      transparent
    />
  );
}

function IconPlane({
  fallback,
  icon,
  materialRef,
  renderOrder,
  scale,
}: {
  fallback: string;
  icon: string;
  materialRef: MutableRefObject<THREE.SpriteMaterial | null>;
  renderOrder: number;
  scale: number;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(
    () => iconTextureCache.get(icon) ?? null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setFailed(false);
    setTexture(iconTextureCache.get(icon) ?? null);
    loadRoundedIconTexture(icon).then(
      (loadedTexture) => {
        if (active) setTexture(loadedTexture);
      },
      (error: unknown) => {
        console.warn("[ToolGalaxy3D] Icon texture failed to load", {
          icon,
          error,
        });
        if (active) setFailed(true);
      },
    );

    return () => {
      active = false;
    };
  }, [icon]);

  if (failed) {
    return (
      <InitialsPlane
        initials={fallback}
        opacity={1}
        renderOrder={renderOrder}
      />
    );
  }

  if (!texture) return null;

  return (
    <sprite position={[0, 0, 0]} scale={[scale, scale, 1]} renderOrder={renderOrder}>
      <spriteMaterial
        ref={materialRef}
        alphaTest={0.12}
        alphaToCoverage
        blending={THREE.NormalBlending}
        depthTest
        depthWrite
        map={texture}
        opacity={1}
        premultipliedAlpha
        toneMapped={false}
        transparent
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
    <group ref={groupRef} position={[0, 0, 0]}>
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
  detailPanelRef,
  focusActive,
  focused,
  interactionPhase,
  projectionSpread,
  reducedMotion,
  selected,
  tool,
  onFocusSettled,
  onReleaseSettled,
  onSelectTool,
}: {
  activeCategory: ToolCategory | null;
  compact: boolean;
  detailPanelRef: MutableRefObject<HTMLElement | null>;
  focusActive: boolean;
  focused: boolean;
  interactionPhase: GalaxyInteractionPhase;
  projectionSpread: typeof defaultProjectionSpread;
  reducedMotion: boolean;
  selected: boolean;
  tool: ToolGalaxyTool;
  onFocusSettled: (toolId: string) => void;
  onReleaseSettled: (toolId: string) => void;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
}) {
  const initialAngle = normalizeAngle(
    compact ? tool.mobileBaseAngle ?? tool.baseAngle : tool.baseAngle,
  );
  const freeAngleRef = useRef(initialAngle);
  const groupRef = useRef<THREE.Group>(null);
  const iconMaterialRef = useRef<THREE.SpriteMaterial | null>(null);
  const hoveredRef = useRef(false);
  const initializedRef = useRef(false);
  const focusReportedRef = useRef(false);
  const releaseReportedRef = useRef(false);
  const focusBlendRef = useRef(0);
  const avoidBlendRef = useRef(0);
  const orbitMotionTimeRef = useRef(seededUnit(tool.id) * twoPi);
  const panelTargetRef = useRef<MorphPanelTarget | null>(null);
  const returningRef = useRef(false);
  const previouslyFocusedRef = useRef(focused);
  const previousCompactRef = useRef(compact);
  const focusPathRef = useRef<{
    controlA: THREE.Vector3;
    controlB: THREE.Vector3;
    end: THREE.Vector3;
    projected: THREE.Vector3;
    start: THREE.Vector3;
    tangentPoint: THREE.Vector3;
  } | null>(null);
  if (focusPathRef.current === null) {
    focusPathRef.current = {
      controlA: new THREE.Vector3(),
      controlB: new THREE.Vector3(),
      end: new THREE.Vector3(),
      projected: new THREE.Vector3(),
      start: new THREE.Vector3(),
      tangentPoint: new THREE.Vector3(),
    };
  }
  const { camera, gl, size } = useThree();
  const categoryActive = activeCategory === null || tool.category === activeCategory;
  const orbitRotation = useMemo(
    () =>
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(tool.orbitTilt[0]),
          THREE.MathUtils.degToRad(tool.orbitTilt[1]),
          THREE.MathUtils.degToRad(tool.orbitTilt[2]),
        ),
    ),
    [tool.orbitTilt],
  );
  const renderOrder = focused ? 40 : selected ? 30 : 20;

  const setHovered = (value: boolean) => {
    hoveredRef.current = value;
    gl.domElement.style.cursor = value ? "pointer" : "";
  };

  useEffect(() => () => {
    if (hoveredRef.current) {
      gl.domElement.style.cursor = "";
    }
  }, [gl]);

  useLayoutEffect(() => {
    if (previouslyFocusedRef.current && !focused) {
      returningRef.current = true;
    }
    previouslyFocusedRef.current = focused;

    if (focused && interactionPhase === "focusing") {
      returningRef.current = false;
      focusReportedRef.current = false;
      releaseReportedRef.current = false;
      focusBlendRef.current = 0;
      panelTargetRef.current = detailPanelRef.current
        ? measureMorphPanelTarget(detailPanelRef.current, gl.domElement)
        : null;
      const path = focusPathRef.current;
      if (path) {
        const currentAvoidAngle =
          (compact ? 0 : tool.focusAvoidOffset ?? 0) *
          smoothRange(avoidBlendRef.current, 0, 1);
        const pathStartAngle = freeAngleRef.current + currentAvoidAngle;
        setOrbitPosition(
          path.start,
          tool,
          pathStartAngle,
          projectionSpread,
          orbitRotation,
        );
        setOrbitPosition(
          path.tangentPoint,
          tool,
          pathStartAngle + 0.08,
          projectionSpread,
          orbitRotation,
        );
        path.tangentPoint.sub(path.start).normalize();
        path.projected.copy(path.start).project(camera);
        const panelTarget = panelTargetRef.current;
        const targetX = panelTarget
          ? panelTarget.left +
            panelTarget.logoX -
            panelTarget.canvasOffsetX
          : compact
            ? size.width * 0.5
            : size.width - 319;
        const targetY = panelTarget
          ? panelTarget.top +
            panelTarget.logoY -
            panelTarget.canvasOffsetY
          : compact
            ? size.height * 0.81
            : size.height * 0.32;
        path.projected.x = (targetX / size.width) * 2 - 1;
        path.projected.y = -(targetY / size.height) * 2 + 1;
        path.end.copy(path.projected).unproject(camera);
        path.controlA
          .copy(path.start)
          .addScaledVector(path.tangentPoint, compact ? 0.72 : 0.9);
        path.controlB
          .copy(path.end)
          .lerp(path.start, compact ? 0.16 : 0.2);
      }
    }
    if (focused && interactionPhase === "releasing") {
      releaseReportedRef.current = false;
    }
  }, [
    camera,
    compact,
    detailPanelRef,
    focused,
    gl.domElement,
    interactionPhase,
    orbitRotation,
    projectionSpread,
    size.height,
    size.width,
    tool,
  ]);

  useEffect(() => {
    if (previousCompactRef.current === compact) return;

    const previousBaseAngle = previousCompactRef.current
      ? tool.mobileBaseAngle ?? tool.baseAngle
      : tool.baseAngle;
    const nextBaseAngle = compact
      ? tool.mobileBaseAngle ?? tool.baseAngle
      : tool.baseAngle;
    const responsiveOffset = shortestAngleDelta(previousBaseAngle, nextBaseAngle);
    freeAngleRef.current = normalizeAngle(
      freeAngleRef.current + responsiveOffset,
    );
    previousCompactRef.current = compact;
  }, [compact, tool.baseAngle, tool.mobileBaseAngle]);

  useFrame((_, delta) => {
    const hovered = hoveredRef.current;
    const frameDelta = Math.min(delta, 0.05);

    if (!reducedMotion) {
      const basePhaseRate = compact
        ? mobileFreeOrbitPhaseRate
        : desktopFreeOrbitPhaseRate;
      orbitMotionTimeRef.current +=
        frameDelta * basePhaseRate * freeOrbitSpeedMultiplier;
      freeAngleRef.current = normalizeAngle(
        (compact ? tool.mobileBaseAngle ?? tool.baseAngle : tool.baseAngle) +
          Math.sin(orbitMotionTimeRef.current) * (compact ? 0.04 : 0.14),
      );
    }

    const returning =
      (focused && interactionPhase === "releasing") ||
      returningRef.current;
    const focusEmphasisActive =
      focusActive && interactionPhase !== "releasing";
    const shouldAvoid = focusEmphasisActive && !focused;
    const avoidDirection = shouldAvoid ? 1 : -1;
    avoidBlendRef.current = THREE.MathUtils.clamp(
      avoidBlendRef.current +
        avoidDirection *
          (reducedMotion
            ? 1
            : frameDelta / (shouldAvoid ? 0.82 : 0.72)),
      0,
      1,
    );
    const easedAvoidBlend = smoothRange(avoidBlendRef.current, 0, 1);
    const orbitAngle =
      freeAngleRef.current +
      (compact ? 0 : tool.focusAvoidOffset ?? 0) * easedAvoidBlend;

    setOrbitPosition(
      tempPosition,
      tool,
      orbitAngle,
      projectionSpread,
      orbitRotation,
    );
    const shouldDock =
      focused && interactionPhase !== "releasing";
    const focusPathDirection = shouldDock ? 1 : -1;
    focusBlendRef.current = THREE.MathUtils.clamp(
      focusBlendRef.current +
        focusPathDirection *
          (reducedMotion
            ? 1
            : frameDelta / (shouldDock ? 1 : 0.72)),
      0,
      1,
    );
    const focusPath = focusPathRef.current;
    if (focused && !panelTargetRef.current && detailPanelRef.current) {
      panelTargetRef.current = measureMorphPanelTarget(
        detailPanelRef.current,
        gl.domElement,
      );
    }
    if (focusBlendRef.current > 0.001 && focusPath) {
      if (returning) {
        setOrbitPosition(
          focusPath.start,
          tool,
          freeAngleRef.current,
          projectionSpread,
          orbitRotation,
        );
        setOrbitPosition(
          focusPath.tangentPoint,
          tool,
          freeAngleRef.current + 0.08,
          projectionSpread,
          orbitRotation,
        );
        focusPath.tangentPoint.sub(focusPath.start).normalize();
        focusPath.controlA
          .copy(focusPath.start)
          .addScaledVector(
            focusPath.tangentPoint,
            compact ? 0.72 : 0.9,
          );
        focusPath.controlB
          .copy(focusPath.end)
          .lerp(focusPath.start, compact ? 0.16 : 0.2);
      }
      const easedFocusBlend =
        focusBlendRef.current *
        focusBlendRef.current *
        (3 - 2 * focusBlendRef.current);
      setCubicBezier(
        tempPosition,
        focusPath.start,
        focusPath.controlA,
        focusPath.controlB,
        focusPath.end,
        easedFocusBlend,
      );
    }

    if (
      focused &&
      interactionPhase === "focusing" &&
      focusBlendRef.current > 0.995 &&
      !focusReportedRef.current
    ) {
      focusReportedRef.current = true;
      onFocusSettled(tool.id);
    }

    if (returning && focusBlendRef.current < 0.005) {
      returningRef.current = false;
      if (
        focused &&
        interactionPhase === "releasing" &&
        !releaseReportedRef.current
      ) {
        releaseReportedRef.current = true;
        onReleaseSettled(tool.id);
      }
    }

    const visualScale = focused
      ? interactionPhase === "focusing"
        ? 1.22
        : interactionPhase === "focused"
          ? 1
          : 1.08
      : hovered
        ? 1.08
        : focusEmphasisActive
          ? 0.84
          : categoryActive
            ? 1
            : 0.88;
    const depthRange = compact ? 2.1 : 3.1;
    const depthRatio = THREE.MathUtils.clamp(
      (tempPosition.z + depthRange) / (depthRange * 2),
      0,
      1,
    );
    const depthScale = THREE.MathUtils.lerp(0.82, 1.18, depthRatio);
    const selectedIconFade = focusBlendRef.current >= 0.18 ? 1 : 0;
    const iconOpacity = focused
      ? 1 - selectedIconFade
      : focusEmphasisActive
        ? 0.42
      : categoryActive
        ? 1
        : 0.58;
    const targetTone = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(0.78, 1, depthRatio) +
        (hovered || focused ? 0.08 : 0),
      0.78,
      1.08,
    );

    if (groupRef.current) {
      if (!initializedRef.current) {
        groupRef.current.position.copy(tempPosition);
        initializedRef.current = true;
      } else {
        groupRef.current.position.copy(tempPosition);
      }

      const nextScale = THREE.MathUtils.damp(
        groupRef.current.scale.x,
        visualScale * depthScale,
        6,
        frameDelta,
      );
      groupRef.current.scale.setScalar(nextScale);
    }

    if (
      focused &&
      detailPanelRef.current &&
      panelTargetRef.current
    ) {
      writeMorphPanelFrame(
        detailPanelRef.current,
        panelTargetRef.current,
        tempPosition,
        camera,
        gl.domElement,
        focusBlendRef.current,
        compact,
      );
    }

    if (iconMaterialRef.current) {
      iconMaterialRef.current.opacity = THREE.MathUtils.damp(
        iconMaterialRef.current.opacity,
        iconOpacity,
        8,
        frameDelta,
      );
      const nextTone = THREE.MathUtils.damp(
        iconMaterialRef.current.color.r,
        targetTone,
        7,
        frameDelta,
      );
      iconMaterialRef.current.color.setScalar(nextTone);
    }
  }, -1);

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
          materialRef={iconMaterialRef}
          renderOrder={renderOrder + 1}
          scale={compact ? 0.95 : 0.56}
        />
      ) : (
        <InitialsPlane
          initials={tool.initials ?? tool.name.slice(0, 2)}
          opacity={1}
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

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    camera.fov = size.width < 520 ? 60 : 44;
    camera.position.set(
      0,
      size.width < 520 ? 0.18 : 0.24,
      size.width < 520 ? 11 : 7.2,
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

function PerformanceProbe({ compact }: { compact: boolean }) {
  const { gl } = useThree();
  const elapsedRef = useRef(0);
  const framesRef = useRef(0);

  useEffect(() => {
    const basePhaseRate = compact
      ? mobileFreeOrbitPhaseRate
      : desktopFreeOrbitPhaseRate;
    gl.domElement.dataset.galaxyBasePhaseRate = basePhaseRate.toString();
    gl.domElement.dataset.galaxyFreePhaseRate = (
      basePhaseRate * freeOrbitSpeedMultiplier
    ).toString();
    gl.domElement.dataset.galaxySpeedMultiplier =
      freeOrbitSpeedMultiplier.toString();
  }, [compact, gl]);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    framesRef.current += 1;
    if (elapsedRef.current < 1) return;

    const fps = framesRef.current / elapsedRef.current;
    gl.domElement.dataset.galaxyFps = fps.toFixed(1);
    gl.domElement.dataset.galaxyFrameMs = (1000 / Math.max(fps, 1)).toFixed(2);
    elapsedRef.current = 0;
    framesRef.current = 0;
  }, -2);

  return null;
}

function GalaxyScene({
  activeCategory,
  detailPanelRef,
  focusedToolId,
  interactionPhase,
  reducedMotion,
  selectedToolId,
  tools,
  onClearFocus,
  onFocusSettled,
  onReleaseSettled,
  onSelectTool,
}: ToolGalaxy3DProps) {
  const { size } = useThree();
  const projectionSpread = useMemo(
    () =>
      size.width < 520
        ? { x: 1.03, y: 2, z: 0.5 }
        : { x: 1.2, y: 0.66, z: 0.58 },
    [size.width],
  );
  const orbitConfigs = useMemo(
    () =>
      [...new Map(tools.map((tool) => [tool.orbitIndex, tool])).values()]
        .sort((a, b) => a.orbitIndex - b.orbitIndex)
        .map((tool) => ({
          center: tool.orbitCenter ?? ([0, 0, 0] as [number, number, number]),
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
      <PerformanceProbe compact={size.width < 520} />
      <pointLight color="#ffd175" intensity={3.8} position={[0, 0.6, 2.6]} />
      <spotLight
        angle={0.55}
        color="#f3b34d"
        intensity={1.6}
        penumbra={0.9}
        position={[2.4, 2.2, 3.4]}
      />
      <group position={[0, 0, 0]}>
        {orbitConfigs.map((orbit) => (
          <OrbitLine
            key={orbit.index}
            active={orbit.active}
            center={orbit.center}
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
            detailPanelRef={detailPanelRef}
            focusActive={focusedToolId !== null}
            focused={focusedToolId === tool.id}
            interactionPhase={interactionPhase}
            projectionSpread={projectionSpread}
            reducedMotion={reducedMotion}
            selected={selectedToolId === tool.id}
            tool={tool}
            onFocusSettled={onFocusSettled}
            onReleaseSettled={onReleaseSettled}
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
  detailPanelRef,
  focusedToolId,
  interactionPhase,
  reducedMotion,
  selectedToolId,
  tools,
  onClearFocus,
  onFocusSettled,
  onReleaseSettled,
  onSelectTool,
}: ToolGalaxy3DProps) {
  const layoutTools = useMemo(() => createStableGalaxyLayout(tools), [tools]);

  return (
    <div
      className="tool-galaxy-stage"
      aria-label="3D 原子轨道式工具星系"
    >
      <Canvas
        camera={{ fov: 44, position: [0, 0.24, 7.2] }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={onClearFocus}
      >
        <GalaxyScene
          activeCategory={activeCategory}
          detailPanelRef={detailPanelRef}
          focusedToolId={focusedToolId}
          interactionPhase={interactionPhase}
          reducedMotion={reducedMotion}
          selectedToolId={selectedToolId}
          tools={layoutTools}
          onClearFocus={onClearFocus}
          onFocusSettled={onFocusSettled}
          onReleaseSettled={onReleaseSettled}
          onSelectTool={onSelectTool}
        />
      </Canvas>
    </div>
  );
});
