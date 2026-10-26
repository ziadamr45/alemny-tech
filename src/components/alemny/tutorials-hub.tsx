"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Youtube,
  Clock,
  BarChart3,
  ChevronDown,
  Lightbulb,
  NotebookPen,
  SquareTerminal,
  Clapperboard,
  ListOrdered,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { type Tutorial } from "@/lib/alemny/tutorials";
import { SOCIALS } from "@/lib/alemny/constants";
import { useAlemnyStore } from "@/lib/alemny/store";

const TUTORIAL_ICONS = { notebook: NotebookPen, cursor: SquareTerminal, veo: Clapperboard } as const;

export function TutorialsHub() {
  const tutorials = useAlemnyStore((s) => s.tutorials);
  const [activeId, setActiveId] = useState(tutorials[0].id);
  const tutorial = tutorials.find((t) => t.id === activeId) ?? tutorials[0];

  return (
    <section id="tutorials" aria-label="أكاديمية الشروحات العملية" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="النظام الخامس — شاهد وطبّق فورًا"
          eyebrowIcon={GraduationCap}
          title="أكاديمية الشروحات"
          highlight="العملية خطوة بخطوة"
          description="دليل تنفيذ مصور لكل نظام: اتبع الخطوات بالترتيب، طبّق كل نقطة فورًا، وشاهد الشرح الكامل فيديو على قناة علَّمني تِك."
        />

        {/* اختيار الشرح */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5" role="tablist" aria-label="اختر الشرح العملي">
          {tutorials.map((t) => {
            const Icon = TUTORIAL_ICONS[t.icon];
            const active = t.id === activeId;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveId(t.id)}
                className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-[13.5px] font-bold transition-all duration-300 ${
                  active ? "btn-neon text-white" : "glass-soft text-alemny-muted hover:border-alemny-purple/60 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {t.title}
              </button>
            );
          })}
        </div>

        {/* الشرح النشط */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tutorial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="glass overflow-hidden rounded-[2rem]"
          >
            {/* ترويسة الشرح */}
            <div className="border-b border-alemny-purple/25 bg-alemny-purple/6 p-5 md:p-7">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <h3 className="text-xl font-bold leading-9 text-white md:text-2xl">{tutorial.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-7 text-alemny-muted">{tutorial.subtitle}</p>
                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <Meta icon={ListOrdered} text={`${tutorial.steps.length} خطوات`} />
                    <Meta icon={Clock} text={`المدة: ${tutorial.duration}`} />
                    <Meta icon={BarChart3} text={`المستوى: ${tutorial.level}`} />
                  </div>
                </div>
                <a
                  href={tutorial.youtubeUrl ?? SOCIALS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon inline-flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-bold text-white"
                  aria-label={`شاهد شرح ${tutorial.title} على يوتيوب`}
                >
                  <Youtube className="h-5 w-5" aria-hidden />
                  الشرح الكامل على يوتيوب
                </a>
              </div>
            </div>

            {/* الخطوات التفاعلية */}
            <StepList steps={tutorial.steps} tutorialId={tutorial.id} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Meta({ icon: Icon, text }: { icon: typeof Clock; text: string }) {
  return (
    <span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold text-alemny-muted">
      <Icon className="h-3.5 w-3.5 text-alemny-lilac" aria-hidden />
      {text}
    </span>
  );
}

function StepList({ steps, tutorialId }: { steps: Tutorial["steps"]; tutorialId: string }) {
  const [openStep, setOpenStep] = useState(0);

  return (
    <div className="p-5 md:p-7">
      <ol className="relative space-y-3">
        {/* خط الرابط العمودي */}
        <span className="absolute bottom-6 right-[26px] top-6 w-px bg-gradient-to-b from-alemny-purple/60 via-alemny-purple/25 to-transparent" aria-hidden />

        {steps.map((step, i) => {
          const open = openStep === i;
          return (
            <li key={step.title} className="relative">
              <button
                type="button"
                onClick={() => setOpenStep(open ? -1 : i)}
                aria-expanded={open}
                className={`group flex w-full items-center gap-4 rounded-2xl border p-3.5 text-right transition-all duration-300 md:p-4 ${
                  open
                    ? "border-alemny-purple/60 bg-alemny-purple/10 shadow-[0_0_24px_rgba(128,70,233,0.25)]"
                    : "glass-soft glass-hover"
                }`}
              >
                <span
                  className={`relative z-10 flex h-[54px] w-[54px] shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors ${
                    open ? "border-alemny-purple bg-alemny-purple/30 text-white" : "border-alemny-purple/35 bg-[#120E22] text-alemny-lilac"
                  }`}
                >
                  <span className="text-[9px] font-bold opacity-70">خطوة</span>
                  <span className="font-display text-lg font-bold leading-none">{i + 1}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[14.5px] font-bold leading-7 ${open ? "text-white" : "text-alemny-muted group-hover:text-white"}`}>
                    {step.title}
                  </span>
                  {!open && <span className="mt-0.5 block truncate text-[12px] text-white/40">{step.desc}</span>}
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-alemny-lilac transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key={`${tutorialId}-step-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mr-[70px] mt-2 space-y-3 rounded-2xl border border-alemny-purple/20 bg-[#0D0A18]/70 p-4">
                      <p className="text-[13.5px] leading-8 text-alemny-muted">{step.desc}</p>
                      <div className="flex items-start gap-2 rounded-xl border border-alemny-amber/30 bg-alemny-amber/8 p-3">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-alemny-amber" aria-hidden />
                        <p className="text-[12.5px] leading-6 text-alemny-amber">
                          <span className="font-bold">نصيحة المحترفين: </span>
                          {step.tip}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      {/* دعوة أخيرة للقناة */}
      <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-alemny-purple/30 bg-gradient-to-l from-alemny-purple/15 to-transparent p-5 sm:flex-row">
        <p className="text-center text-[13.5px] leading-7 text-alemny-muted sm:text-right">
          <span className="font-bold text-white">تريد رؤية كل خطوة على الشاشة؟ </span>
          شروحات مصورة كاملة بالعربية تنتظرك على قناة علَّمني تِك الرسمية.
        </p>
        <a
          href={SOCIALS[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-[13.5px] font-bold text-white"
        >
          <Youtube className="h-5 w-5" aria-hidden />
          اشترك الآن — علَّمني تِك
        </a>
      </div>
    </div>
  );
}
