# 6 Agents Lab — 레포 에이전트 가이드 (Harness 정렬)

이 저장소는 **한 명의 빌더**가 6개 역할(PM · Architect · Frontend · Backend · QA · DevOps)을 순환하는 스토리를 담았다. [하네스(Harness) 엔지니어링](https://github.com/choijinwon/harness/tree/main/skills/harness/references) 관점의 **역할 분리 · Phase 산출물 · 오케스트레이션**을 Cursor 워크플로에 맞춰 적용한다.

## 역할 진실 원천

코드 및 UI 카드 내용은 아래 한 곳과 동기화된다.

- `data/story-data.ts` (`AGENTS`, `TIMELINE_STEPS`)
- 페이지: `/agents`, `/timeline`

역할 카드 수정 시 위 데이터와 페이지가 어긋나지 않게 한다.

## Cursor에서 Harness 적용 방법

프로젝트 스킬 **`.cursor/skills/biilychoi-harness/SKILL.md`** 를 읽는다. 요약하면:

1. Claude Code의 **에이전트 팀 API** 대신 **`Task`(서브 에이전트) + 레포 패치 + `_workspace/` 메모**로 단계 증거를 나눈다.
2. **Phase 0** 의사결정: 기존 `_workspace/` 존재 여부 → 초기 / 부분 재실행 / 새 실행 분기.
3. 병렬 관점 검토에는 **Explore(읽기)** 계열 분리 실행 후 팬인(통합)한다.

upstream 레퍼런스는 다음에서 유지된다.

- [harness/skills/harness/references](https://github.com/choijinwon/harness/tree/main/skills/harness/references)

## 에이전트 스냅샷 (카드별 한 줄)

| 키 | 역할 |
|----|------|
| pm | 요구사항·우선순위·PRD 초안 |
| architect | 구조·경계·리스크 |
| frontend | UX·컴포넌트·a11y/반응형 |
| backend | API 계약·검증·에러 모델 |
| qa | 시나리오·회귀·품질 판단 |
| devops | CI/CD·배포·관측 |

상세 미션·프롬프트·산출물은 `AGENTS` 배열 원문을 본다.

## 로컬 작업 공간

다단계 하네스 스타일 메모와 중간 산출은 `_workspace/` 를 쓴다(저장소에 커밋하지 않음).

## Cursor 규칙 (자동 적용·경로별)

프로젝트 AI 규칙은 `.cursor/rules/*.mdc` 에 정리되어 있다.

| 파일 | 용도 |
|------|------|
| `six-agents-lab-core.mdc` | 전체 세션 공통(SSOT, 하네스·검증 루프) |
| `story-data-agents-pages.mdc` | `story-data`, `/agents`, `/timeline` |
| `next-app-ui.mdc` | `app/**/*.tsx`, `components/**/*.tsx` |
| `api-route-handlers.mdc` | `app/api/**/*.ts` |
| `html-audit-domain.mdc` | HTML 감사 라이브러리·페이지·샘플 |
| `design-md-korean.mdc` | 한국형 Design MD 규격 (`data/design-md/RULES.md`, `/design-md`) |
