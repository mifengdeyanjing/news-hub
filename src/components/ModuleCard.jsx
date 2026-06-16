import { Link } from 'react-router-dom';

export function ModuleCard({ module }) {
  const to = module.type === 'stocks' ? '/stocks' : `/m/${module.id}`;

  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: module.color }}
      />
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: `${module.color}1a` }}
        >
          {module.icon}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-800">{module.name}</h2>
          {module.type === 'stocks' && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              实时
            </span>
          )}
        </div>
      </div>
      <p className="mt-3 line-clamp-1 text-xs text-slate-400">{module.desc}</p>
    </Link>
  );
}
