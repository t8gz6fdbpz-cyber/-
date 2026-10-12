"""Prepare the eight supplied interest photos without changing their content."""

from pathlib import Path
from PIL import Image, ImageOps

SOURCE_DIR = Path(r"D:\xwechat_files\wxid_cr85faeiv9oa22_fc30\temp\RWTemp\2026-10\9e20f478899dc29eb19741386f9343c8")
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public/images/interests/personal"
PHOTOS = {
    "fitness": "2d47ae1922ea8ca83e3e3de8c0a3e6c8.jpg",
    "climbing": "359b1054b9949d05a760e92bce61df7d.jpg",
    "hiking": "b583728927928ea52be45caed285a3fb.jpg",
    "cycling": "5e0ebe1a1737e30cf9c8bc998147b7fb.jpg",
    "swimming": "5b4fb4008deb17e00917f165e9ee5407.jpg",
    "badminton": "5e94a591f24dcd41a379cc8626495c1b.jpg",
    "singing-side": "bb2604cb861613c3ada0a52a0f251094.jpg",
    "singing-front": "e8ef5e4ef92d2f90d317d6aa2fc0b7db.jpg",
}

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
for name, filename in PHOTOS.items():
    with Image.open(SOURCE_DIR / filename) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        destination = OUTPUT_DIR / f"{name}.webp"
        image.save(destination, "WEBP", quality=88, method=6)
        print(f"{name}: {image.width}x{image.height}, {destination.stat().st_size} bytes")
