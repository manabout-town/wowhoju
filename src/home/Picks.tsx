import { useRef } from 'react';
import { useScrub } from '../lib/scrub';
import { say } from '../data/copy';
import { tours, CATS, type Tour } from '../data/tours';
import { Lines } from '../components/Lines';
import { Ph } from '../components/Ph';
import { TourMeta } from '../pages/TourMeta';

// 원래 홈의 투어 묶음 세 개(Must Go 6 · 퍼스 100배 즐기기 3 · 울룰루 3)를 사진 주도로.
// 대표 효과: 업체 사진 속 샌드보드 탄 손님(누끼)이 모래언덕을 미끄러져 내려오듯 목록을 따라 내려옴.
const GROUPS: [string, (t: Tour) => boolean][] = [
  [say('mustGo'), (t) => t.home && t.cats.includes('must-go')],
  [say('perth100'), (t) => t.home && t.cats.includes('perth100')],
  ['호주의 중심, 울룰루 여행', (t) => t.home && t.cats.includes('uluru')],
];

export function Picks() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (p, el) => {
    const r = el.querySelector<HTMLElement>('.pk-rider')!;
    r.style.transform = `translate(${(-10 + p * 80).toFixed(2)}vw, ${(p * 92).toFixed(2)}%) rotate(${(-14 + p * 10).toFixed(1)}deg)`;
    el.querySelectorAll<HTMLElement>('.pk-row').forEach((row) => {
      const b = row.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight - b.top) / (innerHeight * 0.55)));
      row.style.setProperty('--k', k.toFixed(3));
    });
  }, { start: 'top bottom', end: 'bottom top', still: 1 });

  return (
    <section id="tours" ref={ref} className="sec pk" data-bg="gorge" data-fx="샌드보드 손님이 미끄러져 내려옴,사진 가장자리부터 열림,구분선 그려짐,가격 글자 떠오름,사진 호버 확대">
      <div className="pk-track" aria-hidden><img className="pk-rider" src="/cut/sandboarder.webp" alt="" /></div>
      <div className="wrap">
        <div className="head">
          <h2><Lines l={[['어디로 갈지'], ['사진으로 고르세요']]} /></h2>
          <p className="pk-cats">
            {Object.entries(CATS).map(([k, v]) => <a key={k} href={`#/tours/${k}`}>{v}</a>)}
            <a href="#/tours">전체 {tours.length}개 투어</a>
          </p>
        </div>
        {GROUPS.map(([title, pick]) => (
          <div key={title} className="pk-group">
            <h3 className="pk-gt">{title}</h3>
            <ul className="pk-list">
              {tours.filter(pick).map((t, i) => (
                <li key={t.id} className={`pk-row${i % 2 ? ' pk-row--r' : ''}`}>
                  <a href={`#/tour/${t.id}`} className="pk-a">
                    <span className="pk-ph"><Ph s={t.photo!} alt={t.title} sizes="(max-width: 760px) 100vw, 55vw" /></span>
                    <span className="pk-tx">
                      <b className="pk-name">{t.title}</b>
                      <TourMeta t={t} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
