export function StatsStrip() {
  const items = ["51 Skills", "15 Slash Commands", "574+ H1 Patterns", "MIT License"];
  return (
    <div className="bg-hero-bg border-t border-white/[0.08] py-5">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-4 sm:gap-8">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-4">
            <span className="font-mono text-xs text-white/35">{item}</span>
            {i < items.length - 1 && (
              <span className="text-white/[0.12] hidden sm:inline">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
