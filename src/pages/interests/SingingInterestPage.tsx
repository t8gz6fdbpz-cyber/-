import { motion, useReducedMotion } from "framer-motion";

import { singingPhotos } from "../../data/interestDetails";
import { InterestPageFrame } from "./InterestPageFrame";

export function SingingInterestPage() {
  const reduceMotion = useReducedMotion();

  return (
    <InterestPageFrame active="singing">
      <div className="singing-book">
        <header className="singing-hero">
          <motion.div
            className="singing-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="life-eyebrow">03 / 声音与表达</p>
            <h1>在声音里，<br />找到自己的位置</h1>
            <p>
              唱歌像一次缓慢的校准：先听见呼吸，再听见情绪，最后让声音自然抵达更远的地方。
            </p>
            <div className="singing-meter" aria-hidden="true">
              {Array.from({ length: 13 }, (_, index) => <span key={index} />)}
            </div>
          </motion.div>

          <PhotoPlaceholder item={singingPhotos[0]} className="singing-main-photo" eager />
        </header>

        <section className="singing-rehearsal" aria-labelledby="singing-rehearsal-title">
          <div className="singing-side-copy">
            <p>BREATH / REHEARSAL / STAGE</p>
            <h2 id="singing-rehearsal-title">留给舞台的几个位置</h2>
            <p>这里不记录成绩，只保留声音发生时的光线、距离和身体状态。</p>
          </div>
          <PhotoPlaceholder item={singingPhotos[1]} className="singing-side-a" />
          <PhotoPlaceholder item={singingPhotos[2]} className="singing-side-b" />
        </section>

        <PhotoPlaceholder item={singingPhotos[3]} className="singing-banner-photo" />
      </div>
    </InterestPageFrame>
  );
}

function PhotoPlaceholder({
  item,
  className,
  eager = false,
}: {
  item: (typeof singingPhotos)[number];
  className: string;
  eager?: boolean;
}) {
  return (
    <figure className={className}>
      <div className={`life-photo life-photo--${item.photo.ratio}`}>
        <img src={item.photo.src} alt={item.photo.alt} loading={eager ? "eager" : "lazy"} />
      </div>
      <figcaption>
        <span>{item.label} · {item.photo.replacementNote}</span>
        <p>{item.note}</p>
      </figcaption>
    </figure>
  );
}
