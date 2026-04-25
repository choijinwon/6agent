import { JSDOM } from "jsdom";

/**
 * 결정론적 자동 수정(보수적). 사용자는 diff로 검토한 뒤 제목·설명·alt 문구를 다듬습니다.
 */
export function applyAutoFixes(html: string): { html: string; notes: string[] } {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const notes: string[] = [];

  const htmlEl = doc.documentElement;
  if (!htmlEl.getAttribute("lang")?.trim()) {
    htmlEl.setAttribute("lang", "ko");
    notes.push("`<html lang=\"ko\">` 추가 (필요 시 언어 코드를 바꾸세요).");
  }

  const titleEl = doc.querySelector("title");
  if (!titleEl || !titleEl.textContent?.trim()) {
    let head = doc.querySelector("head");
    if (!head) {
      head = doc.createElement("head");
      doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
    }
    if (titleEl) {
      titleEl.textContent = "제목을 입력하세요";
    } else {
      const t = doc.createElement("title");
      t.textContent = "제목을 입력하세요";
      head.appendChild(t);
    }
    notes.push("빈 `<title>` 을 채웠습니다 — 문구를 수정하세요.");
  }

  if (!doc.querySelector('meta[name="description"]')) {
    let head = doc.querySelector("head");
    if (!head) {
      head = doc.createElement("head");
      doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
    }
    const m = doc.createElement("meta");
    m.setAttribute("name", "description");
    m.setAttribute("content", "페이지 설명을 입력하세요.");
    head.appendChild(m);
    notes.push("`meta name=description` 추가 — 내용을 수정하세요.");
  } else {
    for (const m of doc.querySelectorAll('meta[name="description"]')) {
      const c = m.getAttribute("content")?.trim();
      if (!c) {
        m.setAttribute("content", "페이지 설명을 입력하세요.");
        notes.push("빈 description content 를 플레이스홀더로 채웠습니다.");
      }
    }
  }

  doc.querySelectorAll("img:not([alt])").forEach((img) => {
    img.setAttribute("alt", "");
    notes.push("`img` 에 `alt=\"\"` 부여(장식 이미지 가정). 의미가 있으면 설명을 넣으세요.");
  });

  return { html: dom.serialize(), notes: [...new Set(notes)] };
}
