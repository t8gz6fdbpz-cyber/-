import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "首页", href: "#" },
  { label: "工作经历", href: "#growth-systems" },
  { label: "作品", href: "#projects" },
  { label: "爱好", href: "#philosophy" },
  { label: "联系我", href: "#contact" },
];

export function FloatingLogoNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

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
      aria-label="Primary"
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
        {navItems.map((item) => (
          <a key={item.href} href={item.href} tabIndex={isOpen ? 0 : -1}>
            {item.label}
          </a>
        ))}
      </div>
      <button
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        className="floating-logo-nav-logo"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>JW</span>
      </button>
    </nav>
  );
}
