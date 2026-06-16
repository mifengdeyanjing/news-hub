import { Link } from 'react-router-dom';

export function NewsCard({ item }) {
  const params = new URLSearchParams({
    title: item.title,
    link: item.link,
    description: item.description,
    timeText: item.timeText,
    sourceName: item.sourceName,
    sourceIcon: item.sourceIcon,
    sourceColor: item.sourceColor,
  });

  return (
    <Link
      to={`/article?${params.toString()}`}
      className="block rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md active:bg-slate-50"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className="rounded-lg px-2.5 py-1 text-xs font-medium"
          style={{ backgroundColor: `${item.sourceColor}20`, color: item.sourceColor }}
        >
          {item.sourceIcon} {item.sourceName}
        </span>
        <span className="shrink-0 text-xs text-slate-400">{item.timeText}</span>
      </div>
      <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-800">
        {item.title}
      </h2>
      {item.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {item.description}
        </p>
      )}
    </Link>
  );
}
