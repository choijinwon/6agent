import { NextResponse } from "next/server";

import { readJsonBody, normalizeClientMemory } from "@/lib/productivity/api-request";
import { callProductivityLlm, formatMemoryForPrompt } from "@/lib/productivity/llm";
import { parseEmailSummaryResponse } from "@/lib/productivity/parse-responses";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await readJsonBody(req);
  if (!body.ok) {
    return NextResponse.json({ error: body.error }, { status: body.status });
  }

  const b = body.value;
  if (!b || typeof b !== "object") {
    return NextResponse.json({ error: "JSON 객체가 필요합니다." }, { status: 400 });
  }
  const rec = b as Record<string, unknown>;
  const rawText = typeof rec.rawText === "string" ? rec.rawText : "";
  if (!rawText.trim()) {
    return NextResponse.json({ error: "rawText(메일/텍스트 붙여넣기)이 필요합니다." }, { status: 400 });
  }

  const memory = normalizeClientMemory(rec.memory);
  const system = [
    "You summarize pasted email or thread text. Respond in Korean only.",
    "Output a single valid JSON object (no markdown) with this shape:",
    '{"summary":string,"actionItems":string[],"tone"?:string}',
    "actionItems: concrete next steps. tone: optional one word e.g. formal/friendly/urgent.",
  ].join(" ");

  const user = [
    "개인화 메모리:",
    formatMemoryForPrompt(memory),
    "",
    "원문:",
    rawText.slice(0, 32_000),
  ].join("\n");

  const out = await callProductivityLlm({
    system,
    user,
    maxTokens: 1400,
    temperature: 0.3,
    jsonObject: true,
  });

  if (!out.ok) {
    return NextResponse.json({ error: out.error }, { status: out.status });
  }

  try {
    const data = parseEmailSummaryResponse(out.text);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `응답 파싱 실패: ${message}` }, { status: 502 });
  }
}
