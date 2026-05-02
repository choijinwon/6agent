import type { CssStack, DesignMdRequest, DesignMdResult } from "./types";

const BS_CDN_CSS =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";

function normalizeHex(hex: string | undefined, fallback: string): string {
  const h = (hex ?? "").replace(/^#/, "").trim().toLowerCase();
  if (/^[0-9a-f]{6}$/.test(h)) {
    return `#${h}`;
  }
  return `#${fallback}`;
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣_-]/gu, "")
    .slice(0, 48) || "product";
}

function stackSectionBootstrap(primary: string, productName: string): string {
  return `## 구현 레퍼런스: Bootstrap 5.x

공식 문서: [Bootstrap](https://getbootstrap.com/)

### CDN (빠른 시작 예시)

\`\`\`html
<link href="${BS_CDN_CSS}" rel="stylesheet" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous" defer></script>
\`\`\`

### 디자인 토큰 → 부트스트랩 매핑

| 역할 | 권장 |
|------|------|
| Primary | \`btn btn-primary\`, \`bg-primary\`, \`text-primary\`; 커스텀 시 \`--bs-primary: ${primary}\`; |
| 그리드 | \`container-lg\` + \`row\` + \`col-12 col-md-6\` |
| 카드 | \`card\` \`shadow-sm\` \`rounded-3\`; 한글 본문은 \`card-body\`에 \`.text-wrap\` 또는 커스텀 \`word-break: keep-all\` |
| 폼 | \`form-label\` \`form-control\` \`needs-validation\` |
| 간격 | \`g-*\`, \`p-*\`, \`m-*\` 4/8 단위 우선 사용 |

### ${productName} 전용 변수 (example)

\`\`\`css
:root {
  --bs-primary: ${primary};
  --bs-font-sans-serif: "Pretendard Variable", Pretendard, system-ui, sans-serif;
}

body.ko-design {
  word-break: keep-all;
  line-break: strict;
}
\`\`\`
`;
}

function stackSectionTailwind(primary: string): string {
  return `## 구현 레퍼런스: Tailwind CSS

공식 문서: [Tailwind CSS](https://tailwindcss.com/)

### 권장 구성

- 빌드 환경: Vite · Next postcss 플러그인 등 프로젝트 표준 따름 (공식 시작 가이드 참고).
- **한국어 레이아웃**: 긴 명사형 라벨·버튼에서는 \`overflow-wrap:break-word\` 또는 프로젝트 정책에 맞는 keep-all 과 충분한 \`leading-relaxed\` 유지.

### \`@theme\` 예시 (${primary})

\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand: ${primary};
  --font-sans: "Pretendard Variable", Pretendard, ui-sans-serif, system-ui, sans-serif;
}
\`\`\`

### 컴포넌트를 유틸로 묘사할 때의 기본 패턴

| 패턴 | 유틸 조합 예 |
|------|--------------|
| CTA 버튼 | \`rounded-xl px-5 py-2.5 font-semibold text-white bg-brand hover:opacity-90\` (프로젝트에서 \`bg-brand\` 매핑) |
| 카드 | \`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm\` (다크 톤 예시) |
| 스택 간격 | \`flex flex-col gap-4 md:gap-6\` |
| 반응형 그리드 | \`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\` |

> 실제 클래스명은 Tailwind 버전 및 \`safelist\` 설정에 따라 조정한다.
`;
}

function koreanTypographyBlock(): string {
  return `## 3. 타이포그래피 (한국형)

### 원칙

- **폰트**: 가독성 우선 변수 폰트 **Pretendard** 또는 **IBM Plex Sans KR** → 시스템 폰트로 폴백.
- **행간**: 본문 한국어 **1.65–1.75** 권장. 제목은 **1.2–1.35**.
- **줄바꿈**: UI 카피·헤드라인은 \`word-break: keep-all\`; 긴 URL/코드는 별도 스타일.
- **tracking**: 과한 자간축소 지양 — 한글은 작은 크기일수록 과도한 letter-spacing 역효과.
- **수치**: 천 단위 구분·원화 표기 시 **tabular** 숫자가 필요하면 별도 스팬 클래스로 분리.

### 계층 (권역 값 — 프로젝트에서 rem 조정)

| 역할 | 크기(rem) | weight | 줄간격 | 비고 |
|------|-----------|--------|--------|------|
| Display | 2.75–3.25 | 700–800 | 1.2 | 마케팅형 히어만 |
| H1 | 1.75–2 | 700 | 1.28 | 페이지당 1 |
| H2 | 1.35–1.5 | 650–700 | 1.35 | |
| H3 | 1.125–1.25 | 600–650 | 1.4 | |
| Body | 0.9375–1 | 400–500 | 1.65–1.7 | 본문 기본 |
| Caption | 0.8125–0.875 | 400–500 | 1.5 | 부가설명 |

### 폰트 로드 예시 (CDN)

\`\`\`html
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css" />
\`\`\`
`;
}

export function generateKoreanDesignMd(req: DesignMdRequest): DesignMdResult {
  const name = req.productName.trim() || "한국형 서비스";
  const primary = normalizeHex(req.brandPrimaryHex, "c4c9ae");
  const tone = req.verticalTone?.trim() || "일반 디지털 서비스(신뢰·명료)";
  const stack: CssStack = req.stack === "tailwind" ? "tailwind" : "bootstrap";

  const stackBody =
    stack === "bootstrap"
      ? stackSectionBootstrap(primary, name)
      : stackSectionTailwind(primary);

  const markdown = `# ${name} · 한국형 Design MD (${stack === "bootstrap" ? "Bootstrap 5" : "Tailwind CSS"})

> 구조 레퍼런스: [VoltAgent awesome-design-md / design-md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md) 패턴(VISUAL · COLOR · TYPO · COMPONENTS · IMPLEMENTATION)을 한국 로케일·가독성 우선 원칙에 맞게 적용했다.

## 메타

- **제품/서비스**: ${name}
- **구현 스택**: ${stack === "bootstrap" ? "Bootstrap 5.x" : "Tailwind CSS"}
- **브랜드 프라이머리**: ${primary}
- **도메인 톤**: ${tone}
- **외부 레퍼런스**: [Bootstrap](https://getbootstrap.com/) · [Tailwind CSS](https://tailwindcss.com/)

---

## 1. 비주얼 테마 & 분위기 (한국형)

한국어 UI는 **정보 밀도**와 **법·금융·공공 카피의 엄격함** 요구가 잦으므로, 장식보다 **계층·여백·대비**로 신뢰를 만든다.

- 라이트 기본 바탕: **화이트 또는 아주 미세한 블루 그레이** (#f8fafc 근처)로 스캔 피로를 줄인다.
- 다크 옵션: 배경 깊은 남청 + 인디고 계열 포인트(현 레포 브랜드와 호환 가능).
- **마이크로카피 톤**: 짧은 문장·능동태·금지표현 최소화(특히 결제·인증 플로우).
- 상태 색상: 성공 녹색/경고 노랑/실패 빨강은 **색약 대비**(텍스트+배경 대비 동시 검증) 필요.

---

## 2. 색 역할표

### Primary · 브랜드

| 토큰 | 값 | 용도 |
|------|-----|------|
| brand-primary | ${primary} | 주요 CTA, 선택된 탭, 링크 강조 |
| brand-primary-hover | 동일 채널에서 10–15% 어둡게 | hover/active |

### 뉴트럴 · 텍스트

| 토큰 | 라이트(예시) | 용도 |
|------|--------------|------|
| text-strong | #0f172a | 제목 |
| text-body | #334155 | 본문 |
| text-muted | #64748b | 보조, placeholder |
| surface | #ffffff | 카드/모달 |
| border-subtle | #e2e8f0 | 구분선 |

### 의미색

| 의미 | 권장(예시) | 비고 |
|------|-----------|------|
| success | #059669 근처 | 숫자/아이콘 함께 전달 |
| warning | #d97706 근처 | 경고 카피 명시 필수 |
| danger | #dc2626 근처 | 차단 버튼은 별도 확인 모달 패턴 검토 |

---

${koreanTypographyBlock()}

## 4. 컴포넌트 작성 규격

### 버튼

- **주요 버튼**: 한 줄 카피, 최소 패딩 높이 **44×44 px** 접근성(모바일) 고려.
- **보조**: 테두리형·고스트 버튼을 주 버튼과 색만으로 구분하지 말 것(언더라인 또는 아웃라인 병행).
- **진행 상태**: Spinner + 비활성화 + 중복 클릭 방지 명시.

### 카드 · 리스트

- 카드 내부 한글 줄 수가 많으면 상단에는 **카테고리/날짜** 등 고정 헤더, 본문은 **최대 너비 65–75ch** 권장.
- 리스트는 **들여쓰기 규격** 통일 (·, 숫자, 한글 순서 접두 단어 규격).

### 폼 · 에러

- 에러 메시지는 필드 우측/하단 + **무엇이 잘못됐는지 + 수정 방법** 동시 제공.
- \`placeholder\`만으로 레이블을 대체하지 말 것(접근성).

---

## 5. 반응형 & 모션

- 브레이크포인트는 **실제 디바이스 기준**(360 / 768 / 1024 / 1280+)으로 스팟 테스트.
- 애니메이션은 \`prefers-reduced-motion\` 존중: 핵심 정보 전달에는 모션 불필요.

---

${stackBody}

---

## 부록 · AI 작성용 체크리스트

생성 또는 리뷰 시 아래를 만족하는지 검증한다.

- [ ] \`DESIGN.md\` 상단 메타에 **스택**(Bootstrap 또는 Tailwind) 명시됨  
- [ ] 한국 본문 **행간·keep-all 원칙** 반영 여부 명시됨  
- [ ] Primary 색 역할표에 **실제 hex** 기입됨  
- [ ] CTA 대비(**WCAG 접근성**) 검토 필요 항목에 메모 남김  

---

### 라이선스·출처

- 스키마 패턴 크레디트: [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (커뮤니티 수집). 본 파일은 해당 레포를 **직접 복사하지 않고**, 한국 로케일·선택 스택용으로 새로 작성되었다.

`;

  return {
    markdown: markdown.trim(),
    filename: `${slugify(name)}-design.kr.${stack}.md`,
  };
}
