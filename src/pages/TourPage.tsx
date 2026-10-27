import { useMemo, useRef, useState } from 'react';
import { tourById, tours, quote, departsOn, type Tour } from '../data/tours';
import { reviews } from '../data/reviews';
import { facts } from '../data/facts';
import { Ph } from '../components/Ph';
import { Sents } from '../components/Lines';
import { TourMeta } from './TourMeta';
import './pages.css';

// 투어 상세: 원래 상세 페이지의 탭(여행 소개·투어 일정·지도·사진·후기)·정보 박스·가격·포함/불포함·일정 펼침·갤러리·관련 투어·예약 바(날짜·성인·아동)
const WD = '일월화수목금토';
const BG = (t: Tour) => (t.dest.includes('kalbarri') ? 'gorge' : t.dest.includes('pinnacles') ? 'pinnacles' : t.dest.includes('rottnest') ? 'ocean' : t.dest.includes('uluru') ? 'sunset' : t.dest.includes('margaret') || t.dest.includes('south') ? 'sunbush' : 'moore');
const clean = (s: string) => s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').trim();

export function TourPage({ id }: { id: string }) {
  const t = tours.find((x) => x.id === id);
  if (!t) return <section className="sec pg" data-bg="pinnacles"><div className="wrap"><h1 className="pg-h1">투어를 찾을 수 없습니다</h1><p className="lead"><a href="#/tours">전체 투어 보기</a></p></div></section>;
  return <Detail t={t} />;
}

function Detail({ t }: { t: Tour }) {
  const [shot, setShot] = useState<string | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const photos = useMemo(() => [...new Set([t.photo!, ...t.gallery])], [t]);
  const tReviews = t.id === 'pinnacles-sunset' ? reviews : [];
  const open = (s: string) => { setShot(s); dlg.current?.showModal(); };
  return (
    <>
      <section className="sec pg td-hero" data-bg={BG(t)}>
        <div className="td-cover" aria-hidden><Ph s={t.photo!} alt="" sizes="100vw" eager /></div>
        <div className="wrap td-top">
          <p className="td-crumb"><a href="#/tours">투어</a>{t.cats[0] && t.cats[0] !== 'must-go' ? <> · <a href={`#/tours/${t.cats.find((c) => c !== 'must-go' && c !== 'perth100') ?? ''}`}>목록</a></> : null}</p>
          <h1 className="pg-h1">{t.title}</h1>
          <TourMeta t={t} />
          <nav className="td-tabs" aria-label="상세 이동">
            <a href={`#/tour/${t.id}`} onClick={(e) => { e.preventDefault(); document.getElementById('td-intro')?.scrollIntoView({ behavior: 'smooth' }); }}>여행 소개</a>
            {t.stops.length > 0 && <a href="#td-plan" onClick={(e) => { e.preventDefault(); document.getElementById('td-plan')?.scrollIntoView({ behavior: 'smooth' }); }}>투어 일정</a>}
            {t.map && <a href="#td-map" onClick={(e) => { e.preventDefault(); document.getElementById('td-map')?.scrollIntoView({ behavior: 'smooth' }); }}>지도</a>}
            <a href="#td-photos" onClick={(e) => { e.preventDefault(); document.getElementById('td-photos')?.scrollIntoView({ behavior: 'smooth' }); }}>사진 {photos.length}</a>
            <a href="#td-reviews" onClick={(e) => { e.preventDefault(); document.getElementById('td-reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>후기</a>
            <a href="#td-book" className="td-tab-book" onClick={(e) => { e.preventDefault(); document.getElementById('td-book')?.scrollIntoView({ behavior: 'smooth' }); }}>예약 문의</a>
          </nav>
        </div>
      </section>

      <section id="td-intro" className="sec pg td" data-bg={BG(t)}>
        <div className="wrap td-grid">
          <div className="td-main">
            <dl className="td-info">
              {t.duration && <div><dt>기간</dt><dd>{t.duration}</dd></div>}
              <div><dt>출발</dt><dd>{t.avail || '문의'}{t.weekdays.length > 0 && t.weekdays.length < 7 ? ` (${t.weekdays.map((d) => WD[d]).join('·')})` : ''}</dd></div>
              {t.from && <div><dt>출발지</dt><dd>{t.from}</dd></div>}
              {t.to && <div><dt>도착지</dt><dd>{t.to}</dd></div>}
            </dl>
            {t.old && <p className="td-warn">원래 사이트에 남아 있는 옛 상품입니다(마지막 수정 {t.modified?.slice(0, 7)}). 지금 운영하는지는 상담으로 확인하세요.</p>}
            {t.intro.length > 0 && <div className="td-block"><h2>여행 소개</h2>{t.intro.map((x, i) => <p key={i} className={x.startsWith('[') ? 'td-sub' : 'lead'}>{x.startsWith('[') ? x.replace(/[[\]]/g, '') : <Sents s={clean(x)} />}</p>)}</div>}
            {t.priceText.length > 0 && <div className="td-block"><h3>가격</h3><ul className="td-ul">{t.priceText.map((x, i) => <li key={i}><Sents s={clean(x.replace(/^\*/, ''))} /></li>)}</ul></div>}
            {t.times.length > 0 && <div className="td-block"><h3>출발·도착 시간</h3><ul className="td-ul">{t.times.map((x, i) => <li key={i}><Sents s={clean(x.replace(/[[\]]/g, ''))} /></li>)}</ul></div>}
            {t.depart.length > 0 && <div className="td-block"><h3>출발·도착 장소</h3><ul className="td-ul">{t.depart.map((x, i) => <li key={i}><Sents s={clean(x)} /></li>)}</ul></div>}
            <div className="td-two">
              {t.included.length > 0 && <div className="td-block"><h3>포함</h3><ul className="td-ul td-ul--in">{t.included.map((x) => <li key={x}><Sents s={clean(x)} /></li>)}</ul></div>}
              {t.excluded.length > 0 && <div className="td-block"><h3>불포함</h3><ul className="td-ul td-ul--out">{t.excluded.map((x) => <li key={x}><Sents s={clean(x)} /></li>)}</ul></div>}
            </div>
            {t.bring.length > 0 && <div className="td-block"><h3>준비물</h3><ul className="td-ul">{t.bring.map((x, i) => <li key={i}><Sents s={clean(x)} /></li>)}</ul></div>}
            {t.notes.length > 0 && <div className="td-block"><h3>참고 사항</h3><ul className="td-ul">{t.notes.map((x, i) => <li key={i}><Sents s={clean(x.replace(/^\*/, ''))} /></li>)}</ul></div>}
            {t.refund.length > 0 && <div className="td-block"><h3>환불 규정</h3><ul className="td-ul">{t.refund.map((x, i) => <li key={i}><Sents s={clean(x)} /></li>)}</ul></div>}
          </div>
          <Booking t={t} />
        </div>
      </section>

      {t.stops.length > 0 && (
        <section id="td-plan" className="sec pg td" data-bg={BG(t) === 'gorge' ? 'pinklake' : 'sandboard'}>
          <div className="wrap">
            <h2 className="td-h2">투어 일정 {t.stops.length}단계</h2>
            <ol className="td-plan">
              {t.stops.map((s, i) => (
                <li key={i} className="reveal">
                  <details open={i < 3}>
                    <summary><i className="num">{i + 1}</i>{clean(s.t)}</summary>
                    {s.d.length > 0 && <div className="td-plan-d"><Sents s={s.d.map(clean).filter(Boolean)} /></div>}
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {t.map && (
        <section id="td-map" className="sec pg td" data-bg="skywalk">
          <div className="wrap">
            <h2 className="td-h2">지도</h2>
            <iframe className="td-mapframe" src={t.map} title={`${t.title} 경로 지도`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </section>
      )}

      <section id="td-photos" className="sec pg td" data-bg="sunset">
        <div className="wrap">
          <h2 className="td-h2">사진 {photos.length}장</h2>
          <ul className="td-gal">
            {photos.map((s) => <li key={s}><button type="button" onClick={() => open(s)} aria-label="크게 보기"><Ph s={s} alt="" sizes="(max-width: 760px) 50vw, 25vw" /></button></li>)}
          </ul>
        </div>
        <dialog ref={dlg} className="td-dlg" onClick={() => dlg.current?.close()}>
          {shot && <img src={`/img/${shot}-1600.webp`} alt="" />}
          <button type="button" className="td-dlg-x" onClick={() => dlg.current?.close()}>닫기</button>
        </dialog>
      </section>

      <section id="td-reviews" className="sec pg td" data-bg="stars">
        <div className="wrap">
          <h2 className="td-h2">후기</h2>
          {tReviews.length > 0 ? (
            <ul className="td-rev">
              {tReviews.map((r) => <li key={r.date + r.author} className="reveal"><p><Sents s={r.text} /></p><span>★★★★★ · {r.author} · {r.date.replaceAll('-', '.')}</span></li>)}
            </ul>
          ) : <p className="lead"><Sents s={['이 투어의 후기는 아직 옮기지 않았습니다.', '와우호주 투어 후기는 마이리얼트립 파트너 페이지에서 볼 수 있습니다.']} /></p>}
          <p className="src">출처: <a href={facts.mrtReviews.url} target="_blank" rel="noreferrer">마이리얼트립 와우호주 파트너 페이지</a> (평점 {facts.mrtRating.value} · 후기 {facts.mrtReviews.value}건, 2026.10.27 기준)</p>
          {t.related.length > 0 && (
            <div className="td-related">
              <h3>함께 보면 좋은 투어</h3>
              <ul>{t.related.map((rid) => { const r = tourById(rid); return <li key={rid}><a href={`#/tour/${rid}`}><Ph s={r.photo!} alt="" sizes="30vw" /><b>{r.title}</b><TourMeta t={r} /></a></li>; })}</ul>
            </div>
          )}
        </div>
      </section>
      <a className="td-sticky" href="#td-book" onClick={(e) => { e.preventDefault(); document.getElementById('td-book')?.scrollIntoView({ behavior: 'smooth' }); }}>
        <span>{t.price ? <>성인 <b className="num">${t.price}</b></> : '가격 문의'}</span><b>예약 문의</b>
      </a>
    </>
  );
}

// 예약 바: 원래 Tourmaster 예약(날짜·성인·아동 1~15)을 옮김. 시안이라 결제 단계 대신 카톡·이메일로 같은 내용을 보냄.
function Booking({ t }: { t: Tour }) {
  const [date, setDate] = useState('');
  const [ad, setAd] = useState(2);
  const [kd, setKd] = useState(0);
  const [copied, setCopied] = useState(false);
  const ok = !date || departsOn(t, date);
  const sum = quote(t, ad, kd);
  const today = new Date().toISOString().slice(0, 10);
  const msg = `[와우호주 예약 문의]\n투어: ${t.title}\n출발 날짜: ${date || '미정'}\n인원: 성인 ${ad}명${kd ? `, 아동 ${kd}명` : ''}\n예상 금액: ${sum != null ? `$${sum.toLocaleString('en-AU')} (호주달러, 할인 전)` : '상담 확인'}\n원래 상품 페이지: ${t.url}`;
  const copyKakao = async () => {
    try { await navigator.clipboard.writeText(msg); setCopied(true); } catch { setCopied(false); }
    window.open(facts.kakaoChat.value, '_blank', 'noopener');
  };
  return (
    <aside id="td-book" className="td-book" aria-label="예약 문의">
      <h2 className="td-book-h">예약 문의</h2>
      <label className="fl"><span>출발 날짜</span><input type="date" min={today} max={t.lastDate ?? undefined} value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={!ok} /></label>
      {!ok && <p className="td-bad">이 투어는 {t.weekdays.map((d) => WD[d]).join('·')}요일에 출발합니다.</p>}
      <div className="td-pax">
        <label className="fl fl--half"><span>성인</span><select value={ad} onChange={(e) => setAd(Number(e.target.value))}>{Array.from({ length: 15 }, (_, i) => <option key={i} value={i + 1}>{i + 1}명</option>)}</select></label>
        <label className="fl fl--half"><span>아동{t.childNote ? ` (${t.childNote})` : ''}</span><select value={kd} onChange={(e) => setKd(Number(e.target.value))}>{Array.from({ length: 16 }, (_, i) => <option key={i} value={i}>{i}명</option>)}</select></label>
      </div>
      <p className="td-sum"><span>예상 금액</span><b className="num">{sum != null ? `$${sum.toLocaleString('en-AU')}` : '상담 확인'}</b></p>
      <p className="td-sumnote">호주달러 · 인원 할인·할인코드는 상담에서 적용</p>
      <div className="td-acts">
        <button type="button" disabled={!ok} onClick={copyKakao}>카톡으로 예약 문의</button>
        <a aria-disabled={!ok} href={ok ? `mailto:${facts.email.value}?subject=${encodeURIComponent(`[예약 문의] ${t.title}`)}&body=${encodeURIComponent(msg)}` : undefined}>이메일로 예약 문의</a>
      </div>
      <p className="td-sumnote" aria-live="polite"><Sents s={copied ? '문의 내용을 복사했습니다. 카톡 대화창에 붙여 넣어 보내세요.' : '이 페이지는 제안 시안이라 결제는 진행되지 않습니다. 예약 확정·결제는 와우호주 상담으로 진행됩니다.'} /></p>
      <p className="td-sumnote"><a href="#/help">취소 수수료·FAQ 보기</a></p>
    </aside>
  );
}
