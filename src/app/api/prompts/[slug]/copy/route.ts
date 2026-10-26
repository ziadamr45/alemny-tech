import { NextResponse } from "next/server";

import { incrementPromptCopies } from "@/lib/alemny/server-content";

export const dynamic = "force-dynamic";

/**
 * POST /api/prompts/[slug]/copy
 * Increments copiesCount in Neon every time a user clicks «نسخ البرومبت».
 * Always answers 200 with { ok } so the client can degrade gracefully.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const result = await incrementPromptCopies(slug);
  return NextResponse.json(
    { ...result, slug },
    { headers: { "Cache-Control": "no-store" } },
  );
}
