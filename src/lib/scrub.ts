import { useEffect, type RefObject } from 'react';
import { ScrollTrigger, reduced } from './gsap';

// 섹션 하나를 스크롤 진행도 p(0~1)로 그리는 공용 훅. pin이면 화면에 고정.
// ?<섹션 id>=값 이면 그 값으로 정지, ?p= 이면 still 값(히어로는 ?p= 값 자체)으로 정지 — 스크린샷용. reduced-motion이면 still 값으로 한 번만 그림.
export function useScrub(
  ref: RefObject<HTMLElement | null>,
  apply: (p: number, el: HTMLElement) => void,
  o: { pin?: boolean; start?: string; end?: string; still?: number; target?: string } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const q = new URLSearchParams(location.search).get('p');
    const id = el.id;
    const qs = new URLSearchParams(location.search).get(id);
    if (qs !== null) { apply(Number(qs), el); return; }
    if (reduced()) { apply(o.still ?? 1, el); return; }
    if (q !== null) { apply(o.still ?? 1, el); return; }
    apply(0, el);
    const st = ScrollTrigger.create({
      trigger: o.target ? el.querySelector(o.target) ?? el : el,
      start: o.start ?? (o.pin ? 'top top' : 'top 80%'),
      end: o.end ?? (o.pin ? '+=200%' : 'bottom 40%'),
      pin: o.pin ? el : false,
      scrub: true,
      onUpdate: (self) => apply(self.progress, el),
    });
    return () => st.kill();
    // apply는 섹션 안에서 고정된 함수로 씀
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

// 단어 i(총 n개)가 진행도 p에서 얼마나 채워졌나(0~1) — 앞에서부터 차례로
export const wordFill = (p: number, i: number, n: number, soft = 2.5) => Math.min(1, Math.max(0, p * (n + soft) - i) / soft);
