import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { getDomain, domains } from "@/content/domains";
import { getSkillsByDomain } from "@/content/skills";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return domains.map((d) => ({ slug: d.slug }));
}

export default function DomainPage({ params }: Props) {
  const domain = getDomain(params.slug);
  if (!domain) notFound();

  const skills = getSkillsByDomain(params.slug);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-text-muted hover:text-text mb-8 inline-block">
          ← All domains
        </Link>
        <div className="mb-10">
          <p className="text-4xl mb-3">{domain.icon}</p>
          <h1 className="text-4xl font-bold text-text mb-3">{domain.title}</h1>
          <p className="text-text-muted max-w-2xl">{domain.description}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Link key={skill.id} href={`/skills/${skill.id}`}>
              <Card className="p-6 h-full hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-xs text-text-subtle bg-surface-alt rounded px-2 py-0.5">
                    {skill.command}
                  </span>
                  <Pill env={skill.env} />
                </div>
                <h3 className="font-semibold text-text mb-1">{skill.name}</h3>
                <p className="text-xs text-text-muted line-clamp-3">{skill.description}</p>
                {skill.reportCount && (
                  <p className="font-mono text-xs text-text-subtle mt-3">
                    {skill.reportCount} reports
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
