import { facts, channels } from '../data/facts';
import { NAV } from './Header';
import { Sents } from './Lines';

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft__in">
        <img className="ft__logo" src="/logo/logo-ko-white.png" alt="와우호주" width="173" height="23" />
        <div className="ft__links">
          {NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          <a href="#/about">About Us</a>
          <a href="#/help">광고·제휴 문의</a>
        </div>
        <p className="ft__contact">
          <a href={facts.kakaoChat.value} target="_blank" rel="noreferrer">카톡 와우호주투어</a>
          <a href={`tel:${facts.phone.value.replace(/\s/g, '')}`}>{facts.phone.value}</a>
          <a href={`mailto:${facts.email.value}`}>{facts.email.value}</a>
          <a href={channels.insta} target="_blank" rel="noreferrer">인스타그램</a>
          <a href={channels.youtube} target="_blank" rel="noreferrer">유튜브</a>
          <a href={channels.site} target="_blank" rel="noreferrer">원래 사이트</a>
        </p>
        <p className="ft__note">
          WOW HOJU · ACN {facts.acn.value} · ABN {facts.abn.value} · 상담 {facts.hours.value}
        </p>
        <p className="ft__note">
          <Sents s={['이 페이지는 H&H가 만든 비공식 제안 시안이며 와우호주의 공식 홈페이지가 아닙니다.', '예약·결제는 진행되지 않고, 상담은 와우호주 공식 카톡채널·이메일로 연결됩니다.', '투어 가격·일정·문구는 2026.10.27 와우호주 사이트(wowhoju.com.au)·유튜브 채널 원문을 옮긴 것입니다.', '후기·평점은 마이리얼트립 와우호주 파트너 페이지 기준입니다.']} />
        </p>
        <p className="ft__credit">
          사진: 와우호주 사이트 업체 사진(일부 연결 상품 사진은 그 상품 공급사 제공) · 영상: 와우호주 유튜브 채널 원본에서 자른 장면, 별밤·물결 영상은 Mixkit 무료 라이선스 · 기후: 위키백과(BOM 1993–2020) · 환율: Frankfurter · 날씨: Open-Meteo · 글꼴: 카페24 써라운드, 마루부리, SUIT
        </p>
      </div>
    </footer>
  );
}
