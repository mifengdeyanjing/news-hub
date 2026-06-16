export function EmptyState({ message = '暂无资讯，点击刷新试试' }) {
  return (
    <div className="flex flex-col items-center py-20 text-slate-400">
      <span className="text-5xl">📭</span>
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
}
