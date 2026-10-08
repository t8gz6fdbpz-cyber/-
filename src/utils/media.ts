const DEFAULT_MEDIA_ORIGIN =
  "https://wujiahao-media-1501873013.cos.ap-hongkong.myqcloud.com";
const MEDIA_KEY_PREFIX = "portfolio-v1--";
const LOCAL_MEDIA_PREFIXES = ["/assets/", "/images/", "/toolbox/"];
const BITMAP_EXTENSION = /\.(?:png|jpe?g)$/i;

const mediaOrigin = (import.meta.env.VITE_MEDIA_ORIGIN || "").replace(/\/$/, "");

/**
 * Images use same-origin WebP files so EdgeOne caches and serves them alongside
 * the site. Large videos stay on COS. VITE_MEDIA_ORIGIN optionally opts images
 * back into the existing flat COS object layout.
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
  if (!mediaOrigin && !/\.mp4$/i.test(source)) return optimizedPath;
  const objectKey = `${MEDIA_KEY_PREFIX}${optimizedPath
    .replace(/^\//, "")
    .replace(/\//g, "--")}`;

  return `${mediaOrigin || DEFAULT_MEDIA_ORIGIN}/${objectKey}`;
}

export const mediaOriginUrl = mediaOrigin;
