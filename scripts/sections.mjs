// 섹션별 정지 컷: node scripts/sections.mjs <base> <outDir> <width> <height>
import { chromium } from 'playwright';
const [base, out, W = '390', H = '844'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +W, height: +H } });
for (const hp of ['0', '0.45', '0.6', '1']) {
  await p.goto(`${base}/?p=${hp}`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${W}-hero-${hp}.png` });
}
await p.goto(`${base}/?p=1`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const IDS = await p.evaluate(() => [...document.querySelectorAll('main section[id]')].map((s) => s.id).filter((id) => id !== 'hero'));
for (const id of IDS) {
  await p.evaluate((id) => { const el = document.getElementById(id); window.scrollTo(0, el.getBoundingClientRect().top + scrollY); }, id);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/${W}-${id}.png` });
}
await b.close();
