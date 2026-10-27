#!/bin/sh
# 배경용 실사 영상 웹 인코딩: 무음·1280폭·30fps·faststart + 첫 장면 포스터
# 사용: encode-video.sh <원본.mp4> <출력이름(확장자 없이)> [시작초=0] [길이초=12] [crf=31]
set -e
ffmpeg -v error -y -ss "${3:-0}" -t "${4:-12}" -i "$1" -an -vf "scale=1280:-2,fps=30" -c:v libx264 -preset slow -crf "${5:-31}" -pix_fmt yuv420p -movflags +faststart "$2.mp4"
ffmpeg -v error -y -ss 0.5 -i "$2.mp4" -frames:v 1 -vf scale=1280:-2 -q:v 5 "$2.jpg"
printf '%s %s bytes\n' "$2.mp4" "$(wc -c < "$2.mp4")"
