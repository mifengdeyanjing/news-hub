#!/bin/bash
# 终端执行: npm run daily
cd "$(dirname "$0")/.."

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || nvm use 18 2>/dev/null

PORT=3001
URL="http://localhost:$PORT"

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  open "$URL"
  exit 0
fi

[ ! -d dist ] && npm run build

NODE_ENV=production nohup node server/index.js > /tmp/news-hub.log 2>&1 &
echo $! > .news-hub.pid
sleep 1
open "$URL"
