import { useRef } from 'react';
import { useScrub } from '../lib/scrub';
import { say } from '../data/copy';
import { Lines, Sents } from '../components/Lines';
import { Ph } from '../components/Ph';

// 맞춤투어: 흩어진 여행지 조각이 내리는 만큼 한 줄 일정으로 모여 자리를 잡음.
// 근거: About Us 「고객의 성향과 취향에 맞게 일정과 계획이 조정 가능합니다」 「나만을 위한 특별한 여행을 디자인하세요!」
const PIECES = ['피너클스', '란셀린', '스완밸리 와이너리', '로트네스트', '마가렛리버', '웨이브락', '칼바리', '프리맨틀'];
const WHO = [['img-5155-1', '가족여행'], ['wow-hoju-thumnail4', '신혼여행'], ['img-6128', '단체·소그룹']] as const;

export function Custom() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (p, el) => {
    const k = Math.min(1, Math.max(0, (p - 0.1) * 1.6));
    el.querySelectorAll<HTMLElement>('.cu-piece').forEach((pc, i) => {
      const sx = Number(pc.dataset.sx), sy = Number(pc.dataset.sy), r = Number(pc.dataset.r);
      pc.style.transform = `translate(${(sx * (1 - k)).toFixed(1)}px, ${(sy * (1 - k)).toFixed(1)}px) rotate(${(r * (1 - k)).toFixed(1)}deg)`;
      pc.classList.toggle('is-in', k > 0.92 && i < 5);
    });
    el.querySelector<HTMLElement>('.cu-line')!.style.transform = `scaleX(${k.toFixed(3)})`;
    el.querySelectorAll<HTMLElement>('.cu-sent').forEach((s, i) => { const o = Math.min(1, Math.max(0, p * 3 - i * 0.6)); s.style.opacity = String(o); s.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`; });
    el.querySelectorAll<HTMLElement>('.cu-who').forEach((w, i) => { w.style.transform = `translateX(${((1 - Math.min(1, p * 2)) * (i - 1) * 60).toFixed(1)}px)`; });
  }, { start: 'top 75%', end: 'bottom 55%', still: 1 });

  return (
    <section id="custom" ref={ref} className="sec cu" data-bg="bbq" data-fx="여행지 조각이 일정으로 모임,문장 차례로 떠오름,일정 선이 늘어남,사진 띠가 모여듦,버튼 밑줄 반응">
      <div className="wrap">
        <div className="head">
          <h2><Lines l={[['우리 일행에 맞춘'], ['여행이 필요하다면']]} /></h2>
        </div>
        <div className="cu-board" aria-hidden>
          <i className="cu-line" />
          {PIECES.map((x, i) => (
            <span key={x} className="cu-piece" data-sx={(i % 2 ? 1 : -1) * (40 + i * 22)} data-sy={(i % 3 - 1) * 90} data-r={(i % 2 ? 1 : -1) * (8 + i * 2)}>{x}</span>
          ))}
        </div>
        <div className="cu-text">
          <p className="cu-sent quote">{say('custom2')}</p>
          <p className="cu-sent lead"><Sents s={[say('custom1'), say('custom3') + '.']} /></p>
          <p className="cu-sent lead"><Sents s={say('hidden2') + '.'} /></p>
        </div>
        <ul className="cu-whos">
          {WHO.map(([s, l]) => <li key={l} className="cu-who"><Ph s={s} alt={l} sizes="(max-width: 760px) 100vw, 33vw" /><b>{l}</b></li>)}
        </ul>
        <p className="cu-cta"><a href="#/custom">맞춤투어 문의하기</a><a href="https://pf.kakao.com/_rxfkLC/chat" target="_blank" rel="noreferrer">카톡으로 바로 상담</a></p>
      </div>
    </section>
  );
}
