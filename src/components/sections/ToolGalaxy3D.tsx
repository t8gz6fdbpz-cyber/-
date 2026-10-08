import { Html } from "@react-three/drei";
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
  tags: string[];
  orbitIndex: number;
  orbitCenter?: [number, number, number];
  orbitRadius: number;
  orbitRadiusX?: number;
  orbitVerticalRatio?: number;
  orbitTilt: [number, number, number];
  baseAngle: number;
  mobileBaseAngle?: number;
  speed: number;
  phase: number;
};

type ToolGalaxy3DProps = {
  renderingActive: boolean;
  activeCategory: ToolCategory | null;
  cardResourcesReady: boolean;
  focusedToolId: string | null;
  interactionPhase: GalaxyInteractionPhase;
  preloadRequested: boolean;
  reducedMotion: boolean;
  selectedToolId: string | null;
  tools: ToolGalaxyTool[];
  transitionToken: number;
  detailPanelRef: MutableRefObject<HTMLElement | null>;
  onClearFocus: () => void;
  onFocusSettled: (toolId: string, transitionToken: number) => void;
  onReleaseSettled: (toolId: string, transitionToken: number) => void;
  onResourceStateChange: (ready: boolean) => void;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
};

const twoPi = Math.PI * 2;
const categoryOrder: ToolCategory[] = ["AI 创作", "内容制作", "平台运营"];
const tempPosition = new THREE.Vector3();
const tempProjectedPosition = new THREE.Vector3();
const tempCameraSpacePosition = new THREE.Vector3();
const defaultProjectionSpread = { x: 1, y: 1, z: 1 };
const freeOrbitPhaseRate = 0.045;
const freeOrbitSpeedMultiplier = 1.2;
const iconTextureSize = 192;
const iconCornerRatio = 0.382;
const iconTexturePadding = 3;
const iconAlphaCleanupThreshold = 12;
const iconAlphaTest = 0.08;
const morphOwnershipHandoff = 0.18;
const compactMorphOwnershipHandoff = 0.02;
const returnMorphOwnershipHandoff = 0.02;
const iconTextureCache = new Map<string, THREE.Texture>();
const iconTextureRequests = new Map<string, Promise<THREE.Texture>>();
const galaxyDiagnostics = import.meta.env.DEV || import.meta.env.VITE_GALAXY_DEBUG === "true";
const maxPlanetOccluders = 12;
let iconTextureLoader: THREE.TextureLoader | null = null;
type LoadedIconImage = CanvasImageSource & {
  height?: number;
  naturalHeight?: number;
  naturalWidth?: number;
  width?: number;
};

type PlanetOcclusionState = {
  centers: THREE.Vector3[];
  count: number;
  viewport: THREE.Vector2;
};

type PlanetProjectionRecord = {
  group: THREE.Group;
  id: string;
  ndc: THREE.Vector3;
};

function createPlanetOcclusionState(): PlanetOcclusionState {
  return {
    centers: Array.from(
      { length: maxPlanetOccluders },
      () => new THREE.Vector3(),
    ),
    count: 0,
    viewport: new THREE.Vector2(1, 1),
  };
}

const layoutPresets: Array<{
  center: [number, number, number];
  orbitIndex: number;
  radius: number;
  radiusX: number;
  verticalRatio: number;
  speed: number;
  tilt: [number, number, number];
  phase: number;
}> = [
  {
    orbitIndex: 0,
    center: [0, -0.28, -0.54],
    radius: 5.35,
    radiusX: 5.35,
    verticalRatio: 0.46,
    speed: 0.045,
    tilt: [14.8, -7.9, 7.6],
    phase: 0,
  },
  {
    orbitIndex: 1,
    center: [0, -0.28, -0.18],
    radius: 4.15,
    radiusX: 4.44,
    verticalRatio: 0.389,
    speed: 0.045,
    tilt: [-0.8, -11.6, -1.4],
    phase: THREE.MathUtils.degToRad(300),
  },
  {
    orbitIndex: 2,
    center: [0, -0.28, 0.18],
    radius: 2.95,
    radiusX: 3.16,
    verticalRatio: 0.392,
    speed: 0.045,
    tilt: [12.5, 10.7, -5.1],
    phase: THREE.MathUtils.degToRad(105),
  },
  {
    orbitIndex: 3,
    center: [0, -0.28, 0.54],
    radius: 1.75,
    radiusX: 1.81,
    verticalRatio: 0.399,
    speed: 0.045,
    tilt: [7.2, 1.8, -4.2],
    phase: THREE.MathUtils.degToRad(285),
  },
];
const defaultOrbitVerticalRatio = 0.365;
const orbitDepthRatio = 0.11;
const outerOrbitRadius = layoutPresets[0].radius;
const desktopCameraZoom = 100;
const compactCameraZoom = 75;
function normalizeAngle(angle: number) {
  return ((angle % twoPi) + twoPi) % twoPi;
}

function setOrbitPoint(
  target: THREE.Vector3,
  center: [number, number, number],
  radius: number,
  radiusX: number,
  verticalRatio: number,
  angle: number,
  spread: typeof defaultProjectionSpread,
  rotation: THREE.Quaternion,
) {
  target.set(
    Math.cos(angle) * radiusX,
    Math.sin(angle) * radius * verticalRatio,
    Math.sin(angle) * radius * orbitDepthRatio,
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
    tool.orbitRadiusX ?? tool.orbitRadius,
    tool.orbitVerticalRatio ?? defaultOrbitVerticalRatio,
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

function clampWorldPointToSafeScreen(
  point: THREE.Vector3,
  camera: THREE.Camera,
  width: number,
  height: number,
  compact: boolean,
) {
  const horizontalMargin = compact ? 48 : 64;
  const topMargin = compact ? 76 : 128;
  const bottomMargin = compact ? 76 : 64;
  tempProjectedPosition.copy(point).project(camera);
  const screenX = THREE.MathUtils.clamp(
    (tempProjectedPosition.x * 0.5 + 0.5) * width,
    horizontalMargin,
    width - horizontalMargin,
  );
  const screenY = THREE.MathUtils.clamp(
    (-tempProjectedPosition.y * 0.5 + 0.5) * height,
    topMargin,
    height - bottomMargin,
  );
  tempProjectedPosition.x = (screenX / width) * 2 - 1;
  tempProjectedPosition.y = -(screenY / height) * 2 + 1;
  point.copy(tempProjectedPosition.unproject(camera));
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

type ToolVisualPhase =
  | "orbiting"
  | "focusing"
  | "morphing"
  | "focused"
  | "returning";

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
  returning: boolean,
) {
  const projected = tempProjectedPosition.copy(worldPosition).project(camera);
  const centerX =
    target.canvasOffsetX + ((projected.x + 1) / 2) * canvas.clientWidth;
  const centerY =
    target.canvasOffsetY + ((1 - projected.y) / 2) * canvas.clientHeight;
  const ownershipHandoff = returning
    ? returnMorphOwnershipHandoff
    : compact
      ? compactMorphOwnershipHandoff
      : morphOwnershipHandoff;
  const cardOwnsVisual = progress >= ownershipHandoff;
  const shapeProgress = smoothRange(progress, ownershipHandoff, 0.9);
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
  panel.style.opacity = cardOwnsVisual ? "1" : "0";
  panel.style.visibility = cardOwnsVisual ? "visible" : "hidden";
  panel.style.pointerEvents = progress > 0.9 ? "auto" : "none";
  panel.style.overflow = progress > 0.985 ? "" : "hidden";
  panel.style.zIndex = cardOwnsVisual ? "6" : "0";
  panel.dataset.visualOwner = cardOwnsVisual ? "card" : "planet";
  panel.style.setProperty(
    "--morph-logo-visibility",
    cardOwnsVisual ? "visible" : "hidden",
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

function roundedRectPath(
  context: CanvasRenderingContext2D,
  size: number,
  radius: number,
  inset = 0,
) {
  const start = inset;
  const end = size - inset;

  context.beginPath();
  context.moveTo(start + radius, start);
  context.lineTo(end - radius, start);
  context.quadraticCurveTo(end, start, end, start + radius);
  context.lineTo(end, end - radius);
  context.quadraticCurveTo(end, end, end - radius, end);
  context.lineTo(start + radius, end);
  context.quadraticCurveTo(start, end, start, end - radius);
  context.lineTo(start, start + radius);
  context.quadraticCurveTo(start, start, start + radius, start);
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
  const destinationInset = Math.max(
    getIconDrawInset(icon),
    iconTexturePadding,
  );
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
    (iconTextureSize - iconTexturePadding * 2) * iconCornerRatio,
    iconTexturePadding,
  );
  context.clip();
  const background = getIconContainerBackground(icon);
  if (background) {
    context.fillStyle = background;
    context.fillRect(
      iconTexturePadding,
      iconTexturePadding,
      iconTextureSize - iconTexturePadding * 2,
      iconTextureSize - iconTexturePadding * 2,
    );
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
    if (pixels.data[index + 3] >= iconAlphaCleanupThreshold) continue;
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
  texture.premultiplyAlpha = false;
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
      const globalIndex = categoryIndex * layoutPresets.length + toolIndex;
      const presetIndex = globalIndex % layoutPresets.length;
      const preset = layoutPresets[presetIndex];
      const lapIndex = Math.floor(globalIndex / layoutPresets.length);
      const baseAngle = normalizeAngle(
        preset.phase + lapIndex * (twoPi / 3),
      );

      return {
        ...tool,
        orbitIndex: preset.orbitIndex,
        orbitCenter: preset.center,
        orbitRadius: preset.radius,
        orbitRadiusX: preset.radiusX,
        orbitVerticalRatio: preset.verticalRatio,
        orbitTilt: preset.tilt,
        baseAngle,
        mobileBaseAngle: baseAngle,
        speed: preset.speed,
        phase: 0,
      };
    });
  });
}

function createOrbitPoints(
  center: [number, number, number],
  radius: number,
  radiusX: number,
  verticalRatio: number,
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
      radiusX,
      verticalRatio,
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
  occlusionState,
  radius,
  radiusX,
  verticalRatio,
  spread,
  tilt,
}: {
  active: boolean;
  center: [number, number, number];
  occlusionState: PlanetOcclusionState;
  radius: number;
  radiusX: number;
  verticalRatio: number;
  spread: typeof defaultProjectionSpread;
  tilt: [number, number, number];
}) {
  const orbitGeometry = useMemo(
    () => createOrbitPoints(center, radius, radiusX, verticalRatio, tilt, spread),
    [center, radius, radiusX, spread, tilt, verticalRatio],
  );
  const geometry = useMemo(() => {
      const back = new THREE.Color(active ? "#6f4513" : "#4f3210");
      const front = new THREE.Color(active ? "#c58a31" : "#8b5b1e");
      const colors = new Float32Array(orbitGeometry.depths.length * 4);

      orbitGeometry.depths.forEach((depth, index) => {
        const depthRatio = THREE.MathUtils.clamp(
          (depth + 1.2) / 2.4,
          0,
          1,
        );
        const color = back.clone().lerp(front, depthRatio);
        const offset = index * 4;
        colors[offset] = color.r;
        colors[offset + 1] = color.g;
        colors[offset + 2] = color.b;
        colors[offset + 3] = THREE.MathUtils.lerp(
          active ? 0.045 : 0.035,
          active ? 0.26 : 0.15,
          depthRatio,
        );
      });

      const nextGeometry = new THREE.BufferGeometry().setFromPoints(
        orbitGeometry.points,
      );
      nextGeometry.setAttribute(
        "aColor",
        new THREE.BufferAttribute(colors, 4),
      );
      return nextGeometry;
    }, [active, orbitGeometry.depths, orbitGeometry.points]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthTest: true,
        depthWrite: true,
        toneMapped: false,
        uniforms: {
          uOccluderCount: { value: 0 },
          uOccluders: { value: occlusionState.centers },
          uViewport: { value: occlusionState.viewport },
        },
        vertexShader: `
          attribute vec4 aColor;
          varying vec4 vColor;

          void main() {
            vColor = aColor;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform int uOccluderCount;
          uniform vec3 uOccluders[${maxPlanetOccluders}];
          uniform vec2 uViewport;
          varying vec4 vColor;

          void main() {
            if (
              gl_FragCoord.x < 0.0 ||
              gl_FragCoord.y < 0.0 ||
              gl_FragCoord.x > uViewport.x ||
              gl_FragCoord.y > uViewport.y
            ) {
              discard;
            }

            for (int index = 0; index < ${maxPlanetOccluders}; index += 1) {
              if (index >= uOccluderCount) {
                break;
              }
              vec3 occluder = uOccluders[index];
              if (distance(gl_FragCoord.xy, occluder.xy) <= occluder.z) {
                discard;
              }
            }

            gl_FragColor = vColor;
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      }),
    [occlusionState],
  );
  const line = useMemo(() => {
    const nextLine = new THREE.Line(geometry, material);
    nextLine.frustumCulled = false;
    nextLine.renderOrder = -10;
    nextLine.userData.visualRole = "orbit-line";
    return nextLine;
  }, [geometry, material]);

  useFrame(() => {
    material.uniforms.uOccluderCount.value = occlusionState.count;
  }, -1);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <primitive object={line} />;
}

function IconPlane({
  fallback,
  icon,
  materialRef,
  scale,
  toolId,
}: {
  fallback: string;
  icon: string;
  materialRef: MutableRefObject<THREE.SpriteMaterial | null>;
  scale: number;
  toolId: string;
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
        toolId={toolId}
      />
    );
  }

  if (!texture) return null;

  return (
    <sprite
      position={[0, 0, 0]}
      renderOrder={10}
      scale={[scale, scale, 1]}
      userData={{
        toolId,
        visualRole: "planet-icon",
        visualSource: "IconPlane",
      }}
    >
      <spriteMaterial
        ref={materialRef}
        alphaTest={iconAlphaTest}
        blending={THREE.NormalBlending}
        depthTest
        depthWrite
        map={texture}
        opacity={1}
        premultipliedAlpha={false}
        toneMapped={false}
        transparent
      />
    </sprite>
  );
}

function InitialsPlane({
  initials,
  opacity = 1,
  toolId,
}: {
  initials: string;
  opacity?: number;
  toolId: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    groupRef.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      userData={{
        toolId,
        visualRole: "planet-fallback",
        visualSource: "InitialsPlane",
      }}
    >
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
  focused,
  interactionReady,
  interactionPhase,
  projectionSpread,
  reducedMotion,
  selected,
  tool,
  transitionToken,
  onFocusSettled,
  onReleaseSettled,
  onSelectTool,
}: {
  activeCategory: ToolCategory | null;
  compact: boolean;
  detailPanelRef: MutableRefObject<HTMLElement | null>;
  focused: boolean;
  interactionReady: boolean;
  interactionPhase: GalaxyInteractionPhase;
  projectionSpread: typeof defaultProjectionSpread;
  reducedMotion: boolean;
  selected: boolean;
  tool: ToolGalaxyTool;
  transitionToken: number;
  onFocusSettled: (toolId: string, transitionToken: number) => void;
  onReleaseSettled: (toolId: string, transitionToken: number) => void;
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
  const panelTargetRef = useRef<MorphPanelTarget | null>(null);
  const activeTransitionTokenRef = useRef<number | null>(null);
  const returningRef = useRef(false);
  const previouslyFocusedRef = useRef(focused);
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
  const markInteractionStart = () => {
    const timestamp = performance.now();
    gl.domElement.dataset.galaxyPointerdownAt = timestamp.toString();
    gl.domElement.dataset.galaxyPointerdownToolId = tool.id;
    gl.domElement.dataset.galaxyFocusVisibleLatencyMs = "";
  };
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
  const setHovered = (value: boolean) => {
    if (!interactionReady) return;
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

    if (!focused) {
      activeTransitionTokenRef.current = null;
      panelTargetRef.current = null;
      if (groupRef.current) {
        groupRef.current.userData.controlsDetailPanel = false;
        groupRef.current.userData.panelTransitionToken = 0;
      }
    }

    if (focused && interactionPhase === "focusing") {
      activeTransitionTokenRef.current = transitionToken;
      returningRef.current = false;
      focusReportedRef.current = false;
      releaseReportedRef.current = false;
      focusBlendRef.current = 0;
      const panel = detailPanelRef.current;
      panelTargetRef.current =
        panel?.dataset.toolId === tool.id &&
        panel.dataset.transitionToken === String(transitionToken)
          ? measureMorphPanelTarget(panel, gl.domElement)
          : null;
      const path = focusPathRef.current;
      if (path) {
        const pathStartAngle = freeAngleRef.current;
        if (groupRef.current && initializedRef.current) {
          path.start.copy(groupRef.current.position);
        } else {
          setOrbitPosition(
            path.start,
            tool,
            pathStartAngle,
            projectionSpread,
            orbitRotation,
          );
        }
        setOrbitPosition(
          tempProjectedPosition,
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
        path.tangentPoint.sub(tempProjectedPosition).normalize();
        path.projected.copy(path.start).project(camera);
        const panelTarget = panelTargetRef.current;
        const rawTargetX = panelTarget
          ? panelTarget.left +
            panelTarget.logoX -
            panelTarget.canvasOffsetX
          : compact
            ? size.width * 0.5
            : size.width - 319;
        const rawTargetY = panelTarget
          ? panelTarget.top +
            panelTarget.logoY -
            panelTarget.canvasOffsetY
          : compact
            ? size.height * 0.81
            : size.height * 0.32;
        const targetX = THREE.MathUtils.clamp(
          rawTargetX,
          compact ? 48 : 64,
          size.width - (compact ? 48 : 64),
        );
        const targetY = THREE.MathUtils.clamp(
          rawTargetY,
          compact ? 76 : 128,
          size.height - (compact ? 76 : 64),
        );
        path.projected.x = (targetX / size.width) * 2 - 1;
        path.projected.y = -(targetY / size.height) * 2 + 1;
        path.end.copy(path.projected).unproject(camera);
        if (compact) {
          const corridorY = 1 - (76 / size.height) * 2;
          path.controlA.copy(path.start).project(camera);
          path.controlA.y = corridorY;
          path.controlA.unproject(camera);
          path.controlB.copy(path.end).project(camera);
          path.controlB.y = corridorY;
          path.controlB.unproject(camera);
        } else {
          path.controlA
            .copy(path.start)
            .addScaledVector(path.tangentPoint, 0.9);
          path.controlB
            .copy(path.end)
            .lerp(path.start, 0.2);
        }
        clampWorldPointToSafeScreen(
          path.controlA,
          camera,
          size.width,
          size.height,
          compact,
        );
        clampWorldPointToSafeScreen(
          path.controlB,
          camera,
          size.width,
          size.height,
          compact,
        );
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
    transitionToken,
  ]);

  useFrame((_, delta) => {
    const hovered = hoveredRef.current;
    const frameDelta = Math.min(delta, 0.05);

    if (!reducedMotion) {
      freeAngleRef.current = normalizeAngle(
        freeAngleRef.current +
          frameDelta * tool.speed * freeOrbitSpeedMultiplier,
      );
    }

    const returning =
      (focused && interactionPhase === "releasing") ||
      returningRef.current;
    const orbitAngle = freeAngleRef.current;

    setOrbitPosition(
      tempPosition,
      tool,
      orbitAngle,
      projectionSpread,
      orbitRotation,
    );
    const shouldDock =
      focused &&
      (interactionPhase === "focusing" ||
        interactionPhase === "focused");
    const focusPathDirection = shouldDock
      ? 1
      : -1;
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
    const panel = detailPanelRef.current;
    const ownsPanel =
      focused &&
      activeTransitionTokenRef.current === transitionToken &&
      panel?.dataset.toolId === tool.id &&
      panel.dataset.transitionToken === String(transitionToken);
    if (ownsPanel && !panelTargetRef.current && panel) {
      panelTargetRef.current = measureMorphPanelTarget(
        panel,
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
        if (compact) {
          const corridorY = 1 - (76 / size.height) * 2;
          focusPath.controlA.copy(focusPath.start).project(camera);
          focusPath.controlA.y = corridorY;
          focusPath.controlA.unproject(camera);
          focusPath.controlB.copy(focusPath.end).project(camera);
          focusPath.controlB.y = corridorY;
          focusPath.controlB.unproject(camera);
        } else {
          focusPath.controlA
            .copy(focusPath.start)
            .addScaledVector(focusPath.tangentPoint, 0.9);
          focusPath.controlB
            .copy(focusPath.end)
            .lerp(focusPath.start, 0.2);
        }
        clampWorldPointToSafeScreen(
          focusPath.controlA,
          camera,
          size.width,
          size.height,
          compact,
        );
        clampWorldPointToSafeScreen(
          focusPath.controlB,
          camera,
          size.width,
          size.height,
          compact,
        );
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

    const ownershipHandoff = returning
      ? returnMorphOwnershipHandoff
      : compact
        ? compactMorphOwnershipHandoff
        : morphOwnershipHandoff;
    const cardOwnsVisual =
      focused && focusBlendRef.current >= ownershipHandoff;
    const visualPhase: ToolVisualPhase = returning
      ? "returning"
      : !focused
        ? "orbiting"
        : interactionPhase === "focused"
          ? "focused"
          : cardOwnsVisual
            ? "morphing"
            : "focusing";

    if (
      focused &&
      interactionPhase === "focusing" &&
      focusBlendRef.current > 0.995 &&
      !focusReportedRef.current
    ) {
      focusReportedRef.current = true;
      onFocusSettled(tool.id, transitionToken);
    }

    if (returning && focusBlendRef.current < 0.005) {
      returningRef.current = false;
      if (
        focused &&
        interactionPhase === "releasing" &&
        !releaseReportedRef.current
      ) {
        releaseReportedRef.current = true;
        activeTransitionTokenRef.current = null;
        if (groupRef.current) {
          groupRef.current.userData.controlsDetailPanel = false;
          groupRef.current.userData.panelTransitionToken = 0;
        }
        onReleaseSettled(tool.id, transitionToken);
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
        : categoryActive
            ? 1
            : 0.88;
    tempCameraSpacePosition
      .copy(tempPosition)
      .applyMatrix4(camera.matrixWorldInverse);
    const cameraDepth = -tempCameraSpacePosition.z;
    const depthRatio = THREE.MathUtils.clamp(
      (tempPosition.z + 1.2) / 2.4,
      0,
      1,
    );
    const depthScale = THREE.MathUtils.lerp(0.9, 1, depthRatio);
    const iconOpacity = focused
      ? 1
      : categoryActive
        ? 1
        : 0.58;
    const targetTone = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(0.86, 1, depthRatio) +
        (hovered || focused ? 0.08 : 0),
      0.82,
      1.08,
    );

    if (groupRef.current) {
      groupRef.current.visible = !cardOwnsVisual;
      groupRef.current.userData.visualPhase = visualPhase;
      groupRef.current.userData.cameraDepth = cameraDepth;
      groupRef.current.userData.depthScale = depthScale;
      groupRef.current.userData.iconOpacity = iconOpacity;
      groupRef.current.userData.iconWorldScale = compact ? 0.88 : 0.72;
      groupRef.current.userData.focusBlend = focusBlendRef.current;
      groupRef.current.userData.controlsDetailPanel = ownsPanel;
      groupRef.current.userData.panelTransitionToken = ownsPanel
        ? transitionToken
        : 0;
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
      ownsPanel &&
      panel &&
      panelTargetRef.current
    ) {
      writeMorphPanelFrame(
        panel,
        panelTargetRef.current,
        tempPosition,
        camera,
        gl.domElement,
        focusBlendRef.current,
        compact,
        returning,
      );
      panel.dataset.controllerToolId = tool.id;
      panel.dataset.controllerTransitionToken =
        transitionToken.toString();
      panel.dataset.visualPhase = visualPhase;
    }

    if (iconMaterialRef.current) {
      iconMaterialRef.current.rotation = THREE.MathUtils.damp(
        iconMaterialRef.current.rotation,
        Math.sin(orbitAngle + tool.orbitIndex * 0.7) * 0.035,
        5,
        frameDelta,
      );
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
  }, -3);

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={(event) => {
        event.stopPropagation();
        markInteractionStart();
        if (!interactionReady) return;
        onSelectTool(tool, true);
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
      userData={{
        toolId: tool.id,
        visualRole: "planet-main",
        visualSource: "ToolPlanet",
      }}
    >
      {tool.icon ? (
        <IconPlane
          fallback={tool.initials ?? tool.name.slice(0, 2)}
          icon={tool.icon}
          materialRef={iconMaterialRef}
          scale={compact ? 0.88 : 0.72}
          toolId={tool.id}
        />
      ) : (
        <InitialsPlane
          initials={tool.initials ?? tool.name.slice(0, 2)}
          opacity={1}
          toolId={tool.id}
        />
      )}
      <Html center zIndexRange={[20, 0]}>
        <button
          type="button"
          className="tool-galaxy-a11y-button"
          aria-label={`${tool.name}，${tool.category}，${tool.tags.join("，")}`}
          aria-pressed={selected}
          aria-busy={!interactionReady}
          disabled={
            !interactionReady ||
            (focused && interactionPhase !== "releasing")
          }
          tabIndex={
            interactionReady &&
            !(focused && interactionPhase !== "releasing")
              ? 0
              : -1
          }
          onPointerDown={(event) => {
            event.stopPropagation();
            markInteractionStart();
            if (!interactionReady) return;
            onSelectTool(tool, true);
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!interactionReady) return;
              markInteractionStart();
              onSelectTool(tool, true);
            }
          }}
        />
      </Html>
    </group>
  );
}

function PlanetProjectionObserver({
  compact,
  occlusionState,
  tools,
}: {
  compact: boolean;
  occlusionState: PlanetOcclusionState;
  tools: ToolGalaxyTool[];
}) {
  const { camera, gl, scene, size } = useThree();
  const recordsRef = useRef<PlanetProjectionRecord[]>([]);
  const bufferSizeRef = useRef(new THREE.Vector2());
  const worldPositionRef = useRef(new THREE.Vector3());
  const filterBottomRef = useRef(0);

  useLayoutEffect(() => {
    const filter = gl.domElement.closest(".tool-desktop-layout")
      ?.querySelector<HTMLElement>(".tool-category-index");
    const measure = () => {
      filterBottomRef.current = filter
        ? Math.max(0, filter.getBoundingClientRect().bottom - gl.domElement.getBoundingClientRect().top)
        : 0;
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (filter) observer.observe(filter);
    observer.observe(gl.domElement);
    return () => observer.disconnect();
  }, [gl, size.width, size.height]);

  const refreshRecords = () => {
    const groups = new Map<string, THREE.Group>();
    scene.traverse((object) => {
      if (
        object instanceof THREE.Group &&
        object.userData.visualRole === "planet-main" &&
        typeof object.userData.toolId === "string"
      ) {
        groups.set(object.userData.toolId, object);
      }
    });

    recordsRef.current = tools.flatMap((tool) => {
      const group = groups.get(tool.id);
      return group
        ? [{ group, id: tool.id, ndc: new THREE.Vector3() }]
        : [];
    });
  };

  useEffect(() => {
    refreshRecords();
  }, [scene, tools]);

  useFrame(() => {
    if (recordsRef.current.length !== tools.length) {
      refreshRecords();
    }

    const visibleRecords = recordsRef.current.filter(
      (record) => record.group.visible,
    );
    if (visibleRecords.length === 0) return;

    const filterBottom = filterBottomRef.current;
    const safetyGap = compact ? 8 : 32;
    let boundaryViolations = 0;

    gl.getDrawingBufferSize(bufferSizeRef.current);
    occlusionState.viewport.copy(bufferSizeRef.current);
    const pixelRatioX = bufferSizeRef.current.x / Math.max(size.width, 1);
    const pixelRatioY = bufferSizeRef.current.y / Math.max(size.height, 1);
    occlusionState.count = Math.min(
      visibleRecords.length,
      maxPlanetOccluders,
    );

    visibleRecords.forEach((record, index) => {
      record.group.getWorldPosition(worldPositionRef.current);
      record.ndc.copy(worldPositionRef.current).project(camera);
      const screenX = (record.ndc.x * 0.5 + 0.5) * size.width;
      const screenY = (-record.ndc.y * 0.5 + 0.5) * size.height;
      const iconWorldScale = Number(
        record.group.userData.iconWorldScale ?? (compact ? 0.88 : 0.72),
      );
      const projectedIconSize =
        camera instanceof THREE.OrthographicCamera
          ? iconWorldScale * record.group.scale.x * camera.zoom
          : iconWorldScale * record.group.scale.x * 72;
      const radius = THREE.MathUtils.clamp(
        projectedIconSize * 0.54 + 4,
        compact ? 26 : 30,
        compact ? 46 : 52,
      );
      const safeTop = Math.max(
        radius + safetyGap,
        filterBottom + safetyGap + radius,
      );
      const safeBottom = size.height - safetyGap - radius;
      const safeLeft = safetyGap + radius;
      const safeRight = size.width - safetyGap - radius;
      const outside =
        screenX < safeLeft ||
        screenX > safeRight ||
        screenY < safeTop ||
        screenY > safeBottom;

      if (outside) boundaryViolations += 1;
      record.group.userData.screenX = screenX;
      record.group.userData.screenY = screenY;
      record.group.userData.screenRadius = radius;
      record.group.userData.boundaryViolation = outside;

      if (index < maxPlanetOccluders) {
        occlusionState.centers[index].set(
          screenX * pixelRatioX,
          (size.height - screenY) * pixelRatioY,
          radius * Math.max(pixelRatioX, pixelRatioY),
        );
      }
    });

    gl.domElement.dataset.galaxyBoundaryViolations =
      boundaryViolations.toString();
    gl.domElement.dataset.galaxySafeBounds = JSON.stringify({
      bottom: size.height - safetyGap,
      left: safetyGap,
      right: size.width - safetyGap,
      top: Math.max(safetyGap, filterBottom + safetyGap),
    });
    gl.domElement.dataset.galaxyPositionAuthority = "fixed-orbit";
    gl.domElement.dataset.galaxyOccluderCount =
      occlusionState.count.toString();
  }, -2);

  return null;
}
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    camera.zoom = size.width < 520 ? compactCameraZoom : desktopCameraZoom;
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

function PerformanceProbe({
  interactionPhase,
  transitionToken,
}: {
  interactionPhase: GalaxyInteractionPhase;
  transitionToken: number;
}) {
  const { gl } = useThree();
  const elapsedRef = useRef(0);
  const framesRef = useRef(0);
  const frameSamplesRef = useRef<number[]>([]);
  const handledPointerdownRef = useRef("");
  const longTaskCountRef = useRef(0);
  const longTaskMaximumRef = useRef(0);
  const transitionStartedAtRef = useRef(0);
  const phaseRef = useRef(interactionPhase);

  phaseRef.current = interactionPhase;

  const writeTransitionMetrics = () => {
    const samples = [...frameSamplesRef.current].sort((a, b) => a - b);
    const p95Index = Math.max(0, Math.ceil(samples.length * 0.95) - 1);
    gl.domElement.dataset.galaxyTransitionFrameP95Ms = (
      samples[p95Index] ?? 0
    ).toFixed(2);
    gl.domElement.dataset.galaxyTransitionFrameSampleCount =
      samples.length.toString();
    gl.domElement.dataset.galaxyTransitionLongTaskCount =
      longTaskCountRef.current.toString();
    gl.domElement.dataset.galaxyTransitionLongTaskMaximumMs =
      longTaskMaximumRef.current.toFixed(2);
  };

  useEffect(() => {
    gl.domElement.dataset.galaxyBasePhaseRate = freeOrbitPhaseRate.toString();
    gl.domElement.dataset.galaxyFreePhaseRate = (
      freeOrbitPhaseRate * freeOrbitSpeedMultiplier
    ).toString();
    gl.domElement.dataset.galaxySpeedMultiplier =
      freeOrbitSpeedMultiplier.toString();
    gl.domElement.dataset.galaxyAlphaStrategy = "straight-alpha";
  }, [gl]);

  useEffect(() => {
    frameSamplesRef.current = [];
    longTaskCountRef.current = 0;
    longTaskMaximumRef.current = 0;
    transitionStartedAtRef.current = performance.now();
    gl.domElement.dataset.galaxyTransitionFrameP95Ms = "0.00";
    gl.domElement.dataset.galaxyTransitionFrameSampleCount = "0";
    gl.domElement.dataset.galaxyTransitionLongTaskCount = "0";
    gl.domElement.dataset.galaxyTransitionLongTaskMaximumMs = "0.00";
  }, [gl, transitionToken]);

  useEffect(() => {
    if (interactionPhase === "focused" || interactionPhase === "free") {
      writeTransitionMetrics();
    }
  }, [interactionPhase]);

  useEffect(() => {
    if (
      typeof PerformanceObserver === "undefined" ||
      !PerformanceObserver.supportedEntryTypes.includes("longtask")
    ) {
      gl.domElement.dataset.galaxyLongTaskObserverSupported = "false";
      return;
    }

    gl.domElement.dataset.galaxyLongTaskObserverSupported = "true";
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (
          entry.startTime < transitionStartedAtRef.current ||
          (phaseRef.current !== "focusing" &&
            phaseRef.current !== "releasing")
        ) {
          return;
        }
        longTaskCountRef.current += 1;
        longTaskMaximumRef.current = Math.max(
          longTaskMaximumRef.current,
          entry.duration,
        );
      });
    });
    observer.observe({ entryTypes: ["longtask"] });
    return () => observer.disconnect();
  }, [gl]);

  useFrame((_, delta) => {
    if (
      interactionPhase === "focusing" ||
      interactionPhase === "releasing"
    ) {
      frameSamplesRef.current.push(delta * 1000);
      const pointerdownAt =
        gl.domElement.dataset.galaxyPointerdownAt ?? "";
      if (
        pointerdownAt &&
        pointerdownAt !== handledPointerdownRef.current
      ) {
        handledPointerdownRef.current = pointerdownAt;
        gl.domElement.dataset.galaxyFocusVisibleLatencyMs = (
          performance.now() - Number(pointerdownAt)
        ).toFixed(2);
      }
    }

    elapsedRef.current += delta;
    framesRef.current += 1;
    if (elapsedRef.current < 1) return;

    const fps = framesRef.current / elapsedRef.current;
    gl.domElement.dataset.galaxyFps = fps.toFixed(1);
    gl.domElement.dataset.galaxyFrameMs = (1000 / Math.max(fps, 1)).toFixed(2);
    elapsedRef.current = 0;
    framesRef.current = 0;
  }, -4);

  return null;
}

function VisualOwnershipProbe({
  detailPanelRef,
  focusedToolId,
  interactionPhase,
  tools,
  transitionToken,
}: {
  detailPanelRef: MutableRefObject<HTMLElement | null>;
  focusedToolId: string | null;
  interactionPhase: GalaxyInteractionPhase;
  tools: ToolGalaxyTool[];
  transitionToken: number;
}) {
  const { gl, scene, size } = useThree();
  const previousViolationRef = useRef("");
  const repeatedViolationFramesRef = useRef(0);
  const auditTokenRef = useRef(transitionToken);
  const transitionBoundaryViolationsRef = useRef(0);
  const transitionMinimumDistanceRef = useRef(
    Number.POSITIVE_INFINITY,
  );
  const transitionMinimumPairRef = useRef("");
  const transitionMinimumPairPointsRef = useRef("");

  useFrame(() => {
    const counts = new Map(tools.map((tool) => [tool.id, 0]));
    const screenPoints: Array<{
      focusBlend: number;
      id: string;
      phase: string;
      radius: number;
      x: number;
      y: number;
    }> = [];
    const sceneStats = {
      groups: 0,
      lines: 0,
      meshes: 0,
      objects: 0,
      sprites: 0,
    };
    let minCameraDepth = Number.POSITIVE_INFINITY;
    let maxCameraDepth = Number.NEGATIVE_INFINITY;
    let minDepthScale = Number.POSITIVE_INFINITY;
    let maxDepthScale = Number.NEGATIVE_INFINITY;
    let minIconOpacity = Number.POSITIVE_INFINITY;
    let maxIconOpacity = Number.NEGATIVE_INFINITY;
    let boundaryViolations = 0;
    scene.traverse((object) => {
      sceneStats.objects += 1;
      if (object instanceof THREE.Group) sceneStats.groups += 1;
      if (object instanceof THREE.Line) sceneStats.lines += 1;
      if (object instanceof THREE.Mesh) sceneStats.meshes += 1;
      if (object instanceof THREE.Sprite) sceneStats.sprites += 1;

      if (object.userData.visualRole === "planet-main") {
        const cameraDepth = Number(object.userData.cameraDepth);
        const depthScale = Number(object.userData.depthScale);
        const iconOpacity = Number(object.userData.iconOpacity);
        if (Number.isFinite(cameraDepth)) {
          minCameraDepth = Math.min(minCameraDepth, cameraDepth);
          maxCameraDepth = Math.max(maxCameraDepth, cameraDepth);
        }
        if (Number.isFinite(depthScale)) {
          minDepthScale = Math.min(minDepthScale, depthScale);
          maxDepthScale = Math.max(maxDepthScale, depthScale);
        }
        if (Number.isFinite(iconOpacity)) {
          minIconOpacity = Math.min(minIconOpacity, iconOpacity);
          maxIconOpacity = Math.max(maxIconOpacity, iconOpacity);
        }
        if (object.userData.boundaryViolation === true) {
          boundaryViolations += 1;
        }
        if (
          object.visible &&
          Number.isFinite(Number(object.userData.screenX)) &&
          Number.isFinite(Number(object.userData.screenY))
        ) {
          screenPoints.push({
            focusBlend: Number(object.userData.focusBlend ?? 0),
            id: String(object.userData.toolId),
            phase: String(object.userData.visualPhase ?? ""),
            radius: Number(object.userData.screenRadius ?? 0),
            x: Number(object.userData.screenX),
            y: Number(object.userData.screenY),
          });
        }
      }

      if (
        object.userData.visualRole !== "planet-main" ||
        !object.visible ||
        typeof object.userData.toolId !== "string"
      ) {
        return;
      }

      const toolId = object.userData.toolId as string;
      counts.set(toolId, (counts.get(toolId) ?? 0) + 1);
    });

    const panel = detailPanelRef.current;
    const controllerToolId = panel?.dataset.controllerToolId ?? "";
    const controllerTransitionToken = Number(
      panel?.dataset.controllerTransitionToken ?? 0,
    );
    const controllerCount = controllerToolId ? 1 : 0;
    if (panel?.dataset.visualOwner === "card" && panel.dataset.toolId) {
      const toolId = panel.dataset.toolId;
      counts.set(toolId, (counts.get(toolId) ?? 0) + 1);
    }

    const violations = [...counts].filter(([, count]) => count !== 1);
    const violationSignature = violations
      .map(([toolId, count]) => `${toolId}:${count}`)
      .join(",");

    gl.domElement.dataset.galaxyVisibleInstanceCounts = JSON.stringify(
      Object.fromEntries(counts),
    );
    gl.domElement.dataset.galaxyDuplicateInstances = String(
      violations.filter(([, count]) => count > 1).length,
    );
    gl.domElement.dataset.galaxyOwnershipValid = String(
      violations.length === 0,
    );
    gl.domElement.dataset.galaxySceneStats = JSON.stringify(sceneStats);
    gl.domElement.dataset.galaxyPanelControllerCount =
      controllerCount.toString();
    gl.domElement.dataset.galaxyPanelController = controllerToolId;
    gl.domElement.dataset.galaxyPanelControllerToken =
      controllerTransitionToken.toString();
    gl.domElement.dataset.galaxyPanelControllerValid = String(
      controllerCount <= 1 &&
        (!controllerToolId ||
          (controllerToolId === focusedToolId &&
            controllerTransitionToken === transitionToken &&
            panel?.dataset.toolId === controllerToolId &&
            panel.dataset.transitionToken ===
              controllerTransitionToken.toString())),
    );
    gl.domElement.dataset.galaxyTransitionToken = transitionToken.toString();
    gl.domElement.dataset.galaxyCameraDepthRange = JSON.stringify({
      max: Number.isFinite(maxCameraDepth) ? maxCameraDepth : 0,
      min: Number.isFinite(minCameraDepth) ? minCameraDepth : 0,
    });
    gl.domElement.dataset.galaxyDepthScaleRange = JSON.stringify({
      max: Number.isFinite(maxDepthScale) ? maxDepthScale : 0,
      min: Number.isFinite(minDepthScale) ? minDepthScale : 0,
    });
    gl.domElement.dataset.galaxyDepthScaleRatio = (
      Number.isFinite(minDepthScale) && minDepthScale > 0
        ? maxDepthScale / minDepthScale
        : 0
    ).toFixed(3);
    gl.domElement.dataset.galaxyIconOpacityRange = JSON.stringify({
      max: Number.isFinite(maxIconOpacity) ? maxIconOpacity : 0,
      min: Number.isFinite(minIconOpacity) ? minIconOpacity : 0,
    });

    let minimumDistance = Number.POSITIVE_INFINITY;
    let minimumPair = "";
    for (let leftIndex = 0; leftIndex < screenPoints.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < screenPoints.length;
        rightIndex += 1
      ) {
        const pairDistance = Math.hypot(
          screenPoints[rightIndex].x - screenPoints[leftIndex].x,
          screenPoints[rightIndex].y - screenPoints[leftIndex].y,
        );
        if (pairDistance < minimumDistance) {
          minimumDistance = pairDistance;
          minimumPair = `${screenPoints[leftIndex].id}|${screenPoints[rightIndex].id}`;
        }
      }
    }
    const minScreenX =
      screenPoints.length > 0
        ? Math.min(...screenPoints.map((point) => point.x))
        : 0;
    const maxScreenX =
      screenPoints.length > 0
        ? Math.max(...screenPoints.map((point) => point.x))
        : 0;
    const minScreenY =
      screenPoints.length > 0
        ? Math.min(...screenPoints.map((point) => point.y))
        : 0;
    const maxScreenY =
      screenPoints.length > 0
        ? Math.max(...screenPoints.map((point) => point.y))
        : 0;
    const occupiedSectors = new Set(
      screenPoints.map((point) => {
        const column = THREE.MathUtils.clamp(
          Math.floor((point.x / Math.max(size.width, 1)) * 3),
          0,
          2,
        );
        const row = THREE.MathUtils.clamp(
          Math.floor((point.y / Math.max(size.height, 1)) * 2),
          0,
          1,
        );
        return `${column}:${row}`;
      }),
    );

    gl.domElement.dataset.galaxyMinPlanetDistance = (
      Number.isFinite(minimumDistance) ? minimumDistance : 0
    ).toFixed(2);
    if (auditTokenRef.current !== transitionToken) {
      auditTokenRef.current = transitionToken;
      transitionBoundaryViolationsRef.current = 0;
      transitionMinimumDistanceRef.current =
        Number.POSITIVE_INFINITY;
      transitionMinimumPairRef.current = "";
      transitionMinimumPairPointsRef.current = "";
    }
    if (interactionPhase !== "free") {
      transitionBoundaryViolationsRef.current = Math.max(
        transitionBoundaryViolationsRef.current,
        boundaryViolations,
      );
      if (Number.isFinite(minimumDistance)) {
        if (
          minimumDistance <
          transitionMinimumDistanceRef.current
        ) {
          transitionMinimumDistanceRef.current = minimumDistance;
          transitionMinimumPairRef.current = minimumPair;
          const [leftId, rightId] = minimumPair.split("|");
          const leftPoint = screenPoints.find((point) => point.id === leftId);
          const rightPoint = screenPoints.find((point) => point.id === rightId);
          transitionMinimumPairPointsRef.current =
            leftPoint && rightPoint
              ? JSON.stringify({
                  left: {
                    focusBlend: Number(leftPoint.focusBlend.toFixed(3)),
                    id: leftPoint.id,
                    phase: leftPoint.phase,
                    x: Number(leftPoint.x.toFixed(1)),
                    y: Number(leftPoint.y.toFixed(1)),
                  },
                  right: {
                    focusBlend: Number(rightPoint.focusBlend.toFixed(3)),
                    id: rightPoint.id,
                    phase: rightPoint.phase,
                    x: Number(rightPoint.x.toFixed(1)),
                    y: Number(rightPoint.y.toFixed(1)),
                  },
                })
              : "";
        }
      }
    }
    gl.domElement.dataset.galaxyTransitionMinDistance = (
      Number.isFinite(transitionMinimumDistanceRef.current)
        ? transitionMinimumDistanceRef.current
        : 0
    ).toFixed(2);
    gl.domElement.dataset.galaxyTransitionBoundaryViolations =
      transitionBoundaryViolationsRef.current.toString();
    gl.domElement.dataset.galaxyTransitionMinPair =
      transitionMinimumPairRef.current;
    gl.domElement.dataset.galaxyTransitionMinPairPoints =
      transitionMinimumPairPointsRef.current;
    gl.domElement.dataset.galaxyOrbitHorizontalSpan = (
      ((maxScreenX - minScreenX) / Math.max(size.width, 1)) *
      100
    ).toFixed(2);
    gl.domElement.dataset.galaxyOrbitVerticalSpan = (
      ((maxScreenY - minScreenY) / Math.max(size.height, 1)) *
      100
    ).toFixed(2);
    gl.domElement.dataset.galaxyCoverageSectorCount =
      occupiedSectors.size.toString();
    gl.domElement.dataset.galaxyCenterBandCount = screenPoints
      .filter(
        (point) =>
          point.x >= size.width * 0.34 &&
          point.x <= size.width * 0.66,
      )
      .length.toString();
    gl.domElement.dataset.galaxyBoundaryViolations =
      boundaryViolations.toString();
    gl.domElement.dataset.galaxyOcclusionStable = String(
      Number(gl.domElement.dataset.galaxyOccluderCount ?? 0) ===
        screenPoints.length &&
        boundaryViolations === 0 &&
        sceneStats.lines === 4,
    );

    repeatedViolationFramesRef.current = violationSignature
      ? violationSignature === previousViolationRef.current
        ? repeatedViolationFramesRef.current + 1
        : 1
      : 0;
    if (
      import.meta.env.DEV &&
      violationSignature &&
      repeatedViolationFramesRef.current === 3
    ) {
      console.error("[ToolGalaxy3D] Invalid visual ownership", {
        violations: violations.map(([toolId, count]) => ({
          toolId,
          visibleInstances: count,
        })),
      });
    }
    previousViolationRef.current = violationSignature;
  }, 0);

  return null;
}

function GalaxyScene({
  activeCategory,
  detailPanelRef,
  focusedToolId,
  interactionReady,
  interactionPhase,
  reducedMotion,
  selectedToolId,
  tools,
  transitionToken,
  onClearFocus,
  onFocusSettled,
  onReleaseSettled,
  onSelectTool,
}: Omit<
  ToolGalaxy3DProps,
  "cardResourcesReady" | "onResourceStateChange" | "preloadRequested" | "renderingActive"
> & {
  interactionReady: boolean;
}) {
  const { size } = useThree();
  const occlusionState = useMemo(createPlanetOcclusionState, []);
  const projectionSpread = useMemo(() => {
    const compact = size.width < 520;
    const zoom = compact ? compactCameraZoom : desktopCameraZoom;
    const horizontalMargin = compact ? 46 : 76;
    const availableWidth = Math.max(
      0,
      size.width - horizontalMargin * 2,
    );
    const safeHorizontalScale =
      availableWidth / (outerOrbitRadius * 2 * zoom);

    return {
      x: THREE.MathUtils.clamp(
        safeHorizontalScale,
        compact ? 0.12 : 0.4,
        1,
      ),
      y: compact ? 1.35 : 1,
      z: 0.9,
    };
  },
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
          radiusX: tool.orbitRadiusX ?? tool.orbitRadius,
          verticalRatio:
            tool.orbitVerticalRatio ?? defaultOrbitVerticalRatio,
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
      {galaxyDiagnostics ? <PerformanceProbe
        interactionPhase={interactionPhase}
        transitionToken={transitionToken}
      /> : null}
      {galaxyDiagnostics ? <VisualOwnershipProbe
        detailPanelRef={detailPanelRef}
        focusedToolId={focusedToolId}
        interactionPhase={interactionPhase}
        tools={tools}
        transitionToken={transitionToken}
      /> : null}
      <PlanetProjectionObserver
        compact={size.width < 520}
        occlusionState={occlusionState}
        tools={tools}
      />
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
            occlusionState={occlusionState}
            radius={orbit.radius}
            radiusX={orbit.radiusX}
            verticalRatio={orbit.verticalRatio}
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
            focused={focusedToolId === tool.id}
            interactionReady={interactionReady}
            interactionPhase={interactionPhase}
            projectionSpread={projectionSpread}
            reducedMotion={reducedMotion}
            selected={selectedToolId === tool.id}
            tool={tool}
            transitionToken={transitionToken}
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
        <planeGeometry args={[14, 7]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

export const ToolGalaxy3D = memo(function ToolGalaxy3D({
  renderingActive,
  activeCategory,
  cardResourcesReady,
  detailPanelRef,
  focusedToolId,
  interactionPhase,
  preloadRequested,
  reducedMotion,
  selectedToolId,
  tools,
  transitionToken,
  onClearFocus,
  onFocusSettled,
  onReleaseSettled,
  onResourceStateChange,
  onSelectTool,
}: ToolGalaxy3DProps) {
  const layoutTools = useMemo(() => createStableGalaxyLayout(tools), [tools]);
  const [textureResourcesReady, setTextureResourcesReady] = useState(false);
  const [preloadDuration, setPreloadDuration] = useState(0);

  useEffect(() => {
    if (!preloadRequested) {
      setTextureResourcesReady(false);
      setPreloadDuration(0);
      return;
    }

    let active = true;
    let firstFrame = 0;
    let secondFrame = 0;
    const startedAt = performance.now();
    const textureTasks = layoutTools
      .filter((tool) => Boolean(tool.icon))
      .map((tool) => loadRoundedIconTexture(tool.icon as string));

    Promise.allSettled(textureTasks).then(() => {
      if (!active) return;
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if (!active) return;
          setPreloadDuration(performance.now() - startedAt);
          setTextureResourcesReady(true);
        });
      });
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [layoutTools, preloadRequested]);

  const interactionReady =
    preloadRequested && cardResourcesReady && textureResourcesReady;

  useEffect(() => {
    onResourceStateChange(interactionReady);
  }, [interactionReady, onResourceStateChange]);

  return (
    <div
      className="tool-galaxy-stage"
      data-resources-ready={interactionReady}
      data-texture-preload-ms={preloadDuration.toFixed(1)}
      data-rendering-active={renderingActive}
      aria-busy={!interactionReady}
      aria-label="3D 原子轨道式工具星系"
    >
      <Canvas
        frameloop={renderingActive ? "always" : "never"}
        orthographic
        camera={{ far: 30, near: 0.1, position: [0, 0, 10], zoom: 100 }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={onClearFocus}
      >
        <GalaxyScene
          activeCategory={activeCategory}
          detailPanelRef={detailPanelRef}
          focusedToolId={focusedToolId}
          interactionReady={interactionReady}
          interactionPhase={interactionPhase}
          reducedMotion={reducedMotion}
          selectedToolId={selectedToolId}
          tools={layoutTools}
          transitionToken={transitionToken}
          onClearFocus={onClearFocus}
          onFocusSettled={onFocusSettled}
          onReleaseSettled={onReleaseSettled}
          onSelectTool={onSelectTool}
        />
      </Canvas>
    </div>
  );
});
