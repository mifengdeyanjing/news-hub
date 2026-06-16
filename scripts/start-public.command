#!/bin/bash
# 双击此文件：一键启动「资讯聚合」+ 公网隧道（macOS）
# 会自动：启动服务 → 建隧道 → 等隧道真正连通 → 复制网址到剪贴板 + 存桌面 + 打开浏览器
# 说明：免费隧道每次网址都会变，本脚本会自动给出当次网址。
cd "$(dirname "$0")/.."

# Finder 双击时 PATH 不含 Homebrew，手动补上
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || nvm use 18 2>/dev/null

PORT=3001
URLFILE="$HOME/Desktop/资讯Hub公网网址.txt"
TUNLOG="/tmp/news-hub-tunnel.log"

clear
echo "============================================================"
echo "            资讯聚合 · 一键公网访问"
echo "============================================================"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "❌ 未安装 cloudflared，请先在终端执行： brew install cloudflared"
  echo "（按回车键关闭）"; read -r _; exit 1
fi

# 1) 确保本地生产服务在运行（用 HTTP 探测，避免 lsof 误判）
local_ok() {
  [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "http://localhost:$PORT/" 2>/dev/null)" = "200" ]
}

if local_ok; then
  echo "✅ 本地服务已在运行"
else
  [ ! -d dist ] && { echo "📦 首次启动，正在构建（约 10 秒）…"; npm run build >/dev/null 2>&1; }
  echo "🚀 正在启动本地服务…"
  NODE_ENV=production nohup node server/index.js > /tmp/news-hub.log 2>&1 &
  echo $! > .news-hub.pid
  for _ in $(seq 1 20); do
    local_ok && break
    sleep 1
  done
  if ! local_ok; then
    echo "❌ 本地服务启动失败，请查看：/tmp/news-hub.log"
    echo "（按回车键关闭）"; read -r _; exit 1
  fi
fi

# 2) 关掉旧隧道，开新隧道
pkill -f "cloudflared tunnel" 2>/dev/null
sleep 1
echo "🌐 正在建立公网隧道…"
cloudflared tunnel --url "http://localhost:$PORT" > "$TUNLOG" 2>&1 &
CF_PID=$!

# 3) 等待提取公网网址
PUBURL=""
for _ in $(seq 1 30); do
  PUBURL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$TUNLOG" | head -1)
  [ -n "$PUBURL" ] && break
  sleep 1
done

if [ -z "$PUBURL" ]; then
  echo "⚠️ 未能建立隧道，请检查网络后重试。日志：$TUNLOG"
  echo "（按回车键关闭）"; read -r _; kill $CF_PID 2>/dev/null; exit 1
fi

# 4) 等隧道真正连通（关键：避免打开太早出现连接关闭）
echo "⏳ 正在等待隧道连通…"
READY=""
for _ in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$PUBURL/" 2>/dev/null)
  if [ "$code" = "200" ]; then READY=1; break; fi
  sleep 2
done

echo ""
echo "============================================================"
if [ -n "$READY" ]; then
  echo "  ✅ 已就绪！公网网址（手机任何网络都能打开）："
else
  echo "  ⚠️ 隧道已建立但连通较慢，网址如下（稍等片刻再刷新）："
fi
echo ""
echo "      $PUBURL"
echo ""
echo "  · 已复制到剪贴板（可直接粘贴）"
echo "  · 已保存到桌面：资讯Hub公网网址.txt"
echo "============================================================"
echo "$PUBURL" | tr -d '\n' | pbcopy 2>/dev/null
echo "$PUBURL" > "$URLFILE"
open "$PUBURL"

echo ""
echo "⚠️ 保持此窗口开着，公网访问才有效；关闭窗口即断开。"
echo ""

# 5) 隧道前台运行
wait $CF_PID
