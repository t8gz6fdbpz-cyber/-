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

export function FloatingLogoNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerMove = (event: PointerEvent) => {
      const nav = navRef.current;
      if (!nav) return;

      const rect = nav.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      aria-label="主导航"
      className={`floating-logo-nav notranslate${isOpen ? " is-open" : ""}`}
      translate="no"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div className="floating-logo-nav-links">
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
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "关闭导航" : "打开导航"}
        className="floating-logo-nav-logo"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>JW</span>
      </button>
    </nav>
  );
}
