import { ROAD } from './mapData';

// 서호주 투어 지점 — 좌표는 위키백과 각 문서. 지도 투영·해안선·도로는 mapData.ts(scripts/build-map.py)
export type Place = { name: string; lat: number; lng: number; dest: string; at: number; left?: boolean };

export const PLACES: Place[] = [
  { name: '퍼스', lat: -31.9505, lng: 115.8605, dest: 'perth', at: 0 },
  { name: '로트네스트', lat: -32.0, lng: 115.52, dest: 'rottnest', at: 0.08, left: true },
  { name: '란셀린', lat: -31.0167, lng: 115.3304, dest: 'pinnacles', at: 0.18 },
  { name: '피너클스', lat: -30.6045, lng: 115.1574, dest: 'pinnacles', at: 0.26, left: true },
  { name: '핑크호수', lat: -28.17, lng: 114.25, dest: 'kalbarri', at: 0.42 },
  { name: '칼바리', lat: -27.7125, lng: 114.1647, dest: 'kalbarri', at: 0.48 },
  { name: '멍키마이어', lat: -25.7887, lng: 113.7209, dest: 'kalbarri', at: 0.6 },
  { name: '웨이브락', lat: -32.443, lng: 118.8977, dest: 'waverock', at: 0.4 },
  { name: '마가렛리버', lat: -33.9536, lng: 115.0727, dest: 'margaret', at: 0.5, left: true },
  { name: '알바니', lat: -35.0228, lng: 117.884, dest: 'south', at: 0.66 },
];

// 거리 = 실제 주행 경로 길이(OSRM, © OpenStreetMap contributors) — 퍼스에서 마지막 지점까지 차로
export const ROUTES = [
  { id: 'north', tone: 'coral', label: '북쪽 — 피너클스·핑크호수·칼바리·멍키마이어', kmTo: '멍키마이어', km: ROAD.north.km, note: '사막·핑크호수·협곡' },
  { id: 'south', tone: 'blue', label: '남쪽 — 마가렛리버·알바니', kmTo: '알바니', km: ROAD.south.km, note: '와이너리·해안 절벽' },
  { id: 'east', tone: 'gold', label: '동쪽 — 웨이브락', kmTo: '웨이브락', km: ROAD.east.km, note: '파도 모양 화강암' },
] as const;
export const routeLen = (r: (typeof ROUTES)[number]) => r.km;
