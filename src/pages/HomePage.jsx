import { MODULES } from '@shared/sources';
import { ModuleCard } from '@/components/ModuleCard';

export function HomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-10">
      <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pb-7 pt-8 text-white">
        <h1 className="text-2xl font-bold tracking-wide">📰 资讯聚合</h1>
        <p className="mt-1 text-sm text-white/65">选择一个模块，查看最新动态</p>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 pt-5">
        {MODULES.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        资讯来自各平台公开 RSS · 行情来自腾讯财经
      </p>
    </div>
  );
}
