const CAREER_OVERVIEW = {
  totalExperience: "15년+",
  position: "시니어 프론트엔드 테크리드 / 프론트엔드 팀장 (Engineering Manager)",
  expertise:
    "백오피스, 대시보드, CMS, 학습 플랫폼, 인증/권한, ML/DL 어노테이션, 방산, 명품 쇼핑몰, 금융, 블록체인, 보안",
  coreTech: "Vue/Nuxt, React/Next.js, TypeScript, Node.js, Python, Electron",
  strengths:
    "아키텍처 설계, SSR/CSR 최적화, 모노레포/CI-CD 구축, 협업 생산성 개선, 애자일 실무 리딩, TPM 조율 역량, AI 바이브 코딩 실무 적용",
  collaboration:
    "Agile/Scrum 기반 스프린트 운영, 요구사항 우선순위 조율, 개발-기획-디자인-운영 간 의사결정 리딩",
} as const;

const CORE_COMPETENCIES = [
  {
    title: "운영형 서비스 아키텍처 설계 역량",
    description:
      "관리자 시스템/대시보드/CMS 등 복잡한 업무 도메인을 구조화하여 유지보수 가능한 형태로 구현",
    details: [
      "도메인 단위 모듈 경계를 정의해 기능 확장 시 결합도를 낮춥니다.",
      "화면/상태/API 레이어 분리로 유지보수와 테스트 용이성을 높입니다.",
      "운영 요구사항(권한/감사로그/모니터링)을 초기 설계에 반영해 재작업을 줄입니다.",
    ],
  },
  {
    title: "프론트엔드 플랫폼화 역량",
    description:
      "공통 컴포넌트, 디자인 시스템, API 유틸, 코드 규칙 표준화로 개발 일관성 확보",
    details: [
      "디자인 토큰과 공통 UI 컴포넌트 체계로 화면 품질 편차를 줄입니다.",
      "API 클라이언트/에러 핸들러/권한 가드를 공통화해 구현 속도를 높입니다.",
      "Lint/Format/PR 템플릿을 통해 코드 리뷰 기준과 협업 품질을 표준화합니다.",
    ],
  },
  {
    title: "인증/보안 및 데이터 처리 경험",
    description:
      "OAuth2, JWT, 권한 관리, OCR/AML 인증 연동 등 실서비스 환경 경험",
    details: [
      "OAuth2/JWT 기반 인증 흐름과 역할 기반 접근제어(RBAC)를 실서비스에 적용했습니다.",
      "민감 데이터 마스킹/권한별 조회 범위 제어로 보안 준수 수준을 강화했습니다.",
      "인증 예외/만료/재로그인 시나리오를 표준화해 운영 이슈를 줄였습니다.",
    ],
  },
  {
    title: "AI 바이브 코딩 실무 적용 역량",
    description:
      "Copilot/ChatGPT/Claude를 활용한 코드 초안, 리팩터링, 테스트 보조, 문서화 자동화로 개발 사이클 단축",
    details: [
      "요구사항 초안 단계에서 코드 프로토타입을 빠르게 생성해 검증 시간을 단축합니다.",
      "리팩터링/테스트 케이스/문서 자동화를 병행해 품질과 속도를 동시에 확보합니다.",
      "팀 내 활용 가이드를 통해 AI 도구 사용 편차를 줄이고 생산성을 상향 평준화합니다.",
    ],
  },
  {
    title: "애자일 기반 협업/전달 체계 운영",
    description:
      "스프린트 계획, 데일리 스크럼, 회고, 우선순위 재조정 프로세스를 통해 일정 예측 가능성과 팀 실행력을 강화",
    details: [
      "스프린트 단위 목표/산출물 정의로 실행 범위를 명확히 관리합니다.",
      "데일리 스크럼에서 이슈/의존성/리스크를 조기 공유해 병목을 최소화합니다.",
      "회고를 통해 프로세스 개선 액션을 축적하고 다음 스프린트에 반영합니다.",
    ],
  },
  {
    title: "TPM(Technical Program Management) 수행 역량",
    description:
      "기술 의사결정, 리스크 관리, 일정/리소스 조율, 이해관계자 커뮤니케이션을 통합해 프로젝트를 end-to-end로 추진",
    details: [
      "로드맵/마일스톤/리스크 레지스터를 운영해 일정 예측 가능성을 높입니다.",
      "기술 선택의 장단점과 비용을 문서화해 의사결정 품질을 높입니다.",
      "개발-기획-디자인-운영 간 합의 포인트를 조율해 전달 누락을 줄입니다.",
    ],
  },
] as const;

const AGILE_TPM_DETAILS = [
  "Agile/Scrum 기반으로 스프린트 목표를 분기/월/주 단위로 정렬하고, 데일리 스크럼으로 리스크를 조기 식별합니다.",
  "요구사항 우선순위를 비즈니스 임팩트, 개발 난이도, 일정 리스크 관점으로 재정렬해 실행 가능성을 높입니다.",
  "개발-기획-디자인-운영 간 의사결정 포인트를 명확히 정의해 커뮤니케이션 비용을 줄이고 전달 속도를 높입니다.",
  "릴리즈 전/후 체크리스트와 회고를 운영해 지속 개선 루프를 만들고 팀 생산성 지표를 관리합니다.",
] as const;

const EXPERT_DOMAINS = [
  "백오피스",
  "대시보드",
  "CMS",
  "학습 플랫폼",
  "인증/권한",
  "ML/DL 어노테이션",
  "방산",
  "명품 쇼핑몰",
  "금융",
  "블록체인",
  "보안",
] as const;

interface CareerTimelineEntry {
  company: string;
  employmentType: string;
  role: string;
  period: string;
  project?: string;
  responsibilities: string[];
  achievements: string[];
}

const CAREER_TIMELINE: CareerTimelineEntry[] = [
  {
    company: "XR/방산 콘텐츠 기업",
    employmentType: "정규직",
    role: "팀장",
    period: "2025.08 ~ 재직중",
    project: "FA-50 CBT 교본 학습 소프트웨어 개발 (2025.08 ~ 2026.03)",
    responsibilities: [
      "프로젝트 기술 리드로 프론트엔드/백엔드 통합 개발 체계를 구축해 기능 전달 속도 향상",
      "Electron + React/TypeScript 기반 학습 UI/콘텐츠 실행 환경 구축으로 학습 시나리오 실행 안정성 확보",
      "Node.js + SQLite 기반 학습 진도/평가 API 및 오프라인 데이터 구조 설계로 데이터 일관성 강화",
      "항공 교육용 인터랙션(계기/패널/HUD) UI 구현으로 학습 몰입도 및 시뮬레이션 정확도 향상",
      "사용자 인증/권한 및 로컬 데이터 동기화 처리 설계로 보안성과 동기화 신뢰도 강화",
      "멀티미디어 학습 콘텐츠 플레이어 최적화로 로딩 지연 및 재생 중단 이슈 감소",
    ],
    achievements: [
      "단일 개발 환경에서 핵심 기능 구현 및 일정 내 납품",
      "AI 바이브 코딩 기반 구현-검증-리팩터링 루프 운영으로 반복 개발 시간 단축",
      "품질 검증 프로세스 정립으로 QA 대응 효율 향상",
    ],
  },
  {
    company: "프리랜서",
    employmentType: "프리랜서",
    role: "프론트엔드 아키텍트",
    period: "2025.05 ~ 2025.08",
    project: "Next.js 15 기반 프론트엔드 아키텍처 및 모노레포 구축",
    responsibilities: [
      "프론트엔드 구조 설계를 리드해 초기 개발 방향성과 확장 기준을 명확화",
      "공통 패키지/인증/배포 파이프라인 구축으로 팀 간 중복 구현 비용 절감",
      "Next.js 15(App Router) 기반 CSR/SSR 혼합 구조 설계로 렌더링 성능과 운영 유연성 동시 확보",
      "Turborepo 기반 공통 패키지(디자인 시스템, API 유틸) 구성으로 코드 재사용성과 일관성 향상",
      "OAuth2 SSO + middleware.ts 자동 로그인 플로우 설계로 인증 UX 단순화 및 보안성 강화",
      "GitHub Actions + ArgoCD CI/CD 구축으로 배포 리드타임 단축 및 운영 안정성 향상",
      "ESLint/Prettier/Stylelint 기반 코드 표준화로 리뷰 효율과 유지보수성 강화",
    ],
    achievements: [
      "초기 개발 생산성과 코드 일관성 확보",
      "배포 자동화 체계 구축으로 운영 안정성 향상",
    ],
  },
  {
    company: "프리랜서",
    employmentType: "프리랜서",
    role: "프론트엔드 개발자",
    period: "2024.08 ~ 2025.03",
    project: "CMS 시스템 설계 및 구현",
    responsibilities: [
      "Vue3 + Element UI 기반 관리자 화면 개발로 운영자 업무 처리 흐름 표준화",
      "정보 구조 설계 및 초기 화면 프레임 구성으로 요구사항 반영 속도 향상",
      "AUIGRID 설계와 WBS 기반 일정 산정/구현 관리로 개발 진행 예측 가능성 강화",
    ],
    achievements: [
      "요구사항 기반 화면 체계 수립으로 개발 착수 속도 개선",
      "운영자 중심 UI 구조로 업무 처리 효율 향상",
    ],
  },
  {
    company: "명품 쇼핑몰 플랫폼",
    employmentType: "정규직",
    role: "프론트엔드 팀장",
    period: "2023.11 ~ 2024.08",
    project: "백오피스 시스템 및 서비스 고도화",
    responsibilities: [
      "백오피스 시스템 설계/개발로 운영 기능 확장성과 유지보수성 강화",
      "Nuxt 기반 SSR 적용 및 홈페이지 기능 개선으로 초기 로딩 성능과 SEO 품질 개선",
      "모바일 웹 성능 최적화(LCP/CLS 개선) 및 전환율 개선을 위한 반응형 UX 고도화",
      "Node.js 기반 데이터 처리 및 BFF(Facade API) 개발로 프론트-백엔드 연동 복잡도 감소",
      "코드 규칙 및 협업 프로세스 개선으로 팀 생산성과 품질 일관성 향상",
    ],
    achievements: [
      "운영 기능 고도화 및 개발 생산성 향상",
      "팀 협업 표준 정립으로 유지보수 효율 개선",
    ],
  },
  {
    company: "프리랜서",
    employmentType: "프리랜서",
    role: "프론트엔드 개발자",
    period: "2023.03 ~ 2023.09",
    project: "사용자/통계 대시보드 개발",
    responsibilities: [
      "사용자 대시보드 IA 및 네비게이션 설계로 핵심 지표 탐색 동선 최적화",
      "실시간 데이터 필터링/시각화(ECharts) 구현으로 의사결정 속도 향상",
      "반응형 UI 및 모듈형 컴포넌트 구조 적용으로 재사용성 및 유지보수 효율 개선",
    ],
    achievements: [
      "데이터 가시성 향상 및 사용자 접근성 개선",
      "컴포넌트 재사용 구조 도입으로 유지보수성 확보",
    ],
  },
  {
    company: "AI 데이터 플랫폼 기업",
    employmentType: "정규직",
    role: "프론트엔드 팀장",
    period: "2022.08 ~ 2023.03",
    responsibilities: [
      "Nuxt3 SSR 기반 백오피스 기획/설계/개발로 운영형 서비스 개발 사이클 단축",
      "React 기반 에디터 Tool 기능 개발로 작업 정확도와 편집 생산성 향상",
      "REST API 연동 및 Docker 기반 배포 자동화로 배포 신뢰성과 운영 효율 강화",
    ],
    achievements: [
      "백오피스 구축부터 배포까지 일원화",
      "에디터 기능 고도화 및 성능 개선",
    ],
  },
  {
    company: "디지털 자산/핀테크 기업",
    employmentType: "정규직",
    role: "프론트엔드 팀 리드",
    period: "2022.01 ~ 2022.08",
    responsibilities: [
      "관리자 대시보드 및 권한 시스템 구축으로 운영 보안성과 관리 효율 향상",
      "JSP -> Vue 점진적 마이그레이션으로 레거시 의존도 완화 및 개발 생산성 개선",
      "OAuth2 소셜 로그인, 나이스인증, OCR/AML 프로세스 구현으로 인증 신뢰도 강화",
      "팀 리딩 및 협업 방식 개선으로 일정 대응력과 코드 품질 일관성 제고",
    ],
    achievements: [
      "인증/보안 기능 안정화",
      "레거시 마이그레이션 리스크 최소화",
    ],
  },
  {
    company: "대기업 IT 서비스사",
    employmentType: "프리랜서",
    role: "시니어 프론트엔드 개발자",
    period: "2020.01 ~ 2020.12 (1년)",
    project: "ML/DL 추론 학습 대시보드 기능 구현",
    responsibilities: [
      "모델 학습/추론 파이프라인 상태를 한 화면에서 확인하는 운영 대시보드 IA 설계로 관제 효율 향상",
      "실험별 데이터셋/하이퍼파라미터/성능 지표 비교 화면 구현으로 모델 검증 속도 개선",
      "학습 큐/추론 요청량/지연시간/실패율 시각화 컴포넌트 개발로 이슈 탐지 시간 단축",
      "실시간 로그 스트림과 배치 리포트 결합 모니터링 패널 구성으로 운영 가시성 강화",
      "모델 버전 성능 추이 및 배포 이력 추적 기능 구현으로 릴리즈 리스크 관리 고도화",
      "운영자 권한 기반 조회 제어 및 민감 데이터 마스킹 처리로 보안 준수 수준 강화",
      "백엔드 API 스펙 정리와 프론트엔드 에러 핸들링/재시도 전략 표준화로 장애 대응력 향상",
    ],
    achievements: [
      "학습/추론 상태 확인 시간을 단축해 운영 대응 속도 향상",
      "실험 비교와 지표 추적 기능으로 모델 검증 의사결정 효율 개선",
      "운영 관제 화면 표준화로 다수 이해관계자(개발/운영/기획) 협업 생산성 향상",
    ],
  },
  {
    company: "프리랜서",
    employmentType: "프리랜서",
    role: "프론트엔드 컨설턴트/개발자",
    period: "2017.07 ~ 2021.12",
    responsibilities: [
      "대기업 SI사: 보안 취약점 개선으로 운영 리스크 감소",
      "금융/카드사: 프론트 인프라 개선(Docker/Nginx)으로 배포 안정성 향상",
      "보험사: JWT 기반 인증/권한 시스템 개발로 접근 통제 체계 고도화",
      "헬스케어 솔루션사: Ionic 기반 헬스케어 앱 개발로 모바일 서비스 출시 지원",
    ],
    achievements: [
      "산업군별 요구사항 대응 경험 축적",
      "보안/인증/인프라/UX 전반의 실무 역량 강화",
    ],
  },
  {
    company: "디지털 에이전시",
    employmentType: "정규직",
    role: "웹 개발자",
    period: "2012.05 ~ 2016.05",
    responsibilities: [
      "대기업 계열 재단 ERP/웹사이트 개발 및 운영으로 내부 업무 프로세스 효율화",
      "대기업 계열 교육기관 학습 플랫폼 개발 및 유지보수로 교육 서비스 안정성 확보",
      "CMS/회원/학습 기능 및 다국어 지원 구현으로 운영 범용성과 사용자 접근성 강화",
    ],
    achievements: [
      "엔터프라이즈 환경의 운영형 개발 경험 확보",
      "학습 플랫폼 도메인 기능 고도화",
    ],
  },
  {
    company: "포털/플랫폼 기업",
    employmentType: "정규직",
    role: "웹 개발자",
    period: "2010.11 ~ 2012.03",
    responsibilities: [
      "내부 문서 시스템(권한/워크플로우) 개발로 협업 프로세스 표준화",
      "포털 마일리지 체크아웃 PG 연동으로 결제 기능 확장 지원",
      "장애 모니터링 API 개발 및 유지보수로 서비스 관제 신뢰도 향상",
    ],
    achievements: [
      "권한/워크플로우 중심 업무 시스템 고도화",
      "결제 및 모니터링 기능 안정성 확보",
    ],
  },
  {
    company: "웹 에이전시",
    employmentType: "정규직",
    role: "웹 개발자",
    period: "2009.04 ~ 2010.07",
    responsibilities: [
      "기업/재단 웹사이트 구축 및 운영으로 대외 서비스 품질 안정화",
      "콘텐츠/회원/문의 기능 개발 및 접근성 개선으로 사용자 이용 편의성 강화",
    ],
    achievements: [
      "웹 서비스 구축의 기초 역량 확보",
      "운영 품질 및 접근성 개선 경험 축적",
    ],
  },
];

const TECH_STACK_GROUPS = [
  {
    category: "Frontend",
    items: ["Vue3", "Nuxt3", "React", "Next.js", "TypeScript", "JavaScript", "Electron"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python", "PHP", "Java", "C#"],
  },
  {
    category: "UI",
    items: ["MUI", "Emotion", "Element UI", "Sass/CSS", "ECharts"],
  },
  {
    category: "Infra/DevOps",
    items: ["Docker", "Kubernetes", "GitHub Actions", "ArgoCD", "Turborepo"],
  },
  {
    category: "Auth/API",
    items: ["REST API", "OAuth2", "JWT", "BFF"],
  },
  {
    category: "AI Tools",
    items: ["GitHub Copilot", "ChatGPT", "Claude"],
  },
] as const;

const AI_TOOL_LINKS = [
  { name: "GitHub Copilot", url: "https://github.com/features/copilot" },
  { name: "ChatGPT", url: "https://chatgpt.com" },
  { name: "Claude", url: "https://claude.ai" },
] as const;

export default function CareerResumePage() {
  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>경력기술서</h2>
        <p>프론트엔드 아키텍처와 운영형 서비스 중심의 커리어를 타임라인으로 소개합니다.</p>
      </div>

      <section className="project-page-card career-intro-card">
        <h4>Career Snapshot</h4>
        <div className="career-summary-grid">
          <article>
            <small>총 경력</small>
            <p>{CAREER_OVERVIEW.totalExperience}</p>
          </article>
          <article>
            <small>포지션</small>
            <p>{CAREER_OVERVIEW.position}</p>
          </article>
          <article>
            <small>전문 영역</small>
            <p>{CAREER_OVERVIEW.expertise}</p>
          </article>
          <article>
            <small>핵심 기술</small>
            <p>{CAREER_OVERVIEW.coreTech}</p>
          </article>
          <article className="career-summary-wide">
            <small>강점</small>
            <p>{CAREER_OVERVIEW.strengths}</p>
          </article>
          <article className="career-summary-wide">
            <small>애자일/TPM</small>
            <details className="career-detail-toggle">
              <summary>{CAREER_OVERVIEW.collaboration}</summary>
              <ul>
                {AGILE_TPM_DETAILS.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </details>
          </article>
        </div>
      </section>

      <section className="project-page-card">
        <h4>전문 영역</h4>
        <div className="career-domain-chips">
          {EXPERT_DOMAINS.map((domain) => (
            <span key={domain}>{domain}</span>
          ))}
        </div>
      </section>

      <section className="project-page-card">
        <h4>핵심 역량</h4>
        <div className="career-competency-grid">
          {CORE_COMPETENCIES.map((competency) => (
            <article key={competency.title} className="career-competency-card">
              <details className="career-competency-toggle">
                <summary>
                  <h5>{competency.title}</h5>
                  <p>{competency.description}</p>
                </summary>
                <ul>
                  {competency.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section className="career-timeline-wrap">
        <h4>경력 상세 타임라인</h4>
        <div className="career-timeline">
        {CAREER_TIMELINE.map((item) => (
          <article key={`${item.company}-${item.period}`} className="career-timeline-item">
            <div className="career-timeline-marker" aria-hidden="true" />
            <div className="career-timeline-content">
              <small>{item.period}</small>
              <h4>
                {item.company} · {item.role} ({item.employmentType})
              </h4>
              {item.project && <p className="career-team">프로젝트: {item.project}</p>}
              <p className="career-subtitle">주요 수행</p>
              <ul>
                {item.responsibilities.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="career-subtitle">성과</p>
              <ul>
                {item.achievements.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
        </div>
      </section>

      <section className="project-page-card">
        <h4>기술 스택</h4>
        <div className="career-tech-grid">
          {TECH_STACK_GROUPS.map((group) => (
            <article key={group.category} className="career-tech-card">
              <h5>{group.category}</h5>
              <div className="career-stack">
                {group.items.map((tech) => (
                  <span key={`${group.category}-${tech}`}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="project-page-card">
        <h4>AI Tool 관련 링크</h4>
        <div className="career-ai-links">
          {AI_TOOL_LINKS.map((tool) => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noreferrer">
              {tool.name} 공식 페이지
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
