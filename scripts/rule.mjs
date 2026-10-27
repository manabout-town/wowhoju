// 줄바꿈 규칙 검사: node scripts/rule.mjs <base> [path] [width]
// A. 한 글자 덩어리(텍스트 노드) 안에서 문장이 끝나고 같은 줄에 다음 문장이 이어지면 위반 → <Sents>로 나눌 것
// B. 두 줄로 넘어간 문장의 마지막 줄이 첫 줄의 30%보다 짧으면(한두 글자 꼬리) 위반
import { chromium } from 'playwright';
const [base = 'http://localhost:4317', path = '/', W = '390'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +W, height: 900 } });
await p.goto(`${base}${path}?p=1`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const out = await p.evaluate(() => {
  const bad = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const el = n.parentElement;
    if (!el || el.closest('script,style,[aria-hidden="true"],.sr-only,option')) continue;
    const t = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    if (/[가-힣][.!?] +[가-힣"“(]/.test(t)) bad.push(`A ${el.tagName}.${el.className} | ${t.slice(0, 70)}`);
  }
  const blocks = document.querySelectorAll('.sent, h1 .ln, h2 .ln, h3, p:not(:has(.sent)):not(.src), li:not(:has(p,.sent)), summary, figcaption');
  for (const el of blocks) {
    if (el.closest('[aria-hidden="true"],.sr-only') || !el.getClientRects().length) continue;
    if ([...el.querySelectorAll('*')].some((c) => !/^inline/.test(getComputedStyle(c).display))) continue; // 이름표+제목처럼 칸이 나뉜 덩어리는 제외
    if (getComputedStyle(el).display === 'flex' || getComputedStyle(el).display === 'grid') continue;
    const r = document.createRange(); r.selectNodeContents(el);
    const rows = [];
    for (const q of r.getClientRects()) {
      if (q.width < 2) continue;
      const row = rows.find((x) => Math.abs(x.top - q.top) < 4);
      if (row) { row.l = Math.min(row.l, q.left); row.r = Math.max(row.r, q.right); } else rows.push({ top: q.top, l: q.left, r: q.right });
    }
    if (rows.length < 2) continue;
    rows.sort((a, c) => a.top - c.top);
    const first = rows[0].r - rows[0].l, last = rows.at(-1).r - rows.at(-1).l;
    if (last < first * 0.3) bad.push(`B ${rows.length}줄 꼬리 ${Math.round(last)}/${Math.round(first)}px | ${el.textContent.trim().slice(0, 60)}`);
  }
  return bad;
});
console.log(`${path} @${W}: ${out.length}건`);
for (const x of out) console.log('  ' + x);
await b.close();
