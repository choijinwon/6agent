import { NextResponse } from "next/server";

import { generateKoreanDesignMd } from "@/lib/design-md/generate-design-md";
import type { CssStack, DesignMdRequest } from "@/lib/design-md/types";

export const runtime = "nodejs";

const MAX_FIELD = 280;

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type은 application/json이어야 합니다." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON 본문을 파싱할 수 없습니다." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const productName = typeof b.productName === "string" ? b.productName.slice(0, MAX_FIELD) : "";
  const stackRaw = typeof b.stack === "string" ? b.stack : "";
  const stack = (stackRaw === "tailwind" ? "tailwind" : "bootstrap") as CssStack;
  const brandPrimaryHex =
    typeof b.brandPrimaryHex === "string" ? b.brandPrimaryHex.slice(0, 12) : undefined;
  const verticalTone =
    typeof b.verticalTone === "string" ? b.verticalTone.slice(0, MAX_FIELD) : undefined;

  if (!productName.trim()) {
    return NextResponse.json({ error: "productName은 필수입니다." }, { status: 400 });
  }

  const input: DesignMdRequest = {
    productName,
    stack,
    brandPrimaryHex,
    verticalTone,
  };

  const { markdown, filename } = generateKoreanDesignMd(input);
  return NextResponse.json({ markdown, filename });
}
