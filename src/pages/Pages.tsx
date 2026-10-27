import { say } from '../data/copy';
import { facts, channels } from '../data/facts';
import posts from '../data/posts.json';
import help from '../data/help.json';
import type { Route } from '../lib/route';
import { useRate, useWeather } from '../lib/live';
import { Ph } from '../components/Ph';
import { Lines, Sents } from '../components/Lines';
import { MailForm } from './Forms';
import './pages.css';

// ── 맞춤투어: 원래 「허니문·가족·단체 맞춤 안내 + 카톡·이메일」(폼 없음) → 안내 + 문의 폼
export function CustomPage() {
  return (
    <>
      <section className="sec pg" data-bg="bbq">
        <div className="wrap pg-split">
          <div>
            <h1 className="pg-h1"><Lines l={[['나만을 위한'], ['특별한 여행']]} /></h1>
            <p className="quote pg-q">{say('custom3')}</p>
            <p className="lead"><Sents s={[say('custom1'), say('hidden2') + '.']} /></p>
            <p className="lead"><Sents s={say('partner')} /></p>
            <p className="src">문장 출처: 와우호주 사이트 About Us·홈 본문</p>
          </div>
          <div className="pg-photos"><Ph s="img-5155-1" alt="칼바리 협곡을 바라보는 가족" /><Ph s="winery" alt="와이너리 시음" /></div>
        </div>
      </section>
      <section className="sec pg" data-bg="sunset">
        <div className="wrap">
          <h2>맞춤투어 문의</h2>
          <MailForm subject="[맞춤투어 문의]" fields={[
            { k: 'name', label: '이름', req: true }, { k: 'email', label: '이메일', type: 'email', req: true }, { k: 'phone', label: '연락처(카톡 ID 가능)', type: 'tel' },
            { k: 'date', label: '여행 시작일', type: 'date' }, { k: 'days', label: '여행 일수', type: 'number' }, { k: 'pax', label: '인원(성인·아동)', ph: '성인 2, 아동 1' },
            { k: 'where', label: '가고 싶은 곳', ph: '피너클스, 마가렛리버…' }, { k: 'msg', label: '원하는 여행', type: 'textarea', req: true, ph: '여행 목적, 꼭 하고 싶은 것, 숙소 수준 등' },
          ]} />
        </div>
      </section>
    </>
  );
}

// ── 여행정보: 원래 이미지 타일 12개(환율·날씨·행사·일반정보·지역 7곳·뉴스) → 실시간 환율·날씨 + 글 목록
const TILES: [string, string, string][] = [
  ['wa-events', '이벤트 행사 정보', 'perth-city-3'], ['travel-introduction', '호주여행 일반정보', 'perth-city-1'], ['perth', '퍼스', 'perth-city'],
  ['fremantle', '프리맨틀', 'cruize-10'], ['rottnest', '로트네스트', 'rottnest-31'], ['wave-rock', '웨이브락', 'wave-rock-4'], ['kalbarri', '칼바리', 'img-1489'],
  ['margaret-river', '마가렛리버', 'margaret-river-3'], ['pinnacles', '피나클스', 'pinnacles-14'], ['albany', '앨버니', 'kakaotalk-photo-2019-11-04-12-52-52'],
  ['restaurants', '서호주 맛집', 'bbq-dinner'], ['news', '서호주 뉴스', 'perth-city-2'],
];
type Cat = { slug: string; name: string; url: string; posts: { date: string; title: string; url: string }[] };
const cats = posts.cats as Cat[];

export function InfoPage({ route }: { route: Route }) {
  const rate = useRate();
  const w = useWeather();
  const sel = route.parts[0] ? cats.find((c) => c.slug === route.parts[0]) : null;
  if (sel) {
    return (
      <section className="sec pg" data-bg="moore">
        <div className="wrap">
          <p className="td-crumb"><a href="#/info">여행정보</a></p>
          <h1 className="pg-h1">{sel.name}</h1>
          <p className="lead">글 {sel.posts.length}개 · 글을 누르면 와우호주 원래 사이트에서 열립니다.</p>
          <ul className="po-list">{sel.posts.map((p) => <li key={p.url}><a href={p.url} target="_blank" rel="noreferrer"><b>{p.title}</b><span className="num">{p.date.replaceAll('-', '.')}</span></a></li>)}</ul>
        </div>
      </section>
    );
  }
  return (
    <>
      <section className="sec pg" data-bg="lancelin" data-tone="day">
        <div className="wrap on-light">
          <h1 className="pg-h1">여행정보</h1>
          <div className="if-live">
            <p className="ct-num"><span>호주 환율</span><b className="num">{rate ? `1달러 = ${Math.round(rate.krw).toLocaleString('ko-KR')}원` : '불러오는 중'}</b><small>{rate ? `${rate.date} 유럽중앙은행 기준(Frankfurter)` : ''} · <a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noreferrer">xe.com 환율 계산기</a></small></p>
            <p className="ct-num"><span>퍼스 날씨</span><b className="num">{w ? `${Math.round(w.temp)}° ${w.text}` : '불러오는 중'}</b><small>{w ? `오늘 ${Math.round(w.min)}°~${Math.round(w.max)}° · Open-Meteo` : ''} · <a href="https://www.weatherzone.com.au/" target="_blank" rel="noreferrer">weatherzone</a></small></p>
          </div>
        </div>
      </section>
      <section className="sec pg" data-bg="skywalk">
        <div className="wrap">
          <h2>지역·주제별 글</h2>
          <ul className="if-tiles">
            {TILES.map(([slug, name, img]) => {
              const c = cats.find((x) => x.slug === slug);
              if (!c) return null;
              return <li key={slug} className="reveal"><a href={`#/info/${slug}`}><Ph s={img} alt="" sizes="(max-width: 760px) 50vw, 25vw" /><b>{name}</b><span className="num">글 {c.posts.length}개</span></a></li>;
            })}
          </ul>
        </div>
      </section>
      <section className="sec pg" data-bg="ocean">
        <div className="wrap">
          <h2>최근 글</h2>
          <ul className="po-list">{posts.recent.map((p) => <li key={p.url}><a href={p.url} target="_blank" rel="noreferrer"><b>{p.title}</b><span className="num">{p.date.replaceAll('-', '.')}</span></a></li>)}</ul>
          <p className="src">블로그 글 {posts.total}개 중 최근 글(원래 사이트 2026.10.27 기준). 날짜가 오래된 행사·뉴스는 그때 기준 내용입니다.</p>
          <div className="if-events">
            <h3>이벤트(진행 여부는 상담으로 확인)</h3>
            <ul className="pg-ul">
              <li><b>후기 쓰고 쿠폰 받기</b> 여행 후 30일 안에 후기를 남기면 $30 할인 코드(원래 사이트 안내)</li>
              <li><b>SNS 팔로우 쿠폰</b> 와우호주 SNS 중 두 곳을 팔로우하면 $5 할인 코드(원래 사이트 안내)</li>
              <li><b>스냅 투어</b> 투어 중 사진 촬영 상품 3종(인당 $240~$310, 원래 사이트 가격표)</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

// ── 고객센터: 연락처·투어 검색·FAQ·취소 수수료·이용약관·개인정보·연락 폼·광고/제휴 문의
type Faq = { section: string; q: string; a: string };
export function HelpPage() {
  const faq = help.faq as Faq[];
  const groups = [...new Set(faq.map((f) => f.section))];
  const pol = help.pol as { userAgreement: { fullText: string; url: string }; privacy: { fullText: string; url: string }; cancellationFee: { rules: string[]; note: string; url: string } };
  return (
    <>
      <section className="sec pg" data-bg="moore">
        <div className="wrap pg-split">
          <div>
            <h1 className="pg-h1">고객센터</h1>
            <ul className="ct-links">
              <li><a href={facts.kakaoChat.value} target="_blank" rel="noreferrer"><b>카톡채널 「와우호주투어」</b><span>{facts.hours.value}</span></a></li>
              <li><a href={`tel:${facts.phone.value.replace(/\s/g, '')}`}><b>{facts.phone.value}</b><span>전화</span></a></li>
              <li><a href={`mailto:${facts.email.value}`}><b>{facts.email.value}</b><span>이메일</span></a></li>
            </ul>
          </div>
          <form className="tl-form" role="search" onSubmit={(e) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); location.hash = `#/tours?q=${encodeURIComponent(String(q ?? ''))}`; }}>
            <label className="fl fl--wide"><span>투어 찾기</span><input name="q" type="search" placeholder="피너클스, 로트네스트…" /></label>
            <p className="mf-acts"><button type="submit">검색</button></p>
          </form>
        </div>
      </section>
      <section id="faq" className="sec pg" data-bg="sunbush">
        <div className="wrap">
          <h2>자주 하는 질문</h2>
          {groups.map((g) => (
            <div key={g} className="fq-g">
              <h3>{g}</h3>
              {faq.filter((f) => f.section === g).map((f) => <details key={f.q} className="fq"><summary><Sents s={f.q.replace(/\s+\?/g, '?')} /></summary><p><Sents s={f.a.split('\n').filter(Boolean)} /></p></details>)}
            </div>
          ))}
          <p className="src">출처: <a href={help.faqUrl} target="_blank" rel="noreferrer">와우호주 FAQ</a></p>
        </div>
      </section>
      <section id="policy" className="sec pg" data-bg="stars">
        <div className="wrap">
          <h2>취소 수수료</h2>
          <ul className="pg-ul pg-ul--fee">{pol.cancellationFee.rules.map((r) => <li key={r}>{r}</li>)}</ul>
          <p className="lead"><Sents s={['울루루 상품은 상세페이지 환불 규정에 따라 취소·환불이 되지 않습니다.', '제3자 공급사의 환불 정책이 먼저 적용될 수 있습니다.']} /></p>
          <details className="fq fq--doc"><summary>이용약관 전문</summary><div className="fq-doc">{pol.userAgreement.fullText.split('\n').filter(Boolean).map((l, i) => <p key={i}><Sents s={l} /></p>)}</div></details>
          <details className="fq fq--doc"><summary>개인정보취급방침 전문</summary><div className="fq-doc">{pol.privacy.fullText.split('\n').filter(Boolean).map((l, i) => <p key={i}><Sents s={l} /></p>)}</div></details>
          <p className="src">출처: <a href={pol.userAgreement.url} target="_blank" rel="noreferrer">이용약관</a> · <a href={pol.privacy.url} target="_blank" rel="noreferrer">개인정보취급방침</a> (MADANG GROUP PTY LTD, 원래 사이트 원문)</p>
        </div>
      </section>
      <section id="ask" className="sec pg" data-bg="ocean">
        <div className="wrap pg-split">
          <div><h2>문의하기</h2><MailForm subject="[고객센터 문의]" fields={[{ k: 'name', label: '이름', req: true }, { k: 'email', label: '이메일', type: 'email', req: true }, { k: 'title', label: '제목' }, { k: 'msg', label: '문의 내용', type: 'textarea', req: true }]} /></div>
          <div id="partner"><h2>광고·제휴 문의</h2><MailForm subject="[광고/제휴 문의]" fields={[{ k: 'name', label: '이름', req: true }, { k: 'email', label: '이메일', type: 'email', req: true }, { k: 'title', label: '제목' }, { k: 'msg', label: '문의 내용', type: 'textarea', req: true }]} /></div>
        </div>
      </section>
    </>
  );
}

// ── About Us: 회사 소개·Why Book With Us 3항목·사업자 정보
export function AboutPage() {
  return (
    <>
      <section className="sec pg" data-bg="pinnacles">
        <div className="wrap pg-split">
          <div>
            <h1 className="pg-h1">와우호주</h1>
            <p className="quote pg-q">{say('aboutLocal')}</p>
            <p className="lead"><Sents s={[say('aboutLived'), say('aboutGuide')]} /></p>
            <p className="claim">와우호주 About Us 소개 문장</p>
          </div>
          <div className="pg-photos"><Ph s="img-6128" alt="칼바리 해안 전망대 단체 사진" /><Ph s="img-1478-1" alt="피너클스 은하수 아래 손님들" /></div>
        </div>
      </section>
      <section className="sec pg" data-bg="gorge">
        <div className="wrap">
          <h2>와우호주와 함께하면</h2>
          <ul className="ab-why">
            <li><b>{say('custom2')}</b><span><Sents s={say('custom3')} /></span></li>
            <li><b>{say('hidden1')}</b><span><Sents s={say('hidden2') + '.'} /></span></li>
            <li><b>{say('culture')}</b><span><Sents s={say('careful') + '.'} /></span></li>
          </ul>
        </div>
      </section>
      <section className="sec pg" data-bg="sunset">
        <div className="wrap">
          <h2>회사 정보</h2>
          <dl className="td-info">
            <div><dt>운영</dt><dd>MADANG GROUP PTY LTD · <a href={channels.hojumadang} target="_blank" rel="noreferrer">호주마당</a> 운영</dd></div>
            <div><dt>ABN</dt><dd>{facts.abn.value}</dd></div>
            <div><dt>ACN</dt><dd>{facts.acn.value}</dd></div>
            <div><dt>상담</dt><dd>{facts.hours.value}</dd></div>
          </dl>
          <p className="src">출처: <a href={facts.abn.url} target="_blank" rel="noreferrer">호주 사업자 등록부(ABR)</a> · 와우호주 About Us·사이트 푸터</p>
          <p className="mf-acts"><a href="#/help">광고·제휴 문의</a><a href="#/help">고객센터</a></p>
        </div>
      </section>
    </>
  );
}
