"use client";

/* ============================================================
   الصفحة الرئيسية — / — المنصة الشاملة الدائمة (V2)
   • قسم البطل: شعار رسمي عائم داخل حلقات مدارية نيون ثلاثية
     الأبعاد — بلا أي شارات أدوات أو أسماء نماذج مؤقتة.
   • بوابة Bento ثلاثية الأبعاد بأسّ قادة إلى الصفحات المخصصة
     مع عدّادات حية من قاعدة بيانات Neon.
   • معاينة أحدث المقالات والشروحات.
   • مركز المجتمع الاجتماعي بكُرات زجاجية ثلاثية الأبعاد.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  FlaskConical,
  GraduationCap,
  Newspaper,
  Sparkles,
  Wand2,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { AlemnyLogo, PlatformIcon } from "./logo";
import { SectionHeading } from "./section-heading";
import { BRAND, SOCIALS } from "@/lib/alemny/constants";
import { ARTICLE_CATEGORIES } from "@/lib/alemny/articles";
import { arNum } from "@/lib/alemny/format";
import { useAlemnyStore } from "@/lib/alemny/store";
import type { Article } from "@/lib/alemny/articles";
import type { Tutorial } from "@/lib/alemny/tutorials";

export function HomeLanding() {
  return (
    <>
      <HomeHero />
      <BentoPortal />
      <HomePreviews />
      <SocialHub />
    </>
  );
}

/* ============================== قسم البطل ============================== */

function HomeHero() {
  const prompts = useAlemnyStore((s) => s.prompts);
  const tools = useAlemnyStore((s) => s.tools);
  const articles = useAlemnyStore((s) => s.articles);
  const tutorials = useAlemnyStore((s) => s.tutorials);

  return (
    <section aria-label="المقدمة الرئيسية" className="relative overflow-hidden pt-36 pb-14 md:pt-44 md:pb-20">
      <div className="grid-overlay absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center md:px-6">
        {/* المركز ثلاثي الأبعاد: الشعار داخل الحلقات المدارية */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative mx-auto mb-10 aspect-square w-[240px] sm:w-[300px] md:w-[340px]"
        >
          {/* توهج محيطي */}
          <div
            className="absolute inset-[-14%] rounded-full bg-[radial-gradient(circle,rgba(128,70,233,0.35),rgba(128,70,233,0.08)_55%,transparent_75%)] blur-2xl"
            aria-hidden
          />
          {/* حلقتا نيون دوّارتان */}
          <div className="hero-ring animate-ring absolute inset-[-6%]" aria-hidden />
          <div className="hero-ring animate-ring-rev absolute inset-[-13%] opacity-60" aria-hidden />
          <div className="absolute inset-[-13%] rounded-full border border-dashed border-alemny-purple/25" aria-hidden />

          {/* نبض + الشعار الرسمي */}
          <div className="absolute inset-[4%] flex items-center justify-center">
            <div className="pulse-ring absolute inset-0 rounded-full border-2 border-alemny-purple/50" aria-hidden />
            <div className="animate-float-slow relative h-full w-full">
              <AlemnyLogo glow className="h-full w-full drop-shadow-[0_18px_60px_rgba(128,70,233,0.6)]" />
            </div>
          </div>

          {/* حلقة أرضية عاكسة */}
          <div
            className="absolute -bottom-8 left-1/2 h-10 w-[85%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.45),rgba(128,70,233,0.15)_50%,transparent_72%)] blur-lg"
            aria-hidden
          />
        </motion.div>

        {/* الشارة الدائمة */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="neon-chip mx-auto mb-6 px-5 py-2 text-sm font-semibold text-alemny-lilac"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          منصة عربية دائمة — <span dir="ltr" className="inline-block font-en">{BRAND.handle}</span>
        </motion.div>

        {/* العنوان الرئيسي */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-display text-4xl font-bold leading-[1.45] text-white md:text-[3.4rem] md:leading-[1.4]"
        >
          <span className="text-glow">علَّمني تِك</span>
          <span className="text-gradient"> — كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-9 text-alemny-muted md:text-lg"
        >
          {BRAND.tagline}
        </motion.p>

        {/* زرا الإجراء الرئيسيان */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
        >
          <Link
            href="/tutorials"
            className="btn-neon inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-bold text-white"
          >
            <GraduationCap className="h-5 w-5" aria-hidden />
            استكشف المنصة والشروحات
          </Link>
          <Link
            href="/prompts"
            className="glass glass-hover inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-bold text-white"
          >
            <Wand2 className="h-5 w-5 text-alemny-lilac" aria-hidden />
            مكتبة هندسة الأوامر
          </Link>
        </motion.div>

        {/* عدّادات حية من قاعدة البيانات */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <HeroStat value={prompts.length} label="برومبت هندسي جاهز" />
          <HeroStat value={tools.length} label="أدوات موثقة في الدليل" />
          <HeroStat value={articles.length + tutorials.length} label="مقالًا وشرحًا عمليًّا" />
          <HeroStat value={100} suffix="٪" label="مجاني — بلا تسجيل" />
        </motion.div>
      </div>
    </section>
  );
}

function HeroStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
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
        {arNum(display)}
        <span className="text-alemny-lilac">{suffix}</span>
      </div>
      <div className="mt-1 text-[11.5px] leading-4 text-alemny-muted">{label}</div>
    </div>
  );
}

/* ==================== بوابة الأقسام — شبكة Bento 3D ==================== */

const PORTALS = [
  {
    href: "/articles",
    title: "المقالات والأخبار التقنية",
    desc: "مقالات شاملة في عالم التكنولوجيا، الذكاء الاصطناعي، البرمجة، الأمن الرقمي، والمستقبل الرقمي.",
    icon: Newspaper,
    countKey: "articles" as const,
    countLabel: "مقالًا معمّقًا",
    c1: "rgba(168,85,247,0.5)",
    c2: "rgba(168,85,247,0.1)",
    span: "lg:col-span-2",
  },
  {
    href: "/tutorials",
    title: "الشروحات العملية",
    desc: "أدلة تطبيقية خطوة بخطوة وفيديوهات تعليمية تنقلك من الصفر إلى النتيجة.",
    icon: GraduationCap,
    countKey: "tutorials" as const,
    countLabel: "شرحًا متدرجًا",
    c1: "rgba(52,211,153,0.45)",
    c2: "rgba(52,211,153,0.08)",
    span: "",
  },
  {
    href: "/prompts",
    title: "مكتبة هندسة الأوامر",
    desc: "برومبتات احترافية مقسمة بالمجالات — خصّص متغيراتك وانسخ البرومبت بضغطة.",
    icon: Wand2,
    countKey: "prompts" as const,
    countLabel: "برومبتًا جاهزًا",
    c1: "rgba(56,189,248,0.45)",
    c2: "rgba(56,189,248,0.08)",
    span: "",
  },
  {
    href: "/lab",
    title: "المختبر الذكي",
    desc: "أدوات تفاعلية وهندسة أوامر ذكية: مواجهات عملية مقيسة، وصانع برومبتات يبني لك أمرًا هندسيًّا كاملًا.",
    icon: FlaskConical,
    countKey: "missions" as const,
    countLabel: "مواجهة عملية + صانع ذكي",
    c1: "rgba(251,191,36,0.42)",
    c2: "rgba(251,191,36,0.08)",
    span: "lg:col-span-2",
  },
] as const;

function BentoPortal() {
  const prompts = useAlemnyStore((s) => s.prompts);
  const tutorials = useAlemnyStore((s) => s.tutorials);
  const articles = useAlemnyStore((s) => s.articles);
  const missions = useAlemnyStore((s) => s.missions);

  const counts = { prompts: prompts.length, tutorials: tutorials.length, articles: articles.length, missions: missions.length };

  return (
    <section id="portal" aria-label="بوابة أقسام المنصة" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="بوابة المنصة"
          eyebrowIcon={BadgeCheck}
          title="أربعة أبواب تقودك إلى الإتقان"
          highlight="لكل مهارة مسارها"
          description="كل قسم في صفحة مخصصة كاملة: مقالات دائمة الصلة، شروحات متدرجة، مكتبة أوامر هندسية، ومختبر تفاعلي — اختر بابك وابدأ."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PORTALS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className={p.span}
              >
                <Link href={p.href} className="group block h-full" aria-label={`انتقل إلى ${p.title}`}>
                  <article className="card-3d bento-3d flex h-full min-h-[240px] flex-col p-7 md:p-8">
                    <span className="bento-art" style={{ "--art-c1": p.c1, "--art-c2": p.c2 } as React.CSSProperties} aria-hidden />
                    <span className="bento-ring" aria-hidden />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac shadow-[0_8px_28px_-8px_rgba(128,70,233,0.6)] transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-7 w-7" aria-hidden />
                      </span>
                      <span className="neon-chip px-3 py-1.5 text-[12px] font-bold text-white">
                        <span className="h-2 w-2 rounded-full bg-alemny-lilac shadow-[0_0_8px_rgba(168,85,247,0.9)]" aria-hidden />
                        {arNum(counts[p.countKey])} {p.countLabel}
                      </span>
                    </div>

                    <h3 className="relative z-10 mt-5 font-display text-xl font-bold text-white md:text-2xl">{p.title}</h3>
                    <p className="relative z-10 mt-2.5 max-w-md text-[13.5px] leading-7 text-alemny-muted">{p.desc}</p>

                    <span className="relative z-10 mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-bold text-alemny-lilac transition-colors group-hover:text-white">
                      استكشف القسم
                      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" aria-hidden />
                    </span>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= معاينة أحدث المقالات والشروحات ================= */

function HomePreviews() {
  const articles = useAlemnyStore((s) => s.articles);
  const tutorials = useAlemnyStore((s) => s.tutorials);

  const latestArticles = articles.slice(0, 3);
  const latestTutorials = tutorials.slice(0, 3);

  return (
    <section aria-label="أحدث المقالات والشروحات" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="جديد المنصة"
          eyebrowIcon={Newspaper}
          title="أحدث المقالات والشروحات"
          highlight="طازج من المختبر"
          description="لمحة سريعة عن آخر ما نشرته المنصة — كل عنصر في صفحته الكاملة مع القسم الكامل."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* أحدث المقالات */}
          <div className="flex flex-col gap-4">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac">
                  <Newspaper className="h-4.5 w-4.5" aria-hidden />
                </span>
                أحدث المقالات
              </h3>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-alemny-lilac transition-colors hover:text-white"
              >
                عرض كل المقالات
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            {latestArticles.map((article) => (
              <PreviewArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* أحدث الشروحات */}
          <div className="flex flex-col gap-4">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-alemny-emerald/40 bg-alemny-emerald/12 text-alemny-emerald">
                  <GraduationCap className="h-4.5 w-4.5" aria-hidden />
                </span>
                أحدث الشروحات
              </h3>
              <Link
                href="/tutorials"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-alemny-emerald transition-colors hover:text-white"
              >
                عرض كل الشروحات
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            {latestTutorials.map((tutorial) => (
              <PreviewTutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/articles"
            className="glass glass-hover inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white"
          >
            عرض كل الشروحات والمقالات
            <ArrowLeft className="h-4.5 w-4.5 text-alemny-lilac" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PreviewArticleCard({ article }: { article: Article }) {
  const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category);
  return (
    <Link href={`/articles?focus=${article.id}`} className="group block">
      <article className="card-3d rounded-2xl p-5 md:p-6">
        <span className="ambient-spot -top-10 left-1/4 h-24 w-24" aria-hidden />
        <div className="relative z-10">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold"
              style={{ borderColor: `${cat?.color ?? "#A855F7"}55`, color: cat?.color ?? "#A855F7", backgroundColor: `${cat?.color ?? "#A855F7"}14` }}
            >
              {cat?.label ?? "تقنية"}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-alemny-muted">
              <Clock className="h-3 w-3" aria-hidden />
              {arNum(article.readMinutes)} دقائق قراءة
            </span>
          </div>
          <h4 className="text-[15.5px] font-bold leading-7 text-white transition-colors group-hover:text-alemny-lilac">{article.title}</h4>
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-6 text-alemny-muted">{article.excerpt}</p>
        </div>
      </article>
    </Link>
  );
}

function PreviewTutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <Link href={`/tutorials?focus=${tutorial.id}`} className="group block">
      <article className="card-3d rounded-2xl p-5 md:p-6">
        <span className="ambient-spot -top-10 left-1/4 h-24 w-24" aria-hidden />
        <div className="relative z-10">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-alemny-emerald/45 bg-alemny-emerald/10 px-2.5 py-0.5 text-[10.5px] font-bold text-alemny-emerald">
              {tutorial.level}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-alemny-muted">
              <Clock className="h-3 w-3" aria-hidden />
              {tutorial.duration} • {arNum(tutorial.steps.length)} خطوات
            </span>
          </div>
          <h4 className="text-[15.5px] font-bold leading-7 text-white transition-colors group-hover:text-alemny-emerald">{tutorial.title}</h4>
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-6 text-alemny-muted">{tutorial.subtitle}</p>
        </div>
      </article>
    </Link>
  );
}

/* ================== مركز المجتمع — كُرات زجاجية 3D ================== */

function SocialHub() {
  return (
    <section aria-label="مجتمع علَّمني تِك على المنصات الرسمية" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="مجتمع المنصة"
          eyebrowIcon={Sparkles}
          title="انضم إلى مجتمع علَّمني تِك"
          highlight="على منصاتنا الرسمية"
          description="شروحات الفيديو، النصائح اليومية، الريلز التقنية، ونقاشات الذكاء الاصطناعي — اختر منصتك المفضلة وكن جزءًا من الجيل التقني العربي."
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-6">
          {SOCIALS.map((social, i) => (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="group flex flex-col items-center gap-4 text-center"
              aria-label={`تابع علَّمني تِك على ${social.label}`}
            >
              {/* الكرة الزجاجية ثلاثية الأبعاد */}
              <span className="relative">
                <span
                  className="orb-3d block h-24 w-24 sm:h-28 sm:w-28"
                  style={{ "--orb-c1": `${social.color}66`, "--orb-c2": "rgba(18,14,34,0.95)" } as React.CSSProperties}
                >
                  <span className="relative z-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110">
                    <PlatformIcon id={social.id} size={34} />
                  </span>
                </span>
                {/* توهج خارجي يزداد عند المرور */}
                <span
                  className="absolute inset-0 -z-10 rounded-full opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: `${social.color}30` }}
                  aria-hidden
                />
              </span>

              <span>
                <span className="block font-display text-[15px] font-bold text-white">{social.label}</span>
                <span className="mt-0.5 block text-[11.5px] text-alemny-muted">{social.description}</span>
                <span dir="ltr" className="mt-1.5 inline-block rounded-full border border-alemny-purple/35 bg-alemny-purple/10 px-2.5 py-0.5 font-en text-[10.5px] font-bold text-alemny-lilac">
                  {BRAND.handle}
                </span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
