const BITMAP_EXTENSION = /\.(?:png|jpe?g)$/i;
const LOCAL_MEDIA_PREFIXES = ["/assets/", "/images/", "/toolbox/"];

/** Local optimized images only. Video sources and hosting settings stay unchanged. */
export function mediaUrl(source: string): string {
  if (!LOCAL_MEDIA_PREFIXES.some((prefix) => source.startsWith(prefix))) return source;
  return source.replace(BITMAP_EXTENSION, ".webp");
}
