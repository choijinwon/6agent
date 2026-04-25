import { applyAutoFixes } from "./auto-fix";
import { runAxeOnHtml } from "./axe-run";
import { axeViolationsToFindings } from "./engine";
import { INPUT_SCOPE } from "./input-scope";
import { llmSuggest } from "./llm/suggest";
import { prDescriptionMarkdown, toUnifiedDiff } from "./patch";
import { runStaticRules } from "./rules";
import type { AnalyzeResponse, Finding } from "./types";

export async function analyzeHtmlContent(html: string): Promise<AnalyzeResponse> {
  const original = html;
  const axeRun = await runAxeOnHtml(html);
  const staticFindings = runStaticRules(html);

  let axeFindings: Finding[] = [];
  if (axeRun.ok) {
    axeFindings = axeViolationsToFindings(axeRun.results);
  }

  const findings: Finding[] = [...staticFindings, ...axeFindings];
  const { html: autoFixedHtml, notes } = applyAutoFixes(original);
  const unifiedDiff = toUnifiedDiff(original, autoFixedHtml);

  const extraForPr =
    notes.length > 0
      ? `### 자동 적용 메모\n\n${notes.map((n) => `- ${n}`).join("\n")}`
      : "";

  const prBodyMarkdown = prDescriptionMarkdown(unifiedDiff, extraForPr);
  const llm = await llmSuggest({ findings, autoFixNotes: notes });

  return {
    inputScope: INPUT_SCOPE,
    axe: axeRun,
    findings,
    autoFixedHtml,
    unifiedDiff,
    prBodyMarkdown,
    llm,
    meta: {
      originalLength: original.length,
      fixedLength: autoFixedHtml.length,
    },
  };
}
