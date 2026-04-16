"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ProjectLinks } from "@/data/projects-data";
import {
  PROJECT_DOMAINS,
  queryProjectArchive,
} from "@/data/projects-data";
import {
  clearLinkOverridesInStorage,
  getLinkImportTemplate,
  parseLinkOverrides,
  readLinkOverridesFromStorage,
  writeLinkOverridesToStorage,
  type ImportFormat,
  type ProjectLinkOverrideMap,
} from "@/lib/project-link-overrides";

type ProjectSampleView = "recommend" | "search" | "experiment";
const PROJECT_PAGE_SIZE = 12;

const PROJECT_VIEW_TABS: Array<{ id: ProjectSampleView; label: string }> = [
  { id: "recommend", label: "추천 화면" },
  { id: "search", label: "검색 화면" },
  { id: "experiment", label: "실험 결과 화면" },
];

export default function ProjectsPage() {
  const [sampleView, setSampleView] = useState<ProjectSampleView>("recommend");
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [importFormat, setImportFormat] = useState<ImportFormat>("json");
  const [importInput, setImportInput] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [linkOverrides, setLinkOverrides] = useState<ProjectLinkOverrideMap>(() =>
    readLinkOverridesFromStorage(),
  );
  const reduceMotion = useReducedMotion();

  const resolvedCount = useMemo(() => Object.keys(linkOverrides).length, [linkOverrides]);

  const resolveLinks = (projectId: string, links: ProjectLinks) => {
    return linkOverrides[projectId] ?? links;
  };

  const applyImport = () => {
    try {
      const overrides = parseLinkOverrides(importInput, importFormat);
      const merged = { ...linkOverrides, ...overrides };
      setLinkOverrides(merged);
      writeLinkOverridesToStorage(merged);
      setImportStatus(`${Object.keys(overrides).length}개 프로젝트 링크를 반영했습니다.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "업로드 형식을 확인해 주세요.";
      setImportStatus(`실패: ${message}`);
    }
  };

  const fillTemplate = () => {
    setImportInput(getLinkImportTemplate(importFormat));
    setImportStatus("");
  };

  const resetOverrides = () => {
    setLinkOverrides({});
    clearLinkOverridesInStorage();
    setImportStatus("사용자 링크 오버라이드를 초기화했습니다.");
  };

  const { items, total, totalPages, currentPage: safePage, pageStart, pageEnd } = queryProjectArchive({
    searchTerm,
    domain: domainFilter,
    page: currentPage,
    pageSize: PROJECT_PAGE_SIZE,
  });

  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>프로젝트</h2>
        <p>헤더에서 바로 접근 가능한 프로젝트 아카이브입니다.</p>
      </div>

      <section className="project-page-card">
    
        <h3>초개인화 추천 시스템 프로젝트</h3>
        <p>
          수많은 콘텐츠 속에서 유저가 사랑할 이야기를 찾아내기 위해, 인터랙션
          로그와 최신 머신러닝 기술을 결합해 유저별 최적 콘텐츠를 연결하는
          프로젝트입니다.
        </p>
        <p>
          단순 모델 개발을 넘어 라이브 서비스의 방대한 데이터를 안정적으로 처리하고,
          실제 지표로 가치를 증명하는 End-to-End 추천/검색 고도화를 목표로 합니다.
        </p>
      </section>

      <section className="project-page-card">
        <h4>프로젝트 아카이브</h4>
        <p>
          프로젝트가 많아져도 빠르게 소개할 수 있도록 검색/도메인 필터/페이지네이션
          구조로 구성했습니다.
        </p>

        <div className="project-import-panel">
          <div className="project-import-head">
            <h5>링크 업로드 (JSON / CSV)</h5>
            <p>프로젝트별 README/Notion/GitHub 링크를 대량 반영할 수 있습니다.</p>
          </div>
          <div className="project-import-row">
            <label className="project-control">
              <span>포맷</span>
              <select
                value={importFormat}
                onChange={(event) => setImportFormat(event.target.value as ImportFormat)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </label>
            <button type="button" className="timeline-tab" onClick={fillTemplate}>
              템플릿 불러오기
            </button>
            <button type="button" className="timeline-tab" onClick={applyImport}>
              링크 반영
            </button>
            <button type="button" className="timeline-tab" onClick={resetOverrides}>
              오버라이드 초기화
            </button>
          </div>
          <textarea
            value={importInput}
            onChange={(event) => setImportInput(event.target.value)}
            placeholder="JSON 배열 또는 CSV 텍스트를 붙여넣어 주세요."
          />
          <p className="project-import-status">
            {importStatus || `현재 ${resolvedCount}개 프로젝트에 사용자 링크가 반영되어 있습니다.`}
          </p>
        </div>

        <div className="project-archive-controls">
          <label className="project-control">
            <span>검색</span>
            <input
              type="text"
              value={searchTerm}
              placeholder="프로젝트명, 태그, 도메인 검색"
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />
          </label>

          <label className="project-control">
            <span>도메인</span>
            <select
              value={domainFilter}
              onChange={(event) => {
                setDomainFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">전체</option>
              {PROJECT_DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="project-archive-count">
          총 {total}개 중 {pageStart}-{pageEnd} 표시
        </p>

        <div className="project-archive-grid">
          {items.length === 0 && (
            <article className="project-archive-card project-archive-empty">
              <h5>검색 결과가 없습니다.</h5>
              <p>검색어나 도메인 필터를 조정해 다시 확인해 주세요.</p>
            </article>
          )}
          {items.map((project) => {
            const resolvedLinks = resolveLinks(project.id, project.links);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="project-archive-card"
              >
                <div className="project-archive-meta">
                  <small>{project.id.toUpperCase()}</small>
                  <span>{project.year}</span>
                </div>
                <h5>{project.title}</h5>
                <p>{project.summary}</p>
                <div className="project-archive-badges">
                  <em>{project.domain}</em>
                  <em>{project.stage}</em>
                  <em>Impact {project.impact}</em>
                </div>
                <div className="project-archive-tags">
                  {project.tags.map((tag) => (
                    <span key={`${project.id}-${tag}`}>#{tag}</span>
                  ))}
                </div>
                <div className="project-archive-docs">
                  <span>{resolvedLinks.readmeUrl ? "README" : "README 없음"}</span>
                  <span>{resolvedLinks.notionUrl ? "Notion" : "Notion 없음"}</span>
                  <span>{resolvedLinks.githubUrl ? "GitHub" : "GitHub 없음"}</span>
                </div>
                <strong className="project-archive-link">상세 보기 →</strong>
              </Link>
            );
          })}
        </div>

        <div className="project-archive-pagination">
          <button
            type="button"
            className="timeline-tab"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
          >
            이전
          </button>
          <p>
            {safePage} / {totalPages} 페이지
          </p>
          <button
            type="button"
            className="timeline-tab"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
          >
            다음
          </button>
        </div>
      </section>

      <section className="project-page-card">
        <h4>담당업무</h4>
        <ul className="project-duty-list">
          <li>
            초개인화 추천 모델 개발: VOD, LIVE, 검색 행동 데이터를 융합해 사용자
            맥락 기반 추천 모델 설계
          </li>
          <li>
            End-to-End 서비스 운영: 추천 데이터 생성부터 프로덕트 적용, 모니터링,
            성능 최적화
          </li>
          <li>
            검색/추천 경험 고도화: 유저 피드백 루프를 반영해 검색 정확도와 개인화
            알고리즘 지속 개선
          </li>
          <li>
            MLOps 및 인프라 구축: 대규모 트래픽을 처리하는 안정적인 AI/ML 인프라
            운영 자동화
          </li>
        </ul>
      </section>

      <section className="project-page-card">
        <h4>실제 개발 시작 샘플</h4>
        <p>
          아래 순서대로 구성하면 추천 시스템 MVP를 빠르게 구현하고 운영 지표까지
          연결할 수 있습니다.
        </p>
        <div className="project-sample-grid">
          <article className="project-sample-card">
            <small>Step 1</small>
            <h5>이벤트 스키마 고정</h5>
            <pre>{`{
  "user_id": "u_1024",
  "item_id": "vod_891",
  "event_type": "click|watch|like|search",
  "event_ts": "2026-04-14T12:30:00Z",
  "watch_sec": 132,
  "query": "힐링 음악"
}`}</pre>
          </article>

          <article className="project-sample-card">
            <small>Step 2</small>
            <h5>피처 생성 파이프라인</h5>
            <pre>{`# daily_feature_job.py
features = {
  "user_ctr_7d": clicks_7d / impressions_7d,
  "watch_time_7d": sum_watch_sec_7d,
  "category_pref": top_category_7d,
  "search_intent": latest_query_embedding
}
store_feature(user_id, features)`}</pre>
          </article>

          <article className="project-sample-card">
            <small>Step 3</small>
            <h5>추천 API</h5>
            <pre>{`// app/api/recommend/route.ts
export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  const candidates = await fetchCandidates(userId);
  const ranked = await rankByModel(userId, candidates);
  return Response.json({ items: ranked.slice(0, 20) });
}`}</pre>
          </article>

          <article className="project-sample-card">
            <small>Step 4</small>
            <h5>A/B 실험 지표</h5>
            <pre>{`primary_kpi:
- recommendation_ctr
- watch_time_per_user

guardrail:
- hide_rate
- latency_p95_ms`}</pre>
          </article>
        </div>
      </section>

      <section className="project-page-card">
        <h4>MVP 개발 체크리스트</h4>
        <ul className="project-duty-list">
          <li>로그 수집: 노출/클릭/시청/검색 이벤트 파이프라인 구축</li>
          <li>오프라인 학습: 배치 피처 생성 후 랭킹 모델 학습 및 검증</li>
          <li>온라인 서빙: 추천 API + 캐시 + 장애 시 fallback 룰 적용</li>
          <li>모니터링: CTR, 시청시간, 지연시간(p95), 오류율 대시보드화</li>
          <li>A/B 테스트: 실험군/대조군 분리 및 KPI 유의미성 확인</li>
        </ul>
      </section>

      <section className="project-page-card">
        <h4>샘플 화면 (추천 서비스 UI)</h4>
        <p>
          아래는 실제 구현 시 참고할 수 있는 샘플 화면입니다. 탭으로 추천/검색/실험
          결과 화면을 전환해 볼 수 있습니다.
        </p>

        <div className="project-view-tabs">
          {PROJECT_VIEW_TABS.map((tab) => {
            const isActive = sampleView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`timeline-tab project-tab ${isActive ? "is-active" : ""}`}
                onClick={() => setSampleView(tab.id)}
              >
                <span>{tab.label}</span>
                {isActive && !reduceMotion && (
                  <motion.span
                    layoutId="project-tab-indicator"
                    className="project-tab-indicator"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="project-screen-layout">
          <article className="project-screen">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`main-${sampleView}`}
                className="project-view-panel"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={
                  reduceMotion ? undefined : { duration: 0.28, ease: "easeOut" as const }
                }
              >
                {sampleView === "recommend" && (
                  <>
                    <header>
                      <strong>For You</strong>
                      <span>Personalized Feed</span>
                    </header>

                    <div className="reco-card">
                      <small>LIVE · 실시간 인기</small>
                      <h5>힐링 재즈 라이브 - 저녁 집중 플레이리스트</h5>
                      <p>추천 이유: 최근 검색어 &apos;힐링 음악&apos;, 7일 시청 완주율 상위 장르</p>
                      <div className="chip-row">
                        <em>#jazz</em>
                        <em>#focus</em>
                        <em>#night</em>
                      </div>
                    </div>

                    <div className="reco-card">
                      <small>VOD · 이어보기</small>
                      <h5>작업 효율을 높이는 Lo-fi 모음</h5>
                      <p>추천 이유: 비슷한 유저 군집에서 클릭률 +23%</p>
                      <div className="chip-row">
                        <em>#lofi</em>
                        <em>#work</em>
                        <em>#repeat</em>
                      </div>
                    </div>
                  </>
                )}

                {sampleView === "search" && (
                  <>
                    <header>
                      <strong>Search AI</strong>
                      <span>Intent + Personalization</span>
                    </header>

                    <div className="reco-card">
                      <small>검색어: &quot;집중 음악&quot;</small>
                      <h5>의도 해석: 업무 집중 + 저자극 BGM 선호</h5>
                      <p>개인화 랭킹: 최근 야간 시청 패턴과 유사 사용자 피드백 반영</p>
                      <div className="chip-row">
                        <em>#query-intent</em>
                        <em>#personal-rank</em>
                        <em>#semantic</em>
                      </div>
                    </div>

                    <div className="reco-card">
                      <small>추천 검색 결과</small>
                      <h5>1) Lo-fi Study 2) Jazz Focus 3) Rain Ambience</h5>
                      <p>검색 정확도 향상을 위해 클릭/완주/재생시간 신호를 가중치로 적용</p>
                      <div className="chip-row">
                        <em>#rerank</em>
                        <em>#feedback-loop</em>
                        <em>#precision</em>
                      </div>
                    </div>
                  </>
                )}

                {sampleView === "experiment" && (
                  <>
                    <header>
                      <strong>A/B Experiment</strong>
                      <span>Recommendation Quality</span>
                    </header>

                    <div className="reco-card">
                      <small>실험 설정</small>
                      <h5>A: 기존 룰 기반 / B: 개인화 랭킹 모델</h5>
                      <p>대상: 신규 유저 20% 트래픽, 기간: 14일, 샘플 수 자동 균등 배분</p>
                      <div className="chip-row">
                        <em>#ab-test</em>
                        <em>#traffic-split</em>
                        <em>#significance</em>
                      </div>
                    </div>

                    <div className="reco-card">
                      <small>결과 요약</small>
                      <h5>실험군 B 우세 (CTR +0.9%, Watch Time +18%)</h5>
                      <p>Guardrail 지표(숨김률/지연시간)도 기준 이내로 유지되어 점진 배포 가능</p>
                      <div className="chip-row">
                        <em>#ctr</em>
                        <em>#watch-time</em>
                        <em>#guardrail</em>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </article>

          <aside className="project-side-panel">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`side-${sampleView}`}
                className="project-view-panel"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={
                  reduceMotion ? undefined : { duration: 0.28, ease: "easeOut" as const }
                }
              >
                {sampleView === "recommend" && (
                  <>
                    <h5>실시간 추천 지표</h5>
                    <ul>
                      <li>
                        <span>CTR</span>
                        <strong>4.8%</strong>
                      </li>
                      <li>
                        <span>Watch Time</span>
                        <strong>+18%</strong>
                      </li>
                      <li>
                        <span>Latency p95</span>
                        <strong>74ms</strong>
                      </li>
                    </ul>
                    <p>실험군 B가 대조군 대비 추천 만족도 지표에서 우세합니다.</p>
                  </>
                )}

                {sampleView === "search" && (
                  <>
                    <h5>검색 품질 지표</h5>
                    <ul>
                      <li>
                        <span>Top-3 Precision</span>
                        <strong>62%</strong>
                      </li>
                      <li>
                        <span>NDCG@10</span>
                        <strong>0.71</strong>
                      </li>
                      <li>
                        <span>Zero Result Rate</span>
                        <strong>1.9%</strong>
                      </li>
                    </ul>
                    <p>의도 해석 모델 적용 후 무응답 검색 비율이 안정적으로 감소했습니다.</p>
                  </>
                )}

                {sampleView === "experiment" && (
                  <>
                    <h5>실험 결과 지표</h5>
                    <ul>
                      <li>
                        <span>CTR Lift</span>
                        <strong>+0.9%</strong>
                      </li>
                      <li>
                        <span>Watch Time Lift</span>
                        <strong>+18%</strong>
                      </li>
                      <li>
                        <span>Latency Diff</span>
                        <strong>+3ms</strong>
                      </li>
                    </ul>
                    <p>유의수준 기준을 충족해 10% 추가 트래픽 확대 배포를 권장합니다.</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </section>
    </main>
  );
}
