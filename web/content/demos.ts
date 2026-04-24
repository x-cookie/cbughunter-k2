export const skillDemos: Record<string, string> = {
  "web-hunting/hunt-sqli": "PENDING",
  "web-hunting/hunt-xss": "PENDING",
  "auth/hunt-oauth": "PENDING",
  "auth/hunt-jwt": "PENDING",
  "api-infra/hunt-api-misconfig": "PENDING",
  "api-infra/hunt-cloud-misconfig": "PENDING",
  "enterprise/cloud-iam-deep": "PENDING",
  "red-team/apk-redteam-pipeline": "PENDING",
  "red-team/supply-chain-attack-recon": "PENDING",
  "recon/osint-methodology": "PENDING",
  "reporting/triage-validation": "PENDING",
  "reporting/report-writing": "PENDING",
  "reporting/evidence-hygiene": "PENDING",
  "specialized/web3-audit": "PENDING",
};

export function getDemoId(skillId: string): string | null {
  const id = skillDemos[skillId];
  return id && id !== "PENDING" ? id : null;
}
