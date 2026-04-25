import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML 감사",
  description: "업로드한 HTML에 대해 접근성(axe)·SEO 규칙 점검, 자동 수정 diff, PR 설명 마크다운을 생성합니다.",
};

export default function HtmlAuditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
