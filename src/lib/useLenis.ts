import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from './gsap';

// 관성 스크롤 + ScrollTrigger 동기화. reduced-motion이면 끔.
export function useLenis() {
  useEffect(() => {
    if (reduced()) { jumpToHash(); return; }
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    jumpToHash(lenis);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
}

// 섹션 주소(/#contact)로 들어오면 렌더 뒤 그 섹션으로 이동 — 브라우저 기본 이동은 요소가 생기기 전에 끝남
function jumpToHash(lenis?: Lenis) {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { immediate: true });
    else el.scrollIntoView();
    ScrollTrigger.refresh();
  });
}
