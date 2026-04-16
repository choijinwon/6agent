export interface TimelineStep {
  id: string;
  phase: string;
  title: string;
  owner: string;
  summary: string;
  guide?: {
    objective: string;
    process: string[];
    deliverables: string[];
    pitfalls: string[];
  };
}

export interface AgentCard {
  id: string;
  role: string;
  title: string;
  mission: string;
  prompts: string[];
  outputs: string[];
  humanDecision: string;
  impact: string;
}
