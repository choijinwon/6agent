"use client";

import { useMemo } from "react";
import type { ProjectLinks } from "@/data/projects-data";
import { readLinkOverridesFromStorage } from "@/lib/project-link-overrides";

interface ProjectResourceLinksProps {
  projectId: string;
  defaultLinks: ProjectLinks;
}

export function ProjectResourceLinks({ projectId, defaultLinks }: ProjectResourceLinksProps) {
  const resolvedLinks = useMemo(() => {
    const overrides = readLinkOverridesFromStorage();
    const matched = overrides[projectId];
    return matched ?? defaultLinks;
  }, [defaultLinks, projectId]);

  return (
    <div className="project-resource-links">
      <a href={resolvedLinks.readmeUrl} target="_blank" rel="noreferrer">
        README 문서 열기
      </a>
      <a href={resolvedLinks.notionUrl} target="_blank" rel="noreferrer">
        Notion 문서 열기
      </a>
      <a href={resolvedLinks.githubUrl} target="_blank" rel="noreferrer">
        GitHub 저장소 열기
      </a>
    </div>
  );
}
