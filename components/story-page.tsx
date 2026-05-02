"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const TilesHeroScene = dynamic(
  () => import("@/components/tiles-hero-scene").then((mod) => mod.TilesHeroScene),
  { ssr: false },
);

export function StoryPage() {
  return (
    <main>
      <header id="top" className="hero section">
        <div className="hero-3d-bg" aria-hidden="true">
          <TilesHeroScene />
        </div>
        <p className="eyebrow">AI Agent Developer Story</p>
        <h1>
          6명의 에이전트로
          <br />
          멀티 페이지 팀 운영
        </h1>
        <p className="hero-copy">
          스크롤 한 페이지 대신 메뉴 기반으로 이동하며 각 역할과 가이드를
          분리해서 확인합니다.
        </p>
        <div className="home-cta-row">
          <Link href="/timeline" className="cta">
            타임라인 페이지
          </Link>
          <Link href="/ui-ai-components" className="cta ghost">
            UI AI 컴포넌트
          </Link>
        </div>
      </header>

      <section className="section home-grid">
        <Link href="/timeline" className="home-card">
          <small>Project Flow</small>
          <h3>타임라인</h3>
          <p>기획부터 운영까지 단계를 페이지에서 구조적으로 확인</p>
        </Link>
        <Link href="/projects" className="home-card">
          <small>Project Archive</small>
          <h3>프로젝트</h3>
          <p>추천/검색/MLOps 프로젝트를 카드 단위로 문서화해 관리</p>
        </Link>
        <Link href="/agents" className="home-card">
          <small>Role Detail</small>
          <h3>에이전트</h3>
          <p>6개 역할별 미션/프롬프트/산출물/영향 확인</p>
        </Link>
        <Link href="/prd-playbook" className="home-card">
          <small>Reusable Docs</small>
          <h3>PRD 노하우</h3>
          <p>역할별 템플릿을 복사해 다른 에이전트에 바로 적용</p>
        </Link>
        <Link href="/ui-ai-components" className="home-card">
          <small>Build Blocks</small>
          <h3>UI AI 컴포넌트</h3>
          <p>Prompt/Response/Pipeline 블록으로 UI 조합 시작</p>
        </Link>
        <Link href="/ai-chart-components" className="home-card">
          <small>Analytics UI</small>
          <h3>AI 차트 컴포넌트</h3>
          <p>예측/비교/리스크 시각화를 위한 차트 UI 샘플 확인</p>
        </Link>
      </section>
    </main>
  );
}
