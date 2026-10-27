import { useRef } from 'react';
import { useScrub } from '../lib/scrub';
import { climate } from '../data/facts';
import { Lines, Sents } from '../components/Lines';

// 언제 갈까: 내리는 만큼 월 다이얼이 돌아 1월 → 12월을 지나고, 기온 곡선이 그려지고 비 막대가 자람.
// 근거: 퍼스 월별 기후(BOM 1993–2020), 업체 쇼츠 「9월에는 퍼스로 여행을 와야하는 이유 3」
const SEASON = ['여름', '여름', '가을', '가을', '가을', '겨울', '겨울', '겨울', '봄', '봄', '봄', '여름'];
const W = 600, H = 220;
const x = (i: number) => 30 + (i / 11) * (W - 60);
const y = (t: number) => H - 30 - ((t - 5) / 30) * (H - 60);
const curve = (arr: number[]) => arr.map((t, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(t).toFixed(1)}`).join(' ');

export function Season() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (p, el) => {
    const m = Math.min(11, Math.floor(p * 12));
    el.querySelector<HTMLElement>('.se-hand')!.style.transform = `rotate(${(Math.min(11, p * 12) * 30).toFixed(1)}deg)`;
    el.querySelectorAll<SVGPathElement>('.se-curve').forEach((c) => { c.style.strokeDashoffset = String(1 - Math.min(1, p * 1.15)); });
    el.querySelectorAll<SVGRectElement>('.se-rain').forEach((r, i) => { r.style.transform = `scaleY(${i <= m ? 1 : 0})`; });
    el.querySelectorAll<HTMLElement>('.se-mon').forEach((mo, i) => mo.classList.toggle('on', i === m));
    el.querySelector<HTMLElement>('.se-now b')!.textContent = `${m + 1}월`;
    el.querySelector<HTMLElement>('.se-now i')!.textContent = `${SEASON[m]} · 낮 ${climate.max[m]}° / 밤 ${climate.min[m]}° · 비 ${climate.rain[m]}mm · 해 ${climate.sun[m]}시간`;
  }, { pin: true, end: '+=180%', still: 8 / 12 + 0.01 });

  return (
    <section id="season" ref={ref} className="sec se" data-bg="ocean" data-fx="달력 바늘이 달을 따라 돎,기온 곡선 그려짐,비 막대 자람,달 이름 차례로 켜짐,그 달 날씨 글자 바뀜">
      <div className="wrap se-in">
        <div className="head">
          <h2><Lines l={[['몇 월에'], ['가면 좋을까요?']]} /></h2>
          <p className="lead"><Sents s={['퍼스는 남반구라 한국과 계절이 반대입니다.', '한국보다 1시간 늦고, 서머타임이 없습니다.']} /></p>
        </div>
        <div className="se-grid">
          <div className="se-dialbox" aria-hidden>
            <div className="se-dial">
              {Array.from({ length: 12 }, (_, i) => <span key={i} className="se-mon" style={{ transform: `rotate(${i * 30}deg) translateY(calc(var(--r) * -1)) rotate(${-i * 30}deg)` }}>{i + 1}</span>)}
            </div>
            <i className="se-hand" />
          </div>
          <div className="se-chart">
            <p className="se-now" aria-live="off"><b className="big num">9월</b><i>봄</i></p>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="퍼스 월별 평균 최고·최저 기온과 강수량">
              {climate.rain.map((r, i) => <rect key={i} className="se-rain" x={x(i) - 9} y={H - 30 - r * 0.9} width="18" height={r * 0.9} />)}
              <path className="se-curve se-curve--max" d={curve(climate.max)} pathLength={1} />
              <path className="se-curve se-curve--min" d={curve(climate.min)} pathLength={1} />
              {climate.max.map((_, i) => <text key={i} x={x(i)} y={H - 8} textAnchor="middle">{i + 1}</text>)}
            </svg>
            <p className="se-legend"><span className="se-k se-k--max">낮 기온</span><span className="se-k se-k--min">밤 기온</span><span className="se-k se-k--rain">강수량</span></p>
            <p className="src">출처: <a href={climate.url} target="_blank" rel="noreferrer">{climate.source}</a> · 시차: 위키백과 Perth</p>
            <p className="se-short"><a href="https://www.youtube.com/shorts/ij9v1CwwLLg" target="_blank" rel="noreferrer">와우호주 쇼츠 「9월에는 퍼스로 여행을 와야하는 이유 3」 보기</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
