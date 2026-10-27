import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import './intro.css';

// 첫 방문 오프닝(세션당 한 번): 실사 영상 → 문장 두 줄 → 워드마크(돌 놓듯) → 막이 걷히며 히어로.
// 워드마크 위·아래에 지역명·꼬리표·밑줄을 따로 얹지 않는다(머리 라벨 금지, 상호 밑줄 금지 — 유저 2026-10-27). 상호 그대로 한 줄.
// 스크롤·터치·키를 누르면 바로 걷힘. 움직임 줄이기·섹션 주소 진입·?p= 정지 컷이면 건너뜀.
export type IntroProps = { video: string; poster: string; lines: [string[], string[]]; word: string; logo?: string; storageKey: string };

export function Intro({ video, poster, lines, word, logo, storageKey }: IntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(() => {
    if (typeof window === 'undefined') return false;
    const q = new URLSearchParams(location.search);
    let seen = false;
    try { seen = sessionStorage.getItem(storageKey) === '1'; } catch { /* 저장소 막힘 */ }
    return !seen && !location.hash && !q.has('p') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!on) return;
    const el = ref.current!;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    lenis?.stop();
    const q = (s: string) => el.querySelectorAll(s);
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        html.style.overflow = '';
        lenis?.start();
        try { sessionStorage.setItem(storageKey, '1'); } catch { /* 무시 */ }
        setOn(false);
      },
    });
    tl.fromTo(q('.in-video'), { scale: 1.16, opacity: 0 }, { scale: 1, opacity: 1, duration: 6.4, ease: 'power2.out' }, 0)
      .fromTo(q('.in-bar'), { scaleY: 1.6 }, { scaleY: 1, duration: 1.4 }, 0)
      .fromTo(q('.in-l1'), { opacity: 0, y: 18, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4 }, 0.6)
      .fromTo(q('.in-l2'), { opacity: 0, y: 18, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4 }, 1.3)
      .to(q('.in-lines'), { opacity: 0, y: -24, filter: 'blur(8px)', duration: 0.8, ease: 'power2.in' }, 3.0)
      .fromTo(q('.in-logo'), { y: -40, scale: 1.12, opacity: 0, rotate: -4 }, { y: 0, scale: 1, opacity: 1, rotate: 0, duration: 1.1, ease: 'back.out(2)' }, 3.6)
      .fromTo(q('.in-word span'), { yPercent: -38, rotate: (i: number) => [-9, 7, -6, 8][i % 4], scale: 1.18, opacity: 0, filter: 'blur(12px)' }, { yPercent: 0, rotate: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'back.out(2.4)', stagger: 0.14 }, 3.6)
      .to(q('.in-bar'), { scaleY: 0, duration: 0.9, ease: 'expo.inOut' }, 5.4)
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut' }, 5.5);

    // 사용자가 내리기 시작하면 남은 연출을 빨리 감음
    const hurry = () => { if (tl.time() < 5.4) tl.seek(5.4); tl.timeScale(1.6); };
    addEventListener('wheel', hurry, { passive: true });
    addEventListener('touchmove', hurry, { passive: true });
    addEventListener('keydown', hurry);
    return () => {
      tl.kill();
      html.style.overflow = '';
      lenis?.start();
      removeEventListener('wheel', hurry);
      removeEventListener('touchmove', hurry);
      removeEventListener('keydown', hurry);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div className="in" ref={ref} aria-hidden>
      <video className="in-video" src={video} poster={poster} autoPlay muted loop playsInline />
      <div className="in-dim" />
      <div className="in-grain" />
      <div className="in-bar in-bar--t" />
      <div className="in-bar in-bar--b" />
      <div className="in-center">
        <div className="in-lines quote">
          {/* 줄마다 구절 배열 — 줄바꿈은 구절 사이에서만 일어남 */}
          <p className="in-l1">{lines[0].map((c, i) => <span key={i} className="nw">{i > 0 && ' '}{c}</span>)}</p>
          <p className="in-l2">{lines[1].map((c, i) => <span key={i} className="nw">{i > 0 && ' '}{c}</span>)}</p>
        </div>
        <div className="in-mark">
          {logo ? <img className="in-logo" src={logo} alt={word} /> : <p className="in-word">{[...word].map((w, i) => <span key={i}>{w}</span>)}</p>}
        </div>
      </div>
    </div>
  );
}
