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
  activeCategory: ToolCategory;
  focusedToolId: string | null;
  reducedMotion: boolean;
  selectedToolId: string;
  tools: ToolGalaxyTool[];
  onClearFocus: () => void;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
};

const twoPi = Math.PI * 2;
const categoryOrder: ToolCategory[] = ["AI 创作", "内容制作", "平台运营"];
const tempPosition = new THREE.Vector3();
const tempEuler = new THREE.Euler();

const orbitPresets: Array<{
  radius: number;
  tilt: [number, number, number];
  direction: 1 | -1;
}> = [
  { radius: 1.26, tilt: [56, -14, 10], direction: 1 },
  { radius: 1.48, tilt: [-42, 22, -18], direction: -1 },
  { radius: 1.68, tilt: [24, 50, 38], direction: 1 },
  { radius: 1.84, tilt: [-62, -18, 32], direction: -1 },
  { radius: 1.96, tilt: [34, -58, -26], direction: 1 },
  { radius: 1.58, tilt: [-22, -38, 62], direction: -1 },
];

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
) {
  target.set(
    Math.cos(angle) * tool.orbitRadius,
    Math.sin(angle * 1.6 + tool.phase) * 0.18,
    Math.sin(angle) * tool.orbitRadius * 0.58,
  );
  tempEuler.set(
    THREE.MathUtils.degToRad(tool.orbitTilt[0]),
    THREE.MathUtils.degToRad(tool.orbitTilt[1]),
    THREE.MathUtils.degToRad(tool.orbitTilt[2]),
  );
  target.applyEuler(tempEuler);

  return target;
}

function getFrontAngle(tool: ToolGalaxyTool) {
  const probe = new THREE.Vector3();
  let bestAngle = tool.baseAngle;
  let bestScore = -Infinity;

  for (let index = 0; index < 240; index += 1) {
    const angle = (index / 240) * twoPi;
    setOrbitPosition(probe, tool, angle);
    const score = probe.z - Math.abs(probe.x) * 0.16;
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
    const categoryOffset = (categoryIndex * twoPi) / Math.max(group.length * 3, 1);

    return group.map((tool, toolIndex) => {
      const orbitIndex = (categoryIndex * 2 + toolIndex) % orbitPresets.length;
      const preset = orbitPresets[orbitIndex];
      const evenAngle = (toolIndex / Math.max(group.length, 1)) * twoPi;
      const seededJitter = (seededUnit(`${tool.id}-angle`) - 0.5) * 0.12;
      const radiusJitter = (seededUnit(`${tool.id}-radius`) - 0.5) * 0.08;
      const speedJitter = seededUnit(`${tool.id}-speed`) * 0.012;

      return {
        ...tool,
        orbitIndex,
        orbitRadius: preset.radius + radiusJitter,
        orbitTilt: preset.tilt,
        baseAngle: normalizeAngle(categoryOffset + evenAngle + seededJitter),
        speed: preset.direction * (0.038 + speedJitter),
        phase: seededUnit(`${tool.id}-phase`) * twoPi,
      };
    });
  });
}

function createOrbitPoints(radius: number, tilt: [number, number, number]) {
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
      Math.sin(angle * 2) * 0.06,
      Math.sin(angle) * radius * 0.58,
    );

    point.applyEuler(euler);
    points.push(point);
  }

  return points;
}

function OrbitLine({
  active,
  radius,
  tilt,
}: {
  active: boolean;
  radius: number;
  tilt: [number, number, number];
}) {
  const points = useMemo(() => createOrbitPoints(radius, tilt), [radius, tilt]);

  return (
    <Line
      points={points}
      color={active ? "#ffd175" : "#8a5a18"}
      lineWidth={active ? 1.05 : 0.65}
      opacity={active ? 0.58 : 0.22}
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
  focused,
  reducedMotion,
  selected,
  tool,
  onSelectTool,
}: {
  activeCategory: ToolCategory;
  focused: boolean;
  reducedMotion: boolean;
  selected: boolean;
  tool: ToolGalaxyTool;
  onSelectTool: (tool: ToolGalaxyTool, focus?: boolean) => void;
}) {
  const angleRef = useRef(normalizeAngle(tool.baseAngle + tool.phase));
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const hoveredRef = useRef(false);
  const { gl } = useThree();
  const categoryActive = tool.category === activeCategory;
  const iconOpacity = categoryActive || focused || selected ? 1 : 0.22;
  const frontAngle = useMemo(
    () => getFrontAngle(tool),
    [tool.baseAngle, tool.orbitRadius, tool.orbitTilt, tool.phase],
  );
  const renderOrder = focused ? 36 : selected ? 28 : categoryActive ? 16 : 8;

  const setHovered = (value: boolean) => {
    hoveredRef.current = value;
    gl.domElement.style.cursor = value ? "pointer" : "";
  };

  useEffect(() => () => {
    if (hoveredRef.current) {
      gl.domElement.style.cursor = "";
    }
  }, [gl]);

  useFrame((_, delta) => {
    const hovered = hoveredRef.current;

    if (focused) {
      angleRef.current = normalizeAngle(
        angleRef.current +
          shortestAngleDelta(angleRef.current, frontAngle) *
            (reducedMotion ? 1 : 1 - Math.exp(-delta * 5.8)),
      );
    } else if (!reducedMotion) {
      angleRef.current = normalizeAngle(
        angleRef.current + tool.speed * delta * 0.72,
      );
    }

    setOrbitPosition(tempPosition, tool, angleRef.current);

    const opacity = categoryActive ? (focused || selected ? 1 : 0.82) : 0.16;
    const scale = focused
      ? 1.3
      : hovered
        ? 1.08
        : selected
          ? 1.04
          : categoryActive
            ? 0.92
            : 0.54;

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
        focused ? 0.68 : hovered ? 0.36 : selected ? 0.26 : 0.08,
        1 - Math.exp(-delta * 4.8),
      );
    }

    const glowMaterial = glowRef.current?.material as
      | THREE.MeshBasicMaterial
      | undefined;
    if (glowMaterial) {
      glowMaterial.opacity = THREE.MathUtils.lerp(
        glowMaterial.opacity,
        focused ? 0.2 : hovered ? 0.13 : selected ? 0.1 : 0.032,
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
          opacity={categoryActive ? 0.18 : 0.055}
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
          tabIndex={categoryActive ? 0 : -1}
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
  const sceneScale = size.width < 520 ? 0.74 : size.width < 900 ? 0.84 : 1;
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
              item.category === activeCategory,
          ),
        })),
    [activeCategory, tools],
  );

  return (
    <>
      <ambientLight intensity={1.3} />
      <pointLight color="#ffd175" intensity={3.8} position={[0, 0.6, 2.6]} />
      <spotLight
        angle={0.55}
        color="#f3b34d"
        intensity={1.6}
        penumbra={0.9}
        position={[2.4, 2.2, 3.4]}
      />
      <group position={[0, 0, 0]} scale={sceneScale}>
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
            tilt={orbit.tilt}
          />
        ))}
        {tools.map((tool) => (
          <ToolPlanet
            key={tool.id}
            activeCategory={activeCategory}
            focused={focusedToolId === tool.id}
            reducedMotion={reducedMotion}
            selected={selectedToolId === tool.id}
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
        camera={{ fov: 48, position: [0, 0.28, 6.2] }}
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
