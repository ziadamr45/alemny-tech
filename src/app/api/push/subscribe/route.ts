import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const subscribeSchema = z.object({
  endpoint: z.string().min(20),
  keys: z.object({
    p256dh: z.string().min(10),
    auth: z.string().min(10),
  }),
  userAgent: z.string().max(512).optional(),
  role: z.enum(["visitor", "admin"]).optional(),
});

/** تسجيل اشتراك إشعارات جديد (أو تحديث قائم) */
export async function POST(req: NextRequest) {
  try {
    const parsed = subscribeSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const { endpoint, keys, userAgent, role } = parsed.data;

    const subscription = await db.pushSubscription.upsert({
      where: { endpoint },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent ?? "",
        role: role ?? "visitor",
      },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent ?? "",
        role: role ?? "visitor",
      },
    });

    return NextResponse.json({ ok: true, id: subscription.id });
  } catch {
    return NextResponse.json({ error: "subscribe_failed" }, { status: 500 });
  }
}

/** إلغاء الاشتراك — يحذف السجل عبر endpoint */
export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
    const endpoint = body?.endpoint;

    if (typeof endpoint !== "string" || endpoint.length < 10) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    await db.pushSubscription.deleteMany({ where: { endpoint } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unsubscribe_failed" }, { status: 500 });
  }
}
