#!/usr/bin/env python3
"""Mixkit 무료 영상 목록(상업 사용·출처 표시 불필요 라이선스) — 배경 실사 영상 후보 찾기
사용: python3 -I mixkit.py <폴더> <키워드1> [키워드2 ...]   예: mixkit.py raw ocean night-sea sunset-ocean fishing-boat
→ 영상 ID·제목 목록 출력 + <폴더>/<ID>.mp4(360p 미리보기) 받기. 고른 뒤 720p 원본: https://assets.mixkit.co/videos/<ID>/<ID>-720.mp4
키워드는 mixkit.co/free-stock-video/<키워드>/ 주소의 영어 슬러그.
"""
import os, re, sys, urllib.request
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36'}
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
seen = {}
for kw in sys.argv[2:]:
    h = urllib.request.urlopen(urllib.request.Request(f'https://mixkit.co/free-stock-video/{kw}/', headers=UA), timeout=30).read().decode('utf-8', 'ignore')
    for m in re.finditer(r'https://assets\.mixkit\.co/videos/(\d+)/\1-360\.mp4', h):
        vid = m.group(1)
        if vid in seen: continue
        seg = h[max(0, m.start() - 3000): m.start() + 3000]
        t = re.findall(r'<h2[^>]*>\s*([^<]{4,90})\s*</h2>', seg) or re.findall(r'alt="([^"]{4,90})"', seg)
        seen[vid] = (kw, t[0].strip() if t else '?')
for vid, (kw, t) in seen.items():
    print(vid, kw, '|', t)
print(len(seen), 'videos — 미리보기는 필요한 ID만: curl -o', out + '/<ID>.mp4 https://assets.mixkit.co/videos/<ID>/<ID>-360.mp4')
