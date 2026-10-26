"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Swords,
  BookOpen,
  Code2,
  PenLine,
  Mic,
  Check,
  X,
  Trophy,
  Crown,
  Route,
  Copy,
  Sparkles,
  Swords as VsIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SectionHeading } from "./section-heading";
import { arDigits } from "@/lib/alemny/format";
import { copyText } from "@/lib/alemny/clipboard";
import { BRAND_TEXT_SIGNATURE } from "@/lib/alemny/signature";
import { ARENA_MODELS_META, type VersusMission } from "@/lib/alemny/versus";
import { missionChallengePrompt, useAlemnyStore } from "@/lib/alemny/store";

const MISSION_ICONS = { book: BookOpen, code: Code2, pen: PenLine, mic: Mic } as const;

export function VersusArena() {
  const missions = useAlemnyStore((s) => s.missions);
  const [missionId, setMissionId] = useState(missions[0].id);
  /* توقيع علّمني تِك عند النسخ — مفعّل افتراضيًّا ومشترك في الحلبة */
  const [includeSignature, setIncludeSignature] = useState(true);
  const mission = useMemo(
    () => missions.find((m) => m.id === missionId) ?? missions[0],
    [missionId, missions]
  );

  return (
    <section id="versus" aria-label="حلبة المقارنات" className="relative py-20 md:py-28">
      <SectionHeading
          eyebrow="المختبر الذكي — قارن ثم قرر"
          eyebrowIcon={Swords}
          title="حلبة المواجهة العملية"
          highlight="مقارنات مقيسة بالأرقام"
          description="اختر مهمة حقيقية تواجهها، وشاهد النتائج المباشرة: درجات مرجحة، مميزات وعيوب صريحة، سير العمل الموصى به، والفائز بلا مجاملة — ثم انسخ برومبت التحدي الموحد واختبر بنفسك."
        />

        {/* بطاقات المهام */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="tablist" aria-label="اختر مهمة المواجهة">
          {missions.map((m) => {
            const Icon = MISSION_ICONS[m.icon];
            const active = m.id === missionId;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMissionId(m.id)}
                className={`group relative overflow-hidden rounded-3xl p-5 text-right transition-all duration-300 ${
                  active ? "glass border-alemny-purple shadow-[0_0_34px_rgba(128,70,233,0.4)]" : "glass-soft glass-hover"
                }`}
              >
                <span className="mb-3 flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors ${
                      active ? "border-alemny-purple bg-alemny-purple/25 text-white" : "border-alemny-purple/30 bg-alemny-purple/10 text-alemny-lilac"
                    }`}
                  >
                    <Icon className="h-5.5 w-5.5" aria-hidden />
                  </span>
                  <span className="font-display text-2xl font-bold text-alemny-purple/40 group-hover:text-alemny-purple/70">{m.number}</span>
                </span>
                <span className={`block text-[14px] font-bold leading-7 ${active ? "text-white" : "text-alemny-muted group-hover:text-white"}`}>
                  {m.title}
                </span>
                {active && <span className="shimmer-line absolute inset-x-0 bottom-0 h-0.5" aria-hidden />}
              </button>
            );
          })}
        </div>

        {/* لوحة النتائج */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-[2rem] p-5 md:p-8"
          >
            {/* وصف المهمة */}
            <div className="mb-7 flex flex-wrap items-center gap-3 rounded-2xl border border-alemny-purple/25 bg-alemny-purple/8 px-4 py-3">
              <VsIcon className="h-5 w-5 shrink-0 text-alemny-lilac" aria-hidden />
              <p className="text-[13.5px] leading-7 text-alemny-muted">{mission.description}</p>
            </div>

            {/* بطاقات النماذج — عمودان كحد أقصي */}
            <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {mission.models.map((model, idx) => (
                <ModelPanel key={model.id} model={model} isWinner={mission.winner === model.id} delay={idx * 0.12} />
              ))}
            </div>

            {/* حكم الحلبة */}
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-alemny-amber/35 bg-alemny-amber/8 p-4 md:p-5">
              <Trophy className="mt-1 h-5.5 w-5.5 shrink-0 text-alemny-amber" aria-hidden />
              <div>
                <p className="mb-1 text-[13px] font-bold text-alemny-amber">حُكم الحلبة — لماذا هذا الفائز؟</p>
                <p className="text-[14px] leading-8 text-alemny-muted">{mission.verdict}</p>
              </div>
            </div>

            {/* سير العمل الموصى به */}
            <div className="mb-8 rounded-2xl border border-alemny-purple/25 bg-[#0D0A18]/60 p-4 md:p-6">
              <p className="mb-4 flex items-center gap-2 text-[14px] font-bold text-white">
                <Route className="h-5 w-5 text-alemny-lilac" aria-hidden />
                سير العمل الموصى به في هذه المهمة:
              </p>
              <ol className="space-y-3">
                {mission.workflow.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-alemny-purple/50 bg-alemny-purple/15 text-[12px] font-bold text-alemny-lilac">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-[13.5px] leading-7 text-alemny-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* برومبت التحدي الموحد */}
            <ChallengePromptBox
              mission={mission}
              includeSignature={includeSignature}
              onToggleSignature={setIncludeSignature}
            />
          </motion.div>
        </AnimatePresence>
    </section>
  );
}

/* ----------------------------- بطاقة النموذج ----------------------------- */

function ModelPanel({ model, isWinner, delay }: { model: VersusMission["models"][number]; isWinner: boolean; delay: number }) {
  const meta = ARENA_MODELS_META[model.id];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`relative flex flex-col rounded-3xl border p-5 ${
        isWinner
          ? "border-alemny-purple bg-alemny-purple/10 shadow-[0_0_36px_rgba(128,70,233,0.35)]"
          : "border-alemny-purple/20 bg-[#0D0A18]/55"
      }`}
    >
      {isWinner && (
        <span className="btn-neon absolute -top-3.5 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white">
          <Crown className="h-3.5 w-3.5" aria-hidden />
          فائز هذه المهمة
        </span>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="t-card-title font-bold text-white">{meta.name}</p>
          <p className="font-en text-[11px] tracking-wide text-alemny-muted">{meta.nameEn}</p>
        </div>
        <span className="font-display text-3xl font-bold" style={{ color: meta.color }}>
          {arDigits(model.score)}
          <span className="text-sm font-medium text-alemny-muted">/١٠٠</span>
        </span>
      </div>

      {/* شريط الدرجة المتحرك */}
      <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-white/8" role="img" aria-label={`درجة ${meta.name}: ${arDigits(model.score)} من ١٠٠`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${model.score}%` }}
          transition={{ duration: 1, delay: delay + 0.15, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`, boxShadow: `0 0 12px ${meta.color}88` }}
        />
      </div>

      <ul className="mb-4 space-y-2">
        {model.pros.map((p) => (
          <li key={p} className="flex items-start gap-2 text-[12.5px] leading-6 text-alemny-muted">
            <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-alemny-emerald" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
      <ul className="space-y-2">
        {model.cons.map((c) => (
          <li key={c} className="flex items-start gap-2 text-[12.5px] leading-6 text-white/45">
            <X className="mt-1 h-3.5 w-3.5 shrink-0 text-alemny-rose" aria-hidden />
            {c}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ------------------------- برومبت التحدي الموحد ------------------------- */

function ChallengePromptBox({
  mission,
  includeSignature,
  onToggleSignature,
}: {
  mission: VersusMission;
  includeSignature: boolean;
  onToggleSignature: (v: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const prompt = useMemo(() => missionChallengePrompt(mission), [mission]);

  const onCopy = async () => {
    /* نسخ نقي: برومبت التحدي بلا فواصل زخرفية + توقيع المنصة عند التفعيل */
    const pure = prompt.replace(/─+/g, "").trim();
    const text = includeSignature ? `${pure}\n\n${BRAND_TEXT_SIGNATURE}` : pure;
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      toast.success("تم نسخ برومبت التحدي الموحد! ✓", {
        description: "الصقه في Gemini ثم Claude ثم ChatGPT وقارن بنفسك.",
      });
    } else {
      toast.error("تعذّر النسخ تلقائيًّا", { description: "حدد النص يدويًّا وانسخه." });
    }
  };

  return (
    <div className="rounded-2xl border border-alemny-emerald/30 bg-alemny-emerald/6 p-4 md:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="t-card-title font-bold text-white">برومبت التحدي الموحد</p>
          <p className="mt-0.5 text-[12px] text-alemny-muted">نفس النص في النماذج الثلاثة = مقارنة عادلة ١٠٠٪.</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className={`flex h-11 items-center gap-2 rounded-xl px-5 text-[13.5px] font-bold text-white ${copied ? "btn-emerald" : "btn-neon"}`}
          aria-live="polite"
        >
          {copied ? <Check className="h-4.5 w-4.5" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "تم النسخ بنجاح!" : "نسخ البرومبت الموحد"}
        </button>
      </div>
      {/* مفتاح توقيع المنصة عند النسخ */}
      <div className="mb-3 flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-1.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#C4A2FF]" aria-hidden />
          <span className="text-xs leading-5 text-white/60">توقيع علّمني تِك عند النسخ</span>
        </span>
        <Switch
          checked={includeSignature}
          onCheckedChange={onToggleSignature}
          aria-label="توقيع علّمني تِك عند النسخ"
          className="h-5 w-9 shrink-0 data-[state=checked]:bg-alemny-purple"
        />
      </div>
      <pre
        dir="rtl"
        className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-4 font-body text-[12.5px] leading-7 text-alemny-muted"
      >
        {prompt}
      </pre>
    </div>
  );
}
