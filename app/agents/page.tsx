"use client";

import { useMemo, useState } from "react";
import { AGENTS } from "@/data/story-data";

export default function AgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = useState(AGENTS[0].id);
  const selectedAgent = useMemo(
    () => AGENTS.find((agent) => agent.id === selectedAgentId) ?? AGENTS[0],
    [selectedAgentId],
  );

  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>에이전트 역할 상세</h2>
        <p>클릭으로 역할을 바꿔가며 실행 방식과 산출물을 확인할 수 있습니다.</p>
      </div>

      <div className="agent-layout">
        <div className="agent-grid">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              type="button"
              className={`agent-card ${agent.id === selectedAgent.id ? "is-selected" : ""}`}
              onClick={() => setSelectedAgentId(agent.id)}
            >
              <small>{agent.role}</small>
              <h4>{agent.title}</h4>
              <p>{agent.mission}</p>
            </button>
          ))}
        </div>

        <aside className="detail-panel" aria-live="polite">
          <h3>{selectedAgent.title}</h3>
          <p className="detail-role">{selectedAgent.role}</p>
          <div className="detail-block">
            <h5>Mission</h5>
            <p>{selectedAgent.mission}</p>
          </div>
          <div className="detail-block">
            <h5>Input Prompt / Rules</h5>
            <ul>
              {selectedAgent.prompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </div>
          <div className="detail-block">
            <h5>Output Artifacts</h5>
            <ul>
              {selectedAgent.outputs.map((output) => (
                <li key={output}>{output}</li>
              ))}
            </ul>
          </div>
          <div className="detail-block">
            <h5>Human Decision</h5>
            <p>{selectedAgent.humanDecision}</p>
          </div>
          <div className="detail-block">
            <h5>Impact</h5>
            <p>{selectedAgent.impact}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
