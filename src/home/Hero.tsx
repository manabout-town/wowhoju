import { useEffect, useRef } from 'react';
import { ScrollTrigger, reduced } from '../lib/gsap';
import { mulberry32 } from '../fx/rng';
import { say } from '../data/copy';
import { heroStage, STAR_COUNT } from './heroTimeline';
import './hero.css';

// 히어로: 화면에 고정된 피너클스. 내리는 만큼 한낮 → 황금빛 노을 → 별밤으로 하늘이 물들고 별이 하나씩 켜짐.
// 근거: 피너클스 선셋&별빛투어 원문 「해질 무렵, 피나클스가 황금빛으로 물드는 순간」 「시크릿 별빛 스팟」
const rnd = mulberry32(7);
const STARS = Array.from({ length: STAR_COUNT }, () => ({ x: rnd() * 100, y: rnd() * 58, s: 1 + rnd() * 2.2, o: 0.5 + rnd() * 0.5 }));

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    const $ = (s: string) => el.querySelector(s) as HTMLElement;
    const vids = [...el.querySelectorAll<HTMLVideoElement>('.hx-v')];
    const title = $('.hx-title'), cue = $('.hx-cue'), gold = $('.hx-gold'), fin = $('.hx-fin');
    const stars = [...el.querySelectorAll<HTMLElement>('.hx-star')];
    let lit = -1;

    const apply = (p: number) => {
      const s = heroStage(p);
      [s.day, s.dusk, s.night].forEach((o, i) => {
        const v = vids[i];
        v.style.opacity = o.toFixed(3);
        v.style.transform = `scale(${(1.12 - 0.12 * s.zoom).toFixed(4)})`;
        if (reduced()) return;
        if (o > 0.01 && v.paused) v.play().catch(() => {});
        if (o <= 0.01 && !v.paused) v.pause();
      });
      title.style.opacity = String(s.title);
      title.style.transform = `translateY(${((1 - s.title) * -36).toFixed(1)}px)`;
      cue.style.opacity = String(s.cue);
      gold.style.opacity = String(s.goldenLine);
      gold.style.transform = `translateY(${((1 - s.goldenLine) * 24).toFixed(1)}px)`;
      fin.style.opacity = String(s.finaleLine);
      fin.style.transform = `translateY(${((1 - s.finaleLine) * 24).toFixed(1)}px)`;
      if (s.stars !== lit) { stars.forEach((st, i) => st.classList.toggle('on', i < s.stars)); lit = s.stars; }
    };

    const qs = new URLSearchParams(location.search);
    if (reduced()) { apply(0); return; }
    if (qs.has('p')) { apply(Number(qs.get('p'))); return; }
    apply(0);
    const st = ScrollTrigger.create({ trigger: el, start: 'top top', end: '+=260%', pin: true, scrub: 0.4, onUpdate: (self) => apply(self.progress) });
    return () => st.kill();
  }, []);

  return (
    <section id="hero" className="hero" ref={root} data-fx="하늘이 노을·별밤으로 물듦,질문 흐림 사라짐,별 하나씩 켜짐,원문 문장 교대,영상 느린 다가감">
      <video className="hx-v" src="/video/pinnacles.mp4" poster="/video/pinnacles.jpg" autoPlay muted loop playsInline aria-hidden />
      <video className="hx-v" src="/video/sunset.mp4" poster="/video/sunset.jpg" muted loop playsInline preload="auto" aria-hidden />
      <video className="hx-v" src="/video/stars.mp4" poster="/video/stars.jpg" muted loop playsInline preload="auto" aria-hidden />
      <div className="hx-veil" aria-hidden />
      <div className="hx-stars" aria-hidden>
        {STARS.map((s, i) => <i key={i} className="hx-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, ['--o' as string]: s.o }} />)}
      </div>
      <div className="hx-title wrap">
        <h1><span className="ln nw">퍼스에 가면,</span><span className="ln nw">어디부터 봐야 할까요?</span></h1>
        <p className="lead">퍼스에서 직접 운영하는 한인 여행사가<br />서호주의 하루를 처음부터 끝까지 안내합니다.</p>
      </div>
      <p className="hx-line hx-gold quote">{say('golden')}</p>
      <p className="hx-line hx-fin quote">{say('finale')}<small>피너클스 선셋&amp;별빛투어 소개 중</small></p>
      <p className="hx-cue" aria-hidden>내려 보세요</p>
    </section>
  );
}
