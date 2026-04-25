import { JSDOM } from "jsdom";

import type { Finding, Severity } from "../types";

function addFinding(
  list: Finding[],
  id: string,
  ruleId: string,
  message: string,
  severity: Severity,
  nodes?: { selector: string; html?: string }[]
) {
  list.push({ id, source: "rule", ruleId, message, severity, nodes });
}

/**
 * HTML 문자열에 대한 경량 SEO/구조 규칙 (Lighthouse 대체 힌트)
 */
export function runStaticRules(html: string): Finding[] {
  const findings: Finding[] = [];
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const htmlEl = document.documentElement;
  if (!htmlEl.getAttribute("lang")?.trim()) {
    addFinding(
      findings,
      "rule-missing-lang",
      "html-lang",
      "`<html>`에 `lang` 속성이 없습니다. SEO·스크린리더에 영향이 있습니다.",
      "warning"
    );
  }

  const title = document.querySelector("title");
  if (!title || !title.textContent?.trim()) {
    addFinding(
      findings,
      "rule-missing-title",
      "page-title",
      "`<title>`이 비어 있거나 없습니다.",
      "error"
    );
  }

  const metas = document.querySelectorAll('meta[name="description"]');
  if (metas.length === 0) {
    addFinding(
      findings,
      "rule-missing-description",
      "meta-description",
      "`<meta name=\"description\" content=\"...\">`이 없습니다.",
      "warning"
    );
  } else {
    for (const m of metas) {
      const c = m.getAttribute("content")?.trim();
      if (!c) {
        addFinding(
          findings,
          "rule-empty-description",
          "meta-description",
          "description 메타의 content가 비어 있습니다.",
          "warning"
        );
      }
    }
  }

  const h1s = document.querySelectorAll("h1");
  if (h1s.length === 0) {
    addFinding(
      findings,
      "rule-no-h1",
      "heading-h1",
      "페이지에 `h1`이 없습니다. 주제를 한 번 명시하는 것이 좋습니다.",
      "warning"
    );
  } else if (h1s.length > 1) {
    addFinding(
      findings,
      "rule-multi-h1",
      "heading-h1",
      "`h1`이 2개 이상입니다. 일반적으로 하나로 통일하는 것이 SEO에 유리합니다.",
      "info"
    );
  }

  return findings;
}
