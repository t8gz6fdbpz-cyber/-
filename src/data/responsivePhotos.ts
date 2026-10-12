/** Only shipped variants enter srcset. A newly replaced path falls back to its original. */
const responsivePhotos = new Set([
  "/images/interests/personal/badminton.webp",
  "/images/interests/personal/climbing.webp",
  "/images/interests/personal/cycling.webp",
  "/images/interests/personal/fitness.webp",
  "/images/interests/personal/hiking.webp",
  "/images/interests/personal/singing-front.webp",
  "/images/interests/personal/singing-side.webp",
  "/images/interests/personal/swimming.webp",
  "/images/interests/travel-recent/guangxi.webp",
  "/images/interests/travel-recent/henan.webp",
  "/images/interests/travel-recent/hainan.webp",
  "/images/interests/travel-recent/fujian-portrait-2025-02-08.webp",
  "/images/interests/travel-recent/zhejiang-portrait-2025-07-06.webp",
  "/images/interests/travel-recent/beijing.webp",
  "/images/interests/travel-recent/shanxi.webp",
  "/images/interests/travel-recent/shaanxi.webp",
  "/images/interests/travel-recent/shandong.webp",
  "/images/interests/travel-recent/tianjin.webp",
  "/images/interests/travel-recent/guizhou-portrait-2026-07-31.webp",
  "/images/interests/travel-recent/chongqing-portrait-2025-01-20.webp",
]);

export function responsivePhotoSource(source: string): string | undefined {
  return responsivePhotos.has(source) ? source.replace(/\.webp$/, ".responsive-800.webp") : undefined;
}
