import { STOCK_GROUPS } from '@shared/sources';
import { useStocks } from '@/hooks/useStocks';
import { BackBar } from '@/components/BackBar';
import { StockCard } from '@/components/StockCard';
import { WatchlistStockCard } from '@/components/WatchlistStockCard';
import { LoadingState } from '@/components/LoadingState';

export function StocksPage() {
  const { data, isLoading, isFetching, refetch, error } = useStocks();
  const quotes = data?.quotes ?? {};
  const watchlistAnalysis = data?.watchlistAnalysis ?? {};

  const subtitle = isLoading
    ? '正在加载…'
    : data
      ? `更新于 ${data.updatedAt} · 自动刷新`
      : '加载失败';

  const refreshBtn = (
    <button
      type="button"
      onClick={() => refetch()}
      disabled={isFetching}
      className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 disabled:opacity-50"
    >
      {isFetching ? '刷新中' : '刷新'}
    </button>
  );

  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-10">
      <BackBar title="📈 股市行情" subtitle={subtitle} color="#16a34a" right={refreshBtn} />

      {error && (
        <div className="mx-4 mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          行情加载失败：{error.message}
          <button type="button" onClick={() => refetch()} className="ml-2 underline">
            重试
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6 px-4 pt-4">
          {STOCK_GROUPS.map((group) => (
            <section key={group.id}>
              <h2 className="mb-2 px-1 text-sm font-semibold text-slate-500">{group.name}</h2>
              <div className="space-y-3">
                {group.items.map((item) =>
                  group.id === 'watchlist' ? (
                    <WatchlistStockCard
                      key={item.code}
                      name={item.name}
                      code={item.code}
                      quote={quotes[item.code]}
                      analysis={watchlistAnalysis[item.code]}
                    />
                  ) : (
                    <StockCard
                      key={item.code}
                      name={item.name}
                      code={item.code}
                      quote={quotes[item.code]}
                    />
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        数据来源：腾讯财经 · 仅供参考，不构成投资建议
      </p>
    </div>
  );
}
