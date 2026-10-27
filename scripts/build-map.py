#!/usr/bin/env python3
"""실제 지도 → src/home/mapData.ts
해안선: Natural Earth 10m admin-1 「Western Australia」(퍼블릭 도메인) — research/map/wa_10m.json
경로선: OSRM 데모 서버 주행 경로(도로 데이터 © OpenStreetMap contributors, ODbL) — research/map/osrm-*.json
다시 받기: README 대신 이 파일 위 주석의 URL(github nvkelso/natural-earth-vector, router.project-osrm.org)"""
import json, math

LNG0, LNG1, LAT0, LAT1 = 112.8, 120.2, -24.8, -35.4
COS = math.cos(math.radians(30))
W = 400
K = W / ((LNG1 - LNG0) * COS)
H = round((LAT0 - LAT1) * K)

def proj(lng, lat):
    return ((lng - LNG0) * COS * K, (LAT0 - lat) * K)

def dp(pts, tol):  # Douglas-Peucker
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy) or 1e-9
    i, dmax = 0, -1
    for j in range(1, len(pts) - 1):
        d = abs(dy * pts[j][0] - dx * pts[j][1] + x2 * y1 - y2 * x1) / L
        if d > dmax: i, dmax = j, d
    if dmax <= tol: return [pts[0], pts[-1]]
    return dp(pts[:i + 1], tol)[:-1] + dp(pts[i:], tol)

def d_of(pts, close=False):
    s = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    return s + (' Z' if close else '')

wa = json.load(open('research/map/wa_10m.json'))
land = []
for poly in wa['geometry']['coordinates']:
    ring = [proj(*c) for c in poly[0]]
    xs, ys = [p[0] for p in ring], [p[1] for p in ring]
    if max(xs) < -20 or min(xs) > W + 20 or max(ys) < -20 or min(ys) > H + 20: continue
    if max(xs) - min(xs) < 2.5 and max(ys) - min(ys) < 2.5: continue  # 아주 작은 섬은 뺌
    far = max(range(len(ring)), key=lambda i: (ring[i][0] - ring[0][0]) ** 2 + (ring[i][1] - ring[0][1]) ** 2)
    land.append(d_of(dp(ring[:far + 1], 0.35)[:-1] + dp(ring[far:], 0.35), True))  # 닫힌 고리는 반으로 나눠 단순화

routes = {}
for k in ('north', 'south', 'east'):
    g = json.load(open(f'research/map/osrm-{k}.json'))['routes'][0]
    routes[k] = {'d': d_of(dp([proj(*c) for c in g['geometry']['coordinates']], 0.4)), 'km': round(g['distance'] / 1000)}
# 로트네스트는 배로 감(프리맨틀 B-Shed → 로트네스트 섬): 직선 점선
fre, rot = proj(115.745, -32.055), proj(115.52, -32.0)
routes['ferry'] = {'d': d_of([fre, rot]), 'km': 18}

out = f"""// 생성: scripts/build-map.py — 직접 고치지 말 것
// 해안선 Natural Earth 10m(퍼블릭 도메인) · 경로 OSRM 주행 경로(© OpenStreetMap contributors)
export const MAP_W = {W};
export const MAP_H = {H};
export const LAND: string[] = {json.dumps(land)};
export const ROAD: Record<'north' | 'south' | 'east' | 'ferry', {{ d: string; km: number }}> = {json.dumps(routes)};
export const proj = (lat: number, lng: number): [number, number] => [(lng - {LNG0}) * {COS * K:.6f}, ({LAT0} - lat) * {K:.6f}];
"""
open('src/home/mapData.ts', 'w').write(out)
print('land rings', len(land), 'pts', sum(x.count('L') for x in land), {k: (v['km'], v['d'].count('L')) for k, v in routes.items()}, 'H', H)
