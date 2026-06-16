export function LoadingState({ progress }) {
  return (
    <div className="flex flex-col items-center px-8 py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
      <p className="mt-4 text-sm text-slate-500">正在从各平台拉取最新资讯…</p>
      {progress && <p className="mt-1 text-xs text-slate-400">{progress}</p>}
    </div>
  );
}
