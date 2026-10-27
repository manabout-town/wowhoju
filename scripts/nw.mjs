// .nw 구절이 부모 칸보다 넓어 잘리는지(판 overflow:clip 안이라 check.mjs가 못 잡는 경우): node scripts/nw.mjs <base>
import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [320, 360]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(`${process.argv[2]}/?p=1`, { waitUntil: 'domcontentloaded' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const r = await p.evaluate(() => [...document.querySelectorAll('.nw, h1, h2, h3, .big, b')].filter((e) => { const r = e.getBoundingClientRect(); const pr = e.closest('.wrap, .panel, section')?.getBoundingClientRect(); return r.width && pr && (r.right > Math.min(innerWidth, pr.right) - 4 + 4 && r.right > innerWidth - 12); }).map((e) => `${e.tagName}.${e.className} "${e.textContent.slice(0, 18)}" ${Math.round(e.getBoundingClientRect().right)}`));
  console.log(w, r.length ? r : 'ok');
  await p.close();
}
await b.close();
