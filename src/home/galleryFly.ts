// 갤러리 비행: 사진 i는 깊이 -i*GAP 에서 출발, 진행도 p 만큼 카메라 쪽으로 다가옴. 카메라를 지나면 사라짐.
export const SHOTS = [
  { s: 'img-4640', where: '란셀린 모래언덕', x: -22, y: -8, r: -3 },
  { s: 'pinnacles', where: '피너클스', x: 20, y: 6, r: 2 },
  { s: 'img-3055', where: '칼바리 해안 전망대', x: -18, y: 10, r: 2 },
  { s: 'kalbarri-5', where: '핑크호수', x: 22, y: -10, r: -2 },
  { s: 'star-gazing-1', where: '피너클스 별빛', x: -24, y: -4, r: 3 },
  { s: 'monkey-mia', where: '멍키마이어', x: 18, y: 12, r: -3 },
  { s: 'wave-rock', where: '웨이브락', x: -20, y: 8, r: -2 },
  { s: 'img-5959', where: '란셀린 샌드보딩', x: 24, y: -6, r: 2 },
  { s: 'margaret-river-4', where: '캐널록스', x: -22, y: -12, r: 2 },
  { s: 'rottnest-23', where: '로트네스트', x: 20, y: 10, r: -2 },
  { s: 'winery', where: '마가렛리버 와이너리', x: -16, y: 4, r: 3 },
  { s: 'img-7040-copy-2', where: '칼바리 협곡', x: 22, y: -4, r: -3 },
  { s: 'busselton-jetty-3', where: '버셀튼 제티', x: -24, y: 10, r: -2 },
  { s: 'img-1478-1', where: '피너클스 은하수', x: 18, y: -10, r: 2 },
];
const GAP = 700;
const SPAN = GAP * (SHOTS.length + 1);

export function flyStage(raw: number) {
  const p = Math.min(1, Math.max(0, raw));
  const cam = p * SPAN;
  const z = (i: number) => -i * GAP - GAP * 0.6 + cam;
  const o = (i: number) => { const d = z(i); if (d > 260) return Math.max(0, 1 - (d - 260) / 240); if (d < -GAP * 4) return Math.max(0, 1 + (d + GAP * 4) / (GAP * 2)); return 1; };
  let near = 0, best = Infinity;
  SHOTS.forEach((_, i) => { const d = Math.abs(z(i)); if (z(i) < 300 && d < best) { best = d; near = i; } });
  const seen = Math.min(SHOTS.length, Math.max(1, Math.floor(cam / GAP) + 1));
  return { z, o, near, seen };
}
