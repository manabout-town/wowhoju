// 섹션 주소로 들어오면 그 섹션으로 가야 함: node scripts/e2e-hash.mjs <base>
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4318';
const ID = process.argv[3] ?? 'stores'; // 해시로 들어갈 섹션 id
const b = await chromium.launch();
let fail = 0;
for (const reduced of [false, true]) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await p.goto(`${base}/#${ID}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  const top = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, ID);
  const ok = top > -50 && top < 200;
  console.log(reduced ? 'reduced' : 'normal', `${ID} top`, Math.round(top), ok ? 'PASS' : 'FAIL');
  if (!ok) fail++;
  await p.close();
}
await b.close();
process.exit(fail ? 1 : 0);
