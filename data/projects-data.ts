export interface ProjectArchiveItem {
  id: string;
  title: string;
  summary: string;
  domain: string;
  stage: "Idea" | "MVP" | "Scale" | "Production";
  impact: string;
  year: number;
  tags: string[];
  links: ProjectLinks;
}

export interface ProjectLinks {
  readmeUrl: string;
  notionUrl: string;
  githubUrl: string;
}

export interface ProjectArchiveQuery {
  searchTerm?: string;
  domain?: string;
  page?: number;
  pageSize?: number;
}

const DOMAINS = [
  "Recommendation",
  "Search",
  "MLOps",
  "Experimentation",
  "Analytics",
] as const;

const STAGES: ProjectArchiveItem["stage"][] = ["Idea", "MVP", "Scale", "Production"];

const TAG_POOLS = [
  ["ranking", "personalization", "ctr"],
  ["semantic", "retrieval", "rerank"],
  ["feature-store", "batch", "serving"],
  ["ab-test", "guardrail", "kpi"],
  ["dashboard", "latency", "quality"],
] as const;

const SUMMARY_TEMPLATES = [
  "사용자 행동 로그를 바탕으로 추천 품질과 시청 시간을 동시에 개선하는 프로젝트입니다.",
  "검색 의도 해석과 개인화 랭킹을 결합해 탐색 경험을 높이는 프로젝트입니다.",
  "데이터 파이프라인 자동화와 모델 서빙 표준화를 통해 운영 효율을 높입니다.",
  "실험 설계부터 KPI 검증까지 연결해 제품 의사결정을 빠르게 만드는 프로젝트입니다.",
  "실시간 지표 모니터링 기반으로 성능 이슈를 조기에 감지하고 대응합니다.",
] as const;

const FEATURED_PROJECTS: ProjectArchiveItem[] = [
  {
    id: "openclaw-connect",
    title: "OpenClaw 연결",
    summary: "OpenClaw와 툴·워크플로를 연동해 자동화·에이전트 흐름을 구성하는 프로젝트입니다.",
    domain: "MLOps",
    stage: "MVP",
    impact: "연동 구성",
    year: 2026,
    tags: ["openclaw", "integration", "mcp"],
    links: {
      readmeUrl: "https://github.com/choijinwon/openclaw-connect/blob/main/README.md",
      notionUrl: "https://www.notion.so/biilychoi/openclaw-connect",
      githubUrl: "https://github.com/choijinwon/openclaw-connect",
    },
  },
  {
    id: "figma-mcp-ui",
    title: "Figma MCP UI 연결",
    summary: "Figma와 MCP·UI 툴을 이어 디자인–개발 흐름을 연동하는 프로젝트입니다.",
    domain: "Analytics",
    stage: "MVP",
    impact: "UI·디자인 연동",
    year: 2026,
    tags: ["figma", "mcp", "ui"],
    links: {
      readmeUrl: "https://github.com/choijinwon/figma-mcp-ui/blob/main/README.md",
      notionUrl: "https://www.notion.so/biilychoi/figma-mcp-ui",
      githubUrl: "https://github.com/choijinwon/figma-mcp-ui",
    },
  },
  {
    id: "devcheck",
    title: "DevCheck",
    summary: "Puppeteer와 axe-core로 URL별 프론트엔드 접근성·QA를 점검하는 Next.js 앱(Frontend QA Checker)입니다.",
    domain: "Experimentation",
    stage: "Production",
    impact: "a11y·QA 자동 점검",
    year: 2026,
    tags: ["puppeteer", "axe", "nextjs", "qa"],
    links: {
      readmeUrl: "https://github.com/choijinwon/DevCheck/blob/main/README.md",
      notionUrl: "https://www.notion.so/biilychoi/devcheck",
      githubUrl: "https://github.com/choijinwon/DevCheck",
    },
  },
  {
    id: "vibe-coding-academy",
    title: "바이브코딩 아카데미",
    summary: "Next.js 15·Netlify·TypeScript 기반 종합 학습 플랫폼. Netlify Functions·Identity, Neon·Drizzle로 인증·DB를 구성합니다.",
    domain: "Analytics",
    stage: "MVP",
    impact: "학습·인증 흐름",
    year: 2026,
    tags: ["nextjs", "netlify", "typescript", "drizzle", "education"],
    links: {
      readmeUrl: "https://github.com/choijinwon/vibe-coding-academy/blob/main/README.md",
      notionUrl: "https://www.notion.so/biilychoi/vibe-coding-academy",
      githubUrl: "https://github.com/choijinwon/vibe-coding-academy",
    },
  },
  {
    id: "promptedu",
    title: "PromptEdu (Prompt Hub)",
    summary: "고품질 프롬프트 거래·공유를 위한 마켓플레이스. Next.js 15, Prisma, PostgreSQL·크리에이터 대시보드·비즈니스 모델 캔버스를 갖춘 AI 생태계 웹앱입니다.",
    domain: "Search",
    stage: "MVP",
    impact: "프롬프트 마켓",
    year: 2026,
    tags: ["nextjs", "prisma", "prompts", "marketplace", "typescript"],
    links: {
      readmeUrl: "https://github.com/choijinwon/promptedu/blob/main/README.md",
      notionUrl: "https://www.notion.so/biilychoi/promptedu",
      githubUrl: "https://github.com/choijinwon/promptedu",
    },
  },
  {
    id: "naver-blog-automation",
    title: "네이버 블로그 자동화",
    summary: "Selenium·Python으로 네이버 로그인·포스팅·이미지 업로드를 자동화합니다. Unsplash 연동, 에디터 팝업 처리, Chrome ARM64 지원을 포함합니다.",
    domain: "MLOps",
    stage: "MVP",
    impact: "콘텐츠 자동화",
    year: 2026,
    tags: ["python", "selenium", "naver", "automation", "unsplash"],
    links: {
      readmeUrl: "https://github.com/choijinwon/naver-blog-automation/blob/main/README.md",
      notionUrl: "https://www.notion.so/biilychoi/naver-blog-automation",
      githubUrl: "https://github.com/choijinwon/naver-blog-automation",
    },
  },
];

export const PROJECT_ARCHIVE: ProjectArchiveItem[] = [
  ...FEATURED_PROJECTS,
  ...Array.from(
  { length: 200 },
  (_, index) => {
    const number = index + 1;
    const domainIndex = index % DOMAINS.length;
    const stageIndex = index % STAGES.length;
    const tags = TAG_POOLS[domainIndex] ?? TAG_POOLS[0];
    const summary = SUMMARY_TEMPLATES[domainIndex] ?? SUMMARY_TEMPLATES[0];

    return {
      id: `proj-${number.toString().padStart(3, "0")}`,
      title: `${DOMAINS[domainIndex]} 프로젝트 ${number}`,
      summary,
      domain: DOMAINS[domainIndex],
      stage: STAGES[stageIndex],
      impact: `${(number % 12) + 3}% 개선`,
      year: 2022 + (number % 5),
      tags: [...tags],
      links: {
        readmeUrl: `https://github.com/biilychoi/project-archive/blob/main/projects/proj-${number
          .toString()
          .padStart(3, "0")}/README.md`,
        notionUrl: `https://www.notion.so/biilychoi/proj-${number
          .toString()
          .padStart(3, "0")}`,
        githubUrl: `https://github.com/biilychoi/project-archive/tree/main/projects/proj-${number
          .toString()
          .padStart(3, "0")}`,
      },
    };
  },
),
];

export const PROJECT_DOMAINS = [...DOMAINS];

export function getProjectById(id: string): ProjectArchiveItem | undefined {
  return PROJECT_ARCHIVE.find((project) => project.id === id);
}

export function queryProjectArchive({
  searchTerm = "",
  domain = "all",
  page = 1,
  pageSize = 12,
}: ProjectArchiveQuery) {
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filtered = PROJECT_ARCHIVE.filter((project) => {
    const matchesDomain = domain === "all" || project.domain === domain;
    if (!matchesDomain) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      project.id,
      project.title,
      project.summary,
      project.domain,
      project.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageStart = pageItems.length > 0 ? (safePage - 1) * pageSize + 1 : 0;
  const pageEnd = pageItems.length > 0 ? pageStart + pageItems.length - 1 : 0;

  return {
    items: pageItems,
    total: filtered.length,
    totalPages,
    currentPage: safePage,
    pageStart,
    pageEnd,
  };
}
