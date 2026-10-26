"use client";

/* ============================================================
   تذييل المنصة — Community Footer (V3)
   • هوية + بريد رسمي + روابط الصفحات + المنصات الرسمية.
   • شبكة متجاوبة كاملة: عمود واحد → عمودان → ٤ أعمدة.
   • شريط سفلي: الحقوق + توقيع المطوّر.
   (بدون أي مصطلحات تقنية داخلية — زوار فقط)
   ============================================================ */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Mail, Send, Youtube } from "lucide-react";
import { BrandLogo, PlatformIcon } from "./brand-logo";
import { BRAND, NAV_LINKS, SOCIALS, DEVELOPER_NAME, DEVELOPER_SITE_URL, YOUTUBE_CTA_LABEL } from "@/lib/alemny/constants";

export function CommunityFooter() {
  const year = "٢٠٢٦";

  return (
    <footer className="relative mt-auto border-t border-alemny-purple/25 bg-[#060409]/95 pb-8 pt-14" aria-label="تذييل المنصة والتواصل الرسمي">
      {/* توهج علوي */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-alemny-purple/70 to-transparent" aria-hidden />

      <div className="alemny-shell">
        {/* الأعمدة الرئيسية */}
        <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* العمود ١ — الهوية + البريد */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3.5">
              <BrandLogo size={44} />
              <div className="min-w-0">
                <p className="font-display text-xl font-bold text-white">{BRAND.ar}</p>
                <p dir="ltr" className="inline-block font-mono text-[11px] font-medium tracking-wider text-alemny-purple">
                  {BRAND.handle}
                </p>
              </div>
            </div>
            <p className="mb-5 text-[13px] leading-7 text-alemny-muted">{BRAND.slogan} — بمحتوى عربي ينقلك من النظرية إلى النتيجة.</p>

            <a
              href={`mailto:${BRAND.email}`}
              className="glass glass-hover group inline-flex max-w-full items-center gap-3 rounded-2xl px-4 py-3"
              aria-label={`أرسل بريدًا إلكترونيًّا إلى ${BRAND.email}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac transition-transform group-hover:scale-110">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] text-alemny-muted">البريد الرسمي</span>
                <span dir="ltr" className="block truncate font-mono text-[12.5px] font-bold text-white">
                  {BRAND.email}
                </span>
              </span>
              <Send className="h-4 w-4 shrink-0 text-alemny-purple transition-transform group-hover:-translate-x-1" aria-hidden />
            </a>
          </div>

          {/* العمود ٢ — صفحات المنصة */}
          <nav className="min-w-0" aria-label="روابط صفحات المنصة في التذييل">
            <p className="mb-4 text-[15px] font-bold text-white">صفحات المنصة</p>
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-[40px] items-center gap-2 rounded-lg px-2 text-[13.5px] font-semibold text-alemny-muted transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-alemny-purple/70" aria-hidden />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* العمود ٣ — المنصات الرسمية */}
          <div className="min-w-0">
            <p className="mb-4 text-[15px] font-bold text-white">منصاتنا الرسمية</p>
            <ul className="space-y-2">
              {SOCIALS.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-soft glass-hover group flex min-h-[52px] items-center gap-3 rounded-2xl px-3"
                    aria-label={`تابع علَّمني تِك على ${social.label}`}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-110"
                      style={{ borderColor: `${social.color}55`, backgroundColor: `${social.color}18`, color: social.color }}
                    >
                      <PlatformIcon id={social.id} size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-bold text-white">{social.label}</span>
                      <span className="block truncate text-[10.5px] text-alemny-muted">{social.description}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود ٤ — دعوة القناة */}
          <div className="min-w-0">
            <p className="mb-4 text-[15px] font-bold text-white">شروحات فيديو كل أسبوع</p>
            <p className="mb-5 text-[13px] leading-7 text-alemny-muted">
              خطوات تطبيقية مصوّرة على قناتنا الرسمية — من إعداد الأدوات إلى النتيجة النهائية، خطوة بخطوة وبالعربية.
            </p>
            <a
              href={SOCIALS[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="obsidian-btn obsidian-btn-primary w-full text-sm"
              aria-label={`${YOUTUBE_CTA_LABEL} — اشترك الآن`}
            >
              <Youtube className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
              {YOUTUBE_CTA_LABEL}
            </a>
            <p dir="ltr" className="mt-3 inline-block rounded-full border border-alemny-purple/35 bg-alemny-purple/10 px-3 py-1 font-mono text-[11px] font-bold text-alemny-lilac">
              {BRAND.handle}
            </p>
          </div>
        </div>

        {/* الشريط السفلي */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-alemny-purple/15 pt-7 text-center md:flex-row md:text-right">
          <p className="text-[12.5px] text-alemny-muted">
            © {year} <span className="font-bold text-white">{BRAND.ar}</span> — جميع الحقوق محفوظة
          </p>
          <p className="text-[12.5px] text-alemny-muted">
            تم التطوير بواسطة{" "}
            <a
              href={DEVELOPER_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#A855F7] underline underline-offset-4 transition-colors hover:text-white"
            >
              {DEVELOPER_NAME}
            </a>
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
          className="glass fixed bottom-24 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border-alemny-purple/60 text-alemny-lilac shadow-[0_0_26px_rgba(128,70,233,0.4)] transition-colors hover:text-white lg:bottom-6 lg:left-6"
          aria-label="العودة إلى أعلى الصفحة"
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
