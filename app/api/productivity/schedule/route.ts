import { NextResponse } from "next/server";

import { readJsonBody, normalizeClientMemory } from "@/lib/productivity/api-request";
import { callProductivityLlm, formatMemoryForPrompt } from "@/lib/productivity/llm";
import { parseScheduleResponse } from "@/lib/productivity/parse-responses";
import type { DailyTaskItem } from "@/lib/productivity/types";

export const runtime = "nodejs";

function parseTasks(x: unknown): DailyTaskItem[] {
  if (!Array.isArray(x)) {
    return [];
  }
  const out: DailyTaskItem[] = [];
  const pri = new Set(["high", "medium", "low"]);
  for (const t of x) {
    if (!t || typeof t !== "object") {
      continue;
    }
    const o = t as Record<string, unknown>;
    if (typeof o.title !== "string" || !o.title.trim()) {
      continue;
    }
    const p = o.priority;
    const priority = pri.has(String(p)) ? (p as DailyTaskItem["priority"]) : "medium";
    out.push({ title: o.title.trim(), priority });
  }
  return out;
}

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
  const tasks = parseTasks(rec.tasks);
  if (tasks.length === 0) {
    return NextResponse.json({ error: "tasks 배열(최소 1개)이 필요합니다." }, { status: 400 });
  }

  const constraints = typeof rec.constraints === "string" ? rec.constraints : "";
  const memory = normalizeClientMemory(rec.memory);
  const date = typeof rec.date === "string" ? rec.date : "";

  const system = [
    "You propose a simple same-day time-block schedule. Respond in Korean for labels (label field can mix Korean and times).",
    "Output a single valid JSON object (no markdown) with this shape:",
    '{"blocks":[{"start":"HH:MM","end":"HH:MM","label":string}],"notes"?:string}',
    "Use 24h times. No external calendar: infer from workHours and memory. 4–10 blocks, no overlap.",
  ].join(" ");

  const user = [
    `날짜: ${date || "오늘"}`,
    "",
    "개인화 메모리:",
    formatMemoryForPrompt(memory),
    "",
    "할 일(우선 반영):",
    JSON.stringify(tasks, null, 0),
    "",
    "추가 제약(가용 시간/회의/금지 구간):",
    constraints.slice(0, 8000) || "(없음)",
  ].join("\n");

  const out = await callProductivityLlm({
    system,
    user,
    maxTokens: 1200,
    temperature: 0.35,
    jsonObject: true,
  });

  if (!out.ok) {
    return NextResponse.json({ error: out.error }, { status: out.status });
  }

  try {
    const data = parseScheduleResponse(out.text);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `응답 파싱 실패: ${message}` }, { status: 502 });
  }
}
