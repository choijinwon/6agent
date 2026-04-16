"use client";

import { useMemo, useState } from "react";
import { PRD_PLAYBOOK, getPrdTemplate } from "@/data/prd-playbook";

interface PrdPlaybookProps {
  selectedAgentId: string;
}

export function PrdPlaybook({ selectedAgentId }: PrdPlaybookProps) {
  const [copied, setCopied] = useState(false);
  const entry = useMemo(
    () => PRD_PLAYBOOK[selectedAgentId] ?? PRD_PLAYBOOK.pm,
    [selectedAgentId],
  );
  const template = useMemo(() => getPrdTemplate(selectedAgentId), [selectedAgentId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="prd section">
      <div className="section-head">
        <h2>복붙 가능한 PRD 노하우</h2>
        <p>
          선택한 에이전트 역할에 맞춘 PRD 템플릿입니다. 그대로 복사해 다른
          에이전트 워크플로우에 즉시 적용할 수 있습니다.
        </p>
      </div>

      <div className="prd-card">
        <div className="prd-top">
          <div>
            <p className="prd-role">{entry.role}</p>
            <h3>{entry.objective}</h3>
          </div>
          <button type="button" className="copy-btn" onClick={handleCopy}>
            {copied ? "복사 완료" : "PRD 템플릿 복사"}
          </button>
        </div>

        <div className="prd-grid">
          <div className="prd-col">
            <h4>체크리스트</h4>
            <ul>
              {entry.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="prd-col">
            <h4>템플릿 미리보기</h4>
            <pre>{template}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
