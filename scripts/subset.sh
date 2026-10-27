#!/bin/sh
# 한글 웹폰트 서브셋: assets-raw/fonts/*.woff2(원본) → public/fonts/<이름>-sub.woff2 (사이트에 쓰인 글자만)
# 로컬에서 실행(npm run fonts). Vercel 빌드 서버엔 fontTools가 없으니 빌드 스크립트에 넣지 말 것.
cd "$(dirname "$0")/.."
T=$(mktemp)
cat $(find src index.html -name '*.ts' -o -name '*.tsx' -o -name '*.html' -o -name '*.json') > "$T"
printf '0123456789·…“”‘’"\x27.,!?()~-%%/:★$°→−+ ' >> "$T"
mkdir -p public/fonts
for f in assets-raw/fonts/*.woff2; do
  name=$(basename "$f" .woff2)
  python3 -m fontTools.subset "$f" --text-file="$T" --flavor=woff2 --output-file="public/fonts/$name-sub.woff2" --layout-features='*'
  printf '%s %s\n' "$name" "$(wc -c < "public/fonts/$name-sub.woff2")"
done
rm -f "$T"
