import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-hero-bg grid lg:grid-cols-2 items-center px-6 max-w-6xl mx-auto py-20 gap-12">
      {/* Left column */}
      <div>
        <p className="font-mono text-xs tracking-widest uppercase mb-4 text-secondary">
          51 SKILLS · 15 COMMANDS · 574+ H1 PATTERNS
        </p>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
          Turn Claude into a<br />senior bug hunter
        </h1>
        <p className="text-base lg:text-lg text-white/55 max-w-md leading-relaxed mt-4">
          51 specialized skills. Auto-load by context.{" "}
          7-Question Gate before every submission.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/docs/quick-start" variant="primary">
            Browse Skills
          </Button>
          <Button
            href="https://github.com/elementalsouls/Claude-BugHunter"
            variant="ghost"
            external
          >
            View on GitHub
          </Button>
        </div>
      </div>

      {/* Right column — hero video */}
      <div className="overflow-hidden rounded-2xl aspect-[9/16] lg:aspect-auto lg:h-[560px]">
        <video
          src="/hero/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-2xl opacity-85"
        />
      </div>
    </section>
  );
}
