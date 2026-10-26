"use client";

/* ============================================================
   شريط التنقل العلوي — Sticky Obsidian Glass Navbar (V3)
   • الهوية: الشعار الرسمي الدائري + الاسم — لا تفيض عند 320px.
   • روابط سطح المكتب تظهر من lg مع كبسولة نشطة متحركة.
   • زر يوتيوب أوبسيديان أساسي (نصه يختفي دون sm لصالح الأيقونة).
   • زر البحث Ctrl+K — أيقوني دون xl ليتسع الشريط بين lg و xl.
   • قائمة الجوال: ورقة زجاجية كاملة بصفوف ارتفاعها 52px.
   ============================================================ */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Youtube, Menu, X, Command } from "lucide-react";
import { BrandLogo, PlatformIcon } from "./brand-logo";
import { BRAND, NAV_LINKS, SOCIALS, YOUTUBE_CTA_LABEL } from "@/lib/alemny/constants";
import { PushSubscribeButton } from "./push-subscribe-button";

interface NavbarProps {
  onOpenSearch: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /* خلفية أكثر كثافة عند التمرير */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* اختصار لوحة المفاتيح Ctrl + K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenSearch]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-alemny-purple/30 bg-[#0B0814]/88 shadow-[0_8px_40px_-12px_rgba(128,70,233,0.45)] backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[2000px] items-center justify-between gap-2 px-3 sm:px-4 md:gap-3 md:px-6">
        {/* الهوية — يمين (بداية RTL) — كتلة لا تنكمش ولا تفيض عند 320px */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 md:gap-3"
          aria-label="العودة إلى الصفحة الرئيسية — علَّمني تِك"
        >
          <BrandLogo size={38} />
          <span className="font-display text-base font-bold text-white sm:text-lg md:text-xl">{BRAND.ar}</span>
        </Link>

        {/* التنقل — الوسط (سطح المكتب فقط) */}
        <nav aria-label="التنقل الرئيسي بين صفحات المنصة" className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex min-h-[44px] items-center rounded-full px-3 text-sm font-semibold transition-colors duration-300 ${
                  active ? "text-white" : "text-alemny-muted hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-alemny-purple/50 bg-alemny-purple/15 shadow-[0_0_18px_rgba(128,70,233,0.35)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* البحث + يوتيوب + قائمة الجوال — يسار (نهاية RTL) */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* البحث الفوري — أيقوني دون xl حتى تتسع الروابط بين lg و xl */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="glass-soft glass-hover flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-full px-2.5 text-sm text-alemny-muted hover:text-white xl:px-3"
            aria-label="بحث فوري في كل محتوى المنصة (Ctrl + K)"
          >
            <Search className="h-4 w-4 text-alemny-lilac" aria-hidden />
            <span className="hidden xl:inline">بحث فوري</span>
            <kbd className="hidden items-center gap-0.5 rounded-md border border-alemny-purple/40 bg-[#120E22] px-1.5 py-0.5 font-en text-[10px] text-alemny-muted xl:inline-flex">
              <Command className="h-2.5 w-2.5" aria-hidden /> K
            </kbd>
          </button>

          {/* زر القناة الرسمي — النص يختفي دون sm ويبقى الزر دائمًا */}
          <a
            href={SOCIALS[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="obsidian-btn obsidian-btn-primary px-2.5 text-sm sm:px-4"
            aria-label={`${YOUTUBE_CTA_LABEL} — اشترك الآن`}
          >
            <Youtube className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">{YOUTUBE_CTA_LABEL}</span>
          </a>

          {/* تفعيل الإشعارات — يظهر من lg في الشريط العلوي */}
          <PushSubscribeButton className="hidden lg:inline-flex text-sm" />

          {/* قائمة الجوال — هدف لمس 48px */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="glass-soft flex h-12 w-12 items-center justify-center rounded-full text-white lg:hidden"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال — ورقة زجاجية عائمة */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden px-3 pb-3 lg:hidden"
            aria-label="قائمة التنقل للموبايل"
          >
            <div className="mx-auto max-w-xl space-y-1.5 rounded-2xl border border-white/10 bg-[#0C0916]/95 p-3 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.8),0_0_0_1px_rgba(128,70,233,0.15)] backdrop-blur-2xl">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.04 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex min-h-[52px] items-center rounded-xl px-4 text-sm font-semibold transition-colors ${
                        active
                          ? "border border-alemny-purple/50 bg-alemny-purple/15 text-white"
                          : "text-alemny-muted hover:bg-white/5 hover:text-white"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.04 * NAV_LINKS.length }}
                className="flex items-center gap-2 pt-1.5"
              >
                <a
                  href={SOCIALS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="obsidian-btn obsidian-btn-primary flex-1 text-sm"
                >
                  <Youtube className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                  {YOUTUBE_CTA_LABEL}
                </a>
                {SOCIALS.slice(1).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-soft glass-hover flex h-12 w-12 items-center justify-center rounded-xl text-alemny-muted"
                    aria-label={`تابعنا على ${s.label}`}
                  >
                    <PlatformIcon id={s.id} size={18} />
                  </a>
                ))}
              </motion.div>
              <PushSubscribeButton className="w-full text-sm" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
