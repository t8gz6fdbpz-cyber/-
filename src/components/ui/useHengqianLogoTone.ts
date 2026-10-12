import { useEffect, useState, type RefObject } from "react";

/** Match the surface crossing the fixed logo's center, never photograph pixels. */
export function useHengqianLogoTone(enabled: boolean, navRef: RefObject<HTMLElement>) {
  const [tone, setTone] = useState("#f3f1e8");
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const page = document.querySelector<HTMLElement>(".hengqian-case");
      const logo = navRef.current?.querySelector(".floating-logo-nav-logo");
      if (!page || !logo) return;
      const box = logo.getBoundingClientRect();
      const y = box.top + box.height / 2;
      const palette = getComputedStyle(page);
      let next = palette.getPropertyValue("--hq-paper").trim();
      for (const surface of page.querySelectorAll<HTMLElement>("[data-logo-surface]")) {
        const bounds = surface.getBoundingClientRect();
        if (bounds.top <= y && bounds.bottom > y) {
          next = surface.dataset.logoSurface === "green"
            ? palette.getPropertyValue("--hq-green").trim()
            : getComputedStyle(surface).backgroundColor;
        }
      }
      setTone(previous => previous === next ? previous : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The route is lazy loaded; catch both its initial mount and image reflow.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled, navRef]);
  return enabled ? tone : undefined;
}
