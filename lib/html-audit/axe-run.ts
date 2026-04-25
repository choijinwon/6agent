import { readFileSync } from "node:fs";
import { join } from "node:path";

import { JSDOM } from "jsdom";

import type { AxeResults } from "axe-core";

import type { AxeRunOutcome } from "./types";

function loadAxeSource(): string {
  const p = join(process.cwd(), "node_modules", "axe-core", "axe.min.js");
  return readFileSync(p, "utf8");
}

/**
 * JSDOM에 axe를 주입해 접근성 위반을 수집합니다.
 * 일부 룰은 가상 DOM에서 완벽하지 않을 수 있으나, 업로드 HTML 점검에 충분한 경우가 많습니다.
 */
export async function runAxeOnHtml(html: string): Promise<AxeRunOutcome> {
  try {
    const source = loadAxeSource();
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
    });
    const win = dom.window as unknown as {
      eval: (code: string) => void;
      axe: { run: (context?: Node, options?: object) => Promise<AxeResults> };
    };
    win.eval(source);
    if (!win.axe || typeof win.axe.run !== "function") {
      return { ok: false, error: "axe not bound after eval" };
    }
    const results = await win.axe.run();
    return { ok: true, results };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}
