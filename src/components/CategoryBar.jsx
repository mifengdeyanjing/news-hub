import { CATEGORIES } from '@shared/sources';

export function CategoryBar({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
            active === cat.id
              ? 'border-slate-900 bg-slate-900 font-semibold text-white'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
