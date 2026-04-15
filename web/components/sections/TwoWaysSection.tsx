import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";

export function TwoWaysSection() {
  return (
    <section className="py-20 bg-surface-alt">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs tracking-widest uppercase text-text-muted mb-2">
          Usage
        </p>
        <h2 className="text-3xl font-bold text-text mb-12">Two ways to use</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card A */}
          <Card className="p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl mb-2">🌐</p>
                <h3 className="text-xl font-bold text-text">Review your code</h3>
                <p className="text-text-muted text-sm mt-1">
                  Upload skill ZIP → paste code or file → receive findings artifact
                </p>
              </div>
              <Pill env="chat" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs bg-surface border border-border rounded px-3 py-1.5 text-text-muted">
                {"// your code here"}
              </span>
              <span className="text-text-subtle">→</span>
              <span className="bg-success/10 text-success text-xs font-medium rounded-full px-2.5 py-0.5">
                PDF findings report
              </span>
            </div>
            <a
              href="/docs/install"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              How to install →
            </a>
          </Card>

          {/* Card B */}
          <Card className="p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl mb-2">⌨️</p>
                <h3 className="text-xl font-bold text-text">Hunt live targets</h3>
                <p className="text-text-muted text-sm mt-1">
                  Install bundle → open terminal → run /hunt target.com
                </p>
              </div>
              <Pill env="both" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs bg-hero-bg text-white rounded px-3 py-1.5">
                /hunt target.com
              </span>
              <span className="text-text-subtle">→</span>
              <span className="bg-secondary-light text-secondary-dark text-xs font-medium rounded-full px-2.5 py-0.5">
                Live findings stream
              </span>
            </div>
            <a
              href="/docs/chat-vs-code"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              View CLI docs →
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
}
