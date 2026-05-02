# 한국형 Design MD — 작성·리뷰 RULES

이 문서는 [VoltAgent awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md) 형식과 [Bootstrap](https://getbootstrap.com/) / [Tailwind CSS](https://tailwindcss.com/) 구현 선택을 같은 저장소 규격으로 맞출 때 따라야 할 **강제 아님·권고** 규칙이다.

## 1. 필수 원칙 (Why-first)

1. 한국 사용자 **가독성**: 본문 `line-height` 1.65 이상 우선 검토.
2. **정보 우선**: 데코는 나중에, 제목 계층·여백·대비부터 잡을 것.
3. **스택 일관성**: 한 문서(또는 한 PR) 안에서 레이아웃을 Bootstrap과 Tailwind로 **혼합하지 말 것** (예외 시 섹션 경계 명시).

## 2. 문서 골격 (awesome-design-md 정렬)

`DESIGN.md` 또는 저장소 생성기 출력은 가능한 순서를 유지한다.

1. 메타 (제품명, 스택, primary hex, 레퍼런스 링크)
2. 비주얼 테마 · 분위기
3. 색 역할표 (토큰명 + hex 또는 CSS 변수명)
4. 타이포 (한국어 계층, 폰트 로드 또는 스택 변수)
5. 컴포넌트 (버튼·카드·폼 상태)
6. 반응형·모션 (reduced-motion 언급)
7. **구현 섹션** — 선택 스택별: Bootstrap 클래스·변수 또는 Tailwind `@theme`/유틸 매핑
8. AI/리뷰 체크리스트

## 3. 부트스트랩 전용

- 커스터마이즈는 **`--bs-primary`** 등 CSS 변수 또는 SCSS 변수 중 프로젝트가 채택한 한 경로만.
- 그리드는 **모바일 1열 → md 이상 분할**을 기본.
- 카드 안 한글 줄바꿈: 필요 시 **`word-break: keep-all`** 보조 클래스 또는 유틈 한 줄 명시.

## 4. Tailwind 전용

- 색 이름은 디자인 토큰→`@theme`(또는 `tailwind.config` 레거시) 에 **한 번** 정의 후 유틈에서 참조할 것 (`bg-brand` 등).
- **다크 모드**: `design-md` 결과물에 브레이크포인트/다크 variant 전략을 한 줄이라도 명시하지 않았다면 TODO로 적는다.

## 5. AI 에이전트 동작

- 제품 카피 번역 또는 법무 문구 수정은 디자인 MD 범위 **밖**이면 해당 섹션에 “법무 검토 필요” 라벨.
- 새 컴포넌트 패턴 추가 시 표에 **예시 클래스/HTML 스니펫** 한 줄 이상 포함.
- 레포 제공 `/design-md` API·페이지 결과를 시작점으로 두고, 제품별로 표·토큰을 수동 확장 가능.
