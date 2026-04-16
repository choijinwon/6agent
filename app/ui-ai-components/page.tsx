"use client";

import { useEffect, useMemo, useState } from "react";

type ResponseTab = "summary" | "code" | "risk";

interface PromptTemplate {
  id: string;
  label: string;
  system: string;
  user: string;
}

interface SampleScenario {
  id: string;
  title: string;
  templateId: string;
  goal: string;
  context: string;
}

interface ResponsePreset {
  summary: string[];
  code: string;
  risk: string[];
}

const TEMPLATES: PromptTemplate[] = [
  {
    id: "landing",
    label: "랜딩 개선",
    system: "당신은 AI UI Architect다. 정보 구조와 전환율을 함께 개선하라.",
    user: "히어로 섹션 이탈률이 높다. 카피/CTA/신뢰 요소를 개선해줘.",
  },
  {
    id: "dashboard",
    label: "대시보드 설계",
    system: "당신은 SaaS Product Designer다. 의사결정 속도를 높이는 UI를 설계하라.",
    user: "운영팀용 대시보드에 핵심 KPI, 알람, 액션을 한 화면에 구성해줘.",
  },
  {
    id: "onboarding",
    label: "온보딩 플로우",
    system: "당신은 UX Writer이자 PM이다. 첫 3분 내 활성화를 목표로 한다.",
    user: "가입 후 첫 실행 사용자가 1분 내 가치를 체감하도록 온보딩을 만들어줘.",
  },
  {
    id: "checkout",
    label: "결제 전환 개선",
    system: "당신은 전환 최적화 전문가다. 구매 완료율을 높이는 UI를 설계하라.",
    user: "결제 단계 이탈률이 높다. 불안 요소를 줄이고 완료율을 높이는 플로우를 제안해줘.",
  },
  {
    id: "support",
    label: "고객지원 챗 UI",
    system: "당신은 AI Support UX Lead다. 빠른 해결과 신뢰를 동시에 달성하라.",
    user: "문의 유형 분류와 답변 품질 확인이 쉬운 고객지원 챗 인터페이스를 설계해줘.",
  },
  {
    id: "analytics",
    label: "분석 리포트 자동화",
    system: "당신은 Data Product Designer다. 의사결정 가능한 인사이트 전달이 목적이다.",
    user: "주간 리포트를 자동 생성해 임원에게 핵심 변화와 리스크를 전달할 UI를 만들어줘.",
  },
];

const PIPELINE_STAGES = ["PM 분석", "Architect 설계", "Dev 구현안", "QA 검증"];
const PIPELINE_ICONS = ["📌", "🧩", "⚙️", "✅"];
const STAGE_DURATION_MS = 700;

const PIPELINE_LOG_PRESETS: Record<string, string[]> = {
  landing: [
    "PM 분석 완료: 랜딩 이탈 구간(헤드라인-CTA 사이) 핵심 원인 정의",
    "Architect 설계 완료: Hero → Proof → Action 정보 계층안 확정",
    "Dev 구현안 완료: CTA 대비/위치/신뢰요소 컴포넌트 조합안 생성",
    "QA 검증 완료: 클릭 경로/모바일 시인성/카피 A/B 기준 점검",
  ],
  dashboard: [
    "PM 분석 완료: 운영팀 의사결정 지연 구간과 KPI 우선순위 정의",
    "Architect 설계 완료: KPI, 알람, 액션의 단일 대시보드 흐름 확정",
    "Dev 구현안 완료: 위젯 레이아웃/드릴다운/알람 패널 컴포넌트 생성",
    "QA 검증 완료: 지표 정확성/필터 일관성/반응형 해상도 테스트",
  ],
  onboarding: [
    "PM 분석 완료: 첫 3분 활성화 목표와 중도 이탈 포인트 정리",
    "Architect 설계 완료: 단계형 온보딩 플로우와 진입 조건 확정",
    "Dev 구현안 완료: 진행률/가이드/첫 성공 경험 컴포넌트 생성",
    "QA 검증 완료: 단계 전환 오류/입력 검증/재진입 시나리오 점검",
  ],
  checkout: [
    "PM 분석 완료: 결제 단계 이탈 원인(가격 충격/입력 마찰) 정의",
    "Architect 설계 완료: 카트→주소→결제→완료의 마찰 최소 흐름 확정",
    "Dev 구현안 완료: 결제 폼 자동완성/요약 고정/신뢰 배지 UI 생성",
    "QA 검증 완료: 결제 실패 복구/주소 오류/모바일 입력 UX 테스트",
  ],
  support: [
    "PM 분석 완료: 문의량, 응답 지연, triage 병목 구간 정리",
    "Architect 설계 완료: 분류→답변→상담 전환 에이전트 흐름 확정",
    "Dev 구현안 완료: 카테고리 분류/근거 출력/전환 버튼 컴포넌트 생성",
    "QA 검증 완료: 오분류/저신뢰 답변/상담 전환 조건 테스트",
  ],
  analytics: [
    "PM 분석 완료: 리포트 독자(임원/실무)별 요구 인사이트 정의",
    "Architect 설계 완료: 데이터 집계→요약→실행제안 파이프라인 확정",
    "Dev 구현안 완료: 요약 카드/추세 차트/리스크 알림 컴포넌트 생성",
    "QA 검증 완료: 지표 정합성/이상치 기준/주간 자동 생성 테스트",
  ],
};

const RESPONSE_PRESETS: Record<string, ResponsePreset> = {
  landing: {
    summary: [
      "Hero 카피를 문제-해결-증거 순으로 단순화",
      "Primary CTA를 단일 행동으로 고정하고 시선 분산 제거",
      "신뢰 요소(고객사 로고/성과 수치)를 첫 스크린 내 배치",
    ],
    code: `export const landingExperiment = {
  hero: {
    headline: "문제를 해결하는 핵심 가치 1문장",
    subcopy: "누구를 위해 어떤 결과를 만드는지 명확히",
    cta: { primary: "무료로 시작", secondary: "데모 보기" },
  },
  trust: ["고객사 로고", "핵심 성과 수치", "리뷰 1개"],
};`,
    risk: [
      "CTA를 2개 이상 강조하면 전환 동선이 분산될 수 있음",
      "성과 수치 근거가 약하면 신뢰가 떨어질 수 있음",
      "모바일에서 Hero 길이가 길면 첫 액션이 늦어질 수 있음",
    ],
  },
  dashboard: {
    summary: [
      "KPI 우선순위를 상단 고정해 의사결정 시간을 단축",
      "알람/이슈/액션을 한 화면에서 이어지게 설계",
      "지표 드릴다운 경로를 2클릭 이내로 제한",
    ],
    code: `export const dashboardLayout = {
  top: ["Revenue", "MAU", "Churn"],
  middle: {
    alerts: "severity-based list",
    trends: "weekly KPI chart",
  },
  rightRail: ["owner actions", "next best action"],
};`,
    risk: [
      "지표가 과도하면 핵심 신호를 놓칠 수 있음",
      "알람 기준이 불명확하면 노이즈가 급증함",
      "드릴다운이 깊으면 현업 사용성이 급격히 저하됨",
    ],
  },
  onboarding: {
    summary: [
      "첫 1분 내 가치 체감을 위해 핵심 액션 하나에 집중",
      "불필요 입력을 제거하고 단계별 피드백을 즉시 제공",
      "진행률과 예상 소요시간을 보여 이탈 심리 완화",
    ],
    code: `export const onboardingFlow = [
  { step: "profile-minimum", goal: "필수 정보 최소 입력" },
  { step: "first-win", goal: "첫 성공 경험 제공" },
  { step: "personalization", goal: "권장 설정 자동 제안" },
];`,
    risk: [
      "초기 입력 항목이 많으면 첫 화면 이탈률이 높아짐",
      "성공 경험이 늦으면 활성화까지 도달하지 못함",
      "피드백 없는 로딩 상태는 불안감과 중도 포기를 유발함",
    ],
  },
  checkout: {
    summary: [
      "결제 전 총액/배송비를 조기 노출해 가격 충격 완화",
      "주소/결제 입력을 단계화하고 자동완성으로 마찰 제거",
      "불안 요소(환불 정책/보안 배지)를 결제 버튼 인접 배치",
    ],
    code: `export const checkoutUX = {
  steps: ["cart-review", "address", "payment", "confirm"],
  frictionCuts: ["card auto-format", "address lookup", "guest checkout"],
  trustSignals: ["refund policy", "secure payment badge"],
};`,
    risk: [
      "최종 단계에서 추가비용 노출 시 이탈률이 급증할 수 있음",
      "결제 실패 메시지가 모호하면 재시도율이 떨어짐",
      "모바일 입력 폼 최적화 미흡 시 완료율이 크게 감소함",
    ],
  },
  support: {
    summary: [
      "문의 분류를 자동화해 상담원 triage 시간을 단축",
      "답변 신뢰도를 높이기 위해 근거 링크/출처를 함께 노출",
      "사람 상담 전환 조건을 명확히 정의해 CS 품질 유지",
    ],
    code: `export const supportChatFlow = {
  triage: ["billing", "bug", "account", "other"],
  response: { mode: "retrieval + policy", confidenceThreshold: 0.72 },
  escalation: { trigger: ["low-confidence", "negative-sentiment"] },
};`,
    risk: [
      "분류 오탐이 많으면 사용자가 같은 설명을 반복하게 됨",
      "근거 없는 답변은 신뢰 하락과 재문의 증가를 유발함",
      "상담 전환 기준이 약하면 불만 고객 대응이 늦어질 수 있음",
    ],
  },
  analytics: {
    summary: [
      "주간 리포트 핵심 변화(증가/감소/이상치)를 자동 요약",
      "지표별 원인 가설과 실행 제안을 함께 제공",
      "임원용 1페이지와 실무용 상세 리포트를 분리 제공",
    ],
    code: `export const reportGenerator = {
  inputs: ["product events", "revenue", "support volume"],
  outputs: {
    executive: "one-page highlights",
    operator: "detailed trend + anomaly diagnostics",
  },
  cadence: "weekly",
};`,
    risk: [
      "지표 정의가 팀마다 다르면 리포트 신뢰도가 낮아짐",
      "이상치 탐지 기준이 없으면 노이즈 경보가 많아짐",
      "실행 제안 없는 리포트는 읽히지만 행동으로 이어지지 않음",
    ],
  },
};

const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: "sample-growth",
    title: "Growth 랜딩 최적화",
    templateId: "landing",
    goal: "무료 체험 전환율 +20%",
    context: "신규 유입이 많지만 CTA 클릭률이 낮은 SaaS 랜딩",
  },
  {
    id: "sample-commerce",
    title: "이커머스 체크아웃 개선",
    templateId: "checkout",
    goal: "결제 완료율 +15%",
    context: "결제 단계에서 배송비 노출로 이탈이 급증하는 상황",
  },
  {
    id: "sample-support",
    title: "AI 고객지원 센터",
    templateId: "support",
    goal: "첫 응답시간 40% 단축",
    context: "문의량이 많아 상담원 triage가 병목인 B2C 서비스",
  },
  {
    id: "sample-ops",
    title: "운영 대시보드 리포트",
    templateId: "analytics",
    goal: "주간 리포트 작성시간 60% 절감",
    context: "여러 데이터 소스를 수작업으로 취합하는 운영팀",
  },
];

export default function UiAiComponentsPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [systemPrompt, setSystemPrompt] = useState(TEMPLATES[0].system);
  const [userPrompt, setUserPrompt] = useState(TEMPLATES[0].user);
  const [isRunning, setIsRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(-1);
  const [tab, setTab] = useState<ResponseTab>("summary");
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((item) => item.id === selectedTemplateId) ?? TEMPLATES[0],
    [selectedTemplateId],
  );

  const response = useMemo(() => {
    const titleHint = userPrompt.split(".")[0]?.trim() || "요구사항";
    const preset = RESPONSE_PRESETS[selectedTemplateId];

    if (preset) {
      return {
        summary: [`요청 요약: ${titleHint}`, ...preset.summary],
        code: preset.code,
        risk: preset.risk,
      };
    }

    return {
      summary: [
        `요청 요약: ${titleHint}`,
        "핵심 UX 목표를 단일 행동(Primary Action)으로 고정",
        "정보 계층을 Hero → Proof → Action 순으로 단순화",
        "배포 전 A/B 테스트로 CTR과 활성화율 비교 권장",
      ],
      code: `// UI AI demo output
export const layoutPlan = {
  hero: {
    headline: "문제 해결 가치를 1문장으로 제시",
    cta: "Primary 1개 + Secondary 1개",
  },
  trust: ["고객 로고", "핵심 수치", "리뷰 1개"],
  actionFlow: ["탐색", "시도", "활성화"],
};`,
      risk: [
        "리스크: CTA가 2개 이상이면 전환 경로가 분산될 수 있음",
        "리스크: 증거 요소가 약하면 체류는 늘어도 전환이 낮을 수 있음",
        "리스크: 모바일 정보량 과다 시 스크롤 피로로 이탈 가능",
      ],
    };
  }, [selectedTemplateId, userPrompt]);

  const pipelinePercent = Math.max(
    0,
    Math.min(100, ((stageIndex + 1) / PIPELINE_STAGES.length) * 100),
  );
  const remainingStages = Math.max(0, PIPELINE_STAGES.length - (stageIndex + 1));
  const etaSeconds = Math.ceil((remainingStages * STAGE_DURATION_MS) / 1000);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setTimeout(() => {
      const lastIndex = PIPELINE_STAGES.length - 1;

      if (stageIndex >= lastIndex) {
        setIsRunning(false);
        return;
      }

      const nextIndex = Math.min(stageIndex + 1, lastIndex);
      setStageIndex(nextIndex);
      setPipelineLogs((prev) => {
        const presetLogs = PIPELINE_LOG_PRESETS[selectedTemplateId];
        const nextLog =
          presetLogs?.[nextIndex] ??
          `${PIPELINE_STAGES[nextIndex]} 완료: ${selectedTemplate.label} 시나리오 기준 결과 생성`;
        return [...prev, nextLog];
      });

      if (nextIndex >= lastIndex) {
        setIsRunning(false);
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [isRunning, selectedTemplate.label, selectedTemplateId, stageIndex]);

  const handleTemplateChange = (templateId: string) => {
    const target = TEMPLATES.find((item) => item.id === templateId);
    if (!target) {
      return;
    }
    setSelectedTemplateId(templateId);
    setSystemPrompt(target.system);
    setUserPrompt(target.user);
  };

  const handleRun = () => {
    setPipelineLogs([]);
    setStageIndex(-1);
    setIsRunning(true);
  };

  const handleApplyScenario = (scenario: SampleScenario) => {
    const target = TEMPLATES.find((item) => item.id === scenario.templateId);
    if (!target) {
      return;
    }

    setSelectedTemplateId(target.id);
    setSystemPrompt(target.system);
    setUserPrompt(`${target.user}\n\n[시나리오 목표] ${scenario.goal}\n[서비스 맥락] ${scenario.context}`);
    setTab("summary");
    setPipelineLogs([]);
    setStageIndex(-1);
    setIsRunning(false);
  };

  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>UI AI 컴포넌트</h2>
        <p>
          실제 예제를 기반으로 Prompt Composer, Agent Pipeline, Response Viewer를
          하나의 흐름으로 테스트할 수 있습니다.
        </p>
      </div>

      <section className="ui-demo-panel sample-panel">
        <h3>실전 샘플 예제</h3>
        <div className="sample-grid">
          {SAMPLE_SCENARIOS.map((scenario) => (
            <article key={scenario.id} className="sample-card">
              <small>{scenario.goal}</small>
              <h4>{scenario.title}</h4>
              <p>{scenario.context}</p>
              <button
                type="button"
                className="timeline-tab is-active"
                onClick={() => handleApplyScenario(scenario)}
              >
                예제 불러오기
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="ui-demo-layout">
        <section className="ui-demo-panel">
          <h3>Prompt Composer</h3>

          <div className="template-row">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`timeline-tab ${selectedTemplateId === template.id ? "is-active" : ""}`}
                onClick={() => handleTemplateChange(template.id)}
              >
                {template.label}
              </button>
            ))}
          </div>

          <label className="demo-label">
            System Prompt
            <textarea
              value={systemPrompt}
              onChange={(event) => setSystemPrompt(event.target.value)}
              rows={4}
            />
          </label>

          <label className="demo-label">
            User Prompt
            <textarea
              value={userPrompt}
              onChange={(event) => setUserPrompt(event.target.value)}
              rows={4}
            />
          </label>

          <button type="button" className="copy-btn" onClick={handleRun} disabled={isRunning}>
            {isRunning ? "파이프라인 실행 중..." : "AI Pipeline 실행"}
          </button>
        </section>

        <section className="ui-demo-panel">
          <h3>Agent Pipeline</h3>
          <div className="pipeline-progress">
            <div className="pipeline-progress-label">
              <span>진행률</span>
              <div className="pipeline-meta">
                <strong>{Math.round(pipelinePercent)}%</strong>
                <small>{isRunning ? `ETA ${etaSeconds}초` : "대기"}</small>
              </div>
            </div>
            <div className="pipeline-progress-track">
              <div className="pipeline-progress-fill" style={{ width: `${pipelinePercent}%` }}></div>
            </div>
          </div>
          <ul className="pipeline-list">
            {PIPELINE_STAGES.map((stage, index) => {
              const status =
                stageIndex > index ? "done" : stageIndex === index ? "active" : "idle";
              return (
                <li key={stage} className={`pipeline-item ${status}`}>
                  <strong>
                    <em>{PIPELINE_ICONS[index]}</em>
                    {stage}
                  </strong>
                  <span>
                    {status === "done"
                      ? "완료"
                      : status === "active"
                        ? "실행 중"
                        : "대기"}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="pipeline-logs">
            {pipelineLogs.length === 0 ? (
              <p>실행 로그가 여기에 표시됩니다.</p>
            ) : (
              pipelineLogs.map((log) => <p key={log}>{log}</p>)
            )}
          </div>
        </section>
      </div>

      <section className="ui-demo-panel">
        <h3>Response Viewer</h3>
        <div className="template-row">
          <button
            type="button"
            className={`timeline-tab ${tab === "summary" ? "is-active" : ""}`}
            onClick={() => setTab("summary")}
          >
            Summary
          </button>
          <button
            type="button"
            className={`timeline-tab ${tab === "code" ? "is-active" : ""}`}
            onClick={() => setTab("code")}
          >
            Code
          </button>
          <button
            type="button"
            className={`timeline-tab ${tab === "risk" ? "is-active" : ""}`}
            onClick={() => setTab("risk")}
          >
            Risk
          </button>
        </div>

        {tab === "summary" && (
          <ul className="response-list">
            {response.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {tab === "code" && <pre className="response-code">{response.code}</pre>}

        {tab === "risk" && (
          <ul className="response-list">
            {response.risk.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
