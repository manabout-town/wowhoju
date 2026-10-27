// research/gallery → public/img/g-<이름>-800|1600.webp (투어 상세 사진)
import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
let n = 0;
for (const f of fs.readdirSync('research/gallery')) {
  const slug = 'g-' + path.parse(f).name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (fs.existsSync(`public/img/${slug}-800.webp`)) continue;
  try { for (const w of [800, 1600]) await sharp(`research/gallery/${f}`).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(`public/img/${slug}-${w}.webp`); n++; }
  catch (e) { console.log('skip', f, e.message); }
}
console.log('converted', n);
