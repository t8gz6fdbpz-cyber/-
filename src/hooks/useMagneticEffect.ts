import { useEffect, useRef } from "react";

type MagneticOptions = {
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
};

export function useMagneticEffect({
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}: MagneticOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      node.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    let frame = 0;
    let currentX = 0;
    let currentY = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        currentX = 0;
        currentY = 0;
        node.style.transition = inactiveTransition;
        node.style.transform = "translate3d(0px, 0px, 0px)";
        node.style.willChange = "transform";
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const left = rect.left - currentX;
      const top = rect.top - currentY;
      const right = left + rect.width;
      const bottom = top + rect.height;
      const withinBounds =
        event.clientX >= left - padding &&
        event.clientX <= right + padding &&
        event.clientY >= top - padding &&
        event.clientY <= bottom + padding;

      cancelAnimationFrame(frame);

      if (!withinBounds) {
        reset();
        return;
      }

      const centerX = left + rect.width / 2;
      const centerY = top + rect.height / 2;
      const translateX = (event.clientX - centerX) / strength;
      const translateY = (event.clientY - centerY) / strength;

      frame = window.requestAnimationFrame(() => {
        currentX = translateX;
        currentY = translateY;
        node.style.transition = activeTransition;
        node.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px)`;
        node.style.willChange = "transform";
      });
    };

    reset();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", reset);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", reset);
    };
  }, [activeTransition, inactiveTransition, padding, strength]);

  return ref;
}
