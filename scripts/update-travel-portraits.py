"""Install five recent, date-verified native portrait photos for the travel diary."""
from datetime import date
from io import BytesIO
from pathlib import Path
from urllib.parse import urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import html
import json
import re

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / 'public/images/interests/travel-recent'
SOURCES = [
    ('fujian', '福建', 'File:Xiamen 1.jpg', '2025-02-08', '厦门街巷夜景', 'H2v5o68z'),
    ('zhejiang', '浙江', 'File:Leifeng Pagoda and boat.jpg', '2025-07-06', '杭州西湖游船与雷峰塔', 'Takashishin'),
    ('shanghai', '上海', 'File:Shanghai Tower 20251126.jpg', '2025-11-26', '从古城公园望向上海中心大厦', 'Supanut Arunoprayote'),
    ('guizhou', '贵州', 'File:黄果树瀑布 2026-07-31 02.jpg', '2026-07-31', '黄果树瀑布竖幅全景', 'Kcx36'),
    ('chongqing', '重庆', 'File:Night in Chongqing (20250120 ~ Image 4).jpg', '2025-01-20', '重庆城市夜景', 'Fumikas Sagisavas'),
]

def fetch(url):
    request = Request(url, headers={'User-Agent': 'PortfolioPhotoResearch/1.0'})
    with urlopen(request, timeout=45) as response:
        return response.read()

def main():
    query = dict(action='query', titles='|'.join(s[2] for s in SOURCES), prop='imageinfo', iiprop='url|size|extmetadata', iiurlwidth=1200, iiurlheight=1800, format='json')
    evidence_path = ROOT / 'artifacts/interest-pages/portrait-source-evidence.json'
    result = json.loads(evidence_path.read_text(encoding='utf8')) if evidence_path.exists() else json.loads(fetch('https://commons.wikimedia.org/w/api.php?' + urlencode(query)))
    info_by_title = {p['title']: p['imageinfo'][0] for p in result['query']['pages'].values()}
    (ROOT / 'artifacts/interest-pages/portrait-source-evidence.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    records_path = ROOT / 'src/data/travelPhotoSources.json'
    records = json.loads(records_path.read_text(encoding='utf8'))
    for stem, place, title, expected_date, subject, author in SOURCES:
        info = info_by_title[title]
        meta = info['extmetadata']
        actual_date = meta['DateTimeOriginal']['value'][:10]
        assert actual_date == expected_date, (title, actual_date)
        assert date(2025, 1, 1) <= date.fromisoformat(actual_date) <= date(2026, 10, 10)
        assert info['height'] > info['width'] * 1.2, title
        license_name = meta['LicenseShortName']['value']
        assert license_name in ['CC0', 'CC BY 4.0', 'CC BY-SA 4.0'], license_name
        assert author in html.unescape(re.sub('<[^>]+>', '', meta['Artist']['value']))
        output = DESTINATION / f'{stem}-portrait-{actual_date}.webp'
        parsed = urlsplit(info.get('thumburl', info['url']))
        download_url = urlunsplit((parsed.scheme, parsed.netloc, parsed.path, '', ''))
        if not output.exists():
            with Image.open(BytesIO(fetch(download_url))) as original:
                camera_date = original.getexif().get(36867)
                if camera_date:
                    assert str(camera_date)[:10].replace(':', '-') == actual_date
                image = ImageOps.exif_transpose(original).convert('RGB')
                assert image.height > image.width * 1.2, title
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                options = dict(quality=86, method=6)
                if original.info.get('icc_profile'):
                    options['icc_profile'] = original.info['icc_profile']
                image.save(output, 'WEBP', **options)
        with Image.open(output) as image:
            width, height = image.size
        record = next(r for r in records if r['place'] == place)
        record.update(dict(src='/images/interests/travel-recent/' + output.name, subject=subject, sourceUrl=info['descriptionurl'], date=actual_date, author=author, license='CC0 1.0' if license_name == 'CC0' else license_name, licenseUrl=meta['LicenseUrl']['value'], width=width, height=height))
        print(json.dumps(dict(place=place, title=title, date=actual_date, width=width, height=height, bytes=output.stat().st_size), ensure_ascii=True), flush=True)
    records_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    # Generate matching credits from the same source records so assets and credits stay in sync.
    credits_path = ROOT / 'public/travel-image-info.html'
    credits = credits_path.read_text(encoding='utf8')
    items = []
    for r in records:
        items.append('      <li><a href="' + html.escape(r['sourceUrl'], quote=True) + '">' + html.escape(r['place'] + ' · ' + r['subject']) + '</a><br>摄影：' + html.escape(r['author']) + ' · 拍摄：' + r['date'] + ' · <a href="' + html.escape(r['licenseUrl'], quote=True) + '">' + r['license'] + '</a> · <a href="' + r['src'] + '">影像文件</a></li>')
    credits = re.sub(r'    <ol>[\s\S]*?    </ol>', '    <ol>\n' + '\n'.join(items) + '\n    </ol>', credits)
    credits_path.write_text(credits, encoding='utf8')

if __name__ == '__main__':
    main()
