"use client";

/* ============================================================
   زر تفعيل إشعارات علَّمني تِك — Web Push حقيقي (VAPID)
   نقرة واحدة: إذن + تسجيل Service Worker + اشتراك في قاعدة البيانات
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from "react";
import { BellRing, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

type PushState = "idle" | "loading" | "subscribed" | "unsupported" | "denied";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

async function getPushPublicKey(): Promise<string | null> {
  try {
    const res = await fetch("/api/push/key", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { publicKey?: string };
    return data.publicKey ?? null;
  } catch {
    return null;
  }
}

async function saveSubscription(sub: PushSubscription) {
  const json = sub.toJSON();
  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: json.keys,
      userAgent: navigator.userAgent.slice(0, 512),
      role: "visitor",
    }),
  });
}

async function removeSubscription(endpoint: string) {
  await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });
}

export function PushSubscribeButton({ className = "" }: { className?: string }) {
  const [state, setState] = useState<PushState>("idle");
  const subscriptionRef = useRef<PushSubscription | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(async () => {
      const supported =
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;
      if (cancelled) return;
      if (!supported) {
        setState("unsupported");
        return;
      }
      try {
        const registration = await navigator.serviceWorker.getRegistration("/sw.js");
        const existing = registration
          ? await registration.pushManager.getSubscription()
          : null;
        if (cancelled) return;
        if (existing) {
          subscriptionRef.current = existing;
          setState("subscribed");
        }
      } catch {
        /* keep idle */
      }
      if (!cancelled) setMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const subscribe = useCallback(async () => {
    if (state === "loading") return;
    setState("loading");

    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setState("idle");
        toast.error("الإشعارات محظورة من إعدادات المتصفح — فعّلها أولًا ثم أعد المحاولة");
        return;
      }

      const publicKey = await getPushPublicKey();
      if (!publicKey) {
        setState("idle");
        toast.error("خدمة الإشعارات غير متاحة حاليًا — جرّب لاحقًا");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      await saveSubscription(subscription);
      subscriptionRef.current = subscription;
      setState("subscribed");
      toast.success("تم تفعيل إشعارات علَّمني تِك ✨ ستصلك أخبار المنصة فور نشرها");
    } catch (error) {
      setState("idle");
      toast.error("تعذّر تفعيل الإشعارات على هذا الجهاز — تأكد من المتصفح وأعد المحاولة");
      if (process.env.NODE_ENV !== "production") {
        console.error("[push] subscribe failed", error);
      }
    }
  }, [state]);

  const unsubscribe = useCallback(async () => {
    const sub = subscriptionRef.current;
    if (!sub) return;
    setState("loading");
    try {
      await removeSubscription(sub.endpoint);
      await sub.unsubscribe();
      subscriptionRef.current = null;
      setState("idle");
      toast.info("تم إيقاف الإشعارات — يمكنك تفعيلها في أي وقت");
    } catch {
      setState("subscribed");
      toast.error("تعذّر إيقاف الإشعارات الآن");
    }
  }, []);

  if (state === "unsupported") {
    return null;
  }

  const subscribed = state === "subscribed";

  return (
    <button
      type="button"
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={state === "loading" || (!mounted && state === "idle")}
      aria-label={
        subscribed ? "إيقاف إشعارات علَّمني تِك" : "تفعيل إشعارات علَّمني تِك"
      }
      className={`obsidian-btn group relative overflow-hidden font-bold transition-all ${
        subscribed
          ? "border-emerald-400/40 text-emerald-200"
          : "border-[#A855F7]/50 text-white hover:shadow-[0_0_28px_-4px_rgba(168,85,247,0.65)]"
      } ${className}`}
    >
      {!subscribed && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(60%_120%_at_50%_0%,rgba(168,85,247,0.35),transparent_70%)]"
        />
      )}
      {state === "loading" ? (
        <Loader2 className="h-[18px] w-[18px] animate-spin" strokeWidth={1.75} />
      ) : subscribed ? (
        <Check className="h-[18px] w-[18px]" strokeWidth={2} />
      ) : (
        <BellRing className="h-[18px] w-[18px] animate-[pulse_2.4s_ease-in-out_infinite]" strokeWidth={1.75} />
      )}
      <span className="relative">
        {subscribed ? "الإشعارات مفعّلة" : "تفعيل إشعارات علَّمني تِك"}
      </span>
    </button>
  );
}
