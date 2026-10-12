"""Download six date-verified Commons photos; only resize and encode WebP."""
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import json
import subprocess

from PIL import Image, ImageOps

TARGET = Path(__file__).resolve().parents[1] / "public/images/interests/travel-recent"
PHOTOS = [
    ("shanxi", "五台延庆寺大佛殿2025.4.jpg"),
    ("shaanxi", "Xi'An Bell Tower 2025.jpg"),
    ("shandong", "20250518 Nanchangshan, Shandong 03.jpg"),
    ("tianjin", "天津海河夜景20250816.jpg"),
    ("guizhou", "黄果树瀑布(2025年8月).jpg"),
    ("chongqing", "Chongqing Skyline At Night.png"),
]
ORIGINAL_URLS = {
    "shanxi": "https://upload.wikimedia.org/wikipedia/commons/5/5a/%E4%BA%94%E5%8F%B0%E5%BB%B6%E5%BA%86%E5%AF%BA%E5%A4%A7%E4%BD%9B%E6%AE%BF2025.4.jpg",
    "shaanxi": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Xi%27An_Bell_Tower_2025.jpg",
    "shandong": "https://upload.wikimedia.org/wikipedia/commons/a/a8/20250518_Nanchangshan%2C_Shandong_03.jpg",
    "tianjin": "https://upload.wikimedia.org/wikipedia/commons/c/c0/%E5%A4%A9%E6%B4%A5%E6%B5%B7%E6%B2%B3%E5%A4%9C%E6%99%AF20250816.jpg",
    "guizhou": "https://upload.wikimedia.org/wikipedia/commons/6/60/%E9%BB%84%E6%9E%9C%E6%A0%91%E7%80%91%E5%B8%83%282025%E5%B9%B48%E6%9C%88%29.jpg",
    "chongqing": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Chongqing_Skyline_At_Night.png",
}


def get(url):
    return subprocess.run(["curl.exe", "--fail", "--silent", "--show-error", "--max-time", "30", url], check=True, capture_output=True).stdout


def download(photo):
    stem, filename = photo
    original_url = ORIGINAL_URLS[stem]
    path = original_url.split("/commons/", 1)[1]
    encoded_filename = path.rsplit("/", 1)[1]
    info = {"url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/" + path + "/1280px-" + encoded_filename}
    with Image.open(BytesIO(get(info["url"]))) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        original_size = image.size
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        output = TARGET / (stem + ".webp")
        if output.exists():
            raise FileExistsError(output)
        image.save(output, format="WEBP", quality=86, method=6)
        print(json.dumps({"id": stem, "width": image.width, "height": image.height, "originalWidth": original_size[0], "originalHeight": original_size[1], "bytes": output.stat().st_size, "imageUrl": info["url"]}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    TARGET.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=2) as executor:
        list(executor.map(download, PHOTOS))
