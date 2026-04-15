import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-hero-bg border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-bold text-white tracking-tight">
          cbug
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/skills/web-hunting/hunt-sqli" className="text-sm text-white/60 hover:text-white transition-colors">
            Skills
          </Link>
          <Link href="/docs/quick-start" className="text-sm text-white/60 hover:text-white transition-colors">
            Docs
          </Link>
          <a
            href="https://github.com/elementalsouls/Claude-BugHunter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
