// 제목·문단의 실제 줄바꿈을 뽑아 봄: node scripts/lines.mjs <base> <w>
import { chromium } from 'playwright';
const [base = 'http://localhost:4318', W = '390'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +W, height: 900 } });
await p.goto(`${base}/?p=0`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const out = await p.evaluate(() => {
  const sel = 'h1, h2, h3, .lead, .quote, .hx-grilltx, .in-l1, .in-l2, .sm2-note, .gc2-claim, .fs-line, .sm-feat';
  const res = [];
  for (const el of document.querySelectorAll(sel)) {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
    // 글자마다 줄 위치를 재서 줄 단위로 묶음
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const lines = []; let lastTop = null, cur = '';
    let n;
    while ((n = walker.nextNode())) {
      for (let i = 0; i < n.textContent.length; i++) {
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
        const rect = r.getClientRects()[0];
        if (!rect) { cur += n.textContent[i]; continue; }
        if (lastTop !== null && Math.abs(rect.top - lastTop) > rect.height * 0.5) { lines.push(cur.trim()); cur = ''; }
        lastTop = rect.top; cur += n.textContent[i];
      }
    }
    if (cur.trim()) lines.push(cur.trim());
    if (lines.length > 1) res.push(`[${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}] ` + lines.join(' / '));
  }
  return res;
});
console.log(out.join('\n'));
await b.close();
