#!/bin/bash
# 双击此文件即可打开本地资讯聚合（macOS）
cd "$(dirname "$0")/.."

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || nvm use 18 2>/dev/null

PORT=3001
URL="http://localhost:$PORT"

local_ok() {
  [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$URL/" 2>/dev/null)" = "200" ]
}

# 已在运行 → 直接打开浏览器（用 HTTP 探测，避免误判）
if local_ok; then
  open "$URL"
  exit 0
fi

# 端口被占用但不是正常页面（常见于 npm run dev 只起了 API）→ 先释放端口
if lsof -ti:"$PORT" >/dev/null 2>&1; then
  echo "检测到 $PORT 端口被占用但页面不可用，正在重启…"
  lsof -ti:"$PORT" | xargs kill -9 2>/dev/null
  sleep 1
fi

# 首次运行需要构建
if [ ! -d dist ]; then
  echo "首次启动，正在构建…"
  npm run build
fi

echo "正在启动资讯聚合…"
NODE_ENV=production nohup node server/index.js > /tmp/news-hub.log 2>&1 &
echo $! > .news-hub.pid
for _ in $(seq 1 15); do
  local_ok && break
  sleep 1
done
if ! local_ok; then
  echo "启动失败，请查看 /tmp/news-hub.log"
  exit 1
fi
open "$URL"
