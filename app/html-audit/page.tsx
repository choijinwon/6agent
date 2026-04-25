"use client";

import { useCallback, useState } from "react";

import type { AnalyzeResponse } from "@/lib/html-audit/types";

export default function HtmlAuditPage() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/html-audit/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      const data = (await res.json()) as AnalyzeResponse & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `요청 실패 (${res.status})`);
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [html]);

  const onFile = useCallback(async (file: File | null) => {
    if (!file) {
      return;
    }
    const text = await file.text();
    setHtml(text);
  }, []);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  return (
    <main className="section page-pad html-audit-page">
      <header className="project-page-card html-audit-hero">
        <h1>HTML 감사</h1>
        <p className="html-audit-lead">
          HTML 업로드 또는 붙여넣기 → <strong>axe-core</strong> 접근성 · <strong>Rule Engine</strong>{" "}
          SEO/구조 점검 → 자동 수정된 HTML과 <strong>unified diff</strong> · PR 본문 마크다운.{" "}
          <code>OPENAI_API_KEY</code>가 있으면 LLM 요약을 덧붙입니다. v1은{" "}
          <strong>HTML 문자열</strong>만 지원합니다 (Lighthouse URL 분석은 별도 워커/CI 권장).
        </p>
      </header>

      <section className="project-page-card html-audit-panel">
        <h2>입력</h2>
        <div className="html-audit-actions">
          <label className="html-audit-file">
            <span>파일 선택</span>
            <input
              type="file"
              accept=".html,.htm,text/html"
              onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="button"
            className="html-audit-submit"
            disabled={loading || !html.trim()}
            onClick={() => void run()}
          >
            {loading ? "분석 중…" : "분석 실행"}
          </button>
        </div>
        <label className="html-audit-label" htmlFor="html-source">
          HTML
        </label>
        <textarea
          id="html-source"
          className="html-audit-textarea"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder="<!DOCTYPE html>..."
        />
      </section>

      {error ? (
        <section className="project-page-card html-audit-error" role="alert">
          <h2>오류</h2>
          <pre className="html-audit-pre">{error}</pre>
        </section>
      ) : null}

      {result ? (
        <>
          <section className="project-page-card">
            <h2>요약</h2>
            <ul className="html-audit-meta">
              <li>입력 범위: {result.inputScope}</li>
              <li>원문 길이: {result.meta.originalLength}자 / 수정본: {result.meta.fixedLength}자</li>
              <li>
                axe:{" "}
                {result.axe.ok ? "실행됨" : `실패 — ${"error" in result.axe ? result.axe.error : ""}`}
              </li>
              <li>발견 항목 수: {result.findings.length}</li>
            </ul>
            {result.llm.used && result.llm.summary ? (
              <div className="html-audit-llm">
                <h3>LLM 제안</h3>
                <pre className="html-audit-pre">{result.llm.summary}</pre>
              </div>
            ) : null}
            {!result.llm.used ? (
              <p className="html-audit-hint">
                LLM을 쓰려면 서버에 <code>OPENAI_API_KEY</code>를 설정하세요. (선택)
              </p>
            ) : null}
          </section>

          <section className="project-page-card">
            <h2>발견 사항</h2>
            <ul className="html-audit-findings">
              {result.findings.map((f) => (
                <li key={f.id} data-severity={f.severity}>
                  <span className="html-audit-finding-source">[{f.source}]</span>{" "}
                  <strong>{f.ruleId}</strong> — {f.message}
                </li>
              ))}
            </ul>
          </section>

          <section className="project-page-card">
            <div className="html-audit-block-head">
              <h2>Unified diff (PR용)</h2>
              <button
                type="button"
                className="html-audit-copy"
                onClick={() => void copy(result.unifiedDiff)}
              >
                diff 복사
              </button>
            </div>
            <pre className="html-audit-pre html-audit-diff">{result.unifiedDiff}</pre>
          </section>

          <section className="project-page-card">
            <div className="html-audit-block-head">
              <h2>PR 본문 (마크다운)</h2>
              <button
                type="button"
                className="html-audit-copy"
                onClick={() => void copy(result.prBodyMarkdown)}
              >
                본문 복사
              </button>
            </div>
            <pre className="html-audit-pre">{result.prBodyMarkdown}</pre>
          </section>
        </>
      ) : null}

      <style jsx>{`
        .html-audit-page h1 {
          margin-top: 0;
          font-size: 1.75rem;
        }
        .html-audit-hero h1 {
          margin-bottom: 0.5rem;
        }
        .html-audit-lead {
          color: var(--muted);
          margin: 0;
          line-height: 1.65;
        }
        .html-audit-lead code {
          font-size: 0.9em;
        }
        .html-audit-panel h2,
        .html-audit-llm h3 {
          margin-top: 0;
        }
        .html-audit-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .html-audit-file input {
          font-size: 0.9rem;
        }
        .html-audit-file span {
          display: inline-block;
          margin-right: 0.5rem;
          color: var(--muted);
          font-size: 0.9rem;
        }
        .html-audit-submit {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--primary-soft);
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
        }
        .html-audit-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .html-audit-label {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 0.9rem;
          color: var(--muted);
        }
        .html-audit-textarea {
          width: 100%;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 0.85rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: var(--card);
          color: var(--text);
          resize: vertical;
          min-height: 12rem;
        }
        .html-audit-textarea:focus {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .html-audit-error {
          border-color: rgb(255 100 100 / 40%);
        }
        .html-audit-pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 0.8rem;
          padding: 1rem;
          border-radius: 10px;
          background: var(--card-soft);
          border: 1px solid var(--line);
          max-height: 28rem;
          overflow: auto;
        }
        .html-audit-meta {
          margin: 0;
          padding-left: 1.1rem;
          color: var(--muted);
        }
        .html-audit-hint {
          margin: 0.75rem 0 0;
          font-size: 0.9rem;
          color: var(--muted);
        }
        .html-audit-hint code {
          font-size: 0.9em;
        }
        .html-audit-findings {
          margin: 0;
          padding-left: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .html-audit-finding-source {
          color: var(--muted);
          font-size: 0.85em;
        }
        .html-audit-block-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .html-audit-block-head h2 {
          margin: 0;
        }
        .html-audit-copy {
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: transparent;
          color: var(--text);
          font-size: 0.9rem;
          cursor: pointer;
        }
        .html-audit-copy:hover {
          background: var(--card-soft);
        }
      `}</style>
    </main>
  );
}
