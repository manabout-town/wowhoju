# 와우호주 원래 사이트(wowhoju.com.au) 수정 키트 — 2026-11-01

대표님 요청 3건 중 1·2·3을 워드프레스 관리자 화면에서 **붙여넣기만으로** 적용한다. 테마 파일·플러그인은 건드리지 않는다.
테마: Traveltour(GoodLayers) · WordPress 6.8 — 2026-11-01 라이브 페이지에 주입해 1440·1100·430·390·320 폭 확인.

## 1. 상단 오른쪽 '카톡상담' (카톡 노랑 밑줄)
1. 관리자 → 외모 → Traveltour Option(테마 옵션) → Header → **Top Bar** → `Top Bar Right Text` 칸
2. `topbar-right.html` 한 줄을 붙여넣고 저장.
   - 이 칸이 없으면: 외모 → 메뉴 → 메인 메뉴 맨 끝에 '사용자 정의 링크'(URL `https://pf.kakao.com/_rxfkLC/chat`, 이름 `카톡상담`), 화면 옵션에서 'CSS 클래스' 켜고 `wh-talk` 입력.

## 2. 새 메뉴 '여행이야기' → 새로 만든 사이트
1. 외모 → 메뉴 → 메인 메뉴 → 사용자 정의 링크: URL `https://wowhoju.vercel.app/`, 이름 `여행이야기`(또는 `블로그`)
2. '고객센터' 바로 앞으로 끌어 놓기. CSS 클래스 `wh-story`(코랄색 강조, 빼도 됨). 저장.
3. 매달 수정: 새 사이트의 영상·글은 `src/data/*.json` 을 바꾸고 push 하면 Vercel 이 자동 반영.

## 3. 하단 짧게 (내용은 그대로)
1. 외모 → 사용자 정의하기 → **추가 CSS** 에 `additional.css` 전체를 붙여넣고 공개.
2. 결과: PC 하단 940px → 451px, 폰 2,148px → 1,042px. 회사 정보·ACN/ABN·운영 시간·전화·이메일·카톡·계좌·SSL 안내·Quality Tourism 배지·인스타/유튜브는 다 남는다.
   빠지는 것: 위 로고와 중복된 큰 로고, 링크 없는 페이스북 아이콘, 빈 줄.

되돌리기: 추가 CSS 지우기 · Top Bar Right Text 비우기 · 메뉴 항목 삭제.
