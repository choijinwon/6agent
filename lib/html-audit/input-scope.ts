/**
 * v1: 업로드된 HTML 문자열만 분석 대상.
 * URL 기반 Lighthouse는 네트워크·Headless Chrome·별도 워커가 필요하므로 이 저장소 데모 범위 밖;
 * {@link import("./lighthouse")} 는 확장 훅만 둡니다.
 */
export const INPUT_SCOPE = "html_string_only" as const;

export type InputScope = typeof INPUT_SCOPE;
