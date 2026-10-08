import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { MingmingGrowthEvidence } from "../../data/mingmingCase";
import { ORBIT_STAGGER, orbitCapacity, orbitCurve, orbitGeometry, orbitPose, orbitPhrase, orbitWord } from "./accountOrbitMotion";
const phrase = [
  ["从定位、", "内容、", "投流", "到培训，"],
  ["建立", "一套", "可复制的"],
  ["IP 孵化", "系统。"],
];

function OrbitProfile({ item, index, count, progress, viewport }: {
  item: MingmingGrowthEvidence;
  index: number;
  count: number;
  progress: MotionValue<number>;
  viewport: { width: number; height: number };
}) {
  const { width, height, centerY } = orbitGeometry(viewport);
  const localProgress = useTransform(progress, value => value * (1 + ORBIT_STAGGER * (count - 1)) - index * ORBIT_STAGGER);
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
      </span>)}</div>
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
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  // 展示效果优先：桌面精选 8 张，窄屏精选 4 张，始终只有一个环廊。
  const displayItems = items.slice(0, orbitCapacity(viewport));
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

  if (reducedMotion) {
    return <section className="mm-orbit-reduced" aria-label={`精选 ${displayItems.length} 个达人主页`}>
      <div className="mm-shell"><h3>账号增长成果</h3><p>从定位、内容、投流到培训，建立一套可复制的 IP 孵化系统。</p>
        <div className="mm-orbit-reduced-grid">{displayItems.map((item) => <figure key={item.id} data-evidence-id={item.id} data-canonical-source={item.canonicalSource}><img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" /><figcaption>{item.followersLabel} 粉丝</figcaption></figure>)}</div>
      </div>
    </section>;
  }

  return <section ref={ref} className="mm-orbit" style={{ height: viewport.width <= 768 ? "450svh" : "600svh" }} aria-label={`精选 ${displayItems.length} 个达人主页空间回环`}>
    <div className="mm-orbit-stage">
      <div className="mm-orbit-heading mm-shell"><h3>账号增长成果</h3><p>精选 {displayItems.length} 个达人主页 · 按公开粉丝数排序</p><p className="mm-orbit-mobile-copy">从定位、内容、投流到培训，建立一套可复制的 IP 孵化系统。</p></div>
      <div className="mm-orbit-space">
        {displayItems.map((item, index) => <OrbitProfile key={item.id} item={item} index={index} count={displayItems.length} progress={inertialProgress} viewport={viewport} />)}
        <motion.p className="mm-orbit-statement" style={{ opacity: phraseOpacity, y: phraseY }}>{phrase.map((line, row) => <span className="mm-orbit-line" key={row}>{line.map((text, column) => <PhraseWord key={text} text={text} index={phrase.slice(0, row).flat().length + column} progress={inertialProgress} />)}</span>)}</motion.p>
      </div>
    </div>
  </section>;
}
