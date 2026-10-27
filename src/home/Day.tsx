import { useRef } from 'react';
import { useScrub } from '../lib/scrub';
import { say } from '../data/copy';
import { Lines, Sents } from '../components/Lines';
import { Ph } from '../components/Ph';
import { dayStops, dayStage } from './dayTimeline';
import { tourById } from '../data/tours';

// 대표 투어의 하루: 고정된 화면에서 해가 호를 따라 지며 다섯 장면이 차례로 바뀜.
// 근거: 피너클스 선셋&별빛투어 일정 원문(무어리버 → 란셀린 → 행오버베이 바베큐 → 피너클스 노을 → 별빛)
export function Day() {
  const ref = useRef<HTMLElement>(null);
  const t = tourById('pinnacles-sunset');
  useScrub(ref, (p, el) => {
    const s = dayStage(p);
    const sun = el.querySelector<HTMLElement>('.dy-sun')!;
    sun.style.transform = `translate(${s.sunX.toFixed(2)}%, ${(s.sunY * 2).toFixed(2)}%)`;
    sun.style.setProperty('--glow', s.sunGlow.toFixed(3));
    el.querySelector<SVGPathElement>('.dy-arc-done')!.style.strokeDashoffset = String((1 - s.arc).toFixed(4));
    el.querySelectorAll<HTMLElement>('.dy-ph').forEach((ph, i) => {
      ph.style.opacity = s.photo(i).toFixed(3);
      ph.style.transform = `scale(${(1.08 - 0.08 * s.photo(i)).toFixed(4)})`;
    });
    el.querySelectorAll<HTMLElement>('.dy-stop').forEach((st, i) => { st.classList.toggle('on', i === s.active); st.classList.toggle('done', i < s.active); });
    const tx = el.querySelectorAll<HTMLElement>('.dy-say');
    tx.forEach((x, i) => { x.style.opacity = s.photo(i).toFixed(3); x.style.transform = `translateY(${((1 - s.photo(i)) * 20).toFixed(1)}px)`; });
  }, { pin: true, end: '+=260%', still: 1 });

  return (
    <section id="day" ref={ref} className="sec dy" data-bg="sandboard" data-fx="해가 호를 따라 짐,장면 사진 교차,정거장 차례로 켜짐,지나온 길 채워짐,원문 문장 교대">
      <div className="wrap dy-in">
        <div className="head dy-head">
          <h2><Lines l={[['피너클스로 가는 하루,'], ['다섯 장면']]} /></h2>
          <p className="lead"><Sents s={['퍼스 시티에서 출발해 밤 10시 무렵 돌아옵니다.', `매주 ${t.avail.replace(" 출발", "")} 출발합니다.`]} /></p>
        </div>
        <div className="dy-stage">
          <div className="dy-photos">
            {dayStops.map((d) => <Ph key={d.photo} s={d.photo} alt={d.alt} className="dy-ph" sizes="(max-width: 760px) 100vw, 60vw" />)}
            <svg className="dy-arc" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden>
              <path d="M2 48 Q50 -26 98 48" pathLength={1} className="dy-arc-bg" />
              <path d="M2 48 Q50 -26 98 48" pathLength={1} className="dy-arc-done" />
            </svg>
            <i className="dy-sun" aria-hidden />
            <div className="dy-says">
              {dayStops.map((d) => <p key={d.photo} className="dy-say quote"><Sents s={say(d.say)} /></p>)}
            </div>
          </div>
          <ol className="dy-stops">
            {dayStops.map((d) => <li key={d.name} className="dy-stop"><b>{d.name}</b><span>{d.what}</span></li>)}
          </ol>
        </div>
        <p className="dy-price">
          <a href={`#/tour/${t.id}`}>성인 <b className="num">${t.price}</b> · 아동 <b className="num">${t.child}</b> · {t.duration} · 포함 {t.included.length}가지 — 투어 자세히 보기</a>
        </p>
      </div>
    </section>
  );
}
