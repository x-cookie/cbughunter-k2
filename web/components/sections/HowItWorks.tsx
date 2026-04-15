export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Install the skill bundle",
      body: "Download the ZIP from GitHub. Upload to claude.ai/customize/skills or drop it in your Claude Code project.",
    },
    {
      n: "02",
      title: "Claude auto-loads by context",
      body: "Skills activate based on your target signal — paste a URL, a JWT, or an APK path and the right skill loads automatically.",
    },
    {
      n: "03",
      title: "Gate before submit",
      body: "Every finding runs through the 7-Question Gate. One wrong answer kills the report. Your N/A ratio stays clean.",
    },
  ];

  return (
    <section className="py-20 bg-surface-alt">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs tracking-widest uppercase text-text-muted mb-2">
          How it works
        </p>
        <h2 className="text-3xl font-bold text-text mb-12">Three steps to ship</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="font-mono text-5xl font-bold text-primary/20 mb-4">{s.n}</p>
              <h3 className="font-semibold text-text mb-2">{s.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
