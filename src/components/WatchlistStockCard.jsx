function fmt(n, digits = 2) {
  return Number.isFinite(n) ? n.toFixed(digits) : '--';
}

function FlowBar({ leftLabel, leftPct, rightLabel, rightPct, leftColor, rightColor }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px]">
        <span style={{ color: leftColor }}>
          {leftLabel} {leftPct}%
        </span>
        <span style={{ color: rightColor }}>
          {rightLabel} {rightPct}%
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="transition-all" style={{ width: `${leftPct}%`, backgroundColor: leftColor }} />
        <div className="transition-all" style={{ width: `${rightPct}%`, backgroundColor: rightColor }} />
      </div>
    </div>
  );
}

function DayRangeBar({ low, high, price, positionPct }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-slate-400">
        <span>低 {fmt(low)}</span>
        <span className="font-medium text-slate-600">现 {fmt(price)}</span>
        <span>高 {fmt(high)}</span>
      </div>
      <div className="relative h-2 rounded-full bg-gradient-to-r from-emerald-100 via-slate-100 to-rose-100">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-700 shadow"
          style={{ left: `${positionPct}%` }}
        />
      </div>
      <div className="mt-1 text-center text-[11px] text-slate-500">日内位置 {positionPct}%</div>
    </div>
  );
}

export function WatchlistStockCard({ name, code, quote, analysis }) {
  if (!quote?.price) {
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
  const color = up ? '#e11d48' : '#16a34a';
  const sign = up ? '+' : '';
  const pureCode = code.replace(/^(sh|sz)/, '');
  const { dayRange, orderFlow, openGap, limits, orderBook, summary, signals } = analysis ?? {};

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-amber-100">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-[11px] font-medium text-amber-800">
        ⭐ 我的关注 · 专属分析
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
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

        {summary && (
          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
            {summary}
          </p>
        )}

        {dayRange && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">日内高低</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  dayRange.nearLow
                    ? 'bg-emerald-50 text-emerald-700'
                    : dayRange.nearHigh
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-slate-100 text-slate-600'
                }`}
              >
                {dayRange.label}
              </span>
            </div>
            <DayRangeBar
              low={quote.low}
              high={quote.high}
              price={quote.price}
              positionPct={dayRange.positionPct}
            />
          </div>
        )}

        {orderFlow && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">主动买卖（内外盘）</span>
              <span className="text-[10px] text-slate-500">{orderFlow.label}</span>
            </div>
            <FlowBar
              leftLabel="外盘·买"
              leftPct={orderFlow.outerPct}
              rightLabel="内盘·卖"
              rightPct={orderFlow.innerPct}
              leftColor="#e11d48"
              rightColor="#16a34a"
            />
            <div className="mt-1 text-center text-[10px] text-slate-400">
              外盘 {orderFlow.outer.toLocaleString()} 手 · 内盘 {orderFlow.inner.toLocaleString()} 手 · 比值{' '}
              {orderFlow.ratio}
            </div>
          </div>
        )}

        {orderBook && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">盘口结构</span>
              <span className="text-[10px] text-slate-500">{orderBook.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="rounded-lg bg-rose-50 px-2 py-1.5 text-rose-700">
                大单买 {orderBook.bigBuyPct}%
              </div>
              <div className="rounded-lg bg-rose-50/60 px-2 py-1.5 text-rose-600">
                小单买 {orderBook.smallBuyPct}%
              </div>
              <div className="rounded-lg bg-emerald-50 px-2 py-1.5 text-emerald-700">
                大单卖 {orderBook.bigSellPct}%
              </div>
              <div className="rounded-lg bg-emerald-50/60 px-2 py-1.5 text-emerald-600">
                小单卖 {orderBook.smallSellPct}%
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <div className="font-medium text-slate-700">{openGap?.label ?? '--'}</div>
            <div className="text-slate-400">开盘</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <div className="font-medium text-slate-700">{fmt(dayRange?.amplitude ?? quote.amplitude)}%</div>
            <div className="text-slate-400">振幅</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <div className="font-medium text-slate-700">{fmt(quote.volumeRatio, 2)}</div>
            <div className="text-slate-400">量比</div>
          </div>
        </div>

        {limits && (limits.toLimitUpPct > 0 || limits.toLimitDownPct > 0) && (
          <div className="mt-3 flex gap-2 text-[10px]">
            <span className="rounded-md bg-rose-50 px-2 py-1 text-rose-600">
              距涨停 +{limits.toLimitUpPct}%
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-600">
              距跌停 -{limits.toLimitDownPct}%
            </span>
          </div>
        )}

        {signals?.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-slate-50 pt-3">
            {signals.map((s) => (
              <li key={s} className="flex gap-1.5 text-[11px] text-slate-500">
                <span className="text-amber-500">•</span>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
