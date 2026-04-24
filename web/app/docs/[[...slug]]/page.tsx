import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const docsDir = path.join(process.cwd(), "..", "docs");

const docPages = [
  { slug: "quick-start", title: "Quick Start" },
  { slug: "install", title: "Install" },
  { slug: "chat-vs-code", title: "Chat vs Code" },
  { slug: "7-question-gate", title: "7-Question Gate" },
];

function readDoc(slug: string): string | null {
  const filePath = path.join(docsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

interface Props {
  params: { slug?: string[] };
}

export function generateStaticParams() {
  return [
    { slug: undefined },
    ...docPages.map((p) => ({ slug: [p.slug] })),
  ];
}

export default function DocsPage({ params }: Props) {
  const activeSlug = params.slug?.[0] ?? "quick-start";
  const content = readDoc(activeSlug);
  if (!content) notFound();

  return (
    <>
      <Nav />
      <div className="max-w-6xl mx-auto px-6 py-16 flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-48 shrink-0">
          <p className="font-mono text-xs tracking-widest uppercase text-text-subtle mb-4">
            Docs
          </p>
          <nav className="flex flex-col gap-1">
            {docPages.map((p) => (
              <Link
                key={p.slug}
                href={`/docs/${p.slug}`}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  activeSlug === p.slug
                    ? "bg-primary-light text-primary font-medium"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {p.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="flex-1 prose prose-slate max-w-none">
          <MDXRemote source={content} />
        </article>
      </div>
      <Footer />
    </>
  );
}
