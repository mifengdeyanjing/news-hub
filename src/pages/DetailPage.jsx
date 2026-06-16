import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useArticle } from '@/hooks/useArticle';

export function DetailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const title = params.get('title') ?? '';
  const link = params.get('link') ?? '';
  const description = params.get('description') ?? '';
  const timeText = params.get('timeText') ?? '';
  const sourceName = params.get('sourceName') ?? '';
  const sourceIcon = params.get('sourceIcon') ?? '';
  const sourceColor = params.get('sourceColor') ?? '#64748b';

  const { data, isLoading, isError, refetch } = useArticle(link);

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    alert('链接已复制');
  };

  if (!title) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Link to="/" className="text-blue-600 underline">返回首页</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-white pb-10">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
        <button type="button" onClick={() => navigate(-1)} className="text-sm text-blue-600">
          ← 返回列表
        </button>
      </div>

      <article className="px-4 pt-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span
            className="rounded-lg px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: `${sourceColor}20`, color: sourceColor }}
          >
            {sourceIcon} {sourceName}
          </span>
          <span className="text-xs text-slate-400">{timeText}</span>
        </div>

        <h1 className="mb-6 text-2xl font-bold leading-snug text-slate-900">{title}</h1>

        {isLoading && (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
            正在加载全文…
          </div>
        )}

        {data?.text ? (
          <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
            {data.text}
          </div>
        ) : (
          <>
            {isError && (
              <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                无法在页面内加载全文，以下为 RSS 摘要
                <button type="button" onClick={() => refetch()} className="ml-2 text-blue-600 underline">
                  重试
                </button>
              </div>
            )}
            {description && (
              <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-600">
                {description}
              </div>
            )}
          </>
        )}

        <div className="mt-8 flex flex-col gap-2">
          {link && (
            <>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-slate-900 py-3 text-center text-sm font-medium text-white"
              >
                在浏览器打开原文
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="rounded-xl bg-slate-100 py-3 text-sm text-slate-600"
              >
                复制原文链接
              </button>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
