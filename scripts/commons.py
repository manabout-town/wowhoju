#!/usr/bin/env python3
"""위키미디어 공용(Commons) 실사 사진 찾기·받기 — 누끼용 소품(생선·새·꽃·배 등)
사용:
  python3 -I commons.py search "<검색어>" <저장폴더> [개수=8]   → 미리보기 받고 번호·라이선스 출력
  python3 -I commons.py get "<File:제목>" <키> <저장폴더>         → 1600폭 원본 받고 credits.json에 저작자·라이선스 추가
라이선스: CC BY·CC BY-SA·CC0·Public domain만 쓰고, 푸터에 저작자·라이선스·링크를 남길 것(CC BY-SA는 같은 조건).
"""
import json, os, re, sys, urllib.parse, urllib.request
UA = {'User-Agent': 'HnH-research/1.0 (gurbsl12@naver.com)'}
API = 'https://commons.wikimedia.org/w/api.php?'

def call(params):
    return json.loads(urllib.request.urlopen(urllib.request.Request(API + urllib.parse.urlencode({**params, 'format': 'json'}), headers=UA), timeout=30).read())

def fetch(url, path):
    open(path, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read())

def search(q, out, n=8):
    os.makedirs(out, exist_ok=True)
    d = call({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': n, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 600})
    for i, p in enumerate((d.get('query', {}).get('pages', {}) or {}).values()):
        ii = p['imageinfo'][0]
        lic = ii.get('extmetadata', {}).get('LicenseShortName', {}).get('value', '')
        fetch(ii['thumburl'], f'{out}/{i:02d}.jpg')
        print(f'{i:02d}', lic, '|', p['title'])

def get(title, key, out):
    os.makedirs(out, exist_ok=True)
    d = call({'action': 'query', 'titles': title, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 1600})
    ii = list(d['query']['pages'].values())[0]['imageinfo'][0]
    fetch(ii['thumburl'], f'{out}/{key}.jpg')
    m = ii.get('extmetadata', {})
    art = re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip()
    cpath = f'{out}/credits.json'
    cr = json.load(open(cpath)) if os.path.exists(cpath) else []
    cr = [c for c in cr if c['key'] != key] + [{'key': key, 'title': title, 'license': m.get('LicenseShortName', {}).get('value', ''), 'artist': art, 'page': ii['descriptionurl']}]
    json.dump(cr, open(cpath, 'w'), ensure_ascii=False, indent=1)
    print(key, cr[-1]['license'], art[:40])

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'search': search(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 8)
    elif cmd == 'get': get(sys.argv[2], sys.argv[3], sys.argv[4])
