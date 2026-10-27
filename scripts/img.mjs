// 원본 사진 → public/img/<이름>-800.webp, -1600.webp
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
const out = 'public/img';
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
  const name = path.parse(f).name;
  for (const w of [800, 1600]) {
    await sharp(path.join(src, f)).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${out}/${name}-${w}.webp`);
  }
}
console.log('done');
