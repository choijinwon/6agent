import { NextResponse } from "next/server";

import { readJsonBody, normalizeClientMemory } from "@/lib/productivity/api-request";
import { callProductivityLlm, formatMemoryForPrompt } from "@/lib/productivity/llm";
import { parseDailyTasksResponse } from "@/lib/productivity/parse-responses";

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
  const context = typeof rec.context === "string" ? rec.context : "";
  const date = typeof rec.date === "string" ? rec.date : "";
  if (!context.trim()) {
    return NextResponse.json({ error: "context(오늘/이번 주 맥락)이 필요합니다." }, { status: 400 });
  }

  const memory = normalizeClientMemory(rec.memory);
  const system = [
    "You are a planning assistant. Respond in Korean only.",
    "Output a single valid JSON object (no markdown, no text outside JSON) with this shape:",
    '{"tasks":[{"title":string,"priority":"high"|"medium"|"low","estMinutes"?:number}],"rationale"?:string}',
    "3–7 actionable tasks for TODAY. estMinutes is optional, realistic. Prioritize with memory.",
  ].join(" ");

  const user = [
    `날짜(클라이언트): ${date || "미지정"}`,
    "",
    "개인화 메모리:",
    formatMemoryForPrompt(memory),
    "",
    "맥락 및 목표:",
    context.slice(0, 24_000),
  ].join("\n");

  const out = await callProductivityLlm({
    system,
    user,
    maxTokens: 1200,
    temperature: 0.4,
    jsonObject: true,
  });

  if (!out.ok) {
    return NextResponse.json({ error: out.error }, { status: out.status });
  }

  try {
    const data = parseDailyTasksResponse(out.text);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `응답 파싱 실패: ${message}` }, { status: 502 });
  }
}
