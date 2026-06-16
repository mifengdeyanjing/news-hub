#!/bin/bash
# 双击此文件：启动资讯聚合 + 开公网隧道（macOS）
# 注意：免费隧道每次启动网址都会变，本脚本会把当次网址显示出来并写到桌面。
cd "$(dirname "$0")/.."

# Finder 双击时 PATH 不含 Homebrew，手动补上
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || nvm use 18 2>/dev/null

PORT=3001
URLFILE="$HOME/Desktop/资讯Hub公网网址.txt"
TUNLOG="/tmp/news-hub-tunnel.log"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "❌ 未安装 cloudflared，请先执行： brew install cloudflared"
  echo "（按回车键关闭）"; read -r _; exit 1
fi

# 1) 确保本地生产服务在运行
if lsof -ti:"$PORT" >/dev/null 2>&1; then
  echo "✅ 本地服务已在运行（端口 $PORT）"
else
  [ ! -d dist ] && { echo "首次启动，正在构建…"; npm run build; }
  echo "🚀 正在启动本地服务…"
  NODE_ENV=production nohup node server/index.js > /tmp/news-hub.log 2>&1 &
  echo $! > .news-hub.pid
  sleep 2
fi

# 2) 关掉旧隧道，开新隧道
pkill -f "cloudflared tunnel" 2>/dev/null
sleep 1
echo "🌐 正在建立公网隧道…"
cloudflared tunnel --url "http://localhost:$PORT" > "$TUNLOG" 2>&1 &
CF_PID=$!

# 3) 等待并提取公网网址
PUBURL=""
for _ in $(seq 1 30); do
  PUBURL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$TUNLOG" | head -1)
  [ -n "$PUBURL" ] && break
  sleep 1
done

echo ""
if [ -n "$PUBURL" ]; then
  echo "============================================================"
  echo "  ✅ 公网网址（手机任何网络都能打开）："
  echo ""
  echo "      $PUBURL"
  echo ""
  echo "  已保存到：$URLFILE"
  echo "============================================================"
  echo "$PUBURL" > "$URLFILE"
  open "$PUBURL"
else
  echo "⚠️ 未能获取公网网址，请查看日志：$TUNLOG"
fi

echo ""
echo "提示：保持此窗口开着隧道才有效；关闭窗口即断开公网访问。"
echo "（本地服务仍会后台运行，可用 npm run stop 停止）"
echo ""

# 4) 保持隧道前台运行（关闭窗口即停止隧道）
wait $CF_PID
