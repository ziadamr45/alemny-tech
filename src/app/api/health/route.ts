import { NextResponse } from "next/server";

import { getDbHealth } from "@/lib/alemny/server-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/health — Neon connectivity + row counts (observability) */
export async function GET() {
  const health = await getDbHealth();
  return NextResponse.json(health, {
    status: health.database === "connected" ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
