// 인트로 프레임 · reduced 전체 페이지 · 1280×560 헤더 겹침: INTRO_KEY=<인트로 storageKey> node scripts/misc.mjs <base> <out>
import { chromium } from 'playwright';
const [base, out] = process.argv.slice(2);
const go = { waitUntil: 'domcontentloaded' };
const b = await chromium.launch();
let p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto(base, go);
for (const [t, w] of [[1.5, 1500], [4.3, 2800], [5.0, 700]]) { await p.waitForTimeout(w); await p.screenshot({ path: `${out}/intro-${t}.png` }); }
await p.close();
p = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
await p.goto(base, go); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1200);
const hidden = await p.evaluate(() => [...document.querySelectorAll('.reveal')].filter((e) => +getComputedStyle(e).opacity < 0.9).length);
console.log('reduced hidden reveals', hidden);
await p.screenshot({ path: `${out}/reduced-full.png`, fullPage: true });
await p.close();
p = await b.newPage({ viewport: { width: 1280, height: 560 } });
await p.addInitScript((k) => sessionStorage.setItem(k, '1'), process.env.INTRO_KEY ?? 'intro');
await p.goto(base, go); await p.waitForTimeout(1200);
const IDS = await p.evaluate(() => [...document.querySelectorAll('main section[id]')].map((s) => s.id).filter((id) => id !== 'hero'));
for (const id of IDS) {
  await p.evaluate((id) => { const el = document.getElementById(id); window.__lenis?.scrollTo(el, { immediate: true }); }, id);
  await p.waitForTimeout(600);
  await p.mouse.wheel(0, -60); await p.waitForTimeout(900);
  const r = await p.evaluate((id) => { const h = document.querySelector('.hd'); const hb = h.classList.contains('is-on') ? h.getBoundingClientRect().bottom : 0; const t = document.querySelector(`#${id} h2`)?.getBoundingClientRect().top; return { hb: Math.round(hb), t: Math.round(t) }; }, id);
  console.log('header', id, JSON.stringify(r), r.t >= r.hb ? 'ok' : 'OVERLAP');
}
await b.close();
