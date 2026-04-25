import type { ProductivityMemory } from "./types";

const API_URL = "https://api.openai.com/v1/chat/completions";

export type LlmError = { ok: false; error: string; status: number };
export type LlmOk = { ok: true; text: string };

export function getProductivityModel(): string {
  return process.env.OPENAI_PRODUCTIVITY_MODEL?.trim() || "gpt-4o-mini";
}

export function formatMemoryForPrompt(memory: ProductivityMemory | undefined | null): string {
  if (!memory) {
    return "(메모리 없음)";
  }
  const wh = memory.workHours
    ? `근무/가용 시간: ${memory.workHours.start}–${memory.workHours.end}\n`
    : "";
  const facts = memory.facts.length
    ? `사용자 사실:\n${memory.facts.map((f) => `- ${f}`).join("\n")}\n`
    : "";
  const learned = memory.learned.length
    ? `학습된 패턴:\n${memory.learned.map((l) => `- ${l}`).join("\n")}\n`
    : "";
  return [wh, facts, learned].filter(Boolean).join("\n").trim() || "(메모리 비어 있음)";
}

export async function callProductivityLlm(params: {
  system: string;
  user: string;
  maxTokens: number;
  temperature: number;
  jsonObject?: boolean;
}): Promise<LlmOk | LlmError> {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return { ok: false, error: "서버에 OPENAI_API_KEY가 설정되어 있지 않습니다.", status: 503 };
  }

  const model = getProductivityModel();
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system" as const, content: params.system },
      { role: "user" as const, content: params.user },
    ],
    max_tokens: params.maxTokens,
    temperature: params.temperature,
  };
  if (params.jsonObject) {
    body.response_format = { type: "json_object" };
  }

  try {
    const res = await fetch(API_URL, {
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
        ok: false,
        error: `LLM 요청 실패 (${res.status}): ${errText.slice(0, 400)}`,
        status: res.status >= 500 ? 502 : 400,
      };
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    return { ok: true, text };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `LLM 오류: ${msg}`, status: 502 };
  }
}

export function parseJsonObject<T>(raw: string): T {
  const trimmed = raw.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  return JSON.parse(unfenced) as T;
}
