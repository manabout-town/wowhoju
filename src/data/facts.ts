// 페이지의 모든 수치·사실은 여기 한 곳에서만. 출처 없는 값은 넣지 않는다.
// claim: true = 업체 자체 주장(제3자 검증 없음) → 화면에서 인용으로만.
export type Fact<T> = { value: T; source: string; url?: string; asOf: string; claim?: boolean };

const ABR = 'https://abr.business.gov.au/ABN/View?abn=14606553333';
const MRT = 'https://www.myrealtrip.com/guides/10541';

export const facts = {
  mrtRating: { value: 5.0, source: '마이리얼트립 파트너 페이지', url: MRT, asOf: '2026-10-27' },
  mrtReviews: { value: 97, source: '마이리얼트립 파트너 페이지', url: MRT, asOf: '2026-10-27' },
  mrtYears: { value: 7, source: '마이리얼트립 파트너 페이지(파트너 연수)', url: MRT, asOf: '2026-10-27' },
  abnSince: { value: 2015, source: '호주 사업자 등록부(ABR) — MADANG GROUP PTY LTD', url: ABR, asOf: '2026-10-27' },
  abn: { value: '14 606 553 333', source: '호주 사업자 등록부(ABR)', url: ABR, asOf: '2026-10-27' },
  acn: { value: '606 553 333', source: '사이트 푸터', url: 'https://wowhoju.com.au/', asOf: '2026-10-27' },
  wowHojuName: { value: 2022, source: '호주 사업자 등록부(ABR) — 상호 WoW Hoju 등록', url: ABR, asOf: '2026-10-27' },
  insta: { value: 5524, source: '인스타그램 @wowhoju 프로필', url: 'https://www.instagram.com/wowhoju/', asOf: '2026-10-27' },
  instaPosts: { value: 903, source: '인스타그램 @wowhoju 프로필', url: 'https://www.instagram.com/wowhoju/', asOf: '2026-10-27' },
  blogPosts: { value: 173, source: '와우호주 사이트 블로그(wp-json)', url: 'https://wowhoju.com.au/wp-json/wp/v2/posts', asOf: '2026-10-27' },
  tourCount: { value: 38, source: '와우호주 사이트 투어 상품(wp-json)', url: 'https://wowhoju.com.au/wp-json/wp/v2/tour?per_page=100', asOf: '2026-10-27' },
  livedYears: { value: '20년 가까이', source: '와우호주 About Us', url: 'https://wowhoju.com.au/about-us/', asOf: '2026-10-27', claim: true },
  restart: { value: 2022, source: '와우호주 블로그 2025-08-30', url: 'https://wowhoju.com.au/blog/', asOf: '2025-08-30', claim: true },
  phone: { value: '+61 416 471 983', source: '사이트 푸터', url: 'https://wowhoju.com.au/', asOf: '2026-10-27' },
  email: { value: 'info@wowhoju.com.au', source: '사이트 푸터', url: 'https://wowhoju.com.au/', asOf: '2026-10-27' },
  kakao: { value: 'https://pf.kakao.com/_rxfkLC', source: '사이트 카톡채널 버튼(와우호주투어)', url: 'https://wowhoju.com.au/', asOf: '2026-10-27' },
  kakaoChat: { value: 'https://pf.kakao.com/_rxfkLC/chat', source: '사이트 카톡채널 버튼', url: 'https://wowhoju.com.au/', asOf: '2026-10-27' },
  hours: { value: '월~토 09:00~18:00 (퍼스 시간), 일요일·공휴일 휴무', source: '사이트 푸터', url: 'https://wowhoju.com.au/', asOf: '2026-10-27' },
  tz: { value: 8, source: '위키백과 Perth — AWST UTC+8, 서머타임 없음', url: 'https://en.wikipedia.org/wiki/Perth', asOf: '2026-10-27' },
} satisfies Record<string, Fact<unknown>>;

export const channels = {
  insta: 'https://www.instagram.com/wowhoju/',
  youtube: 'https://www.youtube.com/channel/UC66tLCGUrGn2o4KvMUHeOQg',
  site: 'https://wowhoju.com.au/',
  mrt: MRT,
  hojumadang: 'https://www.hojumadang.com',
};

// 퍼스 월별 기후(BOM 1993–2020, 위키백과 표)
export const climate = {
  source: '위키백과 Climate of Perth(BOM 자료 1993–2020)',
  url: 'https://en.wikipedia.org/wiki/Climate_of_Perth',
  max: [31.4, 31.7, 29.7, 26.0, 22.4, 19.5, 18.5, 19.2, 20.6, 23.5, 26.8, 29.6],
  min: [18.1, 18.4, 16.9, 13.8, 10.5, 8.7, 8.1, 8.5, 9.7, 11.7, 14.4, 16.6],
  rain: [16.7, 13.1, 20.0, 35.9, 86.2, 127.1, 147.0, 122.7, 79.3, 39.5, 24.2, 9.4],
  sun: [11.5, 11.0, 9.6, 8.3, 6.9, 5.9, 6.1, 7.2, 7.7, 9.6, 10.6, 11.5],
};

export type Store = {
  name: string; area: string; address: string; tel: string; hours: string; open: number; close: number;
  naverId: string; kakaoId: string; lat: number; lng: number; visitor: number; rating: number;
  feature: string; photo: string; photoNote?: string;
};
export const stores: Store[] = []; // 여행사라 매장 없음(사무실 주소 비공개)
