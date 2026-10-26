/* ============================================================
   PUT & DELETE /api/admin/[collection]/[slug]
   تحديث أو حذف عنصر من Neon عبر لوحة التحكم
   الحماية: ترويسة x-admin-key
   ============================================================ */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { collectionSchema, isAuthorized, isCollection, normalizeSlug } from "@/lib/alemny/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ collection: string; slug: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "غير مصرّح — مفتاح الإدارة مطلوب" }, { status: 401 });
  }

  const { collection, slug } = await ctx.params;
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
    let updated: unknown;
    switch (collection) {
      case "articles":
        updated = await db.article.update({ where: { slug }, data: data as never });
        break;
      case "prompts":
        updated = await db.prompt.update({ where: { slug }, data: data as never });
        break;
      case "tutorials":
        updated = await db.tutorial.update({ where: { slug }, data: data as never });
        break;
      case "tools":
        updated = await db.aiTool.update({ where: { slug }, data: data as never });
        break;
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "خطأ غير معروف";
    const notFound = msg.includes("Record to update not found");
    const conflict = msg.includes("Unique constraint");
    return NextResponse.json(
      { ok: false, error: conflict ? "السلاغ الجديد مستخدم مسبقًا" : notFound ? "العنصر غير موجود" : msg },
      { status: conflict ? 409 : notFound ? 404 : 500 },
    );
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "غير مصرّح — مفتاح الإدارة مطلوب" }, { status: 401 });
  }

  const { collection, slug } = await ctx.params;
  if (!isCollection(collection)) {
    return NextResponse.json({ ok: false, error: "مجموعة غير معروفة" }, { status: 404 });
  }

  try {
    switch (collection) {
      case "articles":
        await db.article.delete({ where: { slug } });
        break;
      case "prompts":
        await db.prompt.delete({ where: { slug } });
        break;
      case "tutorials":
        await db.tutorial.delete({ where: { slug } });
        break;
      case "tools":
        await db.aiTool.delete({ where: { slug } });
        break;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "خطأ غير معروف";
    const notFound = msg.includes("Record to delete does not exist");
    return NextResponse.json({ ok: false, error: notFound ? "العنصر غير موجود" : msg }, { status: notFound ? 404 : 500 });
  }
}
