import { facts } from '../data/facts';
import { Lines, Sents } from '../components/Lines';
import { useClock, perthNow, isOpen, useRate, useWeather } from '../lib/live';

// 상담: 지금 퍼스 시각 시계 + 상담 중 여부 + 실시간 환율·날씨(원래 사이트 「호주환율보기·호주날씨보기」) + 연락처·집결지
export function Contact() {
  const now = useClock();
  const p = perthNow(now);
  const open = isOpen(p);
  const rate = useRate();
  const w = useWeather();
  const kr = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 3600000);
  return (
    <section id="contact" className="sec ct on-light" data-bg="lancelin" data-tone="day" data-fx="퍼스 시계 바늘이 돎,상담 중 불빛 깜빡,환율 숫자 떠오름,날씨 기온 떠오름,연락처 밑줄 반응">
      <div className="wrap">
        <div className="head">
          <h2><Lines l={[['카톡 한 줄이면'], ['상담이 시작됩니다']]} /></h2>
        </div>
        <div className="ct-grid">
          <div className="ct-clock">
            <svg viewBox="0 0 120 120" aria-hidden>
              <circle cx="60" cy="60" r="56" className="ct-face" />
              {Array.from({ length: 12 }, (_, i) => <line key={i} x1="60" y1="8" x2="60" y2="15" transform={`rotate(${i * 30} 60 60)`} className="ct-tick" />)}
              <line x1="60" y1="60" x2="60" y2="30" className="ct-h" transform={`rotate(${(p.h % 12) * 30 + p.m / 2} 60 60)`} />
              <line x1="60" y1="60" x2="60" y2="18" className="ct-m" transform={`rotate(${p.m * 6} 60 60)`} />
              <line x1="60" y1="64" x2="60" y2="14" className="ct-s" transform={`rotate(${p.s * 6} 60 60)`} />
            </svg>
            <p className="ct-time"><b className="num">{String(p.h).padStart(2, '0')}:{String(p.m).padStart(2, '0')}</b><span>지금 퍼스 · 한국 {String(kr.getHours()).padStart(2, '0')}:{String(kr.getMinutes()).padStart(2, '0')}</span></p>
            <p className={`ct-open${open ? ' is-on' : ''}`}><i />{open ? '지금 상담 시간입니다' : '지금은 상담 시간이 아닙니다 — 카톡을 남기면 상담 시간에 답합니다'}</p>
            <p className="ct-hours">{facts.hours.value}</p>
          </div>
          <div className="ct-live">
            <p className="ct-num"><span>환율</span><b className="num">{rate ? `1달러 = ${Math.round(rate.krw).toLocaleString('ko-KR')}원` : '불러오는 중'}</b><small>{rate ? `${rate.date} 유럽중앙은행 기준환율(Frankfurter)` : ''} · <a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noreferrer">xe.com에서 계산</a></small></p>
            <p className="ct-num"><span>퍼스 날씨</span><b className="num">{w ? `${Math.round(w.temp)}° ${w.text}` : '불러오는 중'}</b><small>{w ? `오늘 ${Math.round(w.min)}°~${Math.round(w.max)}° · Open-Meteo` : ''}</small></p>
          </div>
          <ul className="ct-links">
            <li><a href={facts.kakaoChat.value} target="_blank" rel="noreferrer"><b>카톡채널 「와우호주투어」</b><span>쉽고 편한 여행 상담</span></a></li>
            <li><a href={`tel:${facts.phone.value.replace(/\s/g, '')}`}><b>{facts.phone.value}</b><span>전화</span></a></li>
            <li><a href={`mailto:${facts.email.value}`}><b>{facts.email.value}</b><span>이메일</span></a></li>
          </ul>
          <div className="ct-meet">
            <h3>집결 장소</h3>
            <p><Sents s={['투어마다 집결 장소가 다릅니다.', '상품 페이지의 출발 장소를 확인하세요.']} /></p>
            <ul>
              <li>290 Wellington St, Perth — Australian Red Cross Lifeblood 앞 버스 정류장</li>
              <li>490 Wellington St, Perth — 퍼스 시티 기차역 앞 버스 정류장</li>
              <li>프리맨틀 B-Shed 터미널 — 로트네스트 상품</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
