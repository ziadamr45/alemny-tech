import { NextResponse } from "next/server";

import { getTutorials } from "@/lib/alemny/server-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/tutorials — live tutorials hub (Neon → static fallback) */
export async function GET() {
  const result = await getTutorials();
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
