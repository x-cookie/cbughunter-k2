import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { domains } from "@/content/domains";

export function DomainGrid() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs tracking-widest uppercase text-text-muted mb-2">
          Domains
        </p>
        <h2 className="text-3xl font-bold text-text mb-12">8 attack domains</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map((domain) => (
            <Link key={domain.slug} href={`/domains/${domain.slug}`}>
              <Card className="p-6 h-full hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                <p className="text-2xl mb-3">{domain.icon}</p>
                <h3 className="font-semibold text-text mb-1">{domain.title}</h3>
                <p className="text-xs text-text-muted mb-3 line-clamp-2">{domain.description}</p>
                <p className="font-mono text-xs text-text-subtle">
                  {domain.skillCount} skills
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
