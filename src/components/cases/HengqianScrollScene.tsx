import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ViewportImage } from "../ui/ViewportImage";
import { aiProduction, photography } from "../../data/hengqianCase";
import { useHengqianMotion } from "./HengqianMotion";
import { useOriginalImages } from "../ui/OriginalImageViewer";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

// Hero photo-2 has its own exclusive position. This scene uses four other
// commercial-IP photos, then an explicitly attributed digital-human capture.
const sceneImages = [photography[3], photography[0], photography[4], aiProduction[2]];
const sceneCaptions = ["商业 IP · 真人拍摄", "商业 IP · 布光与机位", "商业 IP · 摄影执行", "数字人 · 绿幕采集"];
const showcaseImages = aiProduction.slice(0, 2);

/** Short windows keep natural flow: establish each photograph while approaching,
 * then hold it for reading. No pin, horizontal rail, or extra scroll height. */
function shortProductionMotion(node: HTMLDivElement) {
  gsap.fromTo(node.querySelectorAll(".hq-scene-line > span"), { yPercent: 55 }, { yPercent: 0, duration: .65, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: node, start: "top 88%", once: true } });
  node.querySelectorAll<HTMLElement>(".hq-scene-photo").forEach(card => {
    gsap.fromTo(card, { y: 40 }, { y: 0, ease: "none", scrollTrigger: { trigger: card, start: "top 95%", end: "top 45%", scrub: true } });
    gsap.fromTo(card.querySelector("img"), { yPercent: 0, scale: 1.04 }, { yPercent: -12, scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

function shortShowcaseMotion(node: HTMLDivElement) {
  gsap.fromTo(node.querySelector(".hq-showcase-frame"), { scale: .88, y: 32 }, { scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: node, start: "top 95%", end: "top 30%", scrub: true } });
  gsap.fromTo(node.querySelectorAll(".hq-showcase-title,.hq-showcase-intro"), { y: 28 }, { y: 0, duration: .65, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: node.querySelector(".hq-showcase-title"), start: "top 92%", once: true } });
}

// Observe the unclipped scene, so rail/switch photographs are requested before
// their animated mask enters the screen. The individual images retain their
// original size and do not depend on being opened elsewhere to warm the cache.
function useSceneMediaReady(root: RefObject<HTMLDivElement>) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: "1000px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [root]);
  return ready;
}

export function HengqianHeroScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const { reduce, compact } = useHengqianMotion();
  useLayoutEffect(() => {
    if (reduce || !root.current) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      timeline.to(".hq-hero-drift", { y: compact ? 45 : 100, scale: 1.08, duration: 1, ease: "none" }, 0)
        .to(".hq-hero-heading", { y: compact ? -24 : -60, duration: 1, ease: "none" }, 0);
    }, root);
    return () => context.revert();
  }, [compact, reduce]);
  return <header className="hq-hero" ref={root}>{children}</header>;
}

/** CSS supplies the bounded sticky geometry. GSAP owns this scene's transforms.
 * No wheel interception, smooth-scroller, snap, pin spacer or per-frame React render.
 * See docs/hengqian-motion-study.md for observed reference stages and adaptations.
 */
export function HengqianProductionScene() {
  const open = useOriginalImages();
  const root = useRef<HTMLDivElement>(null);
  const mediaReady = useSceneMediaReady(root);
  const { reduce, compact, short } = useHengqianMotion();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useLayoutEffect(() => {
    if (reduce || !root.current) return;
    const node = root.current;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      if (short) { shortProductionMotion(node); return; }
      media.add("(min-height: 700px)", () => {
        const headings = node.querySelectorAll(".hq-scene-line > span");
        gsap.from(headings, { yPercent: 105, duration: 0.95, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 85%", once: true } });
        gsap.from(".hq-scene-note", { opacity: 0, y: compact ? 24 : 40, duration: 0.85, delay: 0.2, stagger: 0.18, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 65%", once: true } });
        if (compact) {
          const rail = node.querySelector<HTMLElement>(".hq-scene-rail")!;
          const window = node.querySelector<HTMLElement>(".hq-scene-window")!;
          const timeline = gsap.timeline({ scrollTrigger: {
            trigger: node, start: "top 130px", end: "bottom bottom", scrub: 0.65, invalidateOnRefresh: true,
            onUpdate: self => {
              const next = Math.min(3, Math.max(0, Math.round(Math.max(0, (self.progress - 0.04) / 0.92) * 3)));
              if (next !== activeRef.current) { activeRef.current = next; setActive(next); }
            },
          } });
          timeline.addLabel("establish", 0)
            .addLabel("photographs", 0.04)
            .to(rail, { x: () => -Math.max(0, rail.scrollWidth - window.clientWidth), duration: 0.92, ease: "none" }, 0.04)
            .fromTo(".hq-scene-photo-media img", { yPercent: 0 }, { yPercent: -22, duration: 0.96, ease: "none" }, 0)
            .addLabel("hold", 0.96).to({}, { duration: 0.04 }, 0.96).addLabel("release", 1);
        } else {
          // Begin while the scene approaches, then spend 46% of the existing
          // section's scroll range on the first photograph's continuous travel.
          const timeline = gsap.timeline({ scrollTrigger: { trigger: node, start: "top bottom", end: "bottom bottom", scrub: 0.55 } });
          timeline.addLabel("establish", 0)
            .to(".hq-scene-photo-1", { xPercent: -138, duration: 0.46, ease: "none" }, 0.02)
            .addLabel("hold", 0.7).to({}, { duration: 0.3 }, 0.7).addLabel("release", 1);
          node.querySelectorAll<HTMLElement>(".hq-scene-photo").forEach(card => {
            gsap.fromTo(card.querySelector("img"), { yPercent: 0 }, { yPercent: -22, ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
            gsap.fromTo(card.querySelector(".hq-scene-photo-veil"), { scaleY: 1 }, { scaleY: 0, duration: 0.95, ease: "power3.inOut",
              scrollTrigger: { trigger: card, start: "top 92%", once: true } });
          });
        }
      });
    }, node);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(refresh); media.revert(); context.revert(); };
  }, [compact, reduce, short]);

  return <div ref={root} className="hq-paper-scene" data-scroll-scene="production" data-scene-layout={short ? "flow" : "sticky"}>
    <div className="hq-shell hq-scene-canvas">
      <div className="hq-scene-sticky">
        <div className="hq-scene-reading">
        <header className="hq-scene-heading">
          <p className="hq-scene-project">01 商业 IP → 02 数字人</p>
          <h2><span className="hq-scene-line"><span><strong>真实的人物</strong>，</span></span><span className="hq-scene-line"><span><strong>持续的内容</strong>。</span></span></h2>
        </header>
        <div className="hq-scene-notes">
          <p className="hq-scene-note"><span className="hq-scene-desktop-text">孟樊雅项目：让<strong>人物定位与脚本</strong>落到真人拍摄，形成可识别的表达。</span><span className="hq-scene-compact-text">孟樊雅项目 · <strong>真人拍摄</strong>现场。</span></p>
          <p className="hq-scene-note"><span className="hq-scene-desktop-text">下一章转入数字人项目，以<strong>绿幕采集</strong>延展内容生产。</span><span className="hq-scene-compact-text"><strong>人物定位、脚本</strong> → 绿幕采集。</span></p>
        </div>
        </div>
        <div className="hq-scene-window"><div className="hq-scene-rail">
          {sceneImages.map((item, index) => <figure key={item.id} data-media-id={item.id} className={`hq-scene-photo hq-scene-photo-${index + 1}`}>
            <button type="button" className="hq-scene-photo-frame hq-photo-original" aria-label={`查看现场原图：${item.alt}`} onClick={() => open(sceneImages.map(photo => ({ id: photo.id, src: photo.originalSrc, alt: photo.alt, label: photo.evidence, width: photo.width, height: photo.height })), index)}>
              <div className="hq-scene-photo-media"><ViewportImage src={item.previewSrc} alt={item.alt} width={item.width} height={item.height} loading={mediaReady ? "eager" : "lazy"} draggable="false" /></div>
              <span className="hq-scene-photo-veil" aria-hidden="true" />
            </button>
            <figcaption>{String(index + 1).padStart(2, "0")} / {sceneCaptions[index]}</figcaption>
          </figure>)}
        </div></div>
        <div className="hq-scene-mobile-controls"><span aria-live="polite">{String(active + 1).padStart(2, "0")} / 04 · {sceneCaptions[active]}</span></div>
      </div>
    </div>
  </div>;
}

export function HengqianAIShowcase() {
  const open = useOriginalImages();
  const root = useRef<HTMLDivElement>(null);
  const mediaReady = useSceneMediaReady(root);
  const { reduce, compact, short } = useHengqianMotion();
  const [index, setIndex] = useState(0);
  const item = showcaseImages[index];
  useLayoutEffect(() => {
    if (reduce || !root.current) return;
    const node = root.current;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      if (short) { shortShowcaseMotion(node); return; }
      media.add("(min-height: 700px)", () => {
        const stage = node.querySelector<HTMLElement>(".hq-showcase-stage")!;
        const sideWidth = () => stage.clientWidth * 0.175 - 32;
        const timeline = gsap.timeline({ scrollTrigger: { trigger: node, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true } });
        timeline.addLabel("framed", 0).to({}, { duration: 0.25 });
        if (!compact) {
          // Side columns leave the framed view first. Their new overlay
          // positions are revealed only after the shade has begun to develop.
          timeline.to([".hq-showcase-title", ".hq-showcase-intro"], { autoAlpha: 0, duration: 0.1, ease: "none" }, 0.1)
            .fromTo(".hq-showcase-title", { top: "42%", width: sideWidth, x: 0, y: 0, fontSize: () => Math.min(32, Math.max(24, window.innerWidth * 0.02)) },
              { top: "68%", width: () => stage.clientWidth * 0.48, x: 32, y: 0, fontSize: () => Math.min(44, Math.max(32, window.innerWidth * 0.03)), duration: 0.04, ease: "none" }, 0.2)
            .fromTo(".hq-showcase-intro", { top: "38%", width: sideWidth, x: 0, y: 0 },
              { top: "72%", width: () => stage.clientWidth * 0.26, x: -32, y: 0, duration: 0.04, ease: "none" }, 0.2)
            .to([".hq-showcase-title", ".hq-showcase-intro"], { autoAlpha: 1, duration: 0.15, ease: "none" }, 0.42);
        }
        timeline
          .fromTo(".hq-showcase-frame", { width: compact ? "90%" : "65%", height: compact ? "75%" : "65%" }, { width: "100%", height: "100%", duration: 0.4, ease: "power1.inOut" }, 0.25)
          .fromTo(".hq-showcase-shade", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 0.25)
          .addLabel("expanded", 0.65).to({}, { duration: 0.35 }).addLabel("release", 1);
      });
    }, node);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(refresh); media.revert(); context.revert(); };
  }, [compact, reduce, short]);

  return <div className="hq-ai-showcase" ref={root} data-scroll-scene="showcase" data-scene-layout={short ? "flow" : "sticky"}>
    <div className="hq-showcase-sticky"><div className="hq-shell hq-showcase-stage">
      <div className="hq-showcase-frame">{showcaseImages.map((photo, slot) =>
        <motion.figure data-media-id={photo.id} className={`hq-showcase-switch-layer ${slot === index ? "is-active" : ""}`} key={photo.id}
          aria-hidden={!reduce && slot !== index} initial={false} animate={{ clipPath: reduce || slot === index ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
          style={{ zIndex: slot === index ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.75, ease: [0.76, 0, 0.24, 1] }}>
          <button type="button" className="hq-photo-original hq-showcase-original" tabIndex={!reduce && slot !== index ? -1 : 0} aria-label={`查看绿幕原图：${photo.alt}`} onClick={() => open(showcaseImages.map(image => ({ id: image.id, src: image.originalSrc, alt: image.alt, label: image.evidence, width: image.width, height: image.height })), slot)}><ViewportImage src={photo.previewSrc} alt={photo.alt} width={photo.width} height={photo.height} loading={mediaReady ? "eager" : "lazy"} draggable="false" /></button>
          {reduce && <figcaption>数字人项目 · {photo.evidence}</figcaption>}
        </motion.figure>)}<div className="hq-showcase-shade" aria-hidden="true" /></div>
      <h2 className="hq-showcase-title" id="hq-ai-title"><span className="hq-project-number">02 数字人 / AI 矩阵打法</span>把生产方法<br />扩展为矩阵</h2>
      <div className="hq-showcase-intro"><p>以真人采集为基础，组织数字人内容与多版本发布。</p><p>测试、迭代、复制。</p></div>
      {!reduce && <div className="hq-showcase-controls"><p aria-live="polite">0{index + 1} / 0{showcaseImages.length} · 数字人 / {item.evidence}</p><div>
        <button type="button" aria-label="上一张绿幕摄影" onClick={() => setIndex(value => (value - 1 + showcaseImages.length) % showcaseImages.length)}><ChevronLeft aria-hidden="true" /></button>
        <button type="button" aria-label="下一张绿幕摄影" onClick={() => setIndex(value => (value + 1) % showcaseImages.length)}><ChevronRight aria-hidden="true" /></button>
      </div></div>}
    </div></div>
  </div>;
}
