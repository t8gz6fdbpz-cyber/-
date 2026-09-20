import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { PortfolioLink } from "../../routing";

const navItems = [
  { label: "首页", href: "/" },
  { label: "关于我", href: "/#about" },
  { label: "经历", href: "/#case-studies" },
  { label: "作品", href: "/#works-gallery" },
  { label: "技能", href: "/#skills" },
  { label: "兴趣", href: "/#interests" },
  { label: "联系", href: "/#contact" },
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
  const location = useLocation();

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
        setIsOpen(false);
        navRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
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
    <nav
      ref={navRef}
      aria-label="主导航"
      className={`floating-logo-nav notranslate${isOpen ? " is-open" : ""}`}
      translate="no"
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
          const willOpen = !isOpen;
          setIsOpen(willOpen);

          if (willOpen && event.detail === 0) {
            window.requestAnimationFrame(() => {
              navRef.current?.querySelector<HTMLElement>("a")?.focus();
            });
          }
        }}
      >
        <span>JW</span>
      </button>
      <div
        id="floating-logo-nav-panel"
        className="floating-logo-nav-links"
        aria-hidden={!isOpen}
      >
        {navItems.map((item) => {
          const url = new URL(item.href, window.location.origin);
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
              {item.label}
            </PortfolioLink>
          );
        })}
      </div>
    </nav>
  );
}
