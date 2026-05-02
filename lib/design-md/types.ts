/** CSS 번들 선택 — 문서 안의 구현 섹션에 반영된다. */
export type CssStack = "bootstrap" | "tailwind";

export interface DesignMdRequest {
  productName: string;
  stack: CssStack;
  /** # 없이 헥사 6자, 예: c4c9ae */
  brandPrimaryHex?: string;
  /** 금융·SaaS·콘텐츠 등 짧은 톤 묘사 */
  verticalTone?: string;
}

export interface DesignMdResult {
  markdown: string;
  filename: string;
}
