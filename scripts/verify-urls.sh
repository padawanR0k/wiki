#!/usr/bin/env bash
# 운영 사이트의 사이트맵 URL 전체가 다른 호스트(예: https://r0k-wiki.pages.dev)에서도
# 같은 상태 코드로 응답하는지 비교한다. 컷오버 전에 한 번, 컷오버 후에 한 번 돌린다.
#
# 사용법: scripts/verify-urls.sh https://r0k-wiki.pages.dev
set -euo pipefail

TARGET="${1:?비교할 호스트를 넘겨 주세요. 예: scripts/verify-urls.sh https://r0k-wiki.pages.dev}"
BASE="${2:-https://r0k.wiki}"

urls=$(curl -s --max-time 30 "$BASE/sitemap/sitemap-0.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g')
total=0
bad=0

while IFS= read -r url; do
  [ -z "$url" ] && continue
  path="${url#https://r0k.wiki}"
  want=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$BASE$path")
  got=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$TARGET$path")
  total=$((total + 1))
  if [ "$want" != "$got" ]; then
    bad=$((bad + 1))
    echo "DIFF  $path  기준=$want  대상=$got"
  fi
done <<< "$urls"

echo "검사 ${total}개, 불일치 ${bad}개"
[ "$bad" -eq 0 ]
