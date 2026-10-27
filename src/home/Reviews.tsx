import { useRef } from 'react';
import { useScrub } from '../lib/scrub';
import { facts } from '../data/facts';
import { reviews } from '../data/reviews';
import { Lines, Sents } from '../components/Lines';
import { Source } from '../components/Source';

// 숫자·후기: 별밤 위에 별을 잇는 선이 그려지며 숫자가 별자리처럼 떠오르고, 후기는 모래바람처럼 옆으로 흐름.
// 근거: 투어 원문 「별이 쏟아지는 밤하늘」, 후기 「밤하늘의 별은 잊을 수 없을 것 같습니다」
const STATS = [
  { v: facts.mrtRating.value, d: 1, label: '마이리얼트립 평점', pt: [12, 30] },
  { v: facts.mrtReviews.value, d: 0, label: '마이리얼트립 후기', pt: [38, 62] },
  { v: facts.mrtYears.value, d: 0, label: '년째 마이리얼트립 파트너', pt: [64, 26] },
  { v: facts.insta.value, d: 0, label: '인스타그램 팔로워', pt: [88, 58] },
] as const;
const half = Math.ceil(reviews.length / 2);
const ROWS = [reviews.slice(0, half), reviews.slice(half)];

export function Reviews() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (p, el) => {
    const k = Math.min(1, Math.max(0, p * 1.8));
    el.querySelectorAll<SVGLineElement>('.rv-link').forEach((l, i) => { l.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, k * 3 - i))); });
    el.querySelectorAll<HTMLElement>('.rv-stat').forEach((s, i) => {
      const o = Math.min(1, Math.max(0, k * 4 - i * 0.9));
      s.style.opacity = String(o);
      const b = s.querySelector<HTMLElement>('b')!;
      const st = STATS[i];
      b.textContent = (st.v * o).toLocaleString('ko-KR', { minimumFractionDigits: st.d, maximumFractionDigits: st.d });
    });
    el.querySelectorAll<HTMLElement>('.rv-star').forEach((s, i) => s.classList.toggle('on', k * 6 > i + 1));
  }, { start: 'top 70%', end: 'center 40%', still: 1 });

  return (
    <section id="reviews" ref={ref} className="sec rv" data-bg="stars" data-fx="별을 잇는 선이 그려짐,숫자 카운트업,별점 차례로 켜짐,후기가 바람처럼 흐름,두 줄이 서로 다른 속도">
      <div className="wrap">
        <div className="head">
          <h2><Lines l={[['다녀온 분들이'], ['남긴 별점']]} /></h2>
          <p className="rv-stars" aria-label={`평점 ${facts.mrtRating.value}점`}>{[0, 1, 2, 3, 4].map((i) => <i key={i} className="rv-star" aria-hidden>★</i>)}</p>
        </div>
        <div className="rv-sky">
          <svg className="rv-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {STATS.slice(1).map((s, i) => <line key={i} className="rv-link" x1={STATS[i].pt[0]} y1={STATS[i].pt[1]} x2={s.pt[0]} y2={s.pt[1]} pathLength={1} />)}
          </svg>
          {STATS.map((s) => (
            <p key={s.label} className="rv-stat" style={{ left: `${s.pt[0]}%`, top: `${s.pt[1]}%` }}>
              <b className="big num">{s.v.toLocaleString('ko-KR', { minimumFractionDigits: s.d })}</b><span>{s.label}</span>
            </p>
          ))}
        </div>
        <Source facts={[facts.mrtRating, facts.insta]} note="후기 전부 5점, 2026년 4~10월 마이리얼트립 후기 원문(일부 줄임)" />
      </div>
      <div className="rv-flow">
        {ROWS.map((row, r) => (
          <div key={r} className={`rv-row rv-row--${r}`}>
            {[0, 1].map((dup) => (
              <ul key={dup} className="rv-ul" aria-hidden={dup === 1}>
                {row.map((x) => (
                  <li key={x.date + x.author + dup} className="rv-item">
                    <p><Sents s={x.text} /></p>
                    <span>{x.author} · {x.date.replaceAll('-', '.')} · {x.product}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
