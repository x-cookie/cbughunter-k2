import Link from "next/link";

export function GateCallout() {
  const questions = [
    "Is this in scope?",
    "Can I prove it's exploitable?",
    "Is there real impact?",
    "Did I reproduce it twice?",
    "Is the PoC clean?",
    "Have I checked for duplicates?",
    "Would I be proud to send this?",
  ];

  return (
    <section className="py-20 bg-hero-bg">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="font-mono text-xs tracking-widest uppercase text-secondary mb-4">
          Quality Gate
        </p>
        <h2 className="text-3xl font-bold text-white mb-4">The 7-Question Gate</h2>
        <p className="text-white/55 max-w-xl mx-auto mb-10">
          Every finding must clear all 7 questions before a report gets written.
          One wrong answer = kill it and move on.
        </p>
        <ol className="text-left inline-flex flex-col gap-3 mb-10">
          {questions.map((q, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-white/70">
              <span className="font-mono text-xs text-secondary w-5 shrink-0">{i + 1}.</span>
              {q}
            </li>
          ))}
        </ol>
        <div className="flex justify-center">
          <Link
            href="/docs/7-question-gate"
            className="text-sm text-primary-light hover:text-white font-medium transition-colors"
          >
            Read the full gate →
          </Link>
        </div>
      </div>
    </section>
  );
}
