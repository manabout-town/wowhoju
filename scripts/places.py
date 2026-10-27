#!/usr/bin/env python3
"""실존 가게 지도 데이터 수집(카카오맵·네이버 플레이스) — 로그인 없이 공개 응답만
사용:
  python3 -I places.py kakao-search "<상호>" <저장폴더>          → 지점별 카카오 ID·좌표·별점·리뷰 수(kakao.json)
  python3 -I places.py kakao-photos <카카오ID> <저장폴더> [개수=30] → MYSTORE(매장주 제공) 우선 사진 받기
  python3 -I places.py naver-photos <네이버ID> <저장폴더> [개수=40] → 업체 사진(ChatGPT/Gemini 파일명 제외) 받고 names.txt
주의: 크롬 확장은 네이버 플레이스를 막음 → curl/urllib로. 방문자 사진은 손님 저작물이라 '방문자 사진' 표기 필수.
"""
import json, os, re, sys, urllib.parse, urllib.request
KH = {'pf': 'web', 'Referer': 'https://place.map.kakao.com/', 'Origin': 'https://place.map.kakao.com', 'User-Agent': 'Mozilla/5.0'}
MUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

def get(url, headers):
    return urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30).read()

def kakao_search(q, out):
    os.makedirs(out, exist_ok=True)
    res = []
    for page in (1, 2, 3):
        u = 'https://search.map.kakao.com/mapsearch/map.daum?' + urllib.parse.urlencode({'q': q, 'msFlag': 'A', 'sort': 0, 'page': page})
        d = json.loads(get(u, {'Referer': 'https://map.kakao.com/', 'User-Agent': 'Mozilla/5.0'}))
        res += d.get('place', []) or []
    seen = {p['confirmid']: p for p in res}
    rows = [{'kakaoId': p['confirmid'], 'name': p['name'], 'lat': float(p['lat']), 'lng': float(p['lon']), 'rating': p.get('rating_average'), 'ratingCount': p.get('rating_count'), 'blog': p.get('reviewCount'), 'address': (p.get('new_address_disp') or p.get('address') or '').replace('|', ' ').strip()} for p in seen.values()]
    json.dump(rows, open(f'{out}/kakao.json', 'w'), ensure_ascii=False, indent=1)
    for r in rows: print(r['kakaoId'], r['name'], r['lat'], r['lng'], r['rating'], r['blog'])

def kakao_photos(cid, out, n=30):
    os.makedirs(out, exist_ok=True)
    d = json.loads(get(f'https://place-api.map.kakao.com/places/panel3/{cid}', KH))
    json.dump(d, open(f'{out}/panel3-{cid}.json', 'w'), ensure_ascii=False)
    pri = {'MYSTORE': 0, 'CP': 1, 'KMAPREVIEW': 2, 'POI': 3, 'BLOG': 4}
    ph = sorted((d.get('photos') or {}).get('photos', []), key=lambda x: pri.get(x['type'], 9))
    k = 0
    for x in ph[:n]:
        try:
            open(f'{out}/{cid}-{k:02d}-{x["type"]}.jpg', 'wb').write(get(x['url'].replace('http://', 'https://'), {'User-Agent': 'Mozilla/5.0', 'Referer': 'https://place.map.kakao.com/'})); k += 1
        except Exception: pass
    print(cid, k, 'photos', (d.get('photos') or {}).get('counts'))

def naver_photos(nid, out, n=40):
    os.makedirs(out, exist_ok=True)
    h = get(f'https://m.place.naver.com/restaurant/{nid}/photo', {'User-Agent': MUA}).decode('utf-8', 'ignore').replace('\\u002F', '/')
    us = list(dict.fromkeys(re.findall(r'https://ldb-phinf\.pstatic\.net/[0-9_]+/[^"\\&\s]+', h) + [urllib.parse.unquote(m) for m in re.findall(r'src=(https%3A%2F%2Fldb-phinf[^"&\s]+)', h)]))
    names, k = [], 0
    for u in us:
        nm = urllib.parse.unquote(urllib.parse.unquote(u.split('/')[-1]), encoding='euc-kr', errors='ignore')
        if re.search('ChatGPT|Gemini|DALL', nm) or u.lower().endswith(('.gif', '.png')): continue  # AI 생성·움짤 제외
        if k >= n: break
        try:
            open(f'{out}/{nid}-{k:02d}.jpg', 'wb').write(get(u, {'User-Agent': 'Mozilla/5.0', 'Referer': 'https://m.place.naver.com/'})); names.append(f'{k:02d} {nm}'); k += 1
        except Exception: pass
    open(f'{out}/{nid}-names.txt', 'w').write('\n'.join(names))
    print(nid, k, 'photos (파일명 목록 names.txt — 같은 촬영 시리즈가 여러 지점에 재사용되는지 확인)')

if __name__ == '__main__':
    c = sys.argv[1]
    if c == 'kakao-search': kakao_search(sys.argv[2], sys.argv[3])
    elif c == 'kakao-photos': kakao_photos(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 30)
    elif c == 'naver-photos': naver_photos(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 40)
