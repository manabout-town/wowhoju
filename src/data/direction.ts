// 디자인 방향은 전부 업체 리서치에서 나온다. 결정마다 근거(basis)와 그 근거를 본 곳(from)을 적는다.
// from = 리서치 결과 파일(research/…json) · URL · 유저가 직접 지정했으면 'user:<날짜> 지시'. 근거 칸을 못 채우면 그 결정은 쓰지 않는다.
// 테스트(direction.test.ts)가 빈 칸·tokens.css 불일치를 막는다.
export type Pick = { value: string; basis: string; from: string };
export type Axis = { score: number; basis: string; from: string };
export const AXES = ['온도', '결', '속도', '시대', '시각'] as const;

export const direction: {
  purpose: 'brand' | 'franchise' | 'market' | 'card' | 'menu';
  vibe: Record<(typeof AXES)[number], Axis>;
  style: Pick;
  heroEffect: Pick;
  palette: { dark: Pick; light: Pick; brand: Pick; point: Pick };
  sub: Pick; // 숫자·링크 보조색 하나(detail-spec 허용)
  display: Pick;
  quote?: Pick;
  logo: Pick;
  introVideo: Pick;
  bgVideos: Pick[];
  props: Pick[];
  structure: Pick;
} = {
  purpose: 'market',
  vibe: {
    온도: { score: 4, basis: '「여행 그 이상, 우리 가족의 추억 만들기」·「동심으로 돌아가」 — 가족·동심 원문, 쨍한 한낮 단체 사진', from: 'research/copy.json#8' },
    결: { score: 3, basis: '붉은 사암·석회암 기둥의 거친 대지 + 둥근 로고 글자가 반반', from: 'research/design.json#lettering' },
    속도: { score: 4, basis: '「예상보다 스릴 만렙!」·「어른들도 집에가는걸 잊은 아이들처럼 노는」, 사진마다 점프·만세 포즈', from: 'research/copy.json#31' },
    시대: { score: 2, basis: '둥근 고딕 로고·원색 3색, 카테고리 배너도 원색 팝', from: 'research/design.json#colors' },
    시각: { score: 2, basis: '사진 92장 대부분 한낮, 노을·별빛은 투어의 마지막(「하루의 피날레」)', from: 'research/photos.json' },
  },
  style: { value: '에디토리얼(사진 주도)', basis: '업체 손님 실사 92장·자체 영상 2편이 주인공 + 브랜드 감성 원문 문장(「한 폭의 그림 같은 풍경」 등) 섹션 3곳 이상, 결 3', from: 'research/copy.json#1' },
  heroEffect: { value: '피너클스 하늘이 한낮 → 황금빛 노을 → 별밤으로 물듦', basis: '「해질 무렵, 피나클스가 황금빛으로 물드는 순간」·「시크릿 별빛 스팟」 — 대표 상품(가장 핫한 인기투어)의 하루', from: 'research/copy.json#33' },
  palette: {
    dark: { value: '#342c2a', basis: '피너클스 별밤 하늘(업체 영상 E58NPT7L_s4 118초 프레임 상단 평균)', from: 'research/video/E58NPT7L_s4.mp4' },
    light: { value: '#ded6c8', basis: '란셀린 흰 모래언덕(업체 사진 IMG_4640 영역 평균)', from: 'research/design.json#colors' },
    brand: { value: '#f15e53', basis: '로고 「WoW·와우」 코랄 레드', from: 'research/design.json#colors' },
    point: { value: '#fdb839', basis: '로고 「o」 노란 동그라미 = 피너클스 황금빛', from: 'research/design.json#colors' },
  },
  sub: { value: '#048cce', basis: '로고 「HoJu·호주」 블루 = 인도양', from: 'research/design.json#colors' },
  display: { value: 'cafe24 ssurround', basis: '로고 글자가 굵고 둥근 고딕 — 시험 렌더 3종(써라운드·주아·잘난체) 중 로고와 가장 닮음', from: 'user:2026-10-27 승인(「rkwk」)' },
  quote: { value: 'MaruBuri', basis: '브랜드 감성 문장 인용용 — 둥근 획의 명조라 로고 인상과 어긋나지 않음(에디토리얼)', from: 'research/copy.json#41' },
  logo: { value: '/logo/logo-ko.png', basis: '업체 실제 가로형 로고(865px) 원본 + 어두운 바탕용 흰색판. 새로 짓지 않음', from: 'https://wowhoju.com.au/wp-content/uploads/2022/08/wow-hoju-logo-horizontal-Korean.png' },
  introVideo: { value: '/video/lancelin.mp4', basis: '업체 유튜브 「설원같은 란셀린 모래사막에서 라이딩으로 시작한…」 54~62초, 흰 모래를 사륜구동으로 달림', from: 'https://www.youtube.com/watch?v=bfkfx84B2sw' },
  bgVideos: [
    { value: '/video/pinnacles.mp4', basis: '한낮 피너클스(대표 투어)', from: 'https://www.youtube.com/watch?v=bfkfx84B2sw' },
    { value: '/video/sunset.mp4', basis: '「노을 맛집」 해안 노을 실루엣', from: 'https://www.youtube.com/watch?v=bfkfx84B2sw' },
    { value: '/video/stars.mp4', basis: '「시크릿 별빛 스팟」 — 업체 별밤 영상은 세로 잘림이라 Mixkit 사막 별밤(46119)', from: 'research/design.json#mixkit' },
    { value: '/video/moore.mp4', basis: '「강과 바다가 만나는 로맨틱한 풍경, 무어리버」', from: 'research/copy.json#30' },
    { value: '/video/sandboard.mp4', basis: '「동심으로 돌아가 신나는 샌드보딩」', from: 'https://www.youtube.com/watch?v=E58NPT7L_s4' },
    { value: '/video/bbq.mp4', basis: '「노을 맛집 가기 전, 바다 앞 바베큐 한 끼」', from: 'research/copy.json#32' },
    { value: '/video/gorge.mp4', basis: '「서호주의 그랜드캐년 칼바리 국립공원」', from: 'research/copy.json#36' },
    { value: '/video/pinklake.mp4', basis: '「14km 규모의 핑크호수」', from: 'research/copy.json#36' },
    { value: '/video/skywalk.mp4', basis: '칼바리 스카이워크(업체 2박 3일 영상)', from: 'https://www.youtube.com/watch?v=bfkfx84B2sw' },
  ],
  props: [
    { value: '샌드보드(업체 단체 사진에서)', basis: '실물 칸 「샌드보딩」, 업체 사진 IMG_5959·IMG_4640·영상에 빨강·노랑 보드 여러 장', from: 'research/design.json#vibe' },
  ],
  structure: { value: '사진·영상 홍보 홈 + 기존 사이트 기능 전부(투어 목록·검색·상세·예약 문의·정보 페이지)', basis: '유저 지시', from: 'user:2026-10-27 「사진·영상 위주 홍보 + 원래 wowhoju 기능 전부」' },
};
