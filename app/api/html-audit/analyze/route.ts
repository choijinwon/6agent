import { NextResponse } from "next/server";

import { analyzeHtmlContent } from "@/lib/html-audit/analyze";

export const runtime = "nodejs";

const MAX_BYTES = 500_000;

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let html = "";

  if (contentType.includes("application/json")) {
    const body = (await req.json()) as { html?: unknown };
    html = typeof body.html === "string" ? body.html : "";
  } else if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (file instanceof File) {
      html = await file.text();
    } else {
      const raw = form.get("html");
      html = typeof raw === "string" ? raw : "";
    }
  } else {
    return NextResponse.json(
      { error: "Content-Type 은 application/json 또는 multipart/form-data 만 지원합니다." },
      { status: 415 }
    );
  }

  if (!html.trim()) {
    return NextResponse.json({ error: "HTML 내용이 비어 있습니다." }, { status: 400 });
  }

  if (html.length > MAX_BYTES) {
    return NextResponse.json(
      { error: `HTML 크기는 약 ${MAX_BYTES}자 이하로 제한합니다.` },
      { status: 413 }
    );
  }

  try {
    const data = await analyzeHtmlContent(html);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
