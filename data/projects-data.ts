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

export const PROJECT_ARCHIVE: ProjectArchiveItem[] = Array.from(
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
);

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
