import { NextResponse } from "next/server";

import { readJsonBody, normalizeClientMemory } from "@/lib/productivity/api-request";
import { callProductivityLlm, formatMemoryForPrompt } from "@/lib/productivity/llm";
import { parseSuggestMemoryResponse } from "@/lib/productivity/parse-responses";

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
  const recentOutput = typeof rec.recentOutput === "string" ? rec.recentOutput : "";
  if (!recentOutput.trim()) {
    return NextResponse.json({ error: "recentOutput이 필요합니다." }, { status: 400 });
  }
  const f = rec.feature;
  const feature: "tasks" | "email" | "schedule" =
    f === "tasks" || f === "email" || f === "schedule" ? f : "tasks";

  const memory = normalizeClientMemory(rec.memory);

  const system = [
    "Extract 0 to 2 short, durable user-specific facts to personalize a productivity assistant. Korean.",
    "Do not store secrets, passwords, or full content of private mail — only high-level patterns (e.g. meeting-heavy Wednesdays).",
    "Output a single valid JSON object: {\"candidates\": string[] } with 0-2 short strings, no duplicates, each under 120 chars.",
  ].join(" ");

  const user = [
    `기능 맥락: ${feature}`,
    "",
    "현재 메모리(중복은 배제):",
    formatMemoryForPrompt(memory),
    "",
    "방금 본/생성한 출력 요약(원문 일부):",
    recentOutput.slice(0, 12_000),
  ].join("\n");

  const out = await callProductivityLlm({
    system,
    user,
    maxTokens: 300,
    temperature: 0.2,
    jsonObject: true,
  });

  if (!out.ok) {
    return NextResponse.json({ error: out.error }, { status: out.status });
  }

  try {
    const data = parseSuggestMemoryResponse(out.text);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `응답 파싱 실패: ${message}` }, { status: 502 });
  }
}
