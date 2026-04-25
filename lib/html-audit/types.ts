import type { AxeResults } from "axe-core";

export type Severity = "error" | "warning" | "info";

export type SourceKind = "axe" | "rule";

export type Finding = {
  id: string;
  source: SourceKind;
  ruleId: string;
  message: string;
  severity: Severity;
  help?: string;
  nodes?: { selector: string; html?: string }[];
};

export type AxeRunOutcome =
  | { ok: true; results: AxeResults }
  | { ok: false; error: string };

export type AnalyzeResponse = {
  inputScope: "html_string_only";
  axe: AxeRunOutcome;
  findings: Finding[];
  /** 규칙/자동수정이 적용된 HTML */
  autoFixedHtml: string;
  /** index.html PR용 unified diff (복붙) */
  unifiedDiff: string;
  /** 풀리퀘 설명용 (2단계: GitHub API 연동은 별도) */
  prBodyMarkdown: string;
  llm: {
    used: boolean;
    summary: string | null;
    suggestions: string[] | null;
  };
  meta: {
    originalLength: number;
    fixedLength: number;
  };
};

export type { AxeResults };
