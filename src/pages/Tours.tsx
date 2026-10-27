import { useMemo } from 'react';
import { tours, filterTours, CATS, DESTS, DURS, type Filter } from '../data/tours';
import type { Route } from '../lib/route';
import { Ph } from '../components/Ph';
import { TourMeta } from './TourMeta';
import { uluruIntro, uluruFaq, uluruUrl } from '../data/uluru';
import { Sents } from '../components/Lines';
import './pages.css';

// 투어 목록·검색: 원래 메뉴(일일투어·단기여행·버스/선박·울룰루) + 원래 검색 페이지 필드(키워드·카테고리·목적지·기간·날짜·가격·정렬)
const BG: Record<string, string> = { 'full-day': 'pinnacles', short: 'gorge', 'bus-ferry': 'ocean', uluru: 'sunset', experience: 'skywalk' };
const SORTS: Record<string, string> = { home: '추천순', price: '가격', title: '이름', days: '기간', new: '최근 수정' };

function readFilter(r: Route): Filter {
  const q = r.query;
  const num = (k: string) => (q.get(k) ? Number(q.get(k)) : undefined);
  return { cat: r.parts[0] || q.get('cat') || undefined, q: q.get('q') ?? undefined, dest: q.get('dest') ?? undefined, dur: q.get('dur') ?? undefined, date: q.get('date') ?? undefined, min: num('min'), max: num('max'), sort: (q.get('sort') as Filter['sort']) ?? 'home', desc: q.get('desc') === '1' };
}

function writeFilter(f: Filter) {
  const q = new URLSearchParams();
  (['q', 'dest', 'dur', 'date', 'min', 'max', 'sort'] as const).forEach((k) => { const v = f[k]; if (v !== undefined && v !== '' && !(k === 'sort' && v === 'home')) q.set(k, String(v)); });
  if (f.desc) q.set('desc', '1');
  const qs = q.toString();
  history.replaceState(null, '', `#/tours${f.cat ? `/${f.cat}` : ''}${qs ? `?${qs}` : ''}`);
  dispatchEvent(new HashChangeEvent('hashchange'));
}

export function Tours({ route }: { route: Route }) {
  const f = readFilter(route);
  const list = useMemo(() => filterTours(tours, f), [route]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (patch: Partial<Filter>) => writeFilter({ ...f, ...patch });
  const title = (f.cat && CATS[f.cat]) || '전체 투어';
  return (
    <section className="sec pg tl" data-bg={BG[f.cat ?? ''] ?? 'pinnacles'}>
      <div className="wrap">
        <div className="head">
          <h1 className="pg-h1">{title}</h1>
          <nav className="tl-cats" aria-label="투어 종류">
            <a href="#/tours" aria-current={!f.cat ? 'page' : undefined}>전체</a>
            {Object.entries(CATS).map(([k, v]) => <a key={k} href={`#/tours/${k}`} aria-current={f.cat === k ? 'page' : undefined}>{v}</a>)}
          </nav>
        </div>
        {f.cat === 'uluru' && (
          <div className="tl-uluru">
            <p className="lead"><Sents s={uluruIntro} /></p>
            {uluruFaq.map((x) => <details key={x.q} className="fq"><summary>{x.q}</summary><p><Sents s={x.a} /></p></details>)}
            <p className="src">출처: <a href={uluruUrl} target="_blank" rel="noreferrer">와우호주 울룰루 페이지</a> · 울루루 상품은 현지 가이드 연결 상품이며 상세 환불 규정을 따릅니다.</p>
          </div>
        )}
        <form className="tl-form" role="search" onSubmit={(e) => e.preventDefault()}>
          <label className="fl fl--wide"><span>키워드</span><input type="search" defaultValue={f.q} placeholder="피너클스, 와이너리, 별빛…" onChange={(e) => set({ q: e.target.value || undefined })} /></label>
          <label className="fl"><span>목적지</span>
            <select value={f.dest ?? ''} onChange={(e) => set({ dest: e.target.value || undefined })}>
              <option value="">전체</option>{Object.entries(DESTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="fl"><span>기간</span>
            <select value={f.dur ?? ''} onChange={(e) => set({ dur: e.target.value || undefined })}>
              <option value="">전체</option>{Object.entries(DURS).map(([k, v]) => <option key={k} value={k}>{v[2]}</option>)}
            </select>
          </label>
          <label className="fl"><span>출발 날짜</span><input type="date" value={f.date ?? ''} onChange={(e) => set({ date: e.target.value || undefined })} /></label>
          <label className="fl fl--half"><span>최저 가격($)</span><input type="number" inputMode="numeric" min={0} value={f.min ?? ''} onChange={(e) => set({ min: e.target.value ? Number(e.target.value) : undefined })} /></label>
          <label className="fl fl--half"><span>최고 가격($)</span><input type="number" inputMode="numeric" min={0} value={f.max ?? ''} onChange={(e) => set({ max: e.target.value ? Number(e.target.value) : undefined })} /></label>
          <label className="fl"><span>정렬</span>
            <select value={f.sort} onChange={(e) => set({ sort: e.target.value as Filter['sort'] })}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="fl fl--check"><input type="checkbox" checked={!!f.desc} onChange={(e) => set({ desc: e.target.checked })} /><span>거꾸로</span></label>
        </form>
        <p className="tl-count" aria-live="polite"><b className="num">{list.length}</b>개 투어{f.date ? ` · ${f.date} 출발 가능` : ''}</p>
        {list.length === 0 && <p className="lead">조건에 맞는 투어가 없습니다. 조건을 줄이거나 <a href="#/custom">맞춤투어</a>로 문의하세요.</p>}
        <ul className="tl-list">
          {list.map((t) => (
            <li key={t.id} className="tl-row reveal">
              <a href={`#/tour/${t.id}`}>
                <span className="tl-ph"><Ph s={t.photo!} alt={t.title} sizes="(max-width: 760px) 100vw, 40vw" /></span>
                <span className="tl-tx">
                  <b className="tl-name">{t.title}</b>
                  {t.intro[0] && <span className="tl-intro">{(t.intro.find((x) => !x.startsWith('[')) ?? '').split(/(?<=[.!?])\s/)[0]}</span>}
                  <TourMeta t={t} />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="src">가격은 호주달러(원래 사이트 FAQ 「모든 투어의 금액은 호주달러 기준」), 2026.10.27 원래 사이트 상품 페이지 기준.</p>
      </div>
    </section>
  );
}
