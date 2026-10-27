// 폭별 넘침·줄바꿈 검사: node scripts/check.mjs <base>
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4318';
// 애니메이션 시작 상태로 화면 밖에 있는 요소를 품은 섹션(overflow 숨김)은 제외 — 쉼표로 추가
const EXCLUDE = ['.hero', 'svg', '[data-anim-box]', ...(process.env.EXCLUDE ? process.env.EXCLUDE.split(',') : [])].join(', ');
const W = [320, 360, 375, 390, 414, 430, 456, 520, 600, 768, 834, 1024, 1280, 1440];
const b = await chromium.launch();
const out = {};
for (const w of W) {
  const p = await b.newPage({ viewport: { width: w, height: 860 } });
  await p.goto(`${base}/${process.env.QUERY ?? '?p=0'}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate((EX) => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth) issues.push(`page overflowX ${document.documentElement.scrollWidth - innerWidth}`);
    // 가로로 넘친 요소(스크롤 레일·마퀴·표 제외)
    for (const el of document.querySelectorAll('main *, footer *')) {
      if (el.closest(EX)) continue;
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > innerWidth + 1 || r.left < -1)) { issues.push(`out ${el.tagName}.${el.className} ${Math.round(r.left)}..${Math.round(r.right)}`); }
    }
    // nowrap 대상이 두 줄로 꺾였는지
    for (const el of document.querySelectorAll('.btn, .tag, .nw, [data-nowrap]')) {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.3;
      if (el.getBoundingClientRect().height > lh * 1.6 + 24 && !el.classList.contains('btn')) issues.push(`wrap ${el.className} "${el.textContent.slice(0, 20)}"`);
    }
    return [...new Set(issues)].slice(0, 12);
  }, EXCLUDE);
  out[w] = r;
  await p.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
