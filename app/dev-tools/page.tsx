"use client";

import { useState } from "react";

const AI_TOOL_KIND_FILTERS = ["전체", "코드보조", "에이전트형", "UI생성"] as const;

type AiToolKindFilter = (typeof AI_TOOL_KIND_FILTERS)[number];

const DEV_TOOL_GROUPS = [
  {
    category: "AI Coding Tools",
    description: "코드 초안 생성, 리팩터링, 문서화 자동화에 활용하는 도구",
    tools: [
      { name: "GitHub Copilot", url: "https://github.com/features/copilot", note: "IDE 기반 코드 보조", kind: "코드보조" },
      { name: "ChatGPT", url: "https://chatgpt.com", note: "설계/코드/문서 보조", kind: "코드보조" },
      { name: "Claude", url: "https://claude.ai", note: "리뷰/리팩터링/요약", kind: "코드보조" },
      { name: "Cursor", url: "https://cursor.com", note: "AI 중심 코드 편집기", kind: "에이전트형" },
      { name: "Aider", url: "https://aider.chat", note: "터미널 기반 AI 페어 프로그래머", kind: "코드보조" },
      { name: "Continue", url: "https://www.continue.dev", note: "VS Code/JetBrains AI 확장", kind: "코드보조" },
      { name: "Codeium", url: "https://codeium.com", note: "코드 자동완성/챗 보조", kind: "코드보조" },
      { name: "Windsurf", url: "https://windsurf.com", note: "에이전트 기반 개발 IDE", kind: "에이전트형" },
      { name: "Kiro", url: "https://kiro.dev", note: "AI 기반 개발 워크스페이스", kind: "에이전트형" },
      { name: "Amazon Q Developer", url: "https://aws.amazon.com/q/developer/", note: "AWS 통합 개발 보조", kind: "코드보조" },
      { name: "Sourcegraph Cody", url: "https://sourcegraph.com/cody", note: "코드베이스 문맥 기반 보조", kind: "코드보조" },
      { name: "Replit Agent", url: "https://replit.com/ai", note: "브라우저 기반 에이전트 개발", kind: "에이전트형" },
      { name: "Bolt.new", url: "https://bolt.new", note: "프롬프트 기반 풀스택 생성", kind: "UI생성" },
      { name: "v0", url: "https://v0.dev", note: "UI 생성/프로토타이핑", kind: "UI생성" },
    ],
  },
  {
    category: "Frontend & Runtime",
    description: "프론트엔드 개발 및 런타임 구성",
    tools: [
      { name: "Next.js", url: "https://nextjs.org", note: "React 기반 SSR/CSR 프레임워크" },
      { name: "React", url: "https://react.dev", note: "컴포넌트 기반 UI 라이브러리" },
      { name: "Vue", url: "https://vuejs.org", note: "선언형 UI 프레임워크" },
      { name: "Electron", url: "https://www.electronjs.org", note: "데스크톱 앱 런타임" },
    ],
  },
  {
    category: "Collaboration & Quality",
    description: "코드 품질, 협업, 표준화에 사용하는 도구",
    tools: [
      { name: "ESLint", url: "https://eslint.org", note: "정적 분석/코드 규칙" },
      { name: "Prettier", url: "https://prettier.io", note: "코드 포맷 통일" },
      { name: "Stylelint", url: "https://stylelint.io", note: "CSS 규칙 검사" },
      { name: "Storybook", url: "https://storybook.js.org", note: "UI 컴포넌트 문서화" },
    ],
  },
  {
    category: "DevOps & Platform",
    description: "배포 자동화, 모노레포, 운영 안정화 도구",
    tools: [
      { name: "Docker", url: "https://www.docker.com", note: "컨테이너 기반 실행 환경" },
      { name: "Kubernetes", url: "https://kubernetes.io", note: "컨테이너 오케스트레이션" },
      { name: "GitHub Actions", url: "https://github.com/features/actions", note: "CI/CD 자동화" },
      { name: "Argo CD", url: "https://argo-cd.readthedocs.io", note: "GitOps 배포" },
      { name: "Turborepo", url: "https://turbo.build/repo", note: "모노레포 빌드 최적화" },
    ],
  },
  {
    category: "Database Tools",
    description: "DB 모델링, 조회, 운영 모니터링에 사용하는 도구",
    tools: [
      { name: "DBeaver", url: "https://dbeaver.io", note: "다중 DB 클라이언트" },
      { name: "TablePlus", url: "https://tableplus.com", note: "가벼운 DB GUI 툴" },
      { name: "MongoDB Compass", url: "https://www.mongodb.com/products/tools/compass", note: "MongoDB 시각화 클라이언트" },
      { name: "pgAdmin", url: "https://www.pgadmin.org", note: "PostgreSQL 관리 도구" },
      { name: "DataGrip", url: "https://www.jetbrains.com/datagrip", note: "SQL 중심 IDE" },
    ],
  },
  {
    category: "Server-side & API",
    description: "백엔드 API 개발, 서버 운영, 관측성 확보를 위한 도구",
    tools: [
      { name: "Node.js", url: "https://nodejs.org", note: "서버 런타임" },
      { name: "Express", url: "https://expressjs.com", note: "경량 API 프레임워크" },
      { name: "NestJS", url: "https://nestjs.com", note: "구조화된 Node.js 프레임워크" },
      { name: "FastAPI", url: "https://fastapi.tiangolo.com", note: "Python API 프레임워크" },
      { name: "Postman", url: "https://www.postman.com", note: "API 테스트/협업" },
      { name: "Nginx", url: "https://nginx.org", note: "리버스 프록시/로드밸런싱" },
      { name: "Grafana", url: "https://grafana.com", note: "서버/지표 대시보드" },
      { name: "Sentry", url: "https://sentry.io", note: "에러 모니터링/추적" },
    ],
  },
  {
    category: "Text-to-SQL",
    description: "자연어 질문을 SQL로 변환해 분석/조회 속도를 높이는 도구",
    tools: [
      { name: "Vanna", url: "https://vanna.ai", note: "RAG 기반 Text-to-SQL" },
      { name: "DB-GPT", url: "https://github.com/eosphoros-ai/DB-GPT", note: "오픈소스 데이터베이스 AI" },
      { name: "LangChain SQL", url: "https://python.langchain.com/docs/how_to/sql_prompting/", note: "LLM 기반 SQL 체인" },
      { name: "LlamaIndex SQL", url: "https://docs.llamaindex.ai/en/stable/examples/index_structs/struct_indices/SQLIndexDemo/", note: "SQL 질의 보조 워크플로우" },
    ],
  },
] as const;

const TEXT_TO_SQL_SECURITY_GUIDE = [
  "DB 계정은 읽기 전용(SELECT) 권한으로 분리하고 쓰기 권한은 기본 차단합니다.",
  "허용된 스키마/테이블만 조회하도록 화이트리스트를 적용합니다.",
  "실행 전 SQL 검증 단계를 두고 DROP/DELETE/UPDATE 같은 위험 쿼리를 차단합니다.",
  "결과 행 수, 실행 시간, 비용 상한(limit/timeout)을 설정해 과도한 조회를 방지합니다.",
  "민감 컬럼(PII)은 마스킹/비식별화 후 응답하도록 정책을 적용합니다.",
  "프롬프트/쿼리/실행 로그를 저장해 감사 추적과 오탐 분석에 활용합니다.",
] as const;

const SERVER_OPERATIONS_CHECKLIST = [
  "헬스체크(`/health`, `/ready`)와 외부 모니터링 연동을 구성합니다.",
  "구조화 로그(JSON)와 요청 단위 trace id를 적용해 장애 추적성을 높입니다.",
  "인증/권한, 레이트리밋, CORS, 입력 검증 등 API 보안 기본 정책을 표준화합니다.",
  "타임아웃/재시도/서킷브레이커를 적용해 외부 의존 장애 전파를 차단합니다.",
  "배포 전후 체크리스트(마이그레이션, 캐시, 롤백 경로)를 문서화합니다.",
  "SLO/에러버짓 기반으로 알림 임계치와 온콜 대응 플로우를 정의합니다.",
] as const;

const AI_CODING_KEYS_GUIDE = [
  "OpenAI API: OPENAI_API_KEY",
  "Anthropic API: ANTHROPIC_API_KEY",
  "Google Gemini API: GOOGLE_API_KEY 또는 GEMINI_API_KEY",
  "Azure OpenAI: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY",
  "AWS Bedrock: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION",
  "Sentry 연동 시: SENTRY_DSN (에러 추적)",
] as const;

const NODE_SERVER_TEMPLATE = `// Express production template (ops-ready)
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pino from "pino";
import * as Sentry from "@sentry/node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const app = express();
const logger = pino();
const otel = new NodeSDK({ instrumentations: [getNodeAutoInstrumentations()] });
otel.start();

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));
app.use(Sentry.Handlers.requestHandler());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.use((req, _res, next) => {
  req.headers["x-trace-id"] ||= crypto.randomUUID();
  next();
});

app.use(Sentry.Handlers.errorHandler());

app.listen(3000, () => logger.info("server started"));`;

const NEST_SERVER_TEMPLATE = `// NestJS production template
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import * as Sentry from "@sentry/node";
import { AppModule } from "./app.module";

async function bootstrap() {
  Sentry.init({ dsn: process.env.SENTRY_DSN });

  const app = await NestFactory.create(
    AppModule,
    WinstonModule.createLogger({
      transports: [new winston.transports.Console()],
    }),
  );
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();`;

export default function DevToolsPage() {
  const [aiKindFilter, setAiKindFilter] = useState<AiToolKindFilter>("전체");

  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>개발툴</h2>
        <p>실무에서 자주 사용하는 개발 도구를 카테고리별로 정리했습니다.</p>
      </div>

      {DEV_TOOL_GROUPS.map((group) => {
        const filteredTools =
          group.category === "AI Coding Tools"
            ? group.tools.filter((tool) => {
                if (aiKindFilter === "전체") {
                  return true;
                }
                return "kind" in tool && tool.kind === aiKindFilter;
              })
            : group.tools;

        return (
          <section key={group.category} className="project-page-card">
            <h4>{group.category}</h4>
            <p>{group.description}</p>
            {group.category === "AI Coding Tools" && (
              <div className="dev-tool-filter-row">
                {AI_TOOL_KIND_FILTERS.map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    className={`timeline-tab ${aiKindFilter === kind ? "is-active" : ""}`}
                    onClick={() => setAiKindFilter(kind)}
                  >
                    {kind}
                  </button>
                ))}
              </div>
            )}
            <div className="dev-tools-grid">
              {filteredTools.map((tool) => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noreferrer" className="dev-tool-card">
                  {"kind" in tool && <span className="dev-tool-kind">{tool.kind}</span>}
                  <strong>{tool.name}</strong>
                  <p>{tool.note}</p>
                </a>
              ))}
            </div>
            {group.category === "Text-to-SQL" && (
              <div className="dev-tools-security">
                <h5>Text-to-SQL 보안 가이드</h5>
                <ul>
                  {TEXT_TO_SQL_SECURITY_GUIDE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {group.category === "AI Coding Tools" && (
              <div className="dev-tools-security">
                <h5>AI Coding Tools 필수 키/환경변수</h5>
                <ul>
                  {AI_CODING_KEYS_GUIDE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {group.category === "Server-side & API" && (
              <>
                <div className="dev-tools-security">
                  <h5>서버 운영 체크리스트</h5>
                  <ul>
                    {SERVER_OPERATIONS_CHECKLIST.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="dev-tools-template-grid">
                  <article className="dev-tools-template-card">
                    <h5>Node.js/Express 템플릿</h5>
                    <pre>{NODE_SERVER_TEMPLATE}</pre>
                  </article>
                  <article className="dev-tools-template-card">
                    <h5>NestJS 템플릿</h5>
                    <pre>{NEST_SERVER_TEMPLATE}</pre>
                  </article>
                </div>
              </>
            )}
          </section>
        );
      })}
    </main>
  );
}
