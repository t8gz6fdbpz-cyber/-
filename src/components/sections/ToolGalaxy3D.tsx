import { Html, Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react";
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
  { orbitIndex: 11, baseAngle: 226, radius: 3.96, tilt: [34, -18, -16], phase: 3.05 },
];

const defaultFocusAvoidAngles = [
  205, 238, 172, 120, 100, 88, 260, 145, 330, 62, 120, 285,
].map(THREE.MathUtils.degToRad);

const focusAvoidAngleTable = [
  [205, 100, 90, 0, 100, 140, 260, 60, 30, 70, 130, 150],
  [110, 238, 170, 0, 100, 120, 260, 50, 40, 90, 180, 285],
  [40, 100, 172, 120, 100, 120, 260, 50, 30, 90, 180, 180],
  [60, 280, 172, 120, 100, 340, 260, 140, 30, 62, 120, 190],
  [205, 100, 90, 0, 100, 140, 260, 60, 30, 62, 130, 150],
  [60, 100, 172, 10, 100, 88, 260, 145, 330, 100, 120, 180],
  [300, 110, 10, 70, 100, 140, 260, 90, 30, 80, 110, 130],
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
        currentTexture = loadedTexture;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.premultiplyAlpha = true;
        setTexture(loadedTexture);
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
    <sprite position={[0, 0, 0.24]} scale={[0.28, 0.28, 1]} renderOrder={renderOrder}>
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
      <mesh renderOrder={renderOrder}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial
          color="#ffd175"
          transparent
          opacity={0.92 * opacity}
        />
      </mesh>
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
  focusActive,
  focusedToolIndex,
  focused,
  projectionSpread,
  reducedMotion,
  selected,
  toolIndex,
  tool,
  onSelectTool,
}: {
  activeCategory: ToolCategory | null;
  focusActive: boolean;
  focusedToolIndex: number;
  focused: boolean;
  projectionSpread: typeof defaultProjectionSpread;
  reducedMotion: boolean;
  selected: boolean;
  toolIndex: number;
  tool: ToolGalaxyTool;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
}) {
  const angleRef = useRef(normalizeAngle(tool.baseAngle));
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const hoveredRef = useRef(false);
  const previousFocusActiveRef = useRef(focusActive);
  const returningToOrbitRef = useRef(false);
  const { gl } = useThree();
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
      angleRef.current = normalizeAngle(
        angleRef.current +
          shortestAngleDelta(angleRef.current, avoidAngle) *
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

    const opacity = focusActive
      ? focused
        ? 1
        : 0.32
      : categoryActive
        ? 0.96
        : 0.44;
    const scale = focused
      ? 1.42
      : hovered
        ? 1.08
        : focusActive
          ? 0.78
          : categoryActive
            ? 1
            : 0.82;

    groupRef.current?.position.lerp(
      tempPosition,
      reducedMotion ? 1 : 1 - Math.exp(-delta * 6.2),
    );

    if (groupRef.current) {
      const nextScale = THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        scale,
        reducedMotion ? 1 : 1 - Math.exp(-delta * 5),
      );
      groupRef.current.scale.setScalar(nextScale);
    }

    const sphereMaterial = sphereRef.current?.material as
      | THREE.MeshStandardMaterial
      | undefined;
    if (sphereMaterial) {
      sphereMaterial.opacity = THREE.MathUtils.lerp(
        sphereMaterial.opacity,
        opacity,
        1 - Math.exp(-delta * 6),
      );
      sphereMaterial.emissiveIntensity = THREE.MathUtils.lerp(
        sphereMaterial.emissiveIntensity,
        focused ? 0.82 : hovered ? 0.38 : selected ? 0.28 : 0.12,
        1 - Math.exp(-delta * 4.8),
      );
    }

    const glowMaterial = glowRef.current?.material as
      | THREE.MeshBasicMaterial
      | undefined;
    if (glowMaterial) {
      glowMaterial.opacity = THREE.MathUtils.lerp(
        glowMaterial.opacity,
        focused ? 0.24 : hovered ? 0.12 : focusActive ? 0.018 : 0.048,
        1 - Math.exp(-delta * 4.8),
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      renderOrder={renderOrder}
    >
      <mesh
        ref={glowRef}
        scale={1.42}
        renderOrder={renderOrder - 1}
        onClick={(event) => {
          event.stopPropagation();
          onSelectTool(tool, true);
        }}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial
          color="#ffd175"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.04}
          transparent
        />
      </mesh>
      <mesh
        ref={sphereRef}
        castShadow={false}
        receiveShadow={false}
        renderOrder={renderOrder}
        onClick={(event) => {
          event.stopPropagation();
          onSelectTool(tool, true);
        }}
      >
        <sphereGeometry args={[0.18, 42, 42]} />
        <meshStandardMaterial
          color={categoryActive ? "#f2c667" : "#d6a64e"}
          emissive="#ffd175"
          emissiveIntensity={0.1}
          metalness={0.36}
          opacity={categoryActive ? 0.34 : 0.16}
          roughness={0.28}
          transparent
          depthWrite={false}
        />
      </mesh>
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
        <mesh>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshBasicMaterial color="#ffd175" opacity={0.58} transparent />
        </mesh>
        <mesh scale={1.9}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshBasicMaterial
            color="#ffd175"
            depthWrite={false}
            opacity={0.055}
            transparent
          />
        </mesh>
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
            focusActive={focusedToolId !== null}
            focusedToolIndex={focusedToolIndex}
            focused={focusedToolId === tool.id}
            projectionSpread={projectionSpread}
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
