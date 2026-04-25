import { parseJsonObject } from "./llm";
import type {
  DailyTaskItem,
  DailyTasksResponse,
  EmailSummaryResponse,
  ScheduleBlock,
  ScheduleResponse,
  SuggestMemoryResponse,
} from "./types";

const PRIORITIES = new Set(["high", "medium", "low"]);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseDailyTasksResponse(raw: string): DailyTasksResponse {
  const o = parseJsonObject<unknown>(raw);
  if (!isRecord(o)) {
    throw new Error("응답이 객체가 아닙니다.");
  }
  const tasksRaw = o.tasks;
  if (!Array.isArray(tasksRaw)) {
    throw new Error("tasks 배열이 없습니다.");
  }
  const tasks: DailyTaskItem[] = [];
  for (const t of tasksRaw) {
    if (!isRecord(t) || typeof t.title !== "string" || !t.title.trim()) {
      continue;
    }
    const p = t.priority;
    const priority = PRIORITIES.has(String(p)) ? (p as DailyTaskItem["priority"]) : "medium";
    const em = t.estMinutes;
    const item: DailyTaskItem = { title: t.title.trim(), priority };
    if (typeof em === "number" && em > 0 && em < 24 * 60) {
      item.estMinutes = Math.round(em);
    }
    tasks.push(item);
  }
  if (tasks.length === 0) {
    throw new Error("유효한 할 일이 없습니다.");
  }
  const rationale = typeof o.rationale === "string" ? o.rationale.trim() : undefined;
  return { tasks, rationale: rationale || undefined };
}

export function parseEmailSummaryResponse(raw: string): EmailSummaryResponse {
  const o = parseJsonObject<unknown>(raw);
  if (!isRecord(o)) {
    throw new Error("응답이 객체가 아닙니다.");
  }
  const summary = typeof o.summary === "string" ? o.summary.trim() : "";
  if (!summary) {
    throw new Error("summary가 없습니다.");
  }
  const actionItems = Array.isArray(o.actionItems)
    ? o.actionItems.filter((x): x is string => typeof x === "string" && x.trim() !== "")
    : [];
  const tone = typeof o.tone === "string" ? o.tone.trim() : undefined;
  return { summary, actionItems, tone: tone || undefined };
}

export function parseScheduleResponse(raw: string): ScheduleResponse {
  const o = parseJsonObject<unknown>(raw);
  if (!isRecord(o)) {
    throw new Error("응답이 객체가 아닙니다.");
  }
  const blocksRaw = o.blocks;
  if (!Array.isArray(blocksRaw)) {
    throw new Error("blocks 배열이 없습니다.");
  }
  const blocks: ScheduleBlock[] = [];
  for (const b of blocksRaw) {
    if (!isRecord(b)) {
      continue;
    }
    const start = typeof b.start === "string" ? b.start.trim() : "";
    const end = typeof b.end === "string" ? b.end.trim() : "";
    const label = typeof b.label === "string" ? b.label.trim() : "";
    if (start && end && label) {
      blocks.push({ start, end, label });
    }
  }
  if (blocks.length === 0) {
    throw new Error("유효한 일정 블록이 없습니다.");
  }
  const notes = typeof o.notes === "string" ? o.notes.trim() : undefined;
  return { blocks, notes: notes || undefined };
}

export function parseSuggestMemoryResponse(raw: string): SuggestMemoryResponse {
  const o = parseJsonObject<unknown>(raw);
  if (!isRecord(o)) {
    throw new Error("응답이 객체가 아닙니다.");
  }
  const c = o.candidates;
  const candidates = Array.isArray(c)
    ? c.filter((x): x is string => typeof x === "string" && x.trim() !== "").slice(0, 2)
    : [];
  return { candidates };
}
