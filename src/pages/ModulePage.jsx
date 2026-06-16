import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MODULES, SOURCES } from '@shared/sources';
import { useNews } from '@/hooks/useNews';
import { BackBar } from '@/components/BackBar';
import { SourceBar } from '@/components/SourceBar';
import { NewsCard } from '@/components/NewsCard';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';

export function ModulePage() {
  const { id } = useParams();
  const module = MODULES.find((m) => m.id === id && m.type === 'news');
  const { data, isLoading, isFetching, refetch, error } = useNews();
  const [sourceId, setSourceId] = useState('all');

  const visibleSources = useMemo(
    () => (id === 'all' ? SOURCES : SOURCES.filter((s) => s.group === id)),
    [id],
  );

  const filteredItems = useMemo(() => {
    if (!data) return [];
    return data.items.filter((item) => {
      if (id !== 'all' && item.group !== id) return false;
      if (sourceId !== 'all' && item.sourceId !== sourceId) return false;
      return true;
    });
  }, [data, id, sourceId]);

  if (!module) return <Navigate to="/" replace />;

  const subtitle = isLoading
    ? '正在加载…'
    : data
      ? `已更新 ${data.updatedAt} · 共 ${filteredItems.length} 条`
      : '加载失败';

  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-8">
      <BackBar title={`${module.icon} ${module.name}`} subtitle={subtitle} color={module.color} />
      <SourceBar sources={visibleSources} active={sourceId} onChange={setSourceId} />

      {data?.failedSources?.length > 0 && (
        <div className="mx-4 mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
          ⚠️ {data.failedSources.join('、')} 加载失败，其余来源正常
        </div>
      )}

      {error && (
        <div className="mx-4 mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          加载失败：{error.message}
          <button type="button" onClick={() => refetch()} className="ml-2 underline">
            重试
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : filteredItems.length > 0 ? (
        <div className="space-y-3 px-4 pt-4">
          {filteredItems.map((item, i) => (
            <NewsCard key={`${item.link}-${i}`} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <div className="mt-6 flex flex-col items-center gap-2 px-4">
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-full bg-slate-900 px-6 py-2 text-sm text-white disabled:opacity-50"
        >
          {isFetching ? '刷新中…' : '刷新资讯'}
        </button>
        <p className="text-center text-xs text-slate-400">数据来源：各平台公开 RSS</p>
      </div>
    </div>
  );
}
