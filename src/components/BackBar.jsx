import { useNavigate } from 'react-router-dom';

export function BackBar({ title, subtitle, color = '#0f172a', right }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 active:bg-slate-200"
          aria-label="返回"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold leading-tight" style={{ color }}>
            {title}
          </h1>
          {subtitle && <p className="truncate text-xs text-slate-400">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}
