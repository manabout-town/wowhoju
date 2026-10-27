import { useEffect, useRef } from 'react';
import { reduced } from '../lib/gsap';
import './scene-bg.css';

// 페이지 뒤 고정 실사 영상 한 층. 섹션의 data-bg 장면이 화면 가운데 띠에 들어오면 그 영상으로 교차.
// 보이는 영상과 막 사라지는 영상만 재생(디코더 최대 2개). reduced-motion이면 포스터 정지.
export const SCENES = ['moore', 'sandboard', 'bbq', 'gorge', 'pinklake', 'skywalk', 'sunset', 'stars', 'ocean', 'lancelin', 'pinnacles', 'sunbush'] as const;
export type Scene = (typeof SCENES)[number];

export function SceneBg({ page }: { page: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current!;
    const still = reduced();
    const vid = (k: string) => box.querySelector<HTMLVideoElement>(`video[data-k="${k}"]`);
    let cur = box.dataset.cur ?? '';
    const show = (k: string, tone: string) => {
      box.dataset.tone = tone;
      if (k === cur) return;
      const prev = cur ? vid(cur) : null;
      const next = vid(k);
      cur = k;
      box.dataset.cur = k;
      if (!next) return;
      box.querySelectorAll('video').forEach((v) => v.classList.toggle('on', v === next));
      if (!still) {
        if (next.preload === 'none') next.preload = 'auto';
        next.play().catch(() => {});
        if (prev) setTimeout(() => { if (cur !== prev.dataset.k) prev.pause(); }, 900);
      }
    };
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { const t = e.target as HTMLElement; show(t.dataset.bg!, t.dataset.tone ?? 'night'); }
    }, { rootMargin: '-45% 0px -45% 0px' });
    const seen = new Set<Element>();
    const scan = () => {
      const secs = [...document.querySelectorAll<HTMLElement>('[data-bg]')];
      let added = 0;
      secs.forEach((s) => { if (!seen.has(s)) { seen.add(s); io.observe(s); added++; } });
      if (added && secs[0] && scrollY < innerHeight) show(secs[0].dataset.bg!, secs[0].dataset.tone ?? 'night');
    };
    scan();
    // 지연 로딩된 페이지 섹션도 잡음
    const mo = new MutationObserver(scan);
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true }); // 바로 아래 자식만(스크럽 글자 바뀜은 무시)
    return () => { io.disconnect(); mo.disconnect(); };
  }, [page]);
  return (
    <div className="scn" ref={ref} aria-hidden>
      {SCENES.map((k) => <video key={k} data-k={k} src={`/video/${k}.mp4`} poster={`/video/${k}.jpg`} muted loop playsInline preload="none" />)}
      <div className="scn__veil" />
    </div>
  );
}
