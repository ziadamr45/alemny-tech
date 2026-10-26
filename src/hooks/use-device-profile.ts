"use client";

/* ============================================================
   useDeviceProfile — نظام التعرّف العالمي على الجهاز (V3)
   ------------------------------------------------------------
   طبقة واحدة مركزية يستهلكها أي مكوّن يحتاج أن يتكيّف مع:
   • حجم الشاشة (طبقات formFactor من موبايل ضيّق 320px حتى شاشات 4K/TV)
   • نمط الإدخال (لمس / فأرة / ريموت تلفاز)
   • الاتجاه (طولي / عرضي)
   آمن أثناء SSR: القيم الافتراضية تُرسم قبل الترطيب ثم تتحدث
   داخل useEffect فقط — صفر اختلاف hydration.
   ============================================================ */

import { useEffect, useState } from "react";

export type DeviceFormFactor =
  | "mobile-compact" // < 390px
  | "mobile" // 390–639px
  | "tablet-portrait" // 640–899px
  | "tablet-landscape" // 900–1199px
  | "laptop" // 1200–1535px
  | "desktop-wide" // 1536–2559px
  | "smart-tv-4k"; // ≥ 2560px

export type DeviceInputMode = "touch" | "mouse" | "keyboard";
export type DeviceOrientation = "portrait" | "landscape";

export interface DeviceProfile {
  width: number;
  height: number;
  formFactor: DeviceFormFactor;
  inputMode: DeviceInputMode;
  orientation: DeviceOrientation;
  isTouch: boolean;
  /** false أثناء العرض على الخادم — يتحدث إلى true بعد أول ترطيب */
  mounted: boolean;
}

/** الحالة الافتراضية الآمنة للخادم (لابتوب افتراضي، فأرة، بدون لمس) */
const DEFAULT_PROFILE: DeviceProfile = {
  width: 1024,
  height: 1024,
  formFactor: "laptop",
  inputMode: "mouse",
  orientation: "portrait",
  isTouch: false,
  mounted: false,
};

/** أنماط userAgent الخاصة بأجهزة التلفاز الذكي (ريموت D-Pad) */
const TV_UA_PATTERN = /TV|SmartTV|GoogleTV|AppleTV|DIAL/i;

function classifyFormFactor(width: number): DeviceFormFactor {
  if (width < 390) return "mobile-compact";
  if (width < 640) return "mobile";
  if (width < 900) return "tablet-portrait";
  if (width < 1200) return "tablet-landscape";
  if (width < 1536) return "laptop";
  if (width < 2560) return "desktop-wide";
  return "smart-tv-4k";
}

/** قراءة فريعة آمنة — تُستدعى داخل المتصفح فقط */
function readDeviceProfile() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const coarse = window.matchMedia("(pointer: coarse)");
  const isTouch = coarse.matches;
  let inputMode: DeviceInputMode = isTouch ? "touch" : "mouse";
  if (navigator.maxTouchPoints === 0 && TV_UA_PATTERN.test(navigator.userAgent)) {
    inputMode = "keyboard";
  }
  return {
    width,
    height,
    formFactor: classifyFormFactor(width),
    inputMode,
    orientation: (height >= width ? "portrait" : "landscape") as DeviceOrientation,
    isTouch,
  };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    /* حد التحديث عبر rAF: حدود غير متزامنة + قياسات متسقة بعد الرسم */
    let raf = 0;
    const update = () => {
      raf = 0;
      setProfile({ ...readDeviceProfile(), mounted: true });
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    schedule();

    const coarse = window.matchMedia("(pointer: coarse)");
    const onChange = () => schedule();
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });
    coarse.addEventListener?.("change", onChange);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      coarse.removeEventListener?.("change", onChange);
    };
  }, []);

  return profile;
}
