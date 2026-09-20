import { motion, useReducedMotion } from "framer-motion";

import { travelRecords } from "../../data/interestDetails";
import { InterestPageFrame } from "./InterestPageFrame";

export function TravelInterestPage() {
  const reduceMotion = useReducedMotion();

  return (
    <InterestPageFrame active="travel">
      <div className="travel-notes">
        <motion.header
          className="travel-hero"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="life-eyebrow">02 / 在路上</p>
          <h1>旅行札记</h1>
          <p>记住的往往不是行程，而是一阵风、一条街，或一座城市不经意显出的节奏。</p>
          <span>十三处停留，十三种观看</span>
        </motion.header>

        <ol className="travel-stream">
          {travelRecords.map((item, index) => (
            <li
              key={item.place}
              className={`travel-entry travel-entry--${(index % 5) + 1}`}
            >
              <figure>
                <div className={`life-photo life-photo--${item.photo.ratio}`}>
                  <img
                    src={item.photo.src}
                    alt={item.photo.alt}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{item.place}</h2>
                  <p>{item.story}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </InterestPageFrame>
  );
}
