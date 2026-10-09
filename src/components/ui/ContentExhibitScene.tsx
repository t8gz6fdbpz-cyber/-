import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import type { MingmingGrowthEvidence } from "../../data/mingmingCase";

type SceneProps = {
  items: readonly MingmingGrowthEvidence[];
  activeId: string;
  onSelect: (id: string) => void;
  onOpen: () => void;
  reducedMotion: boolean;
  progress: MotionValue<number>;
};

type ResourceStatus = "loading" | "ready" | "error";
type ResourceReporter = (id: string, status: ResourceStatus) => void;

class SceneErrorBoundary extends Component<{
  children: ReactNode;
  fallback: ReactNode;
  onFailure: () => void;
}, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }

  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function useArtworkTexture(item: MingmingGrowthEvidence, report: ResourceReporter) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    let cancelled = false;
    setTexture(null);
    report(item.id, "loading");
    const request = new THREE.TextureLoader().load(item.src, loaded => {
      if (cancelled) { loaded.dispose(); return; }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
      loaded.minFilter = THREE.LinearMipmapLinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      setTexture(loaded);
      report(item.id, "ready");
      invalidate();
    }, undefined, () => {
      if (cancelled) return;
      report(item.id, "error");
      invalidate();
    });
    return () => { cancelled = true; request.dispose(); };
  }, [item.id, item.src, gl, invalidate, report]);

  return texture;
}

function curvedImage(width: number, height: number, reverseU = false) {
  const geometry = new THREE.PlaneGeometry(width, height, 40, 1);
  const positions = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const radius = 4;
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index);
    positions.setX(index, Math.sin(x / radius) * radius);
    positions.setZ(index, (Math.cos(x / radius) - 1) * radius);
    if (reverseU) uvs.setX(index, 1 - uvs.getX(index));
  }
  positions.needsUpdate = true;
  uvs.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function Artwork({ item, index, count, progress, reducedMotion, report,
  onSelect, onOpen }: {
  item: MingmingGrowthEvidence;
  index: number;
  count: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  report: ResourceReporter;
  onSelect: (id: string) => void;
  onOpen: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const hoverDepth = useRef(0);
  const texture = useArtworkTexture(item, report);
  const { gl, viewport, size, invalidate } = useThree();
  const width = size.width <= 700 ? 1.2 : 1.9;
  const height = width * (item.height || 2622) / (item.width || 1206);
  const frontGeometry = useMemo(() => curvedImage(width, height), [width, height]);
  const backGeometry = useMemo(() => curvedImage(width, height, true), [width, height]);

  useEffect(() => () => { frontGeometry.dispose(); backGeometry.dispose(); }, [frontGeometry, backGeometry]);

  // The native scroll's MotionValue is the only orbital clock; stopping scroll stops the scene.
  useFrame((_, delta) => {
    const image = group.current;
    if (!image) return;
    const targetDepth = hovered.current && !reducedMotion ? .24 : 0;
    const difference = Math.abs(hoverDepth.current - targetDepth);
    if (difference > .001 && !reducedMotion) {
      hoverDepth.current = THREE.MathUtils.damp(hoverDepth.current, targetDepth, 16, delta);
      invalidate();
    } else {
      hoverDepth.current = targetDepth;
    }
    const phase = index / count * Math.PI * 2
      + (reducedMotion ? 0 : progress.get() * Math.PI * 2);
    const stagger = index % 2 === 0 ? .45 : -.45;
    image.position.set(
      Math.sin(phase) * viewport.width * .32,
      Math.sin(phase) * .8 + stagger,
      Math.cos(phase) * 5 + hoverDepth.current,
    );
    image.rotation.set(0, phase, 0);
  });

  function openOrSelect(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.delta > 6) return;
    onSelect(item.id);
    onOpen();
  }

  return <group ref={group}
    onPointerOver={event => {
      event.stopPropagation();
      if (event.pointerType === "touch") return;
      gl.domElement.style.cursor = "pointer";
      hovered.current = true;
      invalidate();
    }}
    onPointerOut={() => {
      gl.domElement.style.cursor = "default";
      hovered.current = false;
      invalidate();
    }}
    onClick={openOrSelect}>
    <mesh geometry={frontGeometry}>
      <meshBasicMaterial key={`${texture?.uuid ?? "placeholder"}-front`} map={texture}
        color={texture ? "#ffffff" : "#201c14"}
        toneMapped={false} side={THREE.FrontSide} />
    </mesh>
    <mesh geometry={backGeometry} position={[0, 0, -.006]}>
      <meshBasicMaterial key={`${texture?.uuid ?? "placeholder"}-back`} map={texture}
        color={texture ? "#ffffff" : "#201c14"}
        toneMapped={false} side={THREE.BackSide} />
    </mesh>
  </group>;
}

function Exhibition({ items, onSelect, onOpen, reducedMotion, progress, report }: SceneProps & {
  report: ResourceReporter;
}) {
  const { gl, events, invalidate } = useThree();

  useEffect(() => {
    invalidate();
    if (reducedMotion) return;
    return progress.on("change", () => invalidate());
  }, [progress, reducedMotion, invalidate]);

  useEffect(() => {
    const host = events.connected instanceof HTMLElement ? events.connected : gl.domElement;
    const previousHostAction = host.style.touchAction;
    const previousCanvasAction = gl.domElement.style.touchAction;
    host.style.touchAction = "pan-y";
    gl.domElement.style.touchAction = "pan-y";
    gl.domElement.style.cursor = "default";
    return () => {
      host.style.touchAction = previousHostAction;
      gl.domElement.style.touchAction = previousCanvasAction;
      gl.domElement.style.cursor = "";
    };
  }, [events.connected, gl]);

  return <group>{items.map((item, index) => <Artwork key={item.id} item={item}
    index={index} count={items.length} progress={progress} reducedMotion={reducedMotion}
    report={report} onSelect={onSelect} onOpen={onOpen} />)}</group>;
}

export function ContentExhibitScene(props: SceneProps) {
  const [resources, setResources] = useState<Record<string, ResourceStatus>>({});
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [rendererReady, setRendererReady] = useState(false);
  const canvasElement = useRef<HTMLCanvasElement | null>(null);
  const report = useCallback<ResourceReporter>((id, status) => {
    setResources(previous => previous[id] === status ? previous : { ...previous, [id]: status });
  }, []);
  const fail = useCallback(() => setFailed(true), []);
  const readyCount = props.items.filter(item => resources[item.id] === "ready").length;
  const errorCount = props.items.filter(item => resources[item.id] === "error").length;

  useEffect(() => {
    const canvas = canvasElement.current;
    if (!canvas || !rendererReady) return;
    const contextLost = (event: Event) => { event.preventDefault(); setFailed(true); };
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => canvas.removeEventListener("webglcontextlost", contextLost);
  }, [rendererReady, attempt]);

  function retry() {
    setResources({});
    setRendererReady(false);
    setFailed(false);
    setAttempt(value => value + 1);
  }

  const fallback = <div className="mm-content-exhibit__scene-fallback"
    style={{ display: "grid", placeContent: "center", height: "100%", padding: 24, gap: 16 }}>
    <p>当前设备暂时无法显示 3D 作品。<br />仍可用作品索引查看完整截图。</p>
    <button type="button" onClick={retry}>重新加载 3D 作品</button>
  </div>;

  if (!props.items.length) return <div className="mm-content-exhibit__scene-fallback">暂无作品。</div>;

  return <div className="mm-content-exhibit__scene" role="region"
    aria-label={`${props.items.length}件无边框曲面作品，随页面滚动沿空间环廊前后穿行，点击查看完整截图`}
    style={{ position: "relative", width: "100%", height: "100%", minHeight: 320, touchAction: "pan-y" }}>
    {failed ? fallback : <SceneErrorBoundary key={attempt} fallback={fallback} onFailure={fail}>
      <Canvas dpr={[1, 1.5]} frameloop="demand" fallback={fallback}
        camera={{ position: [0, 0, 14.5], fov: 40, near: .1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ touchAction: "pan-y" }}
        onCreated={({ gl }) => {
          canvasElement.current = gl.domElement;
          gl.setClearColor(0x000000, 0);
          setRendererReady(true);
        }}>
        <Exhibition {...props} report={report} />
      </Canvas>
    </SceneErrorBoundary>}
    {!failed && rendererReady && readyCount + errorCount < props.items.length &&
      <p className="mm-content-exhibit__scene-status" role="status"
        style={{ position: "absolute", left: 16, bottom: 12, pointerEvents: "none", fontSize: 12 }}>
        正在加载作品画面 {readyCount + errorCount} / {props.items.length}
        {errorCount > 0 ? `（${errorCount} 件暂时加载失败）` : ""}
      </p>}
    {!failed && errorCount > 0 && readyCount + errorCount >= props.items.length &&
      <p className="mm-content-exhibit__scene-status" role="status"
        style={{ position: "absolute", left: 16, bottom: 12, pointerEvents: "none", fontSize: 12 }}>
        {errorCount} 件画面暂时加载失败，其余作品仍可浏览。
      </p>}
  </div>;
}
