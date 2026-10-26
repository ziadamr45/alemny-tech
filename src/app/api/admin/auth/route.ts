/* ============================================================
   POST /api/admin/auth — التحقق من مفتاح لوحة التحكم
   الجسم: { key: string } → { ok: true } | 401
   ============================================================ */

import { NextResponse } from "next/server";
import { getAdminKey } from "@/lib/alemny/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { key?: string };
    const provided = (body.key ?? "").trim();
    const expected = getAdminKey();
    if (provided && provided.length === expected.length) {
      let diff = 0;
      for (let i = 0; i < expected.length; i++) {
        diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
      }
      if (diff === 0) return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "مفتاح غير صحيح" }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
