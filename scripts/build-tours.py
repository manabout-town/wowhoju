#!/usr/bin/env python3
"""research/products.json + research/pages/tours-detail.json → src/data/tours.json
사진: 대표(photo-index 또는 tour-img) + 갤러리(research/gallery → public/img/g-*).
사용: python3 scripts/build-tours.py  (갤러리 webp 변환은 node scripts/gallery.mjs 먼저)"""
import json, ast, re, os, urllib.parse

R = 'research'
prods = {p['url']: p for p in json.load(open(f'{R}/products.json'))['products']}
det = json.load(open(f'{R}/pages/tours-detail.json'))['tours']
pidx = {x['url']: x['slug'] for x in json.load(open(f'{R}/photo-index.json'))}

IDS = {  # 주소에 쓰는 짧은 이름 — 원래 사이트 주소의 한글 슬러그 대신
  '피너클스사막 선셋&별빛투어': 'pinnacles-sunset', '핑크호수+칼바리+피너클 투어 2박 3일': 'kalbarri-3d',
  '마가렛리버 1박 2일': 'margaret-2d', '마가렛리버 2박 3일': 'margaret-3d', '서호주 남부 3박 4일 투어-마가렛리버, 월폴, 알바니': 'south-4d',
  '마가렛리버와 버셀튼 제티 일일투어': 'margaret-busselton', '마가렛리버와 버셀튼 제티 일일투어 ': 'margaret-busselton', '웨이브락 어드벤처 투어': 'waverock', '캐버샴 야생공원 + 스완밸리 와이너리': 'caversham-swan',
  '퍼스 시티와 프리맨틀 투어': 'perth-fremantle', '로트네스트 섬 그랜드투어 (페리+기차+버스투어)': 'rottnest-grand', '피너클스사막 데이투어': 'pinnacles-day',
  '멍키마이어+핑크호수+칼바리+피너클스 3박 4일': 'monkeymia-4d', '10일 서호주 로드트립 – 퍼스출발 브룸도착': 'roadtrip-10d',
}
WD = '일월화수목금토'

def money(s):
    m = re.search(r'\$\s*([\d,]+)', s or '')
    v = int(m.group(1).replace(',', '')) if m else None
    return v if v else None

def weekdays(text):
    t = text or ''
    if '매일' in t: return list(range(7))
    found = {WD.index(c) for c in re.findall(r'([일월화수목금토])요일', t)}
    m = re.search(r'매주\s*([일월화수목금토,·/ 과와그리고]+)', t)
    if m: found |= {WD.index(c) for c in re.findall(r'(?:^|[,·/ 과와])\s*([일월화수목금토])(?=$|[,·/ 과와])', m.group(1))}
    m = re.match(r'\s*([일월화수목금토](?:\s*[,·/ ]\s*[일월화수목금토])+)', t)
    if m: found |= {WD.index(c) for c in re.findall('[일월화수목금토]', m.group(1))}
    return sorted(found)

def days_of(dur):
    d = dur or ''
    m = re.search(r'(\d+)\s*박\s*(\d+)\s*일', d) or re.search(r'(\d+)박(\d+)일', d)
    if m: return int(m.group(2))
    m = re.search(r'(\d+)\s*일', d)
    if m: return int(m.group(1))
    return 1

def cats(p, title):
    c = set()
    raw = ' '.join(p.get('categories', [])) if p else ''
    if 'full-day-tour' in raw: c.add('full-day')
    if '2-3' in raw: c.add('short')
    if 'bus-ferry' in raw or '로트네스트' in title: c.add('bus-ferry')
    if '울루루' in title or '울룰루' in title: c.add('uluru')
    if 'experiences' in raw or '에어벌룬' in title or '스카이 다이빙' in title: c.add('experience')
    if 'must-go' in raw: c.add('must-go')
    if 'how-to-enjoy-perth' in raw: c.add('perth100')
    return sorted(c)

DEST = [('피너클스', 'pinnacles'), ('피나클', 'pinnacles'), ('칼바리', 'kalbarri'), ('핑크', 'kalbarri'), ('마가렛', 'margaret'), ('버셀튼', 'margaret'), ('알바니', 'south'), ('월폴', 'south'),
        ('웨이브락', 'waverock'), ('로트네스트', 'rottnest'), ('프리맨틀', 'perth'), ('프리멘틀', 'perth'), ('퍼스', 'perth'), ('스완밸리', 'perth'), ('캐버샴', 'perth'), ('울루루', 'uluru'),
        ('멍키마이어', 'kalbarri'), ('에스페란스', 'south'), ('브룸', 'north'), ('자이언트', 'south'), ('돌고래', 'perth'), ('길포드', 'perth')]

def lines(s): return [x.strip() for x in (s or '').split('\n') if x.strip()]

def gslug(u):
    n = os.path.splitext(urllib.parse.unquote(u.split('/')[-1]))[0].lower()
    return 'g-' + re.sub(r'[^a-z0-9]+', '-', n).strip('-')

def hero_slug(p):
    u = (p or {}).get('heroImage')
    if not u: return None
    if u in pidx: return pidx[u]
    n = os.path.splitext(urllib.parse.unquote(u.split('/')[-1]))[0].lower()
    return 't-' + re.sub(r'[^a-z0-9]+', '-', n).strip('-')

out = []
for d in det:
    p = prods.get(d['url']) or next((v for v in prods.values() if v['title'].strip() == d['title'].strip()), None)
    title = d['title'].strip()
    sec = d.get('detailSections') or {}
    gal = d['gallery']; gal = ast.literal_eval(gal) if isinstance(gal, str) else (gal or [])
    gal_s = [gslug(u) for u in gal if os.path.exists(f"public/img/{gslug(u)}-800.webp")]
    photo = hero_slug(p)
    if not photo or not os.path.exists(f'public/img/{photo}-800.webp'): photo = gal_s[0] if gal_s else None
    avail = (d.get('availability') or '').replace('Availability :', '').strip()
    old_p = bool(p and p.get('note') and '확인 못 함' in p['note'])
    if old_p and avail == '매주 금요일 출발':  # 옛 상품 헤더에 남은 테마 템플릿 값 — 본문 기준으로
        avail = next((l for l in lines(sec.get('투어 출발일') or sec.get('출발/도착 시간') or '') if '출발' in l or '매일' in l or '문의' in l), '출발일 문의')
    dep_text = sec.get('투어 출발일') or sec.get('출발/도착 시간') or ''
    price = money(d.get('priceAdult')) or money(d.get('priceFromHeader'))
    child_raw = d.get('priceChild') or ''
    stops = []
    for it in d.get('itinerary') or []:
        stops.append({'t': it.get('title', '').strip(), 'd': lines(re.sub(r'[\U0001F000-\U0001FAFF☀-➿️]', '', it.get('desc', '')))})
    ad = d.get('availableDates'); ad = ast.literal_eval(ad) if isinstance(ad, str) and ad.startswith('{') else (ad if isinstance(ad, dict) else {})
    old = bool(p and p.get('note') and '확인 못 함' in p['note'])
    out.append({
        'id': IDS.get(title) or next((v for k, v in IDS.items() if k.replace(' ', '') == title.replace(' ', '')), f"t{d['id']}"), 'wp': int(d['id']), 'url': d['url'], 'title': title,
        'price': price, 'child': None if d['id'] in (10530, '10530', 7564, '7564') else money(child_raw),  # 원문 성인·아동가가 서로 다른 터미널·이용권 값이라 상담 확인으로
        'childNote': (re.search(r'\((.*?)\)', child_raw) or [None, None])[1],
        'priceText': lines(sec.get('가격') or sec.get('가격 안내')),
        'duration': (d.get('duration') or (p or {}).get('duration') or '').strip() or None, 'nDays': days_of(d.get('duration') or (p or {}).get('duration')),
        'avail': avail, 'weekdays': weekdays(dep_text) if old_p else (weekdays(avail) or weekdays(dep_text)), 'firstDate': (ad.get('first') or [None])[0], 'lastDate': (ad.get('last') or [None])[0],
        'from': d.get('departureLocation'), 'to': d.get('returnLocation'),
        'intro': lines(sec.get('여행 소개')), 'depart': lines(sec.get('출발/도착 장소') or sec.get('출발 장소')), 'times': lines(sec.get('출발/도착 시간') or sec.get('투어 출발일')),
        'included': lines(sec.get('포함 내역')), 'excluded': lines(sec.get('불포함 내역')), 'notes': lines(sec.get('참고 사항')) + lines(sec.get('유의 사항')),
        'bring': lines(sec.get('준비물') or sec.get('투어 준비물')), 'refund': lines(sec.get('환불 규정')),
        'stops': stops, 'photo': photo, 'gallery': gal_s, 'map': d.get('mapEmbed') if d.get('mapEmbed') not in (None, 'None') else None,
        'related': [], 'relatedUrls': (ast.literal_eval(d['relatedTours']) if isinstance(d.get('relatedTours'), str) else d.get('relatedTours')) or [],
        'cats': cats(p, title), 'dest': ['rottnest'] if '어드벤처 보트' in title or 'Adventure' in title else (sorted({k for w, k in DEST if w in title}) or ['perth']), 'home': str(d.get('onHomepage')) == 'True', 'old': old,
        'modified': (p or {}).get('wpModified'),
    })
byurl = {t['url']: t['id'] for t in out}
for t in out:
    t['related'] = [byurl[u] for u in t.pop('relatedUrls') if u in byurl]
json.dump(out, open('src/data/tours.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), 'tours,', sum(1 for t in out if t['photo']), 'with photo,', sum(len(t['gallery']) for t in out), 'gallery')
for t in out: print(t['id'], t['price'], t['child'], t['weekdays'], t['cats'], t['dest'], t['photo'], len(t['gallery']))
