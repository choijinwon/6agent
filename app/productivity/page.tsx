"use client";

import { useCallback, useMemo, useState } from "react";

import {
  MAX_FACTS,
  MAX_LEARNED,
  type DailyTaskItem,
  type DailyTasksResponse,
  type EmailSummaryResponse,
  type ScheduleResponse,
} from "@/lib/productivity/types";
import { useProductivityMemory } from "@/lib/productivity/useProductivityMemory";

type Tab = "tasks" | "email" | "schedule";

const initialDate = () => new Date().toISOString().slice(0, 10);

export default function ProductivityPage() {
  const { memory, ready, updateFacts, applyLearned, removeLearned, updateWorkHours, reset } =
    useProductivityMemory();

  const [tab, setTab] = useState<Tab>("tasks");
  const [date, setDate] = useState(initialDate);

  const [context, setContext] = useState("");
  const [emailText, setEmailText] = useState("");
  const [constraints, setConstraints] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [taskResult, setTaskResult] = useState<DailyTasksResponse | null>(null);
  const [emailResult, setEmailResult] = useState<EmailSummaryResponse | null>(null);
  const [scheduleResult, setScheduleResult] = useState<ScheduleResponse | null>(null);
  const [scheduleTasks, setScheduleTasks] = useState<DailyTaskItem[]>([]);

  const [lastForMemory, setLastForMemory] = useState<{ text: string; feature: "tasks" | "email" | "schedule" } | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [picked, setPicked] = useState<Record<number, boolean>>({});
  const [memoryLoading, setMemoryLoading] = useState(false);

  const factsText = useMemo(
    () => (ready ? memory.facts.join("\n") : ""),
    [memory.facts, ready],
  );

  const onFactsBlur = useCallback(
    (text: string) => {
      const lines = text
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);
      updateFacts(lines);
    },
    [updateFacts],
  );

  const runTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTaskResult(null);
    try {
      const res = await fetch("/api/productivity/daily-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, memory, date }),
      });
      const data = (await res.json()) as DailyTasksResponse & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `요청 실패 (${res.status})`);
        return;
      }
      setTaskResult(data);
      setLastForMemory({
        text: [data.rationale, ...data.tasks.map((t) => t.title)].filter(Boolean).join("\n"),
        feature: "tasks",
      });
      setCandidates([]);
      setPicked({});
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [context, date, memory]);

  const runEmail = useCallback(async () => {
    setLoading(true);
    setError(null);
    setEmailResult(null);
    try {
      const res = await fetch("/api/productivity/email-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: emailText, memory }),
      });
      const data = (await res.json()) as EmailSummaryResponse & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `요청 실패 (${res.status})`);
        return;
      }
      setEmailResult(data);
      setLastForMemory({
        text: [data.summary, ...data.actionItems].join("\n"),
        feature: "email",
      });
      setCandidates([]);
      setPicked({});
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [emailText, memory]);

  const runSchedule = useCallback(async () => {
    if (scheduleTasks.length === 0) {
      setError("일정에 쓸 할 일이 없습니다. 위 탭에서 생성하거나 제목을 입력하세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setScheduleResult(null);
    try {
      const res = await fetch("/api/productivity/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: scheduleTasks, memory, constraints, date }),
      });
      const data = (await res.json()) as ScheduleResponse & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `요청 실패 (${res.status})`);
        return;
      }
      setScheduleResult(data);
      setLastForMemory({
        text: [data.notes, ...data.blocks.map((b) => `${b.start}-${b.end} ${b.label}`)]
          .filter(Boolean)
          .join("\n"),
        feature: "schedule",
      });
      setCandidates([]);
      setPicked({});
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [constraints, date, memory, scheduleTasks]);

  const fetchMemoryCandidates = useCallback(async () => {
    if (!lastForMemory?.text.trim()) {
      setError("먼저 이 탭에서 생성을 실행하세요.");
      return;
    }
    setMemoryLoading(true);
    setError(null);
    setCandidates([]);
    setPicked({});
    try {
      const res = await fetch("/api/productivity/suggest-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recentOutput: lastForMemory.text,
          feature: lastForMemory.feature,
          memory,
        }),
      });
      const data = (await res.json()) as { candidates?: string[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? `요청 실패 (${res.status})`);
        return;
      }
      setCandidates(data.candidates ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setMemoryLoading(false);
    }
  }, [lastForMemory, memory]);

  const applyPicked = useCallback(() => {
    const toAdd = candidates.filter((_, i) => picked[i]);
    if (toAdd.length === 0) {
      return;
    }
    applyLearned(toAdd);
    setCandidates([]);
    setPicked({});
  }, [applyLearned, candidates, picked]);

  return (
    <main className="section page-pad productivity-page">
      <header className="project-page-card productivity-hero">
        <h1>개인 생산성 Agent (MVP)</h1>
        <p className="productivity-lead">
          오늘 할 일, 메일 붙여넣기 요약, 텍스트 기반 일정 제안. <strong>메모리</strong>는{" "}
          <strong>이 브라우저</strong>에만 저장되며(동기화 없음), API는 메모리를 서버에 남기지
          않습니다. <code>OPENAI_API_KEY</code>가 필요합니다.
        </p>
      </header>

      {error ? (
        <section className="project-page-card productivity-error" role="alert">
          <h2>오류</h2>
          <p>{error}</p>
        </section>
      ) : null}

      <div className="productivity-layout">
        <div className="productivity-main">
          <div className="productivity-date-row">
            <label htmlFor="prod-date" className="productivity-label">
              기준 날짜
            </label>
            <input
              id="prod-date"
              type="date"
              className="productivity-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="productivity-tabs" role="tablist" aria-label="기능 탭">
            {(
              [
                { id: "tasks" as const, label: "오늘 할 일" },
                { id: "email" as const, label: "메일 요약" },
                { id: "schedule" as const, label: "일정 제안" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                className={`productivity-tab ${tab === t.id ? "is-active" : ""}`}
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "tasks" ? (
            <section className="project-page-card productivity-panel" role="tabpanel">
              <h2>맥락 · 목표</h2>
              <label className="productivity-label" htmlFor="ctx">
                캐리오버, 이번 주 목표, 오늘의 제약을 자유롭게 적어주세요.
              </label>
              <textarea
                id="ctx"
                className="productivity-textarea"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={7}
                placeholder="예: 금요일 데드라인 보고서, 어제 미완 A/B, 오후 2시 팀 싱크..."
              />
              <div className="productivity-actions">
                <button
                  type="button"
                  className="productivity-submit"
                  disabled={loading || !ready || !context.trim()}
                  onClick={() => void runTasks()}
                >
                  {loading ? "생성 중…" : "오늘 할 일 생성"}
                </button>
                {taskResult ? (
                  <button
                    type="button"
                    className="productivity-secondary"
                    onClick={() => {
                      setScheduleTasks(taskResult.tasks);
                      setTab("schedule");
                    }}
                  >
                    이 할 일로 일정 짜기 →
                  </button>
                ) : null}
              </div>
              {taskResult ? (
                <div className="productivity-out">
                  <h3>제안</h3>
                  {taskResult.rationale ? <p className="productivity-rationale">{taskResult.rationale}</p> : null}
                  <ul className="productivity-task-list">
                    {taskResult.tasks.map((t, i) => (
                      <li key={i} data-priority={t.priority}>
                        <span className="productivity-pill">{t.priority}</span>{" "}
                        <strong>{t.title}</strong>
                        {t.estMinutes != null ? (
                          <span className="productivity-sub">· 약 {t.estMinutes}분</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {tab === "email" ? (
            <section className="project-page-card productivity-panel" role="tabpanel">
              <h2>메일 / 스레드 붙여넣기</h2>
              <label className="productivity-label" htmlFor="mail">
                원문 (개인정보·비밀은 올리지 마세요)
              </label>
              <textarea
                id="mail"
                className="productivity-textarea"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                rows={10}
                placeholder="이메일 본문을 복사해 붙여넣기…"
              />
              <div className="productivity-actions">
                <button
                  type="button"
                  className="productivity-submit"
                  disabled={loading || !ready || !emailText.trim()}
                  onClick={() => void runEmail()}
                >
                  {loading ? "요약 중…" : "요약 & 액션"}
                </button>
              </div>
              {emailResult ? (
                <div className="productivity-out">
                  <h3>요약</h3>
                  <p>{emailResult.summary}</p>
                  {emailResult.tone ? (
                    <p className="productivity-sub">톤: {emailResult.tone}</p>
                  ) : null}
                  <h4>다음 액션</h4>
                  <ul>
                    {emailResult.actionItems.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {tab === "schedule" ? (
            <section className="project-page-card productivity-panel" role="tabpanel">
              <h2>할 일 (일정 API 입력)</h2>
              <p className="productivity-hint">한 줄에 제목 하나. &quot;오늘 할 일&quot;에서 가져올 수 있습니다.</p>
              <textarea
                className="productivity-textarea"
                value={scheduleTasks.map((t) => t.title).join("\n")}
                onChange={(e) => {
                  const lines = e.target.value
                    .split(/\n+/)
                    .map((l) => l.trim())
                    .filter(Boolean);
                  setScheduleTasks(
                    lines.map((title) => ({ title, priority: "medium" as const })),
                  );
                }}
                rows={6}
                placeholder="리포트 초안\n회의 메모 정리"
              />
              <label className="productivity-label" htmlFor="con">
                추가 제약 (가용 시간, 고정 회의, 금지 구간)
              </label>
              <textarea
                id="con"
                className="productivity-textarea"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                rows={3}
                placeholder="예: 12–13시 점심, 16시 이후 미팅 없음"
              />
              <div className="productivity-actions">
                <button
                  type="button"
                  className="productivity-submit"
                  disabled={loading || !ready || scheduleTasks.length === 0}
                  onClick={() => void runSchedule()}
                >
                  {loading ? "짜는 중…" : "시간대 제안"}
                </button>
              </div>
              {scheduleResult ? (
                <div className="productivity-out">
                  <h3>블록</h3>
                  {scheduleResult.notes ? <p className="productivity-rationale">{scheduleResult.notes}</p> : null}
                  <ul className="productivity-block-list">
                    {scheduleResult.blocks.map((b, i) => (
                      <li key={i}>
                        <span className="productivity-time">
                          {b.start} – {b.end}
                        </span>{" "}
                        {b.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {lastForMemory ? (
            <section className="project-page-card productivity-learn">
              <h2>패턴 학습 (선택)</h2>
              <p className="productivity-hint">마지막 생성 결과로 메모리에 넣을 짧은 사실 0~2개를 가져옵니다.</p>
              <div className="productivity-actions">
                <button
                  type="button"
                  className="productivity-secondary"
                  disabled={memoryLoading}
                  onClick={() => void fetchMemoryCandidates()}
                >
                  {memoryLoading ? "분석 중…" : "학습 후보 생성"}
                </button>
              </div>
              {candidates.length > 0 ? (
                <div className="productivity-candidates">
                  {candidates.map((c, i) => (
                    <label key={i} className="productivity-check">
                      <input
                        type="checkbox"
                        checked={!!picked[i]}
                        onChange={(e) => setPicked((p) => ({ ...p, [i]: e.target.checked }))}
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                  <button
                    type="button"
                    className="productivity-submit"
                    onClick={applyPicked}
                    disabled={!candidates.some((_, i) => picked[i])}
                  >
                    선택 항목을 메모리에 반영
                  </button>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        <aside className="project-page-card productivity-memory" aria-label="개인 메모리">
          <h2>개인 메모리</h2>
          <p className="productivity-hint">사실·학습은 API 요청에만 포함됩니다(서버에 저장되지 않음). 최대{" "}
            {MAX_FACTS} / {MAX_LEARNED} 항목.
          </p>
          <label className="productivity-label" htmlFor="facts">
            직접 사실 (한 줄에 하나)
          </label>
          <textarea
            id="facts"
            className="productivity-textarea"
            key={memory.updatedAt}
            defaultValue={factsText}
            onBlur={(e) => onFactsBlur(e.target.value)}
            rows={5}
            placeholder="수요일 오전 팀 싱크 / 집중은 오전…"
            disabled={!ready}
          />
          <div className="productivity-work-hours">
            <span className="productivity-label">가용 시간 (일정에 참고)</span>
            <div className="productivity-time-inputs">
              <input
                type="time"
                className="productivity-input"
                aria-label="시작"
                value={memory.workHours?.start ?? "09:00"}
                onChange={(e) =>
                  updateWorkHours({ start: e.target.value, end: memory.workHours?.end ?? "18:00" })
                }
                disabled={!ready}
              />
              <span>–</span>
              <input
                type="time"
                className="productivity-input"
                aria-label="종료"
                value={memory.workHours?.end ?? "18:00"}
                onChange={(e) =>
                  updateWorkHours({ start: memory.workHours?.start ?? "09:00", end: e.target.value })
                }
                disabled={!ready}
              />
            </div>
          </div>
          <h3 className="productivity-subhead">학습에 반영된 패턴</h3>
          {memory.learned.length === 0 ? (
            <p className="productivity-hint">아직 없습니다.</p>
          ) : (
            <ul className="productivity-learned">
              {memory.learned.map((line, i) => (
                <li key={i}>
                  {line}
                  <button
                    type="button"
                    className="productivity-icon-btn"
                    aria-label="삭제"
                    onClick={() => removeLearned(i)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="productivity-danger"
            onClick={reset}
            disabled={!ready}
          >
            메모리 초기화
          </button>
        </aside>
      </div>

      <style jsx>{`
        .productivity-page h1 {
          margin-top: 0;
          font-size: 1.75rem;
        }
        .productivity-lead {
          color: var(--muted);
          margin: 0;
          line-height: 1.65;
        }
        .productivity-lead code {
          font-size: 0.9em;
        }
        .productivity-error {
          border-color: rgb(255 100 100 / 40%);
        }
        .productivity-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
          gap: 0.75rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .productivity-layout {
            grid-template-columns: 1fr;
          }
        }
        .productivity-date-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .productivity-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }
        .productivity-tab {
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: rgb(8 10 16 / 40%);
          color: var(--muted);
          font-size: 0.9rem;
          cursor: pointer;
        }
        .productivity-tab.is-active {
          color: var(--text);
          background: var(--primary-soft);
          border-color: rgb(127 141 255 / 45%);
        }
        .productivity-label {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 0.9rem;
          color: var(--muted);
        }
        .productivity-hint {
          color: var(--muted);
          font-size: 0.88rem;
          margin: 0 0 0.5rem;
        }
        .productivity-input {
          font: inherit;
          padding: 0.35rem 0.5rem;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--card);
          color: var(--text);
        }
        .productivity-textarea {
          width: 100%;
          font-size: 0.88rem;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: var(--card);
          color: var(--text);
          resize: vertical;
        }
        .productivity-textarea:focus,
        .productivity-input:focus {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .productivity-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.6rem;
        }
        .productivity-submit,
        .productivity-secondary,
        .productivity-danger {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .productivity-submit {
          border: 1px solid var(--line);
          background: var(--primary-soft);
          color: var(--text);
        }
        .productivity-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .productivity-secondary {
          border: 1px solid rgb(127 141 255 / 35%);
          background: transparent;
          color: #dbe2ff;
        }
        .productivity-danger {
          margin-top: 0.75rem;
          width: 100%;
          border: 1px solid rgb(255 120 100 / 35%);
          background: rgb(255 60 30 / 10%);
          color: #ffccb8;
        }
        .productivity-out {
          margin-top: 1rem;
        }
        .productivity-rationale {
          color: #c9d0ee;
          font-size: 0.92rem;
        }
        .productivity-sub {
          color: var(--muted);
          font-size: 0.88rem;
        }
        .productivity-subhead {
          margin: 0.8rem 0 0.35rem;
          font-size: 0.95rem;
        }
        .productivity-task-list {
          margin: 0;
          padding-left: 1.1rem;
        }
        .productivity-task-list li {
          margin-top: 0.4rem;
        }
        .productivity-pill {
          font-size: 0.72rem;
          text-transform: uppercase;
          padding: 0.12rem 0.4rem;
          border-radius: 6px;
          background: rgb(127 141 255 / 22%);
        }
        .productivity-block-list {
          margin: 0;
          padding-left: 1.1rem;
        }
        .productivity-time {
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 0.86rem;
          color: #9ce5ca;
        }
        .productivity-work-hours {
          margin: 0.6rem 0;
        }
        .productivity-time-inputs {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .productivity-learned {
          list-style: none;
          padding: 0;
          margin: 0 0 0.5rem;
        }
        .productivity-learned li {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.4rem;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgb(255 255 255 / 6%);
          font-size: 0.88rem;
        }
        .productivity-icon-btn {
          flex-shrink: 0;
          border: none;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
        }
        .productivity-learn {
          margin-top: 0.5rem;
        }
        .productivity-candidates {
          margin-top: 0.5rem;
          display: grid;
          gap: 0.4rem;
        }
        .productivity-check {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          font-size: 0.9rem;
        }
        .productivity-check input {
          margin-top: 0.2rem;
        }
        .productivity-memory {
          position: sticky;
          top: 4.5rem;
        }
      `}</style>
    </main>
  );
}
