import { NextResponse } from "next/server";

import { getTools } from "@/lib/alemny/server-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/tools — live 2026 AI tools directory (Neon → static fallback) */
export async function GET() {
  const result = await getTools();
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
