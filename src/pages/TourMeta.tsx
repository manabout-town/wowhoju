import type { Tour } from '../data/tours';

// 투어 한 줄 정보: 가격(호주달러)·기간·출발 — 원래 카드의 From 가격·기간·Availability
export function TourMeta({ t }: { t: Tour }) {
  return (
    <span className="tm">
      <span className="tm-price">{t.price ? <><small>성인</small> <b className="num">${t.price.toLocaleString('en-AU')}</b>{t.child ? <small> · 아동 ${t.child}</small> : null}</> : <b>가격 문의</b>}</span>
      <span className="tm-info">{[t.duration, t.avail].filter(Boolean).join(' · ')}</span>
      {t.old && <span className="tm-old">운영 여부는 상담으로 확인</span>}
    </span>
  );
}
