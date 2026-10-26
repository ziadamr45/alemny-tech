/* ============================================================
   POST /api/admin/[collection] — إنشاء عنصر جديد في Neon
   المجموعات: articles | prompts | tutorials | tools
   الحماية: ترويسة x-admin-key
   ============================================================ */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { collectionSchema, isAuthorized, isCollection, normalizeSlug } from "@/lib/alemny/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ collection: string }> };

/* GET — جلب الصفوف الخام للمجموعة (للتحرير في اللوحة) */
export async function GET(request: Request, ctx: Ctx) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "غير مصرّح — مفتاح الإدارة مطلوب" }, { status: 401 });
  }

  const { collection } = await ctx.params;
  if (!isCollection(collection)) {
    return NextResponse.json({ ok: false, error: "مجموعة غير معروفة" }, { status: 404 });
  }

  try {
    let data: unknown;
    switch (collection) {
      case "articles":
        data = await db.article.findMany({ orderBy: { createdAt: "desc" } });
        break;
      case "prompts":
        data = await db.prompt.findMany({ orderBy: { createdAt: "asc" } });
        break;
      case "tutorials":
        data = await db.tutorial.findMany({ orderBy: { createdAt: "asc" } });
        break;
      case "tools":
        data = await db.aiTool.findMany({ orderBy: { createdAt: "asc" } });
        break;
    }
    return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}

export async function POST(request: Request, ctx: Ctx) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "غير مصرّح — مفتاح الإدارة مطلوب" }, { status: 401 });
  }

  const { collection } = await ctx.params;
  if (!isCollection(collection)) {
    return NextResponse.json({ ok: false, error: "مجموعة غير معروفة" }, { status: 404 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON غير صالح" }, { status: 400 });
  }

  const parsed = collectionSchema(collection).safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: `تحقق فشل: ${first?.path.join(".")} — ${first?.message}` },
      { status: 422 },
    );
  }

  const data = { ...parsed.data, slug: normalizeSlug(parsed.data.slug) };

  try {
    let created: unknown;
    switch (collection) {
      case "articles":
        created = await db.article.create({ data: data as never });
        break;
      case "prompts":
        created = await db.prompt.create({ data: data as never });
        break;
      case "tutorials":
        created = await db.tutorial.create({ data: data as never });
        break;
      case "tools":
        created = await db.aiTool.create({ data: data as never });
        break;
    }
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "خطأ غير معروف";
    const conflict = msg.includes("Unique constraint");
    return NextResponse.json(
      { ok: false, error: conflict ? "السلاغ مستخدم مسبقًا — اختر معرّفًا آخر" : msg },
      { status: conflict ? 409 : 500 },
    );
  }
}
