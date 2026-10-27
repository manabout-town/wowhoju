// 서호주 투어 지점 — 좌표는 위키백과 각 문서, 거리(km)는 research/local.json(위키백과) 값
export type Place = { name: string; lat: number; lng: number; dest: string; at: number; left?: boolean };

export const PLACES: Place[] = [
  { name: '퍼스', lat: -31.95, lng: 115.86, dest: 'perth', at: 0 },
  { name: '로트네스트', lat: -32.0, lng: 115.52, dest: 'rottnest', at: 0.1, left: true },
  { name: '란셀린', lat: -31.02, lng: 115.33, dest: 'pinnacles', at: 0.2, left: true },
  { name: '피너클스', lat: -30.6, lng: 115.16, dest: 'pinnacles', at: 0.3, left: true },
  { name: '칼바리·핑크호수', lat: -27.71, lng: 114.16, dest: 'kalbarri', at: 0.5, left: true },
  { name: '멍키마이어', lat: -25.79, lng: 113.72, dest: 'kalbarri', at: 0.6 },
  { name: '웨이브락', lat: -32.44, lng: 118.9, dest: 'waverock', at: 0.45 },
  { name: '마가렛리버', lat: -33.95, lng: 115.07, dest: 'margaret', at: 0.55, left: true },
  { name: '알바니', lat: -35.02, lng: 117.88, dest: 'south', at: 0.7 },
];

// 경도 112.5~122.5, 위도 -24.5~-36 을 400×520 판에
export const proj = (lat: number, lng: number): [number, number] => [((lng - 112.5) / 10) * 400, ((-lat - 24.5) / 11.5) * 520];

const P = (n: string) => proj(PLACES.find((p) => p.name === n)!.lat, PLACES.find((p) => p.name === n)!.lng);
const path = (...ns: string[]) => ns.map((n, i) => `${i ? 'L' : 'M'}${P(n).map((v) => v.toFixed(1)).join(' ')}`).join(' ');

export const ROUTES = [
  { id: 'north', tone: 'coral', label: '북쪽 — 피너클스·칼바리·멍키마이어', d: path('퍼스', '란셀린', '피너클스', '칼바리·핑크호수', '멍키마이어'), kmTo: '멍키마이어', km: 900, note: '사막·협곡·핑크호수' },
  { id: 'south', tone: 'blue', label: '남쪽 — 마가렛리버·알바니', d: path('퍼스', '마가렛리버', '알바니'), kmTo: '마가렛리버', km: 277, note: '와이너리·해안 절벽' },
  { id: 'east', tone: 'gold', label: '동쪽 — 웨이브락', d: path('퍼스', '웨이브락'), kmTo: '웨이브락', km: 296, note: '파도 모양 화강암' },
] as const;

// 퍼스→멍키마이어 약 900km(위키백과 Monkey Mia), 퍼스→웨이브락 296km(Wave Rock), 남부는 마가렛리버 277km(Margaret River, Western Australia)
export const routeLen = (r: (typeof ROUTES)[number]) => r.km;
