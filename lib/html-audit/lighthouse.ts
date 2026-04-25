/**
 * 확장 훅: URL을 받아 CI·별도 워커에서 Lighthouse를 돌리는 경우
 * `analyze` API에 연결하세요. v1 HTML-only 데모에는 사용하지 않습니다.
 */
export function lighthousePlannedForUrlInput(): { supported: false; reason: string } {
  return {
    supported: false,
    reason:
      "Lighthouse needs a public URL and Headless Chrome; use CI or a worker. HTML upload path uses static rules + axe + optional LLM.",
  };
}
