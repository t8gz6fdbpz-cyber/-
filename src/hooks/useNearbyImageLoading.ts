import { useEffect } from "react";

/** Start existing detail photos ~two viewports early without changing their sources. */
export function useNearbyImageLoading(routeKey: string, scopeSelector: string) {
  useEffect(() => {
    const scope = document.querySelector(scopeSelector);
    if (!scope || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const image = entry.target as HTMLImageElement;
        image.loading = "eager";
        observer.unobserve(image);
      }
    }, { rootMargin: "2000px 0px" });
    // ViewportImage manages its own source; dynamic evidence keeps its own loader.
    scope.querySelectorAll<HTMLImageElement>('img[loading="lazy"][src]').forEach(image => observer.observe(image));
    return () => observer.disconnect();
  }, [routeKey, scopeSelector]);
}
