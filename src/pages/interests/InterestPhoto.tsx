import type { LocalPhoto } from "../../data/interestDetails";
import { responsivePhotoSource } from "../../data/responsivePhotos";

/** Preserve personal photos' native framing; travel entries use a compact crop. */
export function InterestPhoto({
  photo,
  eager = false,
  nativeRatio = false,
  sizes = "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 44vw, 30vw",
}: {
  photo: LocalPhoto;
  eager?: boolean;
  nativeRatio?: boolean;
  sizes?: string;
}) {
  const responsive = photo.width && photo.width > 800 ? responsivePhotoSource(photo.src) : undefined;
  return (
    <div
      className={`life-photo life-photo--${photo.ratio}`}
      style={nativeRatio && photo.width && photo.height
        ? { aspectRatio: `${photo.width} / ${photo.height}` }
        : undefined}
    >
      <img
        src={photo.src}
        srcSet={responsive ? `${responsive} 800w, ${photo.src} ${photo.width}w` : undefined}
        sizes={responsive ? sizes : undefined}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}
