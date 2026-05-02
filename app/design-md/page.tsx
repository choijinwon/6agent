"use client";

import { useCallback, useState } from "react";

type Stack = "bootstrap" | "tailwind";

export default function DesignMdPage() {
  const [productName, setProductName] = useState("");
  const [stack, setStack] = useState<Stack>("bootstrap");
  const [brandHex, setBrandHex] = useState("c4c9ae");
  const [verticalTone, setVerticalTone] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMarkdown("");
    setFilename("");
    try {
      const res = await fetch("/api/design-md/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          stack,
          brandPrimaryHex: brandHex,
          verticalTone: verticalTone || undefined,
        }),
      });
      const data = (await res.json()) as { markdown?: string; filename?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? `실패 (${res.status})`);
        return;
      }
      setMarkdown(data.markdown ?? "");
      setFilename(data.filename ?? "design.kr.md");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [productName, stack, brandHex, verticalTone]);

  const copy = useCallback(async () => {
    if (!markdown) {
      return;
    }
    await navigator.clipboard.writeText(markdown);
  }, [markdown]);

  const download = useCallback(() => {
    if (!markdown) {
      return;
    }
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "design.kr.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown, filename]);

  return (
    <main className="section page-pad design-md-page">
      <header className="project-page-card design-md-hero">
        <h1>한국형 Design MD</h1>
        <p className="design-md-lead">
          <a href="https://github.com/VoltAgent/awesome-design-md/tree/main/design-md" target="_blank" rel="noreferrer">
            awesome-design-md
          </a>
          의 DESIGN.md 레이아웃을 참고해, 로케일·컴포넌트 규격을 포함한 마크다운을 생성합니다. 구현 레이어는{" "}
          <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">
            Bootstrap 5
          </a>
          과{" "}
          <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
            Tailwind CSS
          </a>{" "}
          중 하나를 선택합니다. AI 작성 규칙은 <code className="design-md-inline">data/design-md/RULES.md</code> 를
          참고합니다.
        </p>
      </header>

      <section className="project-page-card design-md-panel">
        <h2>입력</h2>
        <div className="design-md-fields">
          <label className="design-md-field">
            <span>제품·서비스 이름 *</span>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="예: 우리 빌링 콘솔"
              maxLength={280}
              autoComplete="off"
            />
          </label>
          <fieldset className="design-md-stack">
            <legend>CSS 스택 *</legend>
            <label>
              <input
                type="radio"
                name="stack"
                checked={stack === "bootstrap"}
                onChange={() => setStack("bootstrap")}
              />{" "}
              Bootstrap 5
            </label>
            <label>
              <input
                type="radio"
                name="stack"
                checked={stack === "tailwind"}
                onChange={() => setStack("tailwind")}
              />{" "}
              Tailwind CSS
            </label>
          </fieldset>
          <label className="design-md-field">
            <span>브랜드 Primary (헥사, # 선택)</span>
            <input type="text" value={brandHex} onChange={(e) => setBrandHex(e.target.value)} placeholder="c4c9ae" />
          </label>
          <label className="design-md-field">
            <span>도메인 톤 (선택)</span>
            <input
              type="text"
              value={verticalTone}
              onChange={(e) => setVerticalTone(e.target.value)}
              placeholder="예: B2B 결제 SaaS · 공공 교육 플랫폼"
              maxLength={280}
            />
          </label>
        </div>
        <button
          type="button"
          className="design-md-submit"
          disabled={loading || !productName.trim()}
          onClick={() => void generate()}
        >
          {loading ? "생성 중…" : "Design MD 생성"}
        </button>
      </section>

      {error ? (
        <section className="project-page-card design-md-error" role="alert">
          <h2>오류</h2>
          <pre className="design-md-pre">{error}</pre>
        </section>
      ) : null}

      {markdown ? (
        <section className="project-page-card">
          <div className="design-md-actions">
            <h2 className="design-md-result-title">결과</h2>
            <div className="design-md-actions-buttons">
              <button type="button" className="design-md-copy" onClick={() => void copy()}>
                복사
              </button>
              <button type="button" className="design-md-copy" onClick={() => download()}>
                저장 ({filename})
              </button>
            </div>
          </div>
          <pre className="design-md-pre design-md-result">{markdown}</pre>
        </section>
      ) : null}

      <style jsx>{`
        .design-md-hero h1 {
          margin: 0 0 0.5rem;
          font-size: 1.75rem;
        }
        .design-md-lead {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
          font-size: 0.95rem;
        }
        .design-md-lead a {
          color: var(--primary);
        }
        .design-md-inline {
          font-size: 0.88em;
        }
        .design-md-fields {
          display: grid;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .design-md-field span {
          display: block;
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 0.3rem;
        }
        .design-md-field input {
          width: 100%;
          max-width: min(100%, 32rem);
          padding: 0.5rem 0.65rem;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--card);
          color: var(--text);
          font-size: 0.95rem;
        }
        .design-md-stack {
          border: 1px dashed var(--line);
          border-radius: 10px;
          padding: 0.65rem 0.85rem;
          margin: 0;
        }
        .design-md-stack legend {
          padding: 0 0.25rem;
          font-size: 0.82rem;
          color: var(--muted);
        }
        .design-md-stack label {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-right: 1.25rem;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .design-md-submit {
          padding: 0.55rem 1.1rem;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--primary-soft);
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
        }
        .design-md-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .design-md-error {
          border-color: rgb(255 100 100 / 38%);
        }
        .design-md-pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 0.78rem;
          padding: 1rem;
          border-radius: 10px;
          background: var(--card-soft);
          border: 1px solid var(--line);
          max-height: min(70vh, 36rem);
          overflow: auto;
        }
        .design-md-result {
          margin-top: 0.75rem;
        }
        .design-md-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.65rem;
        }
        .design-md-result-title {
          margin: 0;
          font-size: 1.1rem;
        }
        .design-md-actions-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .design-md-copy {
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: transparent;
          color: var(--text);
          font-size: 0.88rem;
          cursor: pointer;
        }
        .design-md-copy:hover {
          background: var(--card-soft);
        }
      `}</style>
    </main>
  );
}
