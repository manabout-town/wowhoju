// 고정(pin) 섹션을 실제 스크롤로 지나가며 진행 단계별 컷 + 넘침 측정: INTRO_KEY=<인트로 storageKey> node scripts/pins.mjs <base> <out> <w> <h>
// 검사 대상 요소를 더하려면 그 요소에 data-pin-check 속성.
import { chromium } from 'playwright';
const [base, out, W = '320', H = '640'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +W, height: +H } });
await p.addInitScript((k) => sessionStorage.setItem(k, '1'), process.env.INTRO_KEY ?? 'intro');
await p.goto(base); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
const report = [];
// 고정 섹션 자동 탐지: ScrollTrigger가 만든 .pin-spacer 안의 요소. PINS=sel1,sel2 로 직접 지정 가능
const PINS = process.env.PINS ? process.env.PINS.split(',') : await p.evaluate(() => [...document.querySelectorAll('.pin-spacer > *')].map((e, i) => { if (!e.id) e.id = `pin-${i}`; return `#${e.id}`; }));
for (const sel of PINS) {
  const id = sel.replace(/[#.]/g, '');
  for (const k of [0.3, 0.7, 1.0]) {
    await p.evaluate(([sel, k]) => {
      const el = document.querySelector(sel);
      const sp = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
      const top = sp.getBoundingClientRect().top + scrollY;
      const dist = sp.offsetHeight - innerHeight;
      window.__lenis?.scrollTo(top + dist * k, { immediate: true });
      window.scrollTo(0, top + dist * k);
    }, [sel, k]);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/pin-${W}-${id}-${k}.png` });
    const r = await p.evaluate((sel) => {
      const el = document.querySelector(sel);
      const kids = [...el.querySelectorAll('h1, h2, h3, p, img, svg, ol, ul, video, canvas, [data-pin-check]')].filter((e) => getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.05 && e.getBoundingClientRect().height > 0 && !e.closest('[style*="hidden"]'));
      const bad = kids.filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > innerHeight + 1 || r.top < -1; }).map((e) => `${e.tagName}.${e.className.baseVal ?? e.className} ${Math.round(e.getBoundingClientRect().top)}..${Math.round(e.getBoundingClientRect().bottom)}`);
      return bad.slice(0, 5);
    }, sel);
    report.push(`${id} ${k}: ${r.length ? r.join(' | ') : 'ok'}`);
  }
}
console.log(report.join('\n'));
await b.close();
