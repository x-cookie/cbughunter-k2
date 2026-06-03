"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  skillName: string;
  skillCommand: string;
  domain: string;
  description: string;
}

interface Msg { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "How do I use this skill?",
  "What payloads work best?",
  "Show me an example workflow",
  "What false positives should I watch for?",
];

/* ── Two-pass markdown → safe HTML ── */
function md(raw: string): string {
  const ph: string[] = [];
  let t = raw;

  t = t.replace(/```([\w-]*)\n?([\s\S]*?)```/g, (_m, lang: string, code: string) => {
    const esc = code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const lb  = lang ? `<span class="cbug-code-lang">${lang}</span>` : "";
    ph.push(`<div class="cbug-pre">${lb}<pre><code>${esc.trimEnd()}</code></pre></div>`);
    return `\x02${ph.length - 1}\x03`;
  });
  t = t.replace(/(?:^|\n)(\|[^\n]+\|)\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)*)/gm, (_m, h: string, b: string) => {
    const ths  = h.split("|").map((c:string)=>c.trim()).filter(Boolean).map((c:string)=>`<th>${c}</th>`).join("");
    const rows = b.trim().split("\n").map((r:string)=>`<tr>${r.split("|").map((c:string)=>c.trim()).filter(Boolean).map((c:string)=>`<td>${c}</td>`).join("")}</tr>`).join("");
    ph.push(`<div class="cbug-table-wrap"><table class="cbug-table"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table></div>`);
    return `\x02${ph.length - 1}\x03`;
  });
  t = t.replace(/`([^`\n]+)`/g, (_m, c:string) => {
    ph.push(`<code class="cbug-inline">${c.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code>`);
    return `\x02${ph.length - 1}\x03`;
  });
  t = t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  t = t
    .replace(/\*\*\*([^*\n]+)\*\*\*/g,"<strong><em>$1</em></strong>")
    .replace(/\*\*([^*\n]+)\*\*/g,"<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g,"<em>$1</em>")
    .replace(/^#{1,2} (.+)$/gm,'<h3 class="cbug-h3">$1</h3>')
    .replace(/^### (.+)$/gm,'<h4 class="cbug-h4">$1</h4>')
    .replace(/^---$/gm,'<hr class="cbug-hr">')
    .replace(/^[-*] (.+)$/gm,"<li>$1</li>")
    .replace(/(?:<li>.*\n?)+/g,(m)=>`<ul class="cbug-ul">${m}</ul>`)
    .replace(/<\/ul>\s*<ul[^>]*>/g,"");
  t = t.replace(/\x02(\d+)\x03/g,(_m,i)=>ph[Number(i)]??"");
  return t
    .split(/\n{2,}/)
    .map((b)=>{const s=b.trim();if(!s)return"";if(/^<(div|ul|ol|h[1-6]|hr|table)/.test(s))return s;return`<p class="cbug-p">${s.replace(/\n/g," ")}</p>`;})
    .filter(Boolean).join("\n");
}

/* ── Bot avatar ── */
function BotAvatar() {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: "50%",
      background: "var(--accent-dim)",
      border: "1px solid rgba(90,133,255,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, alignSelf: "flex-end",
    }}>
      <span style={{ color: "var(--accent)", fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.02em" }}>cb</span>
    </div>
  );
}

export function AskCbugModal({ skillName, skillCommand, domain, description }: Props) {
  const [visible, setVisible]   = useState(false);
  const [closing, setClosing]   = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const dialogRef  = useRef<HTMLDialogElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const context = `Skill: "${skillName}" (${skillCommand}). Domain: ${domain}. ${description.slice(0, 160)}.`;

  const openModal = useCallback(() => {
    setVisible(true);
    // showModal runs after React paints the dialog
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dialogRef.current?.showModal();
        setTimeout(() => inputRef.current?.focus(), 80);
      });
    });
  }, []);

  const closeModal = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      dialogRef.current?.close();
      setVisible(false);
      setClosing(false);
    }, 230);
  }, [closing]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && visible) { e.preventDefault(); closeModal(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, closeModal]);

  /* Auto-scroll messages */
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
      const res  = await fetch("/api/ask-claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, context }) });
      const data = await res.json() as { answer?: string; error?: string };
      setMessages([...next, { role: "assistant", content: data.answer ?? data.error ?? "No response." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <>
      {/* ── Trigger card in sidebar ── */}
      <div style={{ background: "var(--accent-dim)", border: "1px solid rgba(90,133,255,0.22)", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
          <span style={{ color: "var(--accent)", fontSize: 10 }}>◆</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>Ask cbug</span>
        </div>
        <p style={{ fontSize: 11, color: "rgba(240,240,255,0.45)", lineHeight: 1.55, margin: "0 0 10px", fontWeight: 300 }}>Questions about {skillName}?</p>
        <button onClick={openModal} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", background: "transparent", border: "none", padding: 0, cursor: "pointer", letterSpacing: "0.04em", fontWeight: 500 }}>
          Ask a question →
        </button>
      </div>

      {/* ── Dialog — always in DOM once opened ── */}
      {visible && (
        <dialog
          ref={dialogRef}
          className={`cbug-dialog${closing ? " cbug-closing" : ""}`}
          style={{
            width: "min(640px, 95vw)",
            maxHeight: "82vh",
            background: "var(--s1)",
            border: "1px solid rgba(90,133,255,0.25)",
            borderRadius: 18,
            padding: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            color: "var(--text)",
            boxShadow: "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(90,133,255,0.1)",
          }}
          onClick={(e) => { if (e.target === dialogRef.current) closeModal(); }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--b0)", background: "var(--hero)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BotAvatar />
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>cbug</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", letterSpacing: "0.06em" }}>{skillCommand} · {domain}</div>
              </div>
            </div>
            <button onClick={closeModal} style={{ background: "transparent", border: "1px solid var(--b0)", borderRadius: 6, color: "var(--text-muted)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "4px 10px", transition: "border-color 0.15s" }}>
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12, minHeight: 200 }}>

            {/* Welcome + suggestion chips */}
            {messages.length === 0 && !loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <BotAvatar />
                  <div style={{ background: "var(--s2)", border: "1px solid var(--b0)", borderRadius: "12px 12px 12px 2px", padding: "10px 14px", maxWidth: "80%" }}>
                    <p style={{ fontSize: 13, color: "rgba(240,240,255,0.65)", margin: 0, lineHeight: 1.55 }}>
                      Hey! I&apos;m cbug — ask me anything about <strong style={{ color: "var(--text)" }}>{skillName}</strong>.
                    </p>
                  </div>
                </div>
                <div style={{ paddingLeft: 38, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid rgba(90,133,255,0.25)", borderRadius: 20, padding: "5px 12px", cursor: "pointer", transition: "border-color 0.15s" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation */}
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "user" ? (
                  /* User bubble — right, solid blue */
                  <div style={{ background: "var(--accent)", color: "#fff", borderRadius: "14px 14px 2px 14px", padding: "10px 14px", fontSize: 13, maxWidth: "78%", lineHeight: 1.55, fontFamily: "var(--font-sans)", wordBreak: "break-word" }}>
                    {m.content}
                  </div>
                ) : (
                  /* Bot bubble — left, with avatar */
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "88%" }}>
                    <BotAvatar />
                    <div className="cbug-response" dangerouslySetInnerHTML={{ __html: md(m.content) }}
                      style={{ background: "var(--s2)", border: "1px solid var(--b0)", borderRadius: "14px 14px 14px 2px", padding: "10px 14px", fontSize: 13, color: "rgba(240,240,255,0.72)", wordBreak: "break-word" }} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator — WhatsApp style */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <BotAvatar />
                <div style={{ background: "var(--s2)", border: "1px solid var(--b0)", borderRadius: "14px 14px 14px 2px", padding: "12px 16px", display: "flex", alignItems: "center", gap: 5 }}>
                  {[0, 200, 400].map((d) => (
                    <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-muted)", display: "inline-block", animation: `typing-dot 1.4s ease-in-out ${d}ms infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input row */}
          <div style={{ padding: "10px 14px 14px", borderTop: "1px solid var(--b0)", display: "flex", gap: 8, flexShrink: 0 }}>
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Ask about this skill…" disabled={loading}
              style={{ flex: 1, background: "var(--bg)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "10px 13px", fontSize: 13, color: "var(--text)", fontFamily: "var(--font-sans)", outline: "none" }}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
              style={{ background: input.trim() && !loading ? "var(--accent)" : "rgba(90,133,255,0.3)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 12, fontFamily: "var(--font-mono)", cursor: input.trim() && !loading ? "pointer" : "not-allowed", letterSpacing: "0.04em", transition: "background 0.15s", flexShrink: 0 }}>
              Send →
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
