import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** المفتاح العام VAPID — يحتاجه المتصفح للاشتراك في الإشعارات */
export function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return NextResponse.json(
      { error: "push_disabled" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }

  return NextResponse.json(
    { publicKey },
    { headers: { "cache-control": "no-store" } },
  );
}
