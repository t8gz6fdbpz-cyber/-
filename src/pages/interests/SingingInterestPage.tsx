import { useSiteReducedMotion } from "../../motion/MotionPreference";
import { motion, } from "framer-motion";

import { singingPhotos } from "../../data/interestDetails";
import { InterestPageFrame } from "./InterestPageFrame";
import { InterestPhoto } from "./InterestPhoto";

export function SingingInterestPage() {
  const reduceMotion = useSiteReducedMotion();

  return (
    <InterestPageFrame active="singing">
      <div className="singing-book">
        <motion.header
          className="singing-hero life-section-hero"
          initial={reduceMotion ? false : { opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1>在声音里，<br />找到自己的位置</h1>
          <p>
            唱歌像一次缓慢的校准：先听见呼吸，再听见情绪，最后让声音自然抵达更远的地方。
          </p>
        </motion.header>
        <div className="singing-photo-grid" aria-label="舞台演唱照片">
          {singingPhotos.map((item) => (
            <figure key={item.label}>
              <InterestPhoto photo={item.photo} nativeRatio eager
                sizes="(max-width: 760px) calc(100vw - 40px), 64vw" />
              <figcaption>
                <h2>{item.label}</h2>
                <p>{item.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </InterestPageFrame>
  );
}
