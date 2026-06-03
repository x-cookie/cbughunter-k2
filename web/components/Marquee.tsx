const ITEMS = [
  "/hunt-sqli", "/hunt-xss", "/hunt-oauth", "/hunt-idor", "/hunt-ssrf",
  "/hunt-rce", "/osint-methodology", "/cloud-iam-deep", "/triage-validation",
  "/hunt-saml", "/apk-redteam-pipeline", "/hunt-csrf", "/report-writing",
  "/web3-audit", "/m365-entra-attack", "/supply-chain-attack-recon", "/hunt-graphql",
  "/evidence-hygiene", "/hunt-auth-bypass", "/redteam-mindset",
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div
      style={{
        background: "var(--hero)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "12px 0",
        overflow: "hidden",
      }}
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.35)",
                whiteSpace: "nowrap",
                padding: "0 20px",
              }}
            >
              {item}
            </span>
            <span style={{ color: "rgba(255,255,255,0.10)", fontSize: 10 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
