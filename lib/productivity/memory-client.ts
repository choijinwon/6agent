import {
  MAX_FACTS,
  MAX_LEARNED,
  type ProductivityMemory,
  PRODUCTIVITY_MEMORY_VERSION,
} from "./types";

const STORAGE_KEY = "productivity-memory-v1";

export function createDefaultMemory(): ProductivityMemory {
  return {
    version: PRODUCTIVITY_MEMORY_VERSION,
    updatedAt: new Date().toISOString(),
    facts: [],
    learned: [],
  };
}

function touch(m: ProductivityMemory): ProductivityMemory {
  return { ...m, updatedAt: new Date().toISOString() };
}

export function loadMemoryFromStorage(): ProductivityMemory {
  if (typeof window === "undefined") {
    return createDefaultMemory();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultMemory();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultMemory();
    }
    const o = parsed as Partial<ProductivityMemory>;
    return {
      version: PRODUCTIVITY_MEMORY_VERSION,
      updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString(),
      facts: Array.isArray(o.facts)
        ? o.facts.filter((f): f is string => typeof f === "string").slice(0, MAX_FACTS)
        : [],
      learned: Array.isArray(o.learned)
        ? o.learned.filter((f): f is string => typeof f === "string").slice(0, MAX_LEARNED)
        : [],
      workHours:
        o.workHours &&
        typeof o.workHours === "object" &&
        o.workHours !== null &&
        "start" in o.workHours &&
        "end" in o.workHours
          ? {
              start: String((o.workHours as { start: unknown }).start).slice(0, 12),
              end: String((o.workHours as { end: unknown }).end).slice(0, 12),
            }
          : undefined,
    };
  } catch {
    return createDefaultMemory();
  }
}

export function saveMemoryToStorage(m: ProductivityMemory): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
  } catch {
    // quota or private mode
  }
}

export function parseFactsTextarea(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, MAX_FACTS);
}

export function mergeLearned(
  current: ProductivityMemory,
  additions: string[],
): ProductivityMemory {
  const set = new Set(
    current.learned
      .map((s) => s.trim())
      .filter(Boolean),
  );
  for (const a of additions) {
    const t = a.trim();
    if (t) {
      set.add(t);
    }
  }
  const learned = [...set].slice(-MAX_LEARNED);
  return touch({ ...current, learned });
}

export function removeLearnedItem(current: ProductivityMemory, index: number): ProductivityMemory {
  const learned = current.learned.filter((_, i) => i !== index);
  return touch({ ...current, learned });
}

export function setFactsFromArray(current: ProductivityMemory, facts: string[]): ProductivityMemory {
  return touch({
    ...current,
    facts: facts.map((f) => f.trim()).filter(Boolean).slice(0, MAX_FACTS),
  });
}

export function setWorkHours(
  current: ProductivityMemory,
  workHours: ProductivityMemory["workHours"],
): ProductivityMemory {
  return touch({ ...current, workHours });
}

export function clearMemoryStorage(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
