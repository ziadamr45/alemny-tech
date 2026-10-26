"use client";

/* ============================================================
   شريط التنقل العلوي — Sticky 3D Glass Navbar (V2)
   معمارية متعددة الصفحات: روابط <Link> مع تمييز المسار النشط.
   إصلاح RTL: كل المقابض والروابط الإنجليزية داخل dir="ltr".
   ============================================================ */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Youtube, Menu, X, Command, ShieldCheck } from "lucide-react";
import { AlemnyLogo, PlatformIcon } from "./logo";
import { BRAND, NAV_LINKS, SOCIALS } from "@/lib/alemny/constants";

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
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        {/* الهوية — يمين (بداية RTL) */}
        <Link href="/" className="group flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية — علَّمني تِك">
          <span className="relative">
            <AlemnyLogo size={46} glow />
            <span className="absolute inset-0 -z-10 rounded-full bg-alemny-purple/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-white md:text-xl">{BRAND.ar}</span>
            <span dir="ltr" className="inline-block font-en text-[11px] font-medium tracking-wider text-alemny-purple">
              {BRAND.handle}
            </span>
          </span>
        </Link>

        {/* التنقل — الوسط */}
        <nav aria-label="التنقل الرئيسي بين صفحات المنصة" className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-3 py-2 text-[13.5px] font-semibold transition-colors duration-300 ${
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

        {/* البحث + قناة يوتيوب — يسار (نهاية RTL) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="glass-soft glass-hover group flex h-10 items-center gap-2 rounded-full px-3.5 text-sm text-alemny-muted hover:text-white md:px-4"
            aria-label="بحث فوري في كل محتوى المنصة (Ctrl + K)"
          >
            <Search className="h-4 w-4 text-alemny-lilac" aria-hidden />
            <span className="hidden md:inline">بحث فوري</span>
            <kbd className="hidden items-center gap-0.5 rounded-md border border-alemny-purple/40 bg-[#120E22] px-1.5 py-0.5 font-en text-[10px] text-alemny-muted md:inline-flex">
              <Command className="h-2.5 w-2.5" aria-hidden /> K
            </kbd>
          </button>

          <a
            href={SOCIALS[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-bold text-white sm:flex"
            aria-label="زيارة قناة علَّمني تِك على يوتيوب"
          >
            <Youtube className="h-4.5 w-4.5" aria-hidden />
            قناة يوتيوب
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="glass-soft flex h-10 w-10 items-center justify-center rounded-full text-white xl:hidden"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-alemny-purple/25 bg-[#0B0814]/97 backdrop-blur-2xl xl:hidden"
            aria-label="قائمة التنقل للموبايل"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "border border-alemny-purple/50 bg-alemny-purple/15 text-white"
                        : "text-alemny-muted hover:bg-alemny-purple/10 hover:text-white"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive("/admin")
                    ? "border border-alemny-emerald/50 bg-alemny-emerald/10 text-white"
                    : "text-alemny-muted hover:bg-alemny-emerald/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-alemny-emerald" aria-hidden />
                  لوحة التحكم
                </span>
              </Link>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={SOCIALS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
                >
                  <Youtube className="h-4 w-4" aria-hidden /> قناة يوتيوب
                </a>
                {SOCIALS.slice(1).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-soft glass-hover flex h-11 w-11 items-center justify-center rounded-xl text-alemny-muted"
                    aria-label={`تابعنا على ${s.label}`}
                  >
                    <PlatformIcon id={s.id} size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
