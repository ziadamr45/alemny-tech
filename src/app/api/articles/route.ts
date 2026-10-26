/* ============================================================
   GET /api/articles — المقالات التقنية الحية من Neon PostgreSQL
   ------------------------------------------------------------
   • ?limit=3   → أحدث ٣ مقالات (للمعاينة في الرئيسية)
   • ?featured=1 → المقالات المميزة فقط
   Graceful fallback: إن فشل الاتصال تُعاد البيانات المحلية
   مع source=fallback فلا تنكسر الواجهة أبدًا.
   ============================================================ */

import { NextResponse } from "next/server";
import { getArticles } from "@/lib/alemny/server-content";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? 0);
  const featuredOnly = searchParams.get("featured") === "1";

  const { source, data } = await getArticles();

  let items = data;
  if (featuredOnly) items = items.filter((a) => a.featured);
  if (limitParam > 0) items = items.slice(0, limitParam);

  return NextResponse.json(
    { source, count: items.length, data: items },
    { headers: { "Cache-Control": "no-store" } },
  );
}
