"""Fetch seven verified recent Commons photographs and resize without grading.

The source descriptions' DateTimeOriginal field is checked against the shooting
dates reviewed on their Commons file pages. Upload timestamps are not used.
This script only creates new WebP assets; attribution is recorded separately in
public/images/interests/travel-recent/sources-part-a.json.
"""

from concurrent.futures import ThreadPoolExecutor
from datetime import date
from io import BytesIO
from pathlib import Path
from urllib.parse import urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import argparse
import json
import re
import sys

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "public/images/interests/travel-recent"
USER_AGENT = "TravelPhotoResearch/1.0 (public licensed portfolio landscape assets)"
SOURCES = [
    ("guangxi", "广西", "File:Guilin in September 2025.jpg", "2025-09-08"),
    ("henan", "河南", "File:Longmen Grottoes 30.03.2025.jpg", "2025-03-30"),
    ("hainan", "海南", "File:Ferry transport between Haikou and Xuwen 2025.jpg", "2025-07-29"),
    ("fujian", "福建", "File:鼓浪屿黄荣远堂.jpg", "2025-02-09"),
    ("zhejiang", "浙江", "File:West Lake, Hangzhou 2025.jpg", "2025-07-06"),
    ("shanghai", "上海", "File:Shanghai Skyline 2025.jpg", "2025-07-07"),
    ("beijing", "北京", "File:Die verbotene Stadt in Beijing.jpg", "2025-09-05"),
]


def fetch(url):
    with urlopen(Request(url, headers={"User-Agent": USER_AGENT}), timeout=45) as response:
        return response.read()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--resume", action="store_true", help="Keep this script's already-created assets")
    args = parser.parse_args()
    targets = [DESTINATION / f"{name}.webp" for name, *_ in SOURCES]
    for target in targets:
        if target.exists() and not args.resume:
            raise FileExistsError(f"Refusing to overwrite existing asset: {target}")

    query = urlencode({
        "action": "query",
        "titles": "|".join(source[2] for source in SOURCES),
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiurlwidth": 1600,
        "iiurlheight": 1600,
        "format": "json",
    })
    result = json.loads(fetch(f"https://commons.wikimedia.org/w/api.php?{query}"))
    source_info = {
        page["title"]: page["imageinfo"][0]
        for page in result["query"]["pages"].values()
    }
    DESTINATION.mkdir(parents=True, exist_ok=True)

    def convert(source):
        name, place, title, expected_date = source
        info = source_info[title]
        metadata = info["extmetadata"]
        actual_date = metadata["DateTimeOriginal"]["value"][:10]
        if actual_date != expected_date:
            raise ValueError(f"Shooting-date mismatch for {title}: {actual_date}")
        if not date(2024, 10, 10) <= date.fromisoformat(actual_date) <= date(2026, 10, 10):
            raise ValueError(f"Shooting date outside requested interval: {title}")
        if metadata["LicenseShortName"]["value"] not in ("CC0", "CC BY 4.0"):
            raise ValueError(f"Unexpected license: {title}")

        target = DESTINATION / f"{name}.webp"
        parsed_url = urlsplit(info.get("thumburl", info["url"]))
        download_url = urlunsplit((parsed_url.scheme, parsed_url.netloc, parsed_url.path, "", ""))
        cached = target.exists() and args.resume
        with Image.open(target if cached else BytesIO(fetch(download_url))) as original:
            exif = original.getexif()
            camera_date = exif.get(36867)
            if camera_date and str(camera_date)[:10].replace(":", "-") != actual_date:
                raise ValueError(f"EXIF shooting date disagrees for {title}: {camera_date}")
            image = ImageOps.exif_transpose(original)
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            image = image.convert("RGB")
            options = {"quality": 86, "method": 6}
            if original.info.get("icc_profile"):
                options["icc_profile"] = original.info["icc_profile"]
            if not cached:
                image.save(target, "WEBP", **options)
            return {
                "src": f"/images/interests/travel-recent/{name}.webp",
                "place": place,
                "sourceUrl": info["descriptionurl"],
                "downloadUrl": download_url,
                "date": actual_date,
                "dateEvidence": "Commons 文件说明中的拍摄日期" + ("，并与原图 EXIF DateTimeOriginal 一致" if camera_date else "；未使用上传日期"),
                "author": re.sub("<[^>]+>", "", metadata["Artist"]["value"]),
                "license": "CC0 1.0" if metadata["LicenseShortName"]["value"] == "CC0" else metadata["LicenseShortName"]["value"],
                "licenseUrl": metadata["LicenseUrl"]["value"],
                "width": image.width,
                "height": image.height,
                "originalWidth": info["width"],
                "originalHeight": info["height"],
                "changes": "等比例缩小至最长边 1600 像素并转为 WebP；未调色",
                "bytes": target.stat().st_size,
            }

    with ThreadPoolExecutor(max_workers=1) as executor:
        converted = list(executor.map(convert, SOURCES))
    print(json.dumps(converted, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
