// 히어로: 피너클스 하늘이 한낮 → 황금빛 노을 → 별밤으로 물듦. 화면은 진행도 p의 순수 함수.
export const seg = (t: number, a: number, b: number) => (t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a));
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const STAR_COUNT = 90;

export type Stage = {
  title: number; // 질문 제목 보임
  day: number; // 한낮 영상
  dusk: number; // 노을 영상
  night: number; // 별밤 영상
  goldenLine: number; // 「황금빛으로 물드는 순간」
  finaleLine: number; // 「하루의 피날레」
  stars: number; // 켜진 별 수
  zoom: number; // 영상 느린 다가감 0~1
  cue: number;
};

export function heroStage(raw: number): Stage {
  const p = clamp01(raw);
  const toDusk = seg(p, 0.22, 0.42);
  const toNight = seg(p, 0.58, 0.76);
  const title = 1 - seg(p, 0.1, 0.22);
  return {
    title,
    day: 1 - toDusk,
    dusk: toDusk * (1 - toNight),
    night: toNight,
    goldenLine: seg(p, 0.36, 0.44) * (1 - seg(p, 0.56, 0.62)),
    finaleLine: seg(p, 0.8, 0.88),
    stars: Math.round(STAR_COUNT * seg(p, 0.66, 0.92)),
    zoom: p,
    cue: title,
  };
}
