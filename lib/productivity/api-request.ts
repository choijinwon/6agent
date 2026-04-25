import { MAX_FACTS, MAX_LEARNED, type ProductivityMemory, PRODUCTIVITY_MEMORY_VERSION } from "./types";

export const MAX_BODY_BYTES = 65_536;

function defaultMemory(): ProductivityMemory {
  return {
    version: PRODUCTIVITY_MEMORY_VERSION,
    updatedAt: new Date().toISOString(),
    facts: [],
    learned: [],
  };
}

export function normalizeClientMemory(x: unknown): ProductivityMemory {
  const d = defaultMemory();
  if (!x || typeof x !== "object") {
    return d;
  }
  const o = x as Partial<ProductivityMemory>;
  const wh =
    o.workHours &&
    typeof o.workHours === "object" &&
    o.workHours !== null &&
    "start" in o.workHours &&
    "end" in o.workHours
      ? {
          start: String((o.workHours as WorkHoursLoose).start).slice(0, 12),
          end: String((o.workHours as WorkHoursLoose).end).slice(0, 12),
        }
      : undefined;
  return {
    version: PRODUCTIVITY_MEMORY_VERSION,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : d.updatedAt,
    facts: Array.isArray(o.facts)
      ? o.facts.filter((f): f is string => typeof f === "string").slice(0, MAX_FACTS)
      : [],
    learned: Array.isArray(o.learned)
      ? o.learned.filter((f): f is string => typeof f === "string").slice(0, MAX_LEARNED)
      : [],
    workHours: wh?.start && wh?.end ? wh : undefined,
  };
}

type WorkHoursLoose = { start: unknown; end: unknown };

export async function readJsonBody(req: Request): Promise<
  { ok: true; value: unknown } | { ok: false; error: string; status: number }
> {
  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX_BODY_BYTES) {
    return { ok: false, error: "요청 본문이 너무 큽니다 (최대 약 64KB).", status: 413 };
  }
  const text = new TextDecoder().decode(buf);
  if (!text.trim()) {
    return { ok: false, error: "요청 본문이 비어 있습니다.", status: 400 };
  }
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, error: "JSON 파싱에 실패했습니다.", status: 400 };
  }
}
