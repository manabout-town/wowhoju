import { useRef } from 'react';
import { useScrub, wordFill } from '../lib/scrub';
import { say, copy } from '../data/copy';
import { facts } from '../data/facts';
import { Lines } from '../components/Lines';
import { Ph } from '../components/Ph';
import { Source } from '../components/Source';

// 이야기: 모래 위에 발자국이 한 걸음씩 찍히며 현지 여행사 원문이 차오름.
// 근거: 블로그 원문 「다시 걷는 서호주」, About Us 「현지에 살고 있는 한국인 가이드」
const STEPS = 14;
const WORDS = say('aboutLocal').split(' ');

export function Story() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (p, el) => {
    el.querySelectorAll<HTMLElement>('.st-step').forEach((s, i) => { s.style.opacity = String(Math.min(1, Math.max(0, p * (STEPS + 2) - i))); });
    el.querySelectorAll<HTMLElement>('.st-w').forEach((w, i) => { w.style.setProperty('--f', wordFill(p * 1.3, i, WORDS.length, 2).toFixed(3)); });
    el.querySelectorAll<HTMLElement>('.st-ph').forEach((ph, i) => {
      const o = Math.min(1, Math.max(0, p * 3 - i * 0.5));
      ph.style.opacity = String(o);
      ph.style.transform = `translateY(${((1 - p) * (30 + i * 26)).toFixed(1)}px) scale(${(0.92 + 0.08 * o).toFixed(3)})`;
    });
    const n = el.querySelector<HTMLElement>('.st-year');
    if (n) n.textContent = String(Math.round(2015 + Math.min(1, p * 1.6) * (facts.restart.value - 2015)));
  }, { start: 'top 75%', end: 'bottom 60%', still: 1 });

  return (
    <section id="about" ref={ref} className="sec st" data-bg="moore" data-fx="발자국이 찍힘,원문 구절 차오름,사진 열림,사진 시차,연도 올라감">
      <svg className="st-steps" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: STEPS }, (_, i) => {
          const x = 30 + i * 68, y = 150 - Math.sin(i * 0.55) * 46 + (i % 2 ? 16 : -16);
          return <g key={i} className="st-step" transform={`translate(${x} ${y}) rotate(${-8 + Math.cos(i * 0.55) * 22})`}><ellipse rx="9" ry="15" /><ellipse cx="0" cy="-22" rx="6" ry="5" /></g>;
        })}
      </svg>
      <div className="wrap st-grid">
        <div className="st-text">
          <div className="head">
            <h2><Lines l={[['퍼스에 살면서,'], ['퍼스를 안내합니다']]} /></h2>
          </div>
          <p className="st-big" aria-label={say('aboutLocal')}>
            {WORDS.map((w, i) => <span key={i} className="st-w" aria-hidden>{w} </span>)}
          </p>
          <p className="quote st-quote">“{say('aboutLived')}”</p>
          <p className="claim">와우호주 About Us 소개 문장</p>
          <div className="st-years">
            <p><b className="big st-year num">{facts.restart.value}</b><span>코로나로 멈췄다가<br />다시 투어를 시작한 해<small className="claim">와우호주 블로그 소개</small></span></p>
            <p><b className="big num">{facts.abnSince.value}</b><span>운영 법인<br />사업자 등록</span></p>
          </div>
          <p className="quote st-restart">{say('restart')}</p>
          <Source facts={[facts.abnSince, facts.restart]} note={copy.restart.source} />
        </div>
        <div className="st-photos">
          <Ph s="img-3055" alt="칼바리 해안 전망대에서 만세하는 손님들" className="st-ph st-ph--a" />
          <Ph s="pinnacles" alt="피너클스에서 점프하는 손님들" className="st-ph st-ph--b" />
          <Ph s="wow-hoju-thumnail4" alt="인도양 노을 앞 하트 포즈" className="st-ph st-ph--c" />
        </div>
      </div>
    </section>
  );
}
