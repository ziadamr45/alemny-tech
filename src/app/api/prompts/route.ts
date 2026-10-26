import { NextResponse } from "next/server";

import { getPrompts } from "@/lib/alemny/server-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/prompts — live prompt vault (Neon → static fallback) */
export async function GET() {
  const result = await getPrompts();
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
