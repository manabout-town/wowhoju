#!/bin/sh
# 실사 누끼: macOS Vision으로 배경 제거 → 여백 자르고 webp
# 사용: cutout.sh <원본.jpg> <출력.webp> [가로폭=520] [flip]
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
TMP=$(mktemp -d)
swift "$DIR/cutout.swift" "$1" "$TMP/cut.png"
node -e "
const sharp=require(require.resolve('sharp',{paths:[process.cwd()]}));
(async()=>{let i=sharp('$TMP/cut.png').trim(); if('$4'==='flip') i=sharp(await i.toBuffer()).flop();
await i.resize({width:${3:-520}}).webp({quality:82,alphaQuality:90}).toFile('$2');
const m=await sharp('$2').metadata();console.log('$2',m.width,m.height)})()"
rm -rf "$TMP"
