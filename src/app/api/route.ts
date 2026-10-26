import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** API index — علَّمني تِك live content endpoints */
export async function GET() {
  return NextResponse.json({
    name: "علَّمني تِك — Alemny Tech API",
    version: "1.0.0",
    endpoints: {
      prompts: "/api/prompts",
      copyPrompt: "/api/prompts/{slug}/copy (POST)",
      tools: "/api/tools",
      versus: "/api/versus",
      tutorials: "/api/tutorials",
      health: "/api/health",
    },
  });
}
