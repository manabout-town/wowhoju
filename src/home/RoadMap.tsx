import { useRef } from 'react';
import { useScrub } from '../lib/scrub';
import { Lines, Sents } from '../components/Lines';
import { Ph } from '../components/Ph';
import { PLACES, ROUTES, routeLen } from './places';
import { LAND, ROAD, MAP_W, MAP_H, proj } from './mapData';

// 서호주 로드트립 지도: 퍼스에서 북·남·동으로 사륜구동 경로선이 그려지고 지명이 차례로 켜짐.
// 위치는 실제 위도·경도(위키백과), 거리는 research/local.json 위키백과 값.
export function RoadMap() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (p, el) => {
    el.querySelectorAll<SVGPathElement>('.rm-route').forEach((r, i) => {
      const k = Math.min(1, Math.max(0, p * 1.4 - i * 0.12));
      r.style.strokeDashoffset = String(1 - k);
    });
    el.querySelectorAll<HTMLElement>('.rm-pin').forEach((pin) => {
      const at = Number(pin.dataset.at);
      pin.classList.toggle('on', p * 1.5 >= at);
    });
    el.querySelectorAll<HTMLElement>('.rm-km').forEach((k) => {
      const v = Number(k.dataset.v);
      k.textContent = Math.round(v * Math.min(1, p * 1.4)).toLocaleString('ko-KR');
    });
    el.querySelectorAll<HTMLElement>('.rm-ph').forEach((ph, i) => {
      const o = Math.min(1, Math.max(0, p * 2.2 - i * 0.35));
      ph.style.opacity = String(o);
      ph.style.transform = `translateY(${((1 - o) * 30).toFixed(1)}px)`;
    });
  }, { start: 'top 70%', end: 'bottom 70%', still: 1 });

  return (
    <section id="map" ref={ref} className="sec rm" data-bg="skywalk" data-fx="경로선이 그려짐,지명 차례로 켜짐,거리 숫자 올라감,사진 떠오름,퍼스 점 맥박">
      <div className="wrap">
        <div className="head">
          <h2><Lines l={[['퍼스에서 출발해'], ['북쪽·남쪽·동쪽으로']]} /></h2>
          <p className="lead"><Sents s={['투어 대부분은 퍼스 시티에서 출발합니다.', '로트네스트는 프리맨틀 항구, 울루루는 현지에서 출발합니다.', '지명을 누르면 그곳에 가는 투어를 볼 수 있습니다.']} /></p>
        </div>
        <div className="rm-grid">
          <svg className="rm-map" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label="서호주 실제 지도 위 투어 경로">
            <g className="rm-land">{LAND.map((d, i) => <path key={i} d={d} />)}</g>
            <text className="rm-sea" x="22" y={MAP_H * 0.42}>인도양</text>
            {ROUTES.map((r) => <path key={r.id} className={`rm-route rm-route--${r.tone}`} d={ROAD[r.id].d} pathLength={1} />)}
            <path className="rm-route rm-route--ferry" d={ROAD.ferry.d} pathLength={1} />
            {PLACES.map((pl) => {
              const [x, y] = proj(pl.lat, pl.lng);
              return (
                <a key={pl.name} href={`#/tours?dest=${pl.dest}`} className={`rm-pin${pl.name === '퍼스' ? ' rm-pin--home' : ''}`} data-at={pl.at}>
                  <circle cx={x} cy={y} r={pl.name === '퍼스' ? 7 : 5} />
                  <text x={x + (pl.left ? -10 : 10)} y={y + 5} textAnchor={pl.left ? 'end' : 'start'}>{pl.name}</text>
                </a>
              );
            })}
          </svg>
          <div className="rm-side">
            <ul className="rm-list">
              {ROUTES.map((r) => (
                <li key={r.id} className={`rm-li rm-li--${r.tone}`}>
                  <b>{r.label}</b>
                  <span>{r.kmTo}까지 차로 약 <i className="rm-km num" data-v={routeLen(r)}>{routeLen(r).toLocaleString('ko-KR')}</i>km · {r.note}</span>
                </li>
              ))}
            </ul>
            <div className="rm-photos">
              <Ph s="kalbarri-4" alt="칼바리 머치슨강 협곡" className="rm-ph" sizes="30vw" />
              <Ph s="wave-rock-4" alt="웨이브락 파도 모양 화강암" className="rm-ph" sizes="30vw" />
              <Ph s="margaret-river-5" alt="캐널록스 바위 사이 파도" className="rm-ph" sizes="30vw" />
            </div>
            <p className="src">지도: Natural Earth 해안선 · 경로·거리: 실제 도로 주행 경로(OSRM, © OpenStreetMap contributors) · 로트네스트는 프리맨틀에서 배</p>
          </div>
        </div>
      </div>
    </section>
  );
}
