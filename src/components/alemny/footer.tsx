"use client";

import { Mail, Heart, ArrowUp, Send, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlemnyLogo, PlatformIcon } from "./logo";
import { BRAND, NAV_LINKS, SOCIALS, ADMIN_PATH } from "@/lib/alemny/constants";
import { useAlemnyStore } from "@/lib/alemny/store";

export function CommunityFooter() {
  const year = "٢٠٢٦";
  const source = useAlemnyStore((s) => s.source);
  const hydrated = useAlemnyStore((s) => s.hydrated);
  const hydrating = useAlemnyStore((s) => s.hydrating);

  const dbLabel = hydrating
    ? "جارٍ الاتصال بقاعدة بيانات Neon…"
    : hydrated && source === "database"
      ? "المحتوى مباشر الآن من قاعدة بيانات Neon PostgreSQL"
      : "الوضع الاحتياطي السريع — يعمل ببيانات المنصة المحلية";

  return (
    <footer className="relative mt-auto border-t border-alemny-purple/25 bg-[#060409]/95 pb-8 pt-14" aria-label="تذييل المنصة والتواصل الرسمي">
      {/* توهج علوي */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-alemny-purple/70 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* الصف الرئيسي */}
        <div className="mb-12 grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          {/* الهوية + البريد */}
          <div>
            <div className="mb-4 flex items-center gap-3.5">
              <AlemnyLogo size={64} glow />
              <div>
                <p className="font-display text-2xl font-bold text-white">{BRAND.ar}</p>
                <p className="font-en text-xs tracking-widest text-alemny-purple">
                  {BRAND.en} —{" "}
                  <span dir="ltr" className="inline-block">
                    {BRAND.handle}
                  </span>
                </p>
              </div>
            </div>
            <p className="mb-6 max-w-md text-[13.5px] leading-8 text-alemny-muted">{BRAND.slogan} — محتوى عربي أصيل ينقلك من النظرية إلى النتيجة.</p>

            <a
              href={`mailto:${BRAND.email}`}
              className="glass glass-hover group inline-flex items-center gap-3 rounded-2xl px-5 py-3.5"
              aria-label={`أرسل بريدًا إلكترونيًّا إلى ${BRAND.email}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac transition-transform group-hover:scale-110">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-[11px] text-alemny-muted">البريد الرسمي</span>
                <span dir="ltr" className="block font-en text-[13px] font-bold text-white">{BRAND.email}</span>
              </span>
              <Send className="mr-2 h-4 w-4 text-alemny-purple transition-transform group-hover:-translate-x-1" aria-hidden />
            </a>
          </div>

          {/* بطاقات المنصات */}
          <div>
            <p className="mb-4 text-[15px] font-bold text-white">تابعنا أينما كنت — مجتمع علَّمني تِك الرسمي</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-hover group flex flex-col items-center gap-2.5 rounded-3xl p-4 text-center"
                  aria-label={`تابع علَّمني تِك على ${social.label}`}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110"
                    style={{ borderColor: `${social.color}44`, backgroundColor: `${social.color}14`, color: social.color }}
                  >
                    <PlatformIcon id={social.id} size={22} />
                  </span>
                  <span className="text-[13px] font-bold text-white">{social.label}</span>
                  <span className="font-en text-[10px] text-alemny-muted">{social.labelEn}</span>
                  <span className="text-[10.5px] leading-4 text-alemny-muted">{social.description}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* روابط سريعة */}
        <nav className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-alemny-purple/15 pt-8" aria-label="روابط سريعة لصفحات المنصة">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold text-alemny-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ADMIN_PATH}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-alemny-muted transition-colors hover:text-alemny-emerald"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-alemny-emerald" aria-hidden />
            لوحة التحكم
          </Link>
        </nav>

        {/* الشريط السفلي */}
        <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-right">
          <p className="text-[12.5px] text-alemny-muted">
            © {year} <span className="font-bold text-white">{BRAND.ar}</span> — جميع الحقوق محفوظة
          </p>
          <span
            className="glass-soft inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-alemny-muted"
            role="status"
            aria-live="polite"
          >
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${
                hydrated && source === "database"
                  ? "animate-pulse bg-alemny-emerald shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                  : "bg-alemny-purple shadow-[0_0_8px_rgba(128,70,233,0.8)]"
              }`}
            />
            {dbLabel}
          </span>
          <p className="flex items-center gap-1.5 text-[12.5px] text-alemny-muted">
            صُنع بشغف لجيل التقنية العربية
            <Heart className="h-3.5 w-3.5 fill-alemny-purple text-alemny-purple" aria-hidden />
            <span dir="ltr" className="inline-block font-en text-alemny-purple">
              {BRAND.handle}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------- زر العودة للأعلى --------------------------- */

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="glass fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border-alemny-purple/60 text-alemny-lilac shadow-[0_0_26px_rgba(128,70,233,0.4)] transition-colors hover:text-white"
          aria-label="العودة إلى أعلى الصفحة"
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
