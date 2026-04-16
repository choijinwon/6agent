"use client";

import { useState } from "react";
import { PrdPlaybook } from "@/components/prd-playbook";
import { AGENTS } from "@/data/story-data";

export default function PrdPlaybookPage() {
  const [selectedAgentId, setSelectedAgentId] = useState(AGENTS[0].id);

  return (
    <main className="page-pad">
      <section className="section">
        <div className="section-head">
          <h2>PRD 노하우</h2>
          <p>역할을 고르면 해당 에이전트용 PRD 템플릿을 바로 복사할 수 있습니다.</p>
        </div>

        <div className="prd-role-selector">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              type="button"
              className={`timeline-tab ${agent.id === selectedAgentId ? "is-active" : ""}`}
              onClick={() => setSelectedAgentId(agent.id)}
            >
              {agent.role}
            </button>
          ))}
        </div>
      </section>

      <PrdPlaybook selectedAgentId={selectedAgentId} />
    </main>
  );
}
