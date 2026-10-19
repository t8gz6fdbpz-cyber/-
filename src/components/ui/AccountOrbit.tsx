import { useSiteReducedMotion } from "../../motion/MotionPreference";
import { useEffect, useRef, useState } from "react";
import { motion,  useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { MingmingGrowthEvidence } from "../../data/mingmingCase";
import { isCompactOrbit, orbitCapacity, orbitStagger, orbitCurve, orbitGeometry, orbitPose, orbitPhrase, orbitWord, type OrbitViewport } from "./accountOrbitMotion";
import { OriginalImageViewerProvider, useOriginalImages } from "./OriginalImageViewer";
const phrase = [
  ["从定位、", "内容、", "投流", "到培训，"],
  ["建立", "一套", "可复制的"],
  ["IP 孵化", "系统。"],
];

function OrbitProfile({ item, index, count, progress, viewport, onOpen }: {
  item: MingmingGrowthEvidence;
  index: number;
  count: number;
  progress: MotionValue<number>;
  viewport: OrbitViewport;
  onOpen: () => void;
}) {
  const { width, height, centerY } = orbitGeometry(viewport);
  const stagger = orbitStagger(viewport);
  const localProgress = useTransform(progress, value => value * (1 + stagger * (count - 1)) - index * stagger);
  // 原站三段轨迹：左进 → 完整绕行 360° → 右出，正反滚动共用同一进度。
  const pose = useTransform(localProgress, value => orbitPose(value, viewport));
  const transform = useTransform(pose, value => `translate3d(${value.x.toFixed(2)}px, ${value.y.toFixed(2)}px, ${value.z.toFixed(2)}px) rotateY(${value.rotation.toFixed(2)}deg)`);
  const opacity = useTransform(pose, value => value.opacity);
  const zIndex = useTransform(pose, value => value.zIndex);
  const { count: sliceCount, sliceWidth, radius: curveRadius, sliceAngle: angleRadians } = orbitCurve(viewport);
  const sliceAngle = angleRadians * 180 / Math.PI;

  return (
    <motion.figure
      className="mm-orbit-image"
      data-evidence-id={item.id}
      data-canonical-source={item.canonicalSource}
      style={{ width, height, top: centerY, marginLeft: -width / 2, marginTop: -height / 2, transform, opacity, zIndex }}
    >
      <button className="mm-orbit-open" type="button" aria-label={`查看账号 ${index + 1} 原图：${item.alt}`} onClick={onOpen}>
      <img src={item.src} alt={item.alt} width={item.width} height={item.height} decoding="async" draggable={false} />
      <div className="mm-orbit-curvature" aria-hidden="true">{Array.from({ length: sliceCount }, (_, slice) => <span key={slice} style={{
        width: sliceWidth + 1.5, height,
        left: (width - sliceWidth - 1.5) / 2,
        transformOrigin: `50% 50% ${-curveRadius}px`,
        transform: `rotateY(${(slice - (sliceCount - 1) / 2) * sliceAngle}deg)`,
      }}>
        {/* 背面单独映射逆序切片，保持整张账号截图可读，而不是镜像正面。 */}
        <i className="mm-orbit-face" style={{ backgroundImage: `url("${item.src}")`, backgroundSize: `${width}px auto`, backgroundPosition: `${-slice * sliceWidth}px ${-width * .2}px` }} />
        <i className="mm-orbit-face mm-orbit-face-back" style={{ backgroundImage: `url("${item.src}")`, backgroundSize: `${width}px auto`, backgroundPosition: `${-(sliceCount - 1 - slice) * sliceWidth}px ${-width * .2}px` }} />
      </span>)}</div></button>
    </motion.figure>
  );
}

function PhraseWord({ text, index, progress }: { text: string; index: number; progress: MotionValue<number> }) {
  const reveal = useTransform(progress, value => orbitWord(value, index, phrase.flat().length));
  const opacity = useTransform(reveal, value => value.opacity);
  const filter = useTransform(reveal, value => `blur(${value.blur.toFixed(1)}px)`);
  return <motion.span style={{ opacity, filter }}>{text}</motion.span>;
}

export function AccountOrbit({ items }: { items: MingmingGrowthEvidence[] }) {
  return <OriginalImageViewerProvider><AccountOrbitContent items={items} /></OriginalImageViewerProvider>;
}
function AccountOrbitContent({ items }: { items: MingmingGrowthEvidence[] }) {
  const open = useOriginalImages();
  const ref = useRef<HTMLElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSiteReducedMotion();
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const [spaceSize, setSpaceSize] = useState({ width: 1440, height: 900 });
  const compact = isCompactOrbit(viewport);
  const orbitViewport = { ...spaceSize, compact };
  // Preserve the desktop selection; mobile spaces arrivals further apart.
  const displayItems = items.slice(0, orbitCapacity(viewport));
  const originals = displayItems.map(item => ({ id: item.id, src: item.originalSrc ?? item.src, alt: item.alt, label: item.title, width: item.width, height: item.height }));
  const browse = <button className="mm-orbit-browse" type="button" onClick={() => open(originals, 0)}>查看全部 {displayItems.length} 个账号原图 <span aria-hidden="true">↗</span></button>;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 只缓动一个公共进度：停轮后轻微续滑，图片与文字同步，不拦截原生滚动。
  // 过阻尼避免回弹；减弱动效时仍使用静态展示。
  const inertialProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 28, mass: .7, restDelta: .00001, restSpeed: .0001 });
  const phrasePose = useTransform(inertialProgress, value => orbitPhrase(value));
  const phraseOpacity = useTransform(phrasePose, value => value.opacity);
  const phraseY = useTransform(phrasePose, value => value.y);

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const space = spaceRef.current;
    if (!space) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSpaceSize({ width, height });
    });
    observer.observe(space);
    return () => observer.disconnect();
  }, [reducedMotion]);

  if (reducedMotion) {
    return <section className="mm-orbit-reduced" aria-label={`精选 ${displayItems.length} 个达人主页`}>
      <div className="mm-shell"><h3>账号增长成果</h3><p>从定位、内容、投流到培训，建立一套可复制的 IP 孵化系统。</p>{browse}
        <div className="mm-orbit-reduced-grid">{displayItems.map((item, index) => <figure key={item.id} data-evidence-id={item.id} data-canonical-source={item.canonicalSource}><button className="mm-orbit-static-open" type="button" aria-label={`查看账号 ${index + 1} 原图`} onClick={() => open(originals, index)}><img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" /></button><figcaption>{item.followersLabel} 粉丝</figcaption></figure>)}</div>
      </div>
    </section>;
  }

  return <section ref={ref} className="mm-orbit" data-compact={compact} style={{ height: compact ? "450svh" : "600svh" }} aria-label={`精选 ${displayItems.length} 个达人主页空间回环`}>
    <div className="mm-orbit-stage">
      <div className="mm-orbit-heading mm-shell"><h3>账号增长成果</h3><p>精选 {displayItems.length} 个达人主页 · 按公开粉丝数排序</p>{browse}<p className="mm-orbit-mobile-copy">从定位、内容、投流到培训，建立一套可复制的 IP 孵化系统。</p></div>
      <div className="mm-orbit-space" ref={spaceRef}>
        {displayItems.map((item, index) => <OrbitProfile key={item.id} item={item} index={index} count={displayItems.length} progress={inertialProgress} viewport={orbitViewport} onOpen={() => open(originals, index)} />)}
        <motion.p className="mm-orbit-statement" style={{ opacity: phraseOpacity, y: phraseY }}>{phrase.map((line, row) => <span className="mm-orbit-line" key={row}>{line.map((text, column) => <PhraseWord key={text} text={text} index={phrase.slice(0, row).flat().length + column} progress={inertialProgress} />)}</span>)}</motion.p>
      </div>
    </div>
  </section>;
}
