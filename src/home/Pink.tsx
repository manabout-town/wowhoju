import { useRef } from 'react';
import { useScrub } from '../lib/scrub';
import { say } from '../data/copy';
import { tourById } from '../data/tours';
import { Lines, Sents } from '../components/Lines';
import { Ph } from '../components/Ph';

// 핑크호수·칼바리 2박 3일: 내리는 만큼 호수 사진이 가운데서 번지듯 커지며 분홍빛이 화면에 퍼짐.
// 근거: 상품 원문 「14km 규모의 '핑크호수'와 서호주의 그랜드캐년 '칼바리 국립공원'」, 「인생샷을 위한 포토존」
export function Pink() {
  const ref = useRef<HTMLElement>(null);
  const t = tourById('kalbarri-3d');
  useScrub(ref, (p, el) => {
    const bloom = el.querySelector<HTMLElement>('.pi-bloom')!;
    const k = Math.min(1, p * 1.6);
    bloom.style.transform = `scale(${(0.35 + 0.65 * k).toFixed(3)})`;
    bloom.style.opacity = String(Math.min(1, k * 1.4));
    el.querySelectorAll<HTMLElement>('.pi-col').forEach((c, i) => { c.style.transform = `translateY(${((0.5 - p) * (i % 2 ? 90 : -60)).toFixed(1)}px)`; });
    el.querySelectorAll<HTMLElement>('.pi-h .nw').forEach((w, i) => { w.style.opacity = String(Math.min(1, Math.max(0.15, p * 4 - i * 0.5))); });
    const u = el.querySelector<SVGPathElement>('.pi-under path');
    if (u) u.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, p * 2 - 0.4)));
    const n = el.querySelector<HTMLElement>('.pi-n');
    if (n) n.textContent = String(Math.round(t.price! * Math.min(1, p * 1.8)));
  }, { start: 'top 80%', end: 'bottom 40%', still: 1 });

  return (
    <section id="pink" ref={ref} className="sec pi" data-bg="pinklake" data-fx="분홍 호수가 번지듯 퍼짐,사진 기둥 시차,제목 구절 차례로,가격 올라감,밑줄 그려짐">
      <div className="pi-bloom" aria-hidden><Ph s="kalbarri-5" alt="" sizes="100vw" /></div>
      <div className="wrap pi-in">
        <div className="pi-text">
          <h2 className="pi-h"><Lines l={[['분홍빛 호수와'], ['붉은 협곡,'], ['2박 3일']]} /></h2>
          <svg className="pi-under" viewBox="0 0 300 12" aria-hidden><path d="M2 8 Q150 -2 298 8" pathLength={1} /></svg>
          <p className="quote pi-q">{say('photoZone')}</p>
          <p className="lead"><Sents s={[say('turquoise') + '.', `매주 ${t.avail.replace(' 출발', '')} 출발합니다.`]} /></p>
          <a className="pi-cta" href={`#/tour/${t.id}`}>성인 <b className="pi-n num">{t.price}</b><b>달러</b> · 일정 {t.stops.length}단계 보기</a>
        </div>
        <div className="pi-cols" aria-hidden>
          <div className="pi-col"><Ph s="img-6112" alt="" sizes="25vw" /><Ph s="kalbarri-4" alt="" sizes="25vw" /></div>
          <div className="pi-col"><Ph s="img-8972" alt="" sizes="25vw" /><Ph s="img-7040-copy-2" alt="" sizes="25vw" /></div>
        </div>
      </div>
    </section>
  );
}
