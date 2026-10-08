import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

type ViewportImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  preloadMargin?: string;
};

/** Starts nearby images before entry and reveals them only after decoding. */
export function ViewportImage({
  src,
  srcSet,
  className = "",
  loading = "lazy",
  preloadMargin = "900px 600px",
  onLoad,
  ...props
}: ViewportImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [requested, setRequested] = useState(loading === "eager");
  const [decodedSource, setDecodedSource] = useState<string>();

  useEffect(() => {
    const image = ref.current;
    if (!image || requested) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRequested(true);
      observer.disconnect();
    }, { rootMargin: preloadMargin });
    observer.observe(image);
    return () => observer.disconnect();
  }, [requested, preloadMargin]);

  return (
    <img
      {...props}
      ref={ref}
      src={requested ? src : undefined}
      srcSet={requested ? srcSet : undefined}
      loading="eager"
      decoding="async"
      className={`viewport-image ${className}`}
      data-decoded={decodedSource === src}
      onLoad={(event) => {
        const image = event.currentTarget;
        image.decode().catch(() => undefined).then(() => setDecodedSource(src));
        onLoad?.(event);
      }}
    />
  );
}
