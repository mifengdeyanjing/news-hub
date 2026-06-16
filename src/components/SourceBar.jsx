export function SourceBar({ sources, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 scrollbar-hide">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
          active === 'all'
            ? 'bg-slate-900 font-semibold text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        🌐 全部来源
      </button>
      {sources.map((source) => (
        <button
          key={source.id}
          type="button"
          onClick={() => onChange(source.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
            active === source.id ? 'font-semibold text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          style={active === source.id ? { backgroundColor: source.color } : undefined}
        >
          {source.icon} {source.name}
        </button>
      ))}
    </div>
  );
}
