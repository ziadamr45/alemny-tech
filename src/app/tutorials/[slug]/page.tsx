import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ChartNoAxesColumn,
  ChevronLeft,
  Clock,
  Lightbulb,
  Youtube,
} from "lucide-react";
import { getTutorials } from "@/lib/alemny/server-content";
import { arDigits } from "@/lib/alemny/format";

const SITE_URL = "https://alemny-tech.vercel.app";
const FALLBACK_YOUTUBE_URL = "https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B";

/* صفحة التفاصيل: صف قاعدة البيانات يستخدم slug والبيانات المحلية تستخدم id */
function detailHref(item: { id: string; slug?: string }) {
  return `/tutorials/${item.slug ?? item.id}`;
}

/* صفوف قاعدة البيانات تحمل summary، والاحتياطي الثابت يستخدم subtitle */
function summaryOf(item: { subtitle: string; summary?: string }) {
  return item.summary ?? item.subtitle;
}

/* استدعاء واحد لكل طلب (تُستدعى في الميتاداتا والصفحة معًا) */
const loadTutorials = cache(getTutorials);

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: tutorials } = await loadTutorials();
  const tutorial = tutorials.find((t) => detailHref(t) === `/tutorials/${slug}`);
  if (!tutorial) return {};
  const description = summaryOf(tutorial);
  return {
    title: `${tutorial.title} | علَّمني تِك`,
    description,
    alternates: { canonical: `${SITE_URL}/tutorials/${slug}` },
    openGraph: {
      title: tutorial.title,
      description,
      type: "article",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { data: tutorials } = await loadTutorials();
  const tutorial = tutorials.find((t) => detailHref(t) === `/tutorials/${slug}`);
  if (!tutorial) notFound();

  /* شروحات ذات صلة */
  const related = tutorials.filter((t) => detailHref(t) !== `/tutorials/${slug}`).slice(0, 3);

  return (
    <div className="alemny-shell w-full py-8 sm:py-12">
      {/* مسار التنقل */}
      <nav
        aria-label="مسار التنقل"
        className="flex flex-wrap items-center gap-1.5 text-sm text-white/55"
      >
        <Link href="/" className="transition-colors hover:text-white">
          الرئيسية
        </Link>
        <ChevronLeft className="h-4 w-4 text-white/30" aria-hidden />
        <Link href="/tutorials" className="transition-colors hover:text-white">
          الشروحات
        </Link>
        <ChevronLeft className="h-4 w-4 text-white/30" aria-hidden />
        <span className="text-white/80">{tutorial.title}</span>
      </nav>

      <Link
        href="/tutorials"
        className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
      >
        <ArrowRight className="h-4 w-4" aria-hidden />
        العودة إلى جميع الشروحات
      </Link>

      {/* ترويسة الشرح */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8046E9]/50 bg-[#8046E9]/12 px-3 py-1 text-xs font-bold text-[#C4A2FF]">
            <ChartNoAxesColumn className="h-3.5 w-3.5" aria-hidden />
            المستوى: {tutorial.level}
          </span>
          <span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white/70">
            <Clock className="h-3.5 w-3.5 text-alemny-lilac" aria-hidden />
            المدة: {tutorial.duration}
          </span>
          <span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white/70">
            {arDigits(tutorial.steps.length)} خطوات
          </span>
        </div>
        <h1 className="t-hero mb-4 mt-4 font-extrabold leading-[1.35] text-white">
          {tutorial.title}
        </h1>
        <p className="t-body max-w-3xl text-white/75">{summaryOf(tutorial)}</p>
        <a
          href={tutorial.youtubeUrl || FALLBACK_YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`شاهد شرح ${tutorial.title} على يوتيوب`}
          className="obsidian-btn obsidian-btn-primary mt-6 min-h-[44px] text-sm font-bold"
        >
          <Youtube className="h-5 w-5" aria-hidden />
          شاهد الشرح كاملًا على يوتيوب علَّمني تِك
        </a>
      </header>

      {/* الخطوات */}
      <div className="mx-auto my-8 max-w-4xl space-y-5">
        {tutorial.steps.map((step, i) => (
          <div key={step.title} className="card-3d flex gap-4 rounded-2xl p-5 sm:p-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] font-bold text-white">
              {arDigits(i + 1)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="t-card-title font-bold text-white">{step.title}</h3>
              <p className="t-body mt-1.5 text-white/75">{step.desc}</p>
              {step.tip && (
                <div className="mt-3 flex gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
                  <span className="text-sm leading-7 text-white/70">
                    <b className="text-amber-200">نصيحة: </b>
                    {step.tip}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* شروحات ذات صلة */}
      {related.length > 0 && (
        <section aria-label="شروحات ذات صلة" className="my-12">
          <h2 className="t-card-title mb-5 font-bold text-white">شروحات ذات صلة</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
            {related.map((t) => (
              <Link
                key={t.id}
                href={detailHref(t)}
                className="card-3d block rounded-3xl p-5 sm:p-6"
              >
                <h3 className="t-card-title font-bold text-white">{t.title}</h3>
                <p className="t-body mt-2 line-clamp-2 text-white/60">{summaryOf(t)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/10 pt-3 text-[12px] text-white/50">
                  <span className="inline-flex items-center gap-1.5">
                    <ChartNoAxesColumn className="h-3.5 w-3.5" aria-hidden />
                    {t.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {t.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
