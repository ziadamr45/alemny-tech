import { NextResponse } from "next/server";

import { getVersusMissions } from "@/lib/alemny/server-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/versus — live Versus missions (Neon → static fallback) */
export async function GET() {
  const result = await getVersusMissions();
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
