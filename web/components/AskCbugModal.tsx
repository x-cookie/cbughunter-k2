"use client";
import { useState, useRef, useEffect } from "react";

interface Props {
  skillName: string;
  skillCommand: string;
  domain: string;
  description: string;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How do I use this skill?",
  "What are the best payloads?",
  "Show me an example workflow",
  "What false positives should I watch for?",
];

/* ─── Two-pass markdown → HTML (safe, no external deps) ─── */
function md(raw: string): string {
  const ph: string[] = [];
  let t = raw;

  // 1. Extract fenced code blocks
  t = t.replace(/```([\w-]*)\n?([\s\S]*?)```/g, (_m, lang: string, code: string) => {
    const esc = code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const lb  = lang ? `<span class="cbug-code-lang">${lang}</span>` : "";
    const id  = ph.length;
    ph.push(`<div class="cbug-pre">${lb}<pre><code>${esc.trimEnd()}</code></pre></div>`);
    return `\x02${id}\x03`;
  });

  // 2. Pipe tables (before HTML escape)
  t = t.replace(
    /(?:^|\n)(\|[^\n]+\|)\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)*)/gm,
    (_m, hdr: string, body: string) => {
      const ths = hdr.split("|").map((h: string) => h.trim()).filter(Boolean).map((h: string) => `<th>${h}</th>`).join("");
      const rows = body.trim().split("\n").map((r: string) =>
        `<tr>${r.split("|").map((c: string) => c.trim()).filter(Boolean).map((c: string) => `<td>${c}</td>`).join("")}</tr>`
      ).join("");
      const id = ph.length;
      ph.push(`<div class="cbug-table-wrap"><table class="cbug-table"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table></div>`);
      return `\x02${id}\x03`;
    }
  );

  // 3. Inline code
  t = t.replace(/`([^`\n]+)`/g, (_m, c: string) => {
    const id = ph.length;
    ph.push(`<code class="cbug-inline">${c.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code>`);
    return `\x02${id}\x03`;
  });

  // 4. HTML escape remaining
  t = t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  // 5. Markdown formatting
  t = t
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/^#{1,2} (.+)$/gm, "<h3 class=\"cbug-h3\">$1</h3>")
    .replace(/^### (.+)$/gm, "<h4 class=\"cbug-h4\">$1</h4>")
    .replace(/^---$/gm, "<hr class=\"cbug-hr\">")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(?:<li>.*\n?)+/g, (m) => `<ul class="cbug-ul">${m}</ul>`)
    .replace(/<\/ul>\s*<ul[^>]*>/g, "");

  // 6. Restore placeholders
  t = t.replace(/\x02(\d+)\x03/g, (_m, i) => ph[Number(i)] ?? "");

  // 7. Wrap paragraphs
  t = t
    .split(/\n{2,}/)
    .map((b) => {
      const s = b.trim();
      if (!s) return "";
      if (/^<(div|ul|ol|h[1-6]|hr|table)/.test(s)) return s;
      return `<p class="cbug-p">${s.replace(/\n/g, " ")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return t;
}

export function AskCbugModal({ skillName, skillCommand, domain, description }: Props) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const dialogRef  = useRef<HTMLDialogElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const context = `Skill: "${skillName}" (${skillCommand}). Domain: ${domain}. ${description.slice(0, 160)}.`;

  const openModal = () => {
    setOpen(true);
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const closeModal = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  /* Auto-scroll on new messages */
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/ask-claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      const data = await res.json() as { answer?: string; error?: string };
      setMessages([...next, { role: "assistant", content: data.answer ?? data.error ?? "No response." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error. Try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <>
      {/* Trigger card */}
      <div style={{
        background: "var(--accent-dim)",
        border: "1px solid rgba(90,133,255,0.22)",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
          <span style={{ color: "var(--accent)", fontSize: 10 }}>◆</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
            Ask cbug
          </span>
        </div>
        <p style={{ fontSize: 11, color: "rgba(240,240,255,0.45)", lineHeight: 1.55, margin: "0 0 10px", fontWeight: 300 }}>
          Questions about {skillName}?
        </p>
        <button
          onClick={openModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--accent)",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            letterSpacing: "0.04em",
            fontWeight: 500,
          }}
        >
          Ask a question →
        </button>
      </div>

      {/* Dialog (top-layer — no position:fixed needed) */}
      <dialog
        ref={dialogRef}
        style={{
          width: "min(640px, 95vw)",
          maxHeight: "80vh",
          background: "var(--s1)",
          border: "1px solid rgba(90,133,255,0.22)",
          borderRadius: 16,
          padding: 0,
          overflow: "hidden",
          display: open ? "flex" : "none",
          flexDirection: "column",
          color: "var(--text)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => { if (e.target === dialogRef.current) closeModal(); }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--b0)",
          background: "var(--hero)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--accent)" }}>◆</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
              Ask cbug
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.04em" }}>
              {skillCommand}
            </span>
          </div>
          <button
            onClick={closeModal}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "4px 6px" }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minHeight: 200,
          }}
        >
          {/* Welcome state */}
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: "center", paddingTop: 24 }}>
              <p style={{ fontSize: 13, color: "rgba(240,240,255,0.40)", fontWeight: 300, marginBottom: 20 }}>
                Ask anything about <strong style={{ color: "var(--text)", fontWeight: 600 }}>{skillName}</strong>
              </p>
              {/* Suggestion chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      color: "var(--accent)",
                      background: "var(--accent-dim)",
                      border: "1px solid rgba(90,133,255,0.2)",
                      borderRadius: 20,
                      padding: "5px 12px",
                      cursor: "pointer",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "user" ? (
                <div style={{
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "12px 12px 2px 12px",
                  padding: "9px 14px",
                  fontSize: 13,
                  maxWidth: "80%",
                  lineHeight: 1.5,
                  fontFamily: "var(--font-sans)",
                }}>
                  {m.content}
                </div>
              ) : (
                <div
                  className="cbug-response"
                  dangerouslySetInnerHTML={{ __html: md(m.content) }}
                  style={{
                    background: "var(--s2)",
                    border: "1px solid var(--b0)",
                    borderRadius: "12px 12px 12px 2px",
                    padding: "10px 14px",
                    fontSize: 13,
                    maxWidth: "90%",
                    fontFamily: "var(--font-sans)",
                    color: "rgba(240,240,255,0.75)",
                  }}
                />
              )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {[0,160,320].map((d) => (
                <span key={d} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--accent)", display: "inline-block",
                  animation: `dotpulse 1.2s ease-in-out ${d}ms infinite`,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Input row */}
        <div style={{
          padding: "12px 18px",
          borderTop: "1px solid var(--b0)",
          display: "flex",
          gap: 8,
          flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
            placeholder="Ask about this skill…"
            disabled={loading}
            style={{
              flex: 1,
              background: "var(--bg)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 13,
              color: "var(--text)",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? "var(--accent)" : "rgba(90,133,255,0.3)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "9px 16px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              letterSpacing: "0.04em",
              transition: "background 0.15s",
            }}
          >
            Send →
          </button>
        </div>
      </dialog>
    </>
  );
}
