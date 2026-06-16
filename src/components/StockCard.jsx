function fmt(n, digits = 2) {
  return Number.isFinite(n) ? n.toFixed(digits) : '--';
}

export function StockCard({ name, code, quote }) {
  if (!quote || !quote.price) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">{name}</span>
          <span className="text-xs text-slate-300">暂无数据</span>
        </div>
      </div>
    );
  }

  const up = quote.change >= 0;
  // A 股习惯：红涨绿跌
  const color = up ? '#e11d48' : '#16a34a';
  const sign = up ? '+' : '';
  const pureCode = code.replace(/^(sh|sz)/, '');

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-800">{name}</h3>
          <span className="text-xs text-slate-400">{pureCode}</span>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xl font-bold tabular-nums" style={{ color }}>
            {fmt(quote.price)}
          </div>
          <div className="text-xs font-medium tabular-nums" style={{ color }}>
            {sign}
            {fmt(quote.change)} ({sign}
            {fmt(quote.percent)}%)
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1 border-t border-slate-50 pt-2 text-center text-[11px] text-slate-400">
        <div>
          <div className="tabular-nums text-slate-600">{fmt(quote.high)}</div>
          最高
        </div>
        <div>
          <div className="tabular-nums text-slate-600">{fmt(quote.low)}</div>
          最低
        </div>
        <div>
          <div className="tabular-nums text-slate-600">{fmt(quote.open)}</div>
          今开
        </div>
        <div>
          <div className="tabular-nums text-slate-600">{fmt(quote.amount, 1)}亿</div>
          成交额
        </div>
      </div>
    </div>
  );
}
