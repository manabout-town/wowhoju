// 자동으로 움직이는 요소가 실제 시간 흐름에서 멈추거나 덜 그려진 채 서 있지 않은지: node scripts/auto.mjs <base> [w] [h]
// 템플릿: SLIDES 목록·타이핑·카운트 선택자를 사이트에 맞게 바꿔 쓴다(원본 신사 v4).
// 조건을 일부러 나쁘게 잡는다 — 마우스를 섹션 한가운데 올려 두고, 섹션 위쪽만 화면 아래 40%에 걸치게(덜 보이는 상태)도 본다.
// 실패 예: 타이핑이 "손님이 검"에서 멈춤(10-08 반려), 숫자가 0%에서 멈춤, 슬라이드가 안 넘어감.
import { chromium } from 'playwright';
const [base, W = '1440', H = '900'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +W, height: +H } });
await p.addInitScript(() => { try { sessionStorage.setItem('sinsa-intro', '1'); } catch {} });
await p.goto(base); await p.waitForTimeout(1000);
const bad = [];
// [섹션 id, 바뀌어야 하는 요소, 지켜볼 시간(ms)]
const SLIDES = [['levers', '.lv__k', 7000], ['shoot', '.sh__mon figcaption', 5000], ['channels', '.cn__chips .is-on b', 3500], ['formats', '.fm__tabs .is-on', 7000], ['steps', '.st__n', 7000]];
for (const [id, sel, ms] of SLIDES) {
  for (const pose of ['center', 'edge']) {
    await p.evaluate(([id, pose]) => {
      const el = document.getElementById(id); const top = el.getBoundingClientRect().top + scrollY;
      const y = pose === 'center' ? top - innerHeight * 0.1 : top - innerHeight * 0.6; // edge: 섹션 머리만 화면 아래쪽에
      window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
    }, [id, pose]);
    const box = await p.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); return { x: r.left + r.width / 2, y: Math.max(10, Math.min(innerHeight - 10, r.top + 120)) }; }, id);
    await p.mouse.move(box.x, box.y);
    const seen = new Set(); const t0 = Date.now();
    while (Date.now() - t0 < ms) { seen.add(await p.$eval(sel, (e) => e.textContent).catch(() => '∅')); await p.waitForTimeout(250); }
    const ok = seen.size >= 2;
    console.log(`${id} ${pose}: ${ok ? 'ok' : 'STUCK'} (${seen.size}종) ${[...seen].slice(0, 3).join(' / ')}`);
    if (!ok) bad.push(`${id} ${pose}`);
  }
}
// 타이핑: 같은 덜 친 문구가 1.5초 넘게 서 있으면 실패
await p.evaluate(() => { const el = document.getElementById('channels'); window.__lenis.scrollTo(el.getBoundingClientRect().top + scrollY - innerHeight * 0.1, { immediate: true }); });
const full = await p.$$eval('.cn__chips span', (s) => s.map((x) => x.textContent));
let last = '', since = Date.now();
for (let k = 0; k < 40; k++) {
  const txt = (await p.$eval('.cn__say b', (e) => e.textContent)).trim();
  if (txt !== last) { last = txt; since = Date.now(); }
  else if (!full.includes(txt) && Date.now() - since > 1500) { bad.push(`typing stuck "${txt}"`); console.log(`typing: STUCK "${txt}"`); break; }
  await p.waitForTimeout(150);
}
// 카운트: 화면에 들어온 뒤 2초 안에 최종값
for (const [id, sel, want] of [['archive', '.ar__n b', '89']]) {
  await p.evaluate((id) => { const el = document.getElementById(id); window.__lenis.scrollTo(el.getBoundingClientRect().top + scrollY - innerHeight * 0.2, { immediate: true }); }, id);
  await p.waitForTimeout(2200);
  const v = await p.$eval(sel, (e) => e.textContent);
  console.log(`${id} count: ${v === want ? 'ok' : 'STUCK ' + v}`);
  if (v !== want) bad.push(`${id} count ${v}`);
}
await b.close();
if (bad.length) { console.log('FAIL', bad); process.exit(1); } else console.log('auto: 전부 ok');
