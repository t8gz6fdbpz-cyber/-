import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DetailBackLink } from "../routing";
import {
  useSequentialInterestNavigation,
  type SequentialDirection,
} from "../hooks/useSequentialInterestNavigation";
import { getInterest } from "../utils/interestsData";
import { ReadingInterestPage } from "./interests/ReadingInterestPage";
import { useNearbyImageLoading } from "../hooks/useNearbyImageLoading";
import { SingingInterestPage } from "./interests/SingingInterestPage";
import { SportsInterestPage } from "./interests/SportsInterestPage";
import { TravelInterestPage } from "./interests/TravelInterestPage";
import "../styles/interest-details.css";

const interestSequence = ["sports", "travel", "singing", "reading"] as const;

type SequentialNavigationState = {
  fromHomeKey?: string;
  interestSequenceDepth?: number;
  interestSequenceEntry?: boolean;
  interestSequenceDirection?: SequentialDirection;
};

export function InterestPage({ slug }: { slug: string }) {
  useNearbyImageLoading(slug, ".interest-route-stage");
  const interest = getInterest(slug);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [transitionDirection, setTransitionDirection] =
    useState<SequentialDirection | null>(null);
  const navigationTimer = useRef<number | null>(null);
  const sequenceIndex = interestSequence.findIndex((item) => item === slug);
  const previousSlug = sequenceIndex > 0
    ? interestSequence[sequenceIndex - 1]
    : undefined;
  const nextSlug = sequenceIndex >= 0
    ? interestSequence[sequenceIndex + 1]
    : undefined;
  const routeState = (location.state ?? {}) as SequentialNavigationState;

  useEffect(
    () => () => {
      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }
    },
    [],
  );

  const navigateInSequence = useCallback((direction: SequentialDirection) => {
    const destination = direction === "forward" ? nextSlug : previousSlug;
    if (!destination) return;

    setTransitionDirection(direction);

    navigationTimer.current = window.setTimeout(
      () => {
        navigate(`/interests/${destination}`, {
          state: {
            ...routeState,
            interestSequenceDepth: (routeState.interestSequenceDepth ?? 0) + 1,
            interestSequenceEntry: true,
            interestSequenceDirection: direction,
          } satisfies SequentialNavigationState,
        });
      },
      reduceMotion ? 20 : 320,
    );
  }, [navigate, nextSlug, previousSlug, reduceMotion, routeState]);

  useSequentialInterestNavigation({
    canNavigateBackward: Boolean(previousSlug),
    canNavigateForward: Boolean(nextSlug),
    entryDirection: routeState.interestSequenceEntry
      ? routeState.interestSequenceDirection ?? "forward"
      : null,
    onNavigate: navigateInSequence,
  });

  if (!interest) {
    return (
      <section className="portfolio-page-shell">
        <div className="portfolio-page-header">
          <DetailBackLink
            fallback="/#interests"
            className="portfolio-back-link"
          >
            <ArrowLeft aria-hidden="true" />
            返回
          </DetailBackLink>
          <h1>Interest not found</h1>
          <p>这个兴趣页面还没有建立。</p>
        </div>
      </section>
    );
  }

  const page = (() => {
    switch (interest.id) {
      case "sports":
        return <SportsInterestPage />;
      case "travel":
        return <TravelInterestPage />;
      case "singing":
        return <SingingInterestPage />;
      case "reading":
        return <ReadingInterestPage />;
    }
  })();

  return (
    <div className={`interest-route-stage interest-route-stage--${interest.id}`}>
      <motion.div
        className={`interest-route-stage__content${transitionDirection ? " is-leaving" : ""}`}
        initial={
          reduceMotion || !routeState.interestSequenceEntry
            ? false
            : {
                opacity: 0.45,
                y: routeState.interestSequenceDirection === "backward" ? -28 : 28,
              }
        }
        animate={
          transitionDirection
            ? {
                opacity: reduceMotion ? 1 : 0.28,
                y: reduceMotion ? 0 : transitionDirection === "forward" ? -28 : 28,
              }
            : { opacity: 1, y: 0 }
        }
        transition={{
          duration: reduceMotion ? 0 : transitionDirection ? 0.3 : 0.4,
          ease: transitionDirection ? [0.4, 0, 1, 1] : [0.22, 1, 0.36, 1],
        }}
      >
        {page}
      </motion.div>
    </div>
  );
}
