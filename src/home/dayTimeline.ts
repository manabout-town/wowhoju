import type { copy } from '../data/copy';

// 피너클스 선셋&별빛투어 일정 원문 순서 그대로(research/products.json itineraryStops)
export const dayStops: { name: string; what: string; photo: string; alt: string; say: keyof typeof copy }[] = [
  { name: '무어리버', what: '강과 바다가 만나는 곳', photo: 'moore-river-11', alt: '무어리버 데크길과 강·바다', say: 'mooreLancelin' },
  { name: '란셀린', what: '하얀 모래언덕 샌드보딩', photo: 'img-4640', alt: '란셀린 모래언덕에서 샌드보드 타는 손님', say: 'thrill' },
  { name: '행오버베이', what: '바다 앞 바베큐', photo: 'bbq-dinner', alt: '투어 중 바비큐 저녁', say: 'bbq' },
  { name: '피너클스 노을', what: '황금빛으로 물드는 기둥', photo: 'background-1-1', alt: '노을빛 피너클스 석회암 기둥', say: 'golden' },
  { name: '별빛', what: '은하수 아래', photo: 'star-gazing-1', alt: '피너클스 은하수 아래 양팔 벌린 손님', say: 'sunsetSpot' },
];

const seg = (t: number, a: number, b: number) => (t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a));

export function dayStage(raw: number) {
  const p = Math.min(1, Math.max(0, raw));
  const n = dayStops.length;
  const pos = p * (n - 1); // 0..4
  const active = Math.min(n - 1, Math.round(pos));
  // 해: 호(왼쪽 아래 → 위 → 오른쪽 아래). 마지막 별빛 장면에선 지평선 아래로
  const u = seg(p, 0, 0.82);
  const sunX = 2 + 96 * u;
  const sunY = 48 - 74 * 4 * u * (1 - u) * 0.5 + seg(p, 0.82, 1) * 30;
  const photo = (i: number) => Math.max(0, 1 - Math.abs(pos - i) * 1.6);
  return { active, sunX, sunY, sunGlow: 1 - seg(p, 0.8, 0.95), arc: u, photo };
}
