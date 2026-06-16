#!/bin/bash
# 双击此文件即可打开本地资讯聚合（macOS）
cd "$(dirname "$0")/.."

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || nvm use 18 2>/dev/null

PORT=3001
URL="http://localhost:$PORT"

# 已在运行 → 直接打开浏览器（用 HTTP 探测，避免误判）
if [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$URL" 2>/dev/null)" = "200" ]; then
  open "$URL"
  exit 0
fi

# 首次运行需要构建
if [ ! -d dist ]; then
  echo "首次启动，正在构建…"
  npm run build
fi

echo "正在启动资讯聚合…"
NODE_ENV=production nohup node server/index.js > /tmp/news-hub.log 2>&1 &
echo $! > .news-hub.pid
sleep 1
open "$URL"
