// 투어 38개 — 원래 사이트 상품 페이지에서 옮김(생성: scripts/build-tours.py). 가격은 호주달러(FAQ 「모든 투어의 금액은 호주달러 기준」).
import data from './tours.json';

export type Stop = { t: string; d: string[] };
export type Tour = {
  id: string; wp: number; url: string; title: string;
  price: number | null; child: number | null; childNote: string | null; priceText: string[];
  duration: string | null; nDays: number; avail: string; weekdays: number[]; firstDate: string | null; lastDate: string | null;
  from: string | null; to: string | null; intro: string[]; depart: string[]; times: string[];
  included: string[]; excluded: string[]; notes: string[]; bring: string[]; refund: string[];
  stops: Stop[]; photo: string | null; gallery: string[]; map: string | null; related: string[];
  cats: string[]; dest: string[]; home: boolean; old: boolean; modified?: string | null;
};

export const tours = data as Tour[];
export const tourById = (id: string) => tours.find((t) => t.id === id)!;

// 원래 사이트 메뉴(일일투어·단기여행·버스/선박·울룰루) + 메뉴에 없던 체험투어
export const CATS: Record<string, string> = { 'full-day': '일일투어', short: '단기여행', 'bus-ferry': '버스 / 선박 투어', uluru: '울룰루', experience: '체험투어' };
export const DESTS: Record<string, string> = { perth: '퍼스·프리맨틀', pinnacles: '피너클스', kalbarri: '칼바리·핑크호수', margaret: '마가렛리버', south: '남부·알바니', waverock: '웨이브락', rottnest: '로트네스트', uluru: '울루루', north: '북부·브룸' };
// 원래 검색 페이지의 기간 구간
export const DURS: Record<string, [number, number, string]> = { d1: [1, 1, '1일 투어'], d2: [2, 4, '2~4일'], d5: [5, 7, '5~7일'], d7: [8, 99, '7일 넘게'] };

export type Filter = { q?: string; cat?: string; dest?: string; dur?: string; min?: number; max?: number; date?: string; sort?: 'home' | 'price' | 'title' | 'days' | 'new'; desc?: boolean };

// 출발 가능일: 요일이 정해진 상품은 그 요일만, 「매일」·「문의」 상품은 어느 날이든(문의로 확정)
export const departsOn = (t: Tour, iso: string) => {
  if (!iso) return true;
  if (!t.weekdays.length) return true;
  const wd = new Date(`${iso}T12:00:00`).getDay();
  return t.weekdays.includes(wd);
};

export function filterTours(list: Tour[], f: Filter) {
  const q = f.q?.trim().toLowerCase();
  let r = list.filter((t) =>
    (!q || [t.title, ...t.intro, ...t.stops.map((s) => s.t)].join(' ').toLowerCase().includes(q)) &&
    (!f.cat || t.cats.includes(f.cat)) &&
    (!f.dest || t.dest.includes(f.dest)) &&
    (!f.dur || (t.nDays >= DURS[f.dur][0] && t.nDays <= DURS[f.dur][1])) &&
    (f.min == null || (t.price ?? 0) >= f.min) &&
    (f.max == null || (t.price ?? Infinity) <= f.max) &&
    departsOn(t, f.date ?? ''),
  );
  const s = f.sort ?? 'home';
  const key: Record<string, (t: Tour) => number | string> = {
    home: (t) => (t.home ? 0 : 1) * 1000 + (t.old ? 500 : 0) + list.indexOf(t),
    price: (t) => t.price ?? 1e9, title: (t) => t.title, days: (t) => t.nDays, new: (t) => -(Date.parse(t.modified ?? '2000-01-01') / 1e10),
  };
  r = [...r].sort((a, b) => { const x = key[s](a), y = key[s](b); return x < y ? -1 : x > y ? 1 : 0; });
  return f.desc ? r.reverse() : r;
}

// 예약 금액: 성인·아동 수 × 가격. 아동가 없는 상품은 성인가로 계산하지 않고 null(상담으로 확정)
export function quote(t: Tour, adults: number, kids: number) {
  if (t.price == null) return null;
  if (kids > 0 && t.child == null) return null;
  return adults * t.price + kids * (t.child ?? 0);
}
