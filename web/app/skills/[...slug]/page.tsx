import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Pill } from "@/components/ui/Pill";
import { Badge } from "@/components/ui/Badge";
import { DemoVideo } from "@/components/DemoVideo";
import { getSkill, skills } from "@/content/skills";
import { getDomain } from "@/content/domains";
import { getDemoId } from "@/content/demos";

interface Props {
  params: { slug: string[] };
}

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.id.split("/") }));
}

export default function SkillPage({ params }: Props) {
  const id = params.slug.join("/");
  const skill = getSkill(id);
  if (!skill) notFound();

  const domain = getDomain(skill.domain);
  const demoId = getDemoId(id);

  const installSteps = [
    `Download the skill ZIP from GitHub`,
    `Go to claude.ai/customize/skills → Upload ZIP`,
    `Open Claude and type ${skill.command}`,
  ];

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-text">Home</Link>
          <span>/</span>
          <Link href={`/domains/${skill.domain}`} className="hover:text-text">
            {domain?.title}
          </Link>
          <span>/</span>
          <span className="text-text">{skill.name}</span>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-sm bg-hero-bg text-white rounded px-3 py-1">
              {skill.command}
            </span>
            <Pill env={skill.env} />
            {skill.reportCount && (
              <Badge>{skill.reportCount} reports</Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold text-text mb-4">{skill.name}</h1>
          <p className="text-text-muted text-lg leading-relaxed">{skill.description}</p>
        </div>

        {/* Demo video */}
        {demoId && (
          <div className="mb-12">
            <DemoVideo videoId={demoId} title={`${skill.name} demo`} />
          </div>
        )}

        {/* What it does */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4">◆ What it does</h2>
          <p className="text-text-muted leading-relaxed">{skill.description}</p>
        </section>

        {/* Input */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4">◆ Input — what you give Claude</h2>
          <ul className="list-disc list-inside text-text-muted space-y-2 text-sm">
            <li>Target URL or domain (e.g. <code className="font-mono bg-surface-alt px-1 rounded">target.com</code>)</li>
            <li>Code snippet, HTTP request/response, or file path</li>
            <li>Scope notes and program context (optional)</li>
          </ul>
        </section>

        {/* Output */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4">◆ Output / Artifact</h2>
          <ul className="list-disc list-inside text-text-muted space-y-2 text-sm">
            <li>Vulnerability findings with severity and impact</li>
            <li>PoC steps or code (where applicable)</li>
            <li>Report-ready markdown artifact</li>
          </ul>
        </section>

        {/* Example prompt */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4">◆ Example Prompt</h2>
          <div className="relative bg-hero-bg rounded-xl p-5">
            <pre className="font-mono text-sm text-white/80 whitespace-pre-wrap">
              {`${skill.command} https://target.com`}
            </pre>
          </div>
        </section>

        {/* Install */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4">◆ Install This Skill</h2>
          <ol className="space-y-3">
            {installSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                <span className="font-mono text-xs bg-primary-light text-primary rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Back */}
        <Link
          href={`/domains/${skill.domain}`}
          className="text-sm text-primary hover:text-primary-dark font-medium"
        >
          ← More {domain?.title} skills
        </Link>
      </main>
      <Footer />
    </>
  );
}
