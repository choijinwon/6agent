import { createTwoFilesPatch } from "diff";

/**
 * PR에 붙일 unified diff (`index.html` 가정).
 */
export function toUnifiedDiff(
  original: string,
  modified: string,
  filename = "index.html"
): string {
  return createTwoFilesPatch(
    `a/${filename}`,
    `b/${filename}`,
    original,
    modified,
    "",
    "",
    { context: 3 }
  );
}

export function prDescriptionMarkdown(unifiedDiff: string, extra: string): string {
  return [
    "## HTML 감사 자동 수정",
    "",
    extra.trim(),
    "",
    "### Diff (`index.html`)",
    "",
    "```diff",
    unifiedDiff.trimEnd(),
    "```",
    "",
    "_GitHub PR 은 저장소 토큰·권한이 필요해 2단계로 연동합니다. 위 diff 를 브랜치에 적용해 올리세요._",
  ].join("\n");
}
