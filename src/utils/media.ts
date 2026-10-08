const DEFAULT_MEDIA_ORIGIN =
  "https://wujiahao-media-1501873013.cos.ap-hongkong.myqcloud.com";
const MEDIA_KEY_PREFIX = "portfolio-v1--";
const LOCAL_MEDIA_PREFIXES = ["/assets/", "/images/", "/toolbox/"];
const BITMAP_EXTENSION = /\.(?:png|jpe?g)$/i;

const mediaOrigin = (
  import.meta.env.VITE_MEDIA_ORIGIN || DEFAULT_MEDIA_ORIGIN
).replace(/\/$/, "");

/**
 * Maps replaceable local media paths to the optimized, public COS objects.
 * Original source files stay in /public as an editing and replacement fallback.
 */
export function mediaUrl(source: string): string {
  if (
    !source ||
    /^(?:https?:)?\/\//i.test(source) ||
    source.startsWith("data:") ||
    source.startsWith("blob:") ||
    !LOCAL_MEDIA_PREFIXES.some((prefix) => source.startsWith(prefix))
  ) {
    return source;
  }

  const optimizedPath = source.replace(BITMAP_EXTENSION, ".webp");
  const objectKey = `${MEDIA_KEY_PREFIX}${optimizedPath
    .replace(/^\//, "")
    .replace(/\//g, "--")}`;

  return `${mediaOrigin}/${objectKey}`;
}

export const mediaOriginUrl = mediaOrigin;
