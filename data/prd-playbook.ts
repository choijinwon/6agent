export interface PrdPlaybookEntry {
  role: string;
  objective: string;
  checklist: string[];
  promptTemplate: string;
}

const COMMON_PRD_BLOCK = `# PRD

## 1) Problem
- 어떤 사용자 문제가 존재하는가?
- 지금 해결해야 하는 이유는 무엇인가?

## 2) Target User
- 핵심 사용자 세그먼트:
- 사용 맥락:

## 3) Success Metrics
- North Star:
- Leading Metrics:
- Guardrail Metrics:

## 4) Scope
- In Scope:
- Out of Scope:

## 5) Risks & Constraints
- 기술/운영 리스크:
- 일정/비용 제약:

## 6) Decision Log
- 선택한 방향:
- 버린 대안:
- 근거:
`;

export const PRD_PLAYBOOK: Record<string, PrdPlaybookEntry> = {
  pm: {
    role: "PM Agent",
    objective: "요구사항을 성과 단위로 정리하고 우선순위를 명확히 고정",
    checklist: [
      "문제/사용자/지표 3요소가 연결되는지 확인",
      "기능 요구를 Impact/Cost로 정렬",
      "릴리즈 차단 조건과 실패 기준 명시",
    ],
    promptTemplate: `${COMMON_PRD_BLOCK}

## 7) PM 확장 섹션
- Business Goal:
- Priority Rationale:
- Release Gate:
`,
  },
  architect: {
    role: "Architect Agent",
    objective: "구조 경계와 트레이드오프를 명시해 확장성과 안정성 확보",
    checklist: [
      "모듈 경계와 데이터 흐름도를 함께 작성",
      "병목 가능 구간과 완화 전략 포함",
      "의존성 변경 시 영향 범위 문서화",
    ],
    promptTemplate: `${COMMON_PRD_BLOCK}

## 7) Architect 확장 섹션
- Module Boundaries:
- Data Flow:
- Trade-offs:
- Scalability Plan:
`,
  },
  frontend: {
    role: "Frontend Agent",
    objective: "사용자 플로우 중심의 UI/상태 구조를 정의",
    checklist: [
      "핵심 사용자 여정별 화면 목표 명시",
      "컴포넌트 책임 경계와 상태 소유권 정의",
      "접근성/반응형 기준을 요구사항에 포함",
    ],
    promptTemplate: `${COMMON_PRD_BLOCK}

## 7) Frontend 확장 섹션
- UX Flow:
- Component Responsibilities:
- State Model:
- A11y/Responsive Requirements:
`,
  },
  backend: {
    role: "Backend Agent",
    objective: "API 계약과 데이터 정합성 규칙을 표준화",
    checklist: [
      "요청/응답 스키마와 에러 모델 통일",
      "권한/검증/감사 로그 요구 포함",
      "성능 기준(p95)과 장애 대응 정책 명시",
    ],
    promptTemplate: `${COMMON_PRD_BLOCK}

## 7) Backend 확장 섹션
- API Contracts:
- Validation & Auth:
- Error Policy:
- SLO / Performance Target:
`,
  },
  qa: {
    role: "QA Agent",
    objective: "회귀 리스크를 낮추는 테스트 전략 수립",
    checklist: [
      "치명도 기준 테스트 우선순위 정의",
      "정상/예외/경계 케이스 균형 구성",
      "차단 이슈 기준과 재현 절차 문서화",
    ],
    promptTemplate: `${COMMON_PRD_BLOCK}

## 7) QA 확장 섹션
- Test Strategy:
- Regression Scope:
- Blocker Criteria:
- Repro Steps Template:
`,
  },
  devops: {
    role: "DevOps Agent",
    objective: "배포 안정성과 운영 복구 시간을 단축",
    checklist: [
      "CI/CD 단계별 실패 조건과 롤백 정책 정의",
      "관측 지표와 알람 임계치 명시",
      "릴리즈 체크리스트와 대응 Runbook 연결",
    ],
    promptTemplate: `${COMMON_PRD_BLOCK}

## 7) DevOps 확장 섹션
- Pipeline Stages:
- Rollback Policy:
- Monitoring/Alerts:
- Incident Runbook:
`,
  },
};

export function getPrdTemplate(agentId: string): string {
  return PRD_PLAYBOOK[agentId]?.promptTemplate ?? PRD_PLAYBOOK.pm.promptTemplate;
}
