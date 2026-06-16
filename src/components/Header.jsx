export function Header({ subtitle }) {
  return (
    <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 pb-5 pt-6 text-white">
      <h1 className="text-2xl font-bold tracking-wide">📰 资讯聚合</h1>
      <p className="mt-1 text-sm text-white/65">{subtitle}</p>
    </header>
  );
}
