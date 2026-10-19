import { useSiteReducedMotion } from "../../motion/MotionPreference";
import { useEffect, useRef, useState } from "react";
import { motion, } from "framer-motion";
import { useLocation } from "react-router-dom";

import { PortfolioLink } from "../../routing";
import { AnimatedMonogram } from "./AnimatedMonogram";
import { useHengqianLogoTone } from "./useHengqianLogoTone";
import "./FloatingLogoNav.css";

// The reference site's Webflow actions use these exact easing functions.
const outBack = (value: number) => 1 + 2.70158 * (value - 1) ** 3 + 1.70158 * (value - 1) ** 2;
const outQuad = (value: number) => 1 - (1 - value) ** 2;
const inOutQuad = (value: number) => value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2;
const referenceEase = (value: number) => -2.75 * value ** 5 + 11 * value ** 4 - 15.5 * value ** 3 + 8 * value ** 2 + 0.25 * value;

const navItems = [
  { label: "首页", href: "/" },
  { label: "履历", href: "/#case-studies" },
  { label: "兴趣", href: "/#interests" },
];

const hiddenInterestRoutes = new Set([
  "/interests/sports",
  "/interests/travel",
  "/interests/singing",
  "/interests/reading",
]);

export function FloatingLogoNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useSiteReducedMotion();
  const [extent, setExtent] = useState({ width: 80, height: 80, compact: false });
  const location = useLocation();
  const markTone = useHengqianLogoTone(location.pathname.replace(/\/$/, "") === "/cases/hengqian", navRef);

  useEffect(() => {
    const links = linksRef.current;
    if (!links) return;
    const measure = () => {
      const compact = window.matchMedia("(max-width: 767px)").matches;
      const width = compact ? 200 : Math.min(links.scrollWidth + 80, window.innerWidth - 40);
      const height = compact ? links.scrollHeight + 100 : 80;
      setExtent(previous => previous.width === width && previous.height === height && previous.compact === compact
        ? previous : { width, height, compact });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(links);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const nav = navRef.current;
      if (nav && !nav.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (hiddenInterestRoutes.has(location.pathname.replace(/\/$/, ""))) {
    return null;
  }

  return (
    <motion.nav
      ref={navRef}
      aria-label="主导航"
      className={`floating-logo-nav floating-logo-nav--reference notranslate${isOpen ? " is-open" : ""}`}
      translate="no"
      initial={false}
      animate={{ width: isOpen ? extent.width : extent.compact ? 60 : 80, height: isOpen ? extent.height : extent.compact ? 60 : 80 }}
      transition={{
        duration: reduceMotion ? 0 : isOpen ? extent.compact ? 0.3 : 0.25 : 0.2,
        delay: !reduceMotion && extent.compact && !isOpen ? 0.1 : 0,
        ease: isOpen ? outBack : extent.compact ? referenceEase : outQuad,
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch" && window.matchMedia("(min-width: 992px) and (hover: hover)").matches) setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch" && window.matchMedia("(min-width: 992px) and (hover: hover)").matches) setIsOpen(false);
      }}
      onFocus={(event) => {
        if (event.target.matches(":focus-visible")) setIsOpen(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        aria-controls="floating-logo-nav-panel"
        aria-expanded={isOpen}
        aria-label={isOpen ? "关闭导航" : "打开导航"}
        className="floating-logo-nav-logo"
        type="button"
        onClick={(event) => {
          if (event.detail === 0) {
            setIsOpen(true);
            window.requestAnimationFrame(() => {
              navRef.current?.querySelector<HTMLElement>("a")?.focus();
            });
          } else if (!window.matchMedia("(min-width: 992px) and (hover: hover)").matches) {
            setIsOpen(previous => !previous);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
            window.requestAnimationFrame(() => navRef.current?.querySelector<HTMLElement>("a")?.focus());
          }
        }}
      >
        <motion.div
          className="floating-logo-nav-mark"
          initial={false}
          animate={{ width: isOpen && !extent.compact ? 54 : extent.compact ? 60 : 80, height: isOpen && !extent.compact ? 54 : extent.compact ? 60 : 80, scale: extent.compact && isOpen ? 0.75 : 1 }}
          transition={{
            duration: reduceMotion ? 0 : extent.compact ? 0.2 : 0.1,
            delay: !reduceMotion && extent.compact && !isOpen ? 0.1 : 0,
            ease: extent.compact ? isOpen ? outBack : referenceEase : isOpen ? inOutQuad : outQuad,
          }}
        >
          <AnimatedMonogram active={isOpen} reducedMotion={Boolean(reduceMotion)} tone={markTone} />
        </motion.div>
      </button>
      <motion.div
        ref={linksRef}
        id="floating-logo-nav-panel"
        className="floating-logo-nav-links"
        aria-hidden={!isOpen}
        initial={false}
        animate={{ opacity: extent.compact && !isOpen ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : isOpen ? 0.4 : 0.2, ease: referenceEase }}
      >
        {navItems.map((item) => {
          const url = new URL(item.href, typeof window === "undefined"
            ? "https://www.wujiahao.top" : window.location.origin);
          const isCurrent =
            location.pathname === url.pathname &&
            location.hash === url.hash;

          return (
            <PortfolioLink
              key={item.href}
              to={item.href}
              aria-current={isCurrent ? "page" : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
            >
              <svg className="floating-logo-nav-arrow" viewBox="0 0 8 8" aria-hidden="true">
                <path d="M7.5625 3.22427C8.14583 3.56904 8.14583 4.43096 7.5625 4.77573L2.3125 7.87866C1.72917 8.22343 1 7.79246 1 7.10293V0.897074C1 0.207534 1.72917 -0.223427 2.3125 0.121342Z" fill="currentColor" />
              </svg>
              {item.label}
            </PortfolioLink>
          );
        })}
      </motion.div>
    </motion.nav>
  );
}
