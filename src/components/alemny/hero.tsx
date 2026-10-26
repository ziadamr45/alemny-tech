"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Wand2, ArrowDown, BadgeCheck } from "lucide-react";
import { AlemnyLogo, PlatformIcon } from "./logo";
import { BRAND, SOCIALS } from "@/lib/alemny/constants";

const FLOATING_BADGES = [
  { label: "Gemini Notebook", color: "#38BDF8", position: "top-[6%] right-[2%] lg:right-[8%]", delay: "0s", ltr: true },
  { label: "Claude 5.5", color: "#FBBF24", position: "top-[30%] left-[0%] lg:left-[6%]", delay: "1.2s", ltr: true },
  { label: "Veo 3.1", color: "#A855F7", position: "bottom-[22%] right-[4%] lg:right-[10%]", delay: "0.6s", ltr: true },
  { label: "Cursor Agents", color: "#34D399", position: "bottom-[8%] left-[4%] lg:left-[10%]", delay: "1.8s", ltr: true },
];

export function Hero() {
  return (
    <section id="home" aria-label="المقدمة الرئيسية" className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="grid-overlay absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 md:px-6 lg:grid-cols-2 lg:gap-8">
        {/* النص التسويقي */}
        <div className="order-2 text-center lg:order-1 lg:text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-soft mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-alemny-muted"
          >
            <Sparkles className="h-4 w-4 text-alemny-lilac" aria-hidden />
            منصة {BRAND.ar} — <span className="font-en text-alemny-purple">{BRAND.handle}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.4] text-white md:text-[3.2rem] md:leading-[1.35]"
          >
            <span className="text-glow">علَّمني تِك</span>
            <span className="text-gradient-purple"> — كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base leading-9 text-alemny-muted md:text-lg lg:mx-0"
          >
            المنصة العربية المتكاملة التي تنقلك من الكلام النظري إلى النتيجة العملية المبهرة في المذاكرة،
            البرمجة، التصميم، وصناعة المحتوى.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#prompts"
              className="btn-neon inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white sm:whitespace-nowrap"
            >
              <Wand2 className="h-5 w-5" aria-hidden />
              استكشف مكتبة البرومبتات الجاهزة
            </a>
            <a
              href="#tools"
              className="glass glass-hover inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white sm:whitespace-nowrap"
            >
              <BadgeCheck className="h-5 w-5 text-alemny-cyan" aria-hidden />
              دليل أدوات الذكاء الاصطناعي ٢٠٢٦
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <HeroStat value={11} suffix="" label="برومبت هندسي جاهز" />
            <HeroStat value={8} suffix="" label="أدوات موثقة ٢٠٢٦" />
            <HeroStat value={4} suffix="" label="مواجهات Versus عملية" />
            <HeroStat value={100} suffix="٪" label="مجاني — بلا تسجيل" />
          </motion.div>
        </div>

        {/* العرض ثلاثي الأبعاد: الشعار + المنصات المدارة */}
        <div className="order-1 lg:order-2">
          <OrbitShowcase />
        </div>
      </div>

      <motion.a
        href="#prompts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-alemny-muted transition-colors hover:text-white md:flex"
        aria-label="انتقل إلى مكتبة البرومبتات"
      >
        انزل للمحتوى
        <ArrowDown className="h-4 w-4 animate-bounce text-alemny-lilac" aria-hidden />
      </motion.a>
    </section>
  );
}

function HeroStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="glass-soft glass-hover rounded-2xl px-3 py-3.5 text-center">
      <div className="font-display text-2xl font-bold text-white">
        {display}
        <span className="text-alemny-lilac">{suffix}</span>
      </div>
      <div className="mt-1 text-[11.5px] leading-4 text-alemny-muted">{label}</div>
    </div>
  );
}

/* ---------------------- العرض المدار ثلاثي الأبعاد ---------------------- */

function OrbitShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px]"
    >
      {/* توهج أرضي — حلقة النيون الأرضية كما في بوستر الهوية */}
      <div
        className="absolute -bottom-6 left-1/2 h-16 w-[78%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.5),rgba(128,70,233,0.18)_45%,transparent_70%)] blur-xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-4 left-1/2 h-10 w-[62%] -translate-x-1/2 rounded-[100%] border-2 border-alemny-lilac/50 blur-[1px]"
        aria-hidden
      />

      {/* حلقتا المدار */}
      <div className="absolute inset-[6%] rounded-full border border-alemny-purple/25" aria-hidden />
      <div className="absolute inset-[16%] rounded-full border border-dashed border-alemny-purple/20" aria-hidden />

      {/* الشعار المركزي المتوهج */}
      <div className="absolute inset-[24%] flex items-center justify-center">
        <div className="pulse-ring absolute inset-0 rounded-full border-2 border-alemny-purple/50" aria-hidden />
        <AlemnyLogo glow className="h-full w-full" />
      </div>

      {/* مدار البطاقات الزجاجية للمنصات */}
      <div
        className="animate-orbit absolute inset-0 [--orbit-r:148px] sm:[--orbit-r:188px] lg:[--orbit-r:212px]"
        aria-hidden={false}
      >
        {SOCIALS.map((social, i) => {
          const angle = i * 90;
          return (
            <div
              key={social.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--orbit-r))) rotate(${-angle}deg)`,
              }}
            >
              <div className="animate-orbit-rev">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-hover group flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3"
                  style={{ width: 84 }}
                  aria-label={`تابع ${BRAND.ar} على ${social.label}`}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      borderColor: `${social.color}55`,
                      backgroundColor: `${social.color}18`,
                      color: social.color,
                    }}
                  >
                    <PlatformIcon id={social.id} size={19} />
                  </span>
                  <span className="text-[10.5px] font-bold text-white">{social.label}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* شارات النماذج العائمة */}
      {FLOATING_BADGES.map((badge) => (
        <div
          key={badge.label}
          className={`absolute z-20 ${badge.position}`}
          style={{ animationDelay: badge.delay }}
          aria-hidden={false}
        >
          <div className="animate-float">
            <span
              className="glass flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold shadow-lg"
              style={{ borderColor: `${badge.color}44`, color: badge.color }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: badge.color, boxShadow: `0 0 10px ${badge.color}` }} />
              <span className={badge.ltr ? "font-en tracking-wide" : ""}>{badge.label}</span>
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
