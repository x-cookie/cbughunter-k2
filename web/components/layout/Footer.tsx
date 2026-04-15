import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-text-subtle">
          cbug — 51 Claude bug hunting skills. MIT License.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/docs/quick-start" className="text-xs text-text-subtle hover:text-text-muted transition-colors">
            Docs
          </Link>
          <Link href="/docs/install" className="text-xs text-text-subtle hover:text-text-muted transition-colors">
            Install
          </Link>
          <a
            href="https://github.com/elementalsouls/Claude-BugHunter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-subtle hover:text-text-muted transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-4">
        <p className="text-xs text-text-subtle/50">
          Skills adapted from{" "}
          <a
            href="https://github.com/elementalsouls/Claude-BugHunter"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            elementalsouls/Claude-BugHunter
          </a>{" "}
          (MIT). Not affiliated with Anthropic.
        </p>
      </div>
    </footer>
  );
}
