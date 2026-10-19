import { useSiteReducedMotion } from "../../motion/MotionPreference";
import { motion, } from "framer-motion";
import { Info } from "lucide-react";

import { travelRecords } from "../../data/interestDetails";
import { InterestPageFrame } from "./InterestPageFrame";
import { InterestPhoto } from "./InterestPhoto";

export function TravelInterestPage() {
  const reduceMotion = useSiteReducedMotion();
  const renderEntry = (item: (typeof travelRecords)[number], index: number) => (
    <li key={item.place} className="travel-entry">
      <figure>
        <InterestPhoto photo={item.photo} nativeRatio eager={index < 2}
          sizes={index === 0 ? "(max-width: 760px) calc(100vw - 40px), 60vw" : undefined} />
        <figcaption>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h2>{item.place}</h2>
          <p>{item.story}</p>
        </figcaption>
      </figure>
    </li>
  );

  return (
    <InterestPageFrame active="travel">
      <div className="travel-notes">
        <motion.header
          className="travel-hero life-section-hero"
          initial={reduceMotion ? false : { opacity: 0.8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>旅行日记</h1>
          <p>记住的往往不是行程，而是一阵风、一条街，或一座城市不经意显出的节奏。</p>
        </motion.header>

        <ol className="travel-opening" aria-label="旅行日记开篇" role="list">
          {travelRecords.slice(0, 2).map(renderEntry)}
        </ol>
        <ol className="travel-stream" start={3} aria-label="沿途影像" role="list">
          {travelRecords.slice(2).map((item, index) => renderEntry(item, index + 2))}
        </ol>
        <div className="travel-image-info">
          <a href="/travel-image-info.html" aria-label="查看影像署名" title="影像署名">
            <Info aria-hidden="true" size={18} />
          </a>
        </div>
      </div>
    </InterestPageFrame>
  );
}
