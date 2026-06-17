#!/bin/bash
# 终端执行: npm run daily
cd "$(dirname "$0")/.."

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || nvm use 18 2>/dev/null

PORT=3001
URL="http://localhost:$PORT"

local_ok() {
  [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$URL/" 2>/dev/null)" = "200" ]
}

if local_ok; then
  open "$URL"
  exit 0
fi

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  lsof -ti:"$PORT" | xargs kill -9 2>/dev/null
  sleep 1
fi

[ ! -d dist ] && npm run build

NODE_ENV=production nohup node server/index.js > /tmp/news-hub.log 2>&1 &
echo $! > .news-hub.pid
for _ in $(seq 1 15); do
  local_ok && break
  sleep 1
done
local_ok && open "$URL"
