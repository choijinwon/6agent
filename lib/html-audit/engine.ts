import type { AxeResults } from "axe-core";

import type { Finding, Severity } from "./types";

function impactToSeverity(impact: string | null | undefined): Severity {
  if (impact === "critical" || impact === "serious") {
    return "error";
  }
  if (impact === "moderate") {
    return "warning";
  }
  return "info";
}

export function axeViolationsToFindings(results: AxeResults): Finding[] {
  return results.violations.map((v, i) => ({
    id: `axe-${v.id}-${i}`,
    source: "axe",
    ruleId: v.id,
    message: v.help,
    severity: impactToSeverity(v.impact),
    help: v.description,
    nodes: v.nodes.map((n) => ({
      selector: n.target.join(" "),
      html: n.html,
    })),
  }));
}
