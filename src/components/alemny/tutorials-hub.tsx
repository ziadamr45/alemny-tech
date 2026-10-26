"use client";

/* ============================================================
   الشروحات العملية — /tutorials (V3)
   شبكة بطاقات كاملة قابلة للنقر تفتح صفحة الشرح المستقلة
   /tutorials/[slug]. البيانات حية من Neon PostgreSQL مع
   احتياطي محلي أنيق.
   ============================================================ */

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ChartNoAxesColumn,
  Clock,
  GraduationCap,
  ListOrdered,
  NotebookPen,
  SquareTerminal,
  Clapperboard,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { arNum } from "@/lib/alemny/format";
import { type Tutorial } from "@/lib/alemny/tutorials";
import { useAlemnyStore } from "@/lib/alemny/store";

/* صفحة التفاصيل: صف قاعدة البيانات يستخدم slug والبيانات المحلية تستخدم id */
function detailHref(tutorial: { id: string; slug?: string }) {
  return `/tutorials/${tutorial.slug ?? tutorial.id}`;
}

/* صفوف قاعدة البيانات تحمل summary، والاحتياطي الثابت يستخدم subtitle */
function summaryOf(tutorial: { subtitle: string; summary?: string }) {
  return tutorial.summary ?? tutorial.subtitle;
}

const TUTORIAL_ICONS = {
  notebook: NotebookPen,
  cursor: SquareTerminal,
  veo: Clapperboard,
} as const;

export function TutorialsHub() {
  const tutorials = useAlemnyStore((s) => s.tutorials);

  return (
    <section id="tutorials" aria-label="أكاديمية الشروحات العملية" className="relative">
      <SectionHeading
        eyebrow="أكاديمية الشروحات — شاهد وطبّق فورًا"
        eyebrowIcon={GraduationCap}
        title="الشروحات العملية"
        highlight="خطوة بخطوة بالتفصيل"
        description="دليل تنفيذ مصور لكل نظام: اتبع الخطوات بالترتيب، طبّق كل نقطة فورًا، وشاهد الشرح الكامل فيديو على قناة علَّمني تِك."
      />

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
        {tutorials.map((tutorial, i) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} index={i} />
        ))}
      </div>
    </section>
  );
}

function Badge({ icon: Icon, children }: { icon: typeof Clock; children: ReactNode }) {
  return (
    <span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-alemny-muted">
      <Icon className="h-3.5 w-3.5 text-alemny-lilac" aria-hidden />
      {children}
    </span>
  );
}

function TutorialCard({ tutorial, index }: { tutorial: Tutorial; index: number }) {
  const Icon = TUTORIAL_ICONS[tutorial.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.3), ease: "easeOut" }}
    >
      <Link
        href={detailHref(tutorial)}
        className="card-3d group flex flex-col rounded-3xl p-6 md:p-7"
      >
        <span className="ambient-spot -top-14 left-1/3 h-32 w-32" aria-hidden />

        <div className="relative z-10 mb-4 flex items-center justify-between gap-2">
          <span className="glass-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-alemny-lilac">
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <span className="rounded-full border border-alemny-purple/45 bg-alemny-purple/12 px-3 py-1 text-[11px] font-bold text-alemny-lilac">
            {tutorial.level}
          </span>
        </div>

        <h3 className="t-card-title relative z-10 font-bold text-white">{tutorial.title}</h3>
        <p className="t-body relative z-10 mt-2.5 line-clamp-3 flex-1 text-white/70">
          {summaryOf(tutorial)}
        </p>

        {/* المستوى والمدة والخطوات */}
        <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
          <Badge icon={ListOrdered}>{arNum(tutorial.steps.length)} خطوات</Badge>
          <Badge icon={Clock}>المدة: {tutorial.duration}</Badge>
          <Badge icon={ChartNoAxesColumn}>{tutorial.level}</Badge>
        </div>

        <div className="relative z-10 mt-5 flex items-center justify-end border-t border-alemny-purple/15 pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-alemny-purple/45 bg-alemny-purple/12 px-4 py-2 text-[12.5px] font-bold text-white transition-all group-hover:border-alemny-lilac group-hover:bg-alemny-purple/25">
            افتح الشرح
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
