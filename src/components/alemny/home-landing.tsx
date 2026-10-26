"use client";

/* ============================================================
   الصفحة الرئيسية — / (V3 — تصميم مفتوح متجاوب)
   • قسم بطل بدون شعار عملاق: محتوى مباشر + زخارف محيطية خفيفة
     (بقع ضوء، حلقة شبح، توهج أرضي) — بلا أي أسماء نماذج.
   • بوابة Bento 3D (عمودان كحد أقصى) بعدّادات حية.
   • أحدث المقالات والشروحات في شبكة موحدة بروابط صفحات التفاصيل.
   • مركز المجتمع بكُرات زجاجية 3D متجاوبة.
   كل الأقسام داخل الحاوية الأم .alemny-shell.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  FlaskConical,
  GraduationCap,
  Newspaper,
  Sparkles,
  Wand2,
} from "lucide-react";
import { BrandLogo, PlatformIcon } from "./brand-logo";
import { SectionHeading } from "./section-heading";
import { BRAND, SOCIALS } from "@/lib/alemny/constants";
import { PushSubscribeButton } from "./push-subscribe-button";
import { ARTICLE_CATEGORIES } from "@/lib/alemny/articles";
import { arNum } from "@/lib/alemny/format";
import { useAlemnyStore } from "@/lib/alemny/store";
import type { Article } from "@/lib/alemny/articles";
import type { Tutorial } from "@/lib/alemny/tutorials";

/* صفحة التفاصيل: صف قاعدة البيانات يستخدم slug والبيانات المحلية تستخدم id */
function detailHref(base: string, item: { id: string; slug?: string }) {
  return `/${base}/${item.slug ?? item.id}`;
}

export function HomeLanding() {
  return (
    <div className="alemny-shell pb-16 md:pb-24">
      <HomeHero />
      <div className="space-y-16 sm:space-y-24">
        <BentoPortal />
        <HomePreviews />
        <SocialHub />
      </div>
    </div>
  );
}

/* ============================== قسم البطل ============================== */

function HomeHero() {
  const prompts = useAlemnyStore((s) => s.prompts);
  const tools = useAlemnyStore((s) => s.tools);
  const articles = useAlemnyStore((s) => s.articles);
  const tutorials = useAlemnyStore((s) => s.tutorials);

  return (
    <section aria-label="المقدمة الرئيسية" className="relative overflow-hidden pb-12 pt-36 text-center md:pb-16 md:pt-44">
      {/* زخارف محيطية خفيفة — بلا شعار */}
      <div className="grid-overlay absolute inset-0" aria-hidden />
      <span className="ambient-spot -top-24 right-[8%] h-72 w-72" aria-hidden />
      <span className="ambient-spot top-40 left-[4%] h-64 w-64 opacity-50" aria-hidden />
      {/* حلقة شبح بطيئة الدوران خلف المحتوى */}
      <div
        className="animate-spin-slower absolute left-1/2 top-16 hidden h-[480px] w-[480px] -translate-x-1/2 rounded-full border border-dashed border-alemny-purple/15 sm:block"
        aria-hidden
      />
      {/* توهج أرضي تحت منطقة الإجراءات */}
      <div
        className="absolute bottom-0 left-1/2 h-14 w-[80%] max-w-2xl -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.35),rgba(128,70,233,0.12)_50%,transparent_72%)] blur-lg"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* شعار صغير أنيق فوق الشارة */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto mb-7 w-fit"
        >
          <span
            className="absolute inset-0 -z-10 rounded-full bg-alemny-purple/40 opacity-60 blur-2xl"
            aria-hidden
          />
          <BrandLogo size={56} decorative />
        </motion.div>

        {/* الشارة الزجاجية */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mb-6 inline-flex w-auto max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-alemny-lilac backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-alemny-lilac" aria-hidden />
          بوابتك العملية لعالم الذكاء الاصطناعي والتقنية
        </motion.div>

        {/* العنوان الرئيسي */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="t-hero font-display font-bold text-white"
        >
          <span className="text-gradient-purple text-glow">علَّمني تِك</span>
          <span> — كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="t-body mx-auto mt-6 max-w-3xl text-alemny-muted"
        >
          {BRAND.tagline}
        </motion.p>

        {/* صف الإجراءات */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="/articles" className="obsidian-btn obsidian-btn-primary text-[15px]">
            <Newspaper className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
            استكشف المقالات
          </Link>
          <Link href="/prompts" className="obsidian-btn text-[15px] text-white">
            <Wand2 className="h-[18px] w-[18px] text-alemny-lilac" strokeWidth={1.75} aria-hidden />
            مكتبة هندسة الأوامر
          </Link>
          <Link href="/tutorials" className="obsidian-btn text-[15px] text-white">
            <GraduationCap className="h-[18px] w-[18px] text-alemny-emerald" strokeWidth={1.75} aria-hidden />
            الشروحات العملية
          </Link>
          <PushSubscribeButton className="text-[15px]" />
        </motion.div>

        {/* عدّادات حية */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-stretch justify-center gap-6 sm:gap-10"
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
    <div ref={ref} className="glass-soft glass-hover min-w-[128px] rounded-2xl px-5 py-3.5 text-center">
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
  },
] as const;

function BentoPortal() {
  const prompts = useAlemnyStore((s) => s.prompts);
  const tutorials = useAlemnyStore((s) => s.tutorials);
  const articles = useAlemnyStore((s) => s.articles);
  const missions = useAlemnyStore((s) => s.missions);

  const counts = { prompts: prompts.length, tutorials: tutorials.length, articles: articles.length, missions: missions.length };

  return (
    <section id="portal" aria-label="بوابة أقسام المنصة" className="relative">
      <SectionHeading
        eyebrow="بوابة المنصة"
        eyebrowIcon={BadgeCheck}
        title="أربعة أبواب تقودك إلى الإتقان"
        highlight="لكل مهارة مسارها"
        description="كل قسم في صفحة مخصصة كاملة: مقالات معمّقة، شروحات متدرجة، مكتبة أوامر هندسية، ومختبر تفاعلي — اختر بابك وابدأ."
      />

      {/* عمودان كحد أقصى — لا ٣ أو ٤ أعمدة أبدًا */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {PORTALS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="min-w-0"
            >
              <Link href={p.href} className="group block h-full" aria-label={`انتقل إلى ${p.title}`}>
                <article className="card-3d bento-3d flex h-full min-w-0 flex-col p-6 md:p-7">
                  <span className="bento-art" style={{ "--art-c1": p.c1, "--art-c2": p.c2 } as React.CSSProperties} aria-hidden />
                  <span className="bento-ring" aria-hidden />

                  <div className="relative z-10 flex min-w-0 items-start justify-between gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac shadow-[0_8px_28px_-8px_rgba(128,70,233,0.6)] transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7" aria-hidden />
                    </span>
                    <span className="neon-chip shrink-0 whitespace-nowrap px-3 py-1.5 text-[12px] font-bold text-white">
                      <span className="h-2 w-2 rounded-full bg-alemny-lilac shadow-[0_0_8px_rgba(168,85,247,0.9)]" aria-hidden />
                      {arNum(counts[p.countKey])} {p.countLabel}
                    </span>
                  </div>

                  <h3 className="t-card-title relative z-10 mt-5 min-w-0 font-display font-bold text-white">{p.title}</h3>
                  <p className="t-body relative z-10 mt-2 min-w-0 text-alemny-muted">{p.desc}</p>

                  <span className="relative z-10 mt-auto inline-flex min-w-0 items-center gap-2 pt-6 text-[14px] font-bold text-alemny-lilac transition-colors group-hover:text-white">
                    <span className="min-w-0 truncate">استكشف القسم</span>
                    <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1.5" aria-hidden />
                  </span>
                </article>
              </Link>
            </motion.div>
          );
        })}
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
    <section aria-label="أحدث المقالات والشروحات" className="relative">
      <SectionHeading
        eyebrow="جديد المنصة"
        eyebrowIcon={Newspaper}
        title="أحدث المقالات والشروحات"
        highlight="طازج من المختبر"
        description="لمحة سريعة عن آخر ما نشرته المنصة — كل عنصر في صفحته الكاملة."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
        {latestArticles.map((article) => (
          <PreviewArticleCard key={article.id} article={article} />
        ))}
        {latestTutorials.map((tutorial) => (
          <PreviewTutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/articles" className="obsidian-btn text-sm text-white">
          عرض كل الشروحات والمقالات
          <ArrowLeft className="h-[18px] w-[18px] text-alemny-lilac" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </section>
  );
}

function PreviewArticleCard({ article }: { article: Article }) {
  const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category);
  return (
    <Link href={detailHref("articles", article)} className="group block min-w-0">
      <article className="card-3d flex h-full min-w-0 flex-col rounded-2xl p-5 md:p-6">
        <span className="ambient-spot -top-10 left-1/4 h-24 w-24" aria-hidden />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <div className="mb-2.5 flex min-w-0 flex-wrap items-center gap-2">
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
          <h4 className="t-card-title min-w-0 font-display font-bold text-white transition-colors group-hover:text-alemny-lilac">{article.title}</h4>
          <p className="t-body mt-1.5 line-clamp-2 min-w-0 text-alemny-muted">{article.excerpt}</p>
        </div>
      </article>
    </Link>
  );
}

function PreviewTutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <Link href={detailHref("tutorials", tutorial)} className="group block min-w-0">
      <article className="card-3d flex h-full min-w-0 flex-col rounded-2xl p-5 md:p-6">
        <span className="ambient-spot -top-10 left-1/4 h-24 w-24" aria-hidden />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <div className="mb-2.5 flex min-w-0 flex-wrap items-center gap-2">
            <span className="rounded-full border border-alemny-emerald/45 bg-alemny-emerald/10 px-2.5 py-0.5 text-[10.5px] font-bold text-alemny-emerald">
              {tutorial.level}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-alemny-muted">
              <Clock className="h-3 w-3" aria-hidden />
              {tutorial.duration} • {arNum(tutorial.steps.length)} خطوات
            </span>
          </div>
          <h4 className="t-card-title min-w-0 font-display font-bold text-white transition-colors group-hover:text-alemny-emerald">{tutorial.title}</h4>
          <p className="t-body mt-1.5 line-clamp-2 min-w-0 text-alemny-muted">{tutorial.subtitle}</p>
        </div>
      </article>
    </Link>
  );
}

/* ================== مركز المجتمع — كُرات زجاجية 3D ================== */

function SocialHub() {
  return (
    <section aria-label="مجتمع علَّمني تِك على المنصات الرسمية" className="relative">
      <SectionHeading
        eyebrow="مجتمع المنصة"
        eyebrowIcon={Sparkles}
        title="انضم إلى مجتمع علَّمني تِك"
        highlight="على منصاتنا الرسمية"
        description="شروحات الفيديو، النصائح اليومية، الريلز التقنية، ونقاشات الذكاء الاصطناعي — اختر منصتك المفضلة وكن جزءًا من الجيل التقني العربي."
      />

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
            className="group flex min-w-0 flex-col items-center gap-4 text-center"
            aria-label={`تابع علَّمني تِك على ${social.label}`}
          >
            {/* الكرة الزجاجية ثلاثية الأبعاد */}
            <span className="relative block w-full max-w-[190px]">
              <span
                className="orb-3d mx-auto block aspect-square w-full"
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

            <span className="min-w-0">
              <span className="block font-display text-[15px] font-bold text-white">{social.label}</span>
              <span className="mt-0.5 block text-[11.5px] leading-5 text-alemny-muted">{social.description}</span>
              <span dir="ltr" className="mt-1.5 inline-block max-w-full truncate rounded-full border border-alemny-purple/35 bg-alemny-purple/10 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-alemny-lilac">
                {BRAND.handle}
              </span>
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
