import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectResourceLinks } from "@/components/project-resource-links";
import { PROJECT_ARCHIVE, getProjectById } from "@/data/projects-data";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PROJECT_ARCHIVE.map((project) => ({ id: project.id }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const relatedProjects = PROJECT_ARCHIVE.filter(
    (item) => item.id !== project.id && item.domain === project.domain,
  ).slice(0, 3);

  return (
    <main className="section page-pad">
      <div className="section-head">
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
      </div>

      <section className="project-page-card project-detail-top">
        <div className="project-archive-meta">
          <small>{project.id.toUpperCase()}</small>
          <span>{project.year}</span>
        </div>
        <div className="project-archive-badges">
          <em>{project.domain}</em>
          <em>{project.stage}</em>
          <em>Impact {project.impact}</em>
        </div>
        <div className="project-archive-tags">
          {project.tags.map((tag) => (
            <span key={`${project.id}-tag-${tag}`}>#{tag}</span>
          ))}
        </div>
      </section>

      <section className="project-page-card">
        <h4>소개</h4>
        <p>
          이 프로젝트는 {project.domain} 도메인에서 {project.stage} 단계로 운영되는
          프로젝트입니다. 핵심 목표는 사용자 가치 지표를 개선하면서도 서비스 안정성을
          유지하는 것입니다.
        </p>
      </section>

      <section className="project-page-card">
        <h4>프로젝트 리소스</h4>
        <ProjectResourceLinks projectId={project.id} defaultLinks={project.links} />
      </section>

      <section className="project-page-card">
        <h4>실행 체크포인트</h4>
        <ul className="project-duty-list">
          <li>문제 정의와 KPI를 고정하고 데이터 수집 범위를 확정합니다.</li>
          <li>오프라인 검증 지표와 온라인 실험 지표를 분리해 설계합니다.</li>
          <li>서빙 경로의 지연시간/오류율을 모니터링하며 배포 단계를 나눕니다.</li>
          <li>주간 리포트에서 학습/서빙/지표 변화를 함께 리뷰합니다.</li>
        </ul>
      </section>

      <section className="project-page-card">
        <h4>같은 도메인 프로젝트</h4>
        <div className="project-archive-grid">
          {relatedProjects.map((item) => (
            <Link key={item.id} href={`/projects/${item.id}`} className="project-archive-card">
              <div className="project-archive-meta">
                <small>{item.id.toUpperCase()}</small>
                <span>{item.year}</span>
              </div>
              <h5>{item.title}</h5>
              <p>{item.summary}</p>
              <strong className="project-archive-link">상세 보기 →</strong>
            </Link>
          ))}
        </div>
      </section>

      <div className="project-detail-back">
        <Link href="/projects" className="cta ghost">
          프로젝트 목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
