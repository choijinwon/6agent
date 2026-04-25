export const PRODUCTIVITY_MEMORY_VERSION = 1;
export const MAX_LEARNED = 30;
export const MAX_FACTS = 20;

export type WorkHours = { start: string; end: string };

export type ProductivityMemory = {
  version: number;
  updatedAt: string;
  facts: string[];
  learned: string[];
  workHours?: WorkHours;
};

export type DailyTaskItem = {
  title: string;
  priority: "high" | "medium" | "low";
  estMinutes?: number;
};

export type DailyTasksResponse = { tasks: DailyTaskItem[]; rationale?: string };

export type EmailSummaryResponse = { summary: string; actionItems: string[]; tone?: string };

export type ScheduleBlock = { start: string; end: string; label: string };

export type ScheduleResponse = { blocks: ScheduleBlock[]; notes?: string };

export type SuggestMemoryResponse = { candidates: string[] };
