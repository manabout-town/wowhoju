// CPU 4배 감속 폰 흉내로 페이지를 끝까지 스크롤하며 프레임 측정: node scripts/perf.mjs <base>
import { chromium } from 'playwright';
const base = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.addInitScript(() => sessionStorage.setItem('jack-intro', '1'));
const cdp = await p.context().newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await p.goto(base, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
await p.evaluate(() => { window.__f = []; let l = performance.now(); const t = (n) => { window.__f.push(n - l); l = n; requestAnimationFrame(t); }; requestAnimationFrame(t); });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 120) { await p.mouse.wheel(0, 120); await p.waitForTimeout(40); }
await p.waitForTimeout(500);
const r = await p.evaluate(() => { const f = window.__f.slice(2); f.sort((a, b) => a - b); const avg = f.reduce((a, b) => a + b, 0) / f.length; return { frames: f.length, fps: +(1000 / avg).toFixed(1), p95: +f[Math.floor(f.length * 0.95)].toFixed(1), long50: f.filter((x) => x > 50).length }; });
console.log(JSON.stringify(r));
await b.close();
