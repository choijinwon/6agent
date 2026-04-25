import type { Finding } from "../types";

type LlmResult = {
  used: boolean;
  summary: string | null;
  suggestions: string[] | null;
};

/**
 * OPENAI_API_KEY 가 있으면 Rules+Axe 결과를 넘겨 한국어 개선 제안을 생성합니다.
 */
export async function llmSuggest(payload: {
  findings: Finding[];
  autoFixNotes: string[];
}): Promise<LlmResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return { used: false, summary: null, suggestions: null };
  }

  const model = process.env.OPENAI_HTML_AUDIT_MODEL ?? "gpt-4o-mini";
  const body = {
    model,
    messages: [
      {
        role: "system" as const,
        content:
          "You are an expert in accessibility, SEO, and web performance. Respond in Korean. Output 3–8 bullet lines of actionable advice. No markdown code fences.",
      },
      {
        role: "user" as const,
        content: JSON.stringify({
          findings: payload.findings.map((f) => ({
            ruleId: f.ruleId,
            message: f.message,
            severity: f.severity,
            source: f.source,
          })),
          autoFixNotes: payload.autoFixNotes,
        }),
      },
    ],
    max_tokens: 900,
    temperature: 0.3,
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        used: true,
        summary: `LLM 요청 실패 (${res.status}): ${errText.slice(0, 200)}`,
        suggestions: [],
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    const lines = text
      .split(/\n+/)
      .map((l) => l.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);

    return {
      used: true,
      summary: text || null,
      suggestions: lines.length ? lines : null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { used: true, summary: `LLM 오류: ${msg}`, suggestions: [] };
  }
}
