"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FlaskConical,
  Sparkles,
  Copy,
  Check,
  Loader2,
  RotateCcw,
  Wand2,
  BookOpen,
  Code2,
  Palette,
  Clapperboard,
  Briefcase,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { arNum } from "@/lib/alemny/format";
import { copyText } from "@/lib/alemny/clipboard";
import {
  BUILDER_FIELDS,
  BUILDER_MODELS,
  BUILDER_DEPTHS,
  generateBuilderPrompt,
  type BuilderFormState,
  type BuilderIcon,
} from "@/lib/alemny/builder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignaturePanel, PromptPreviewEditor } from "./prompt-copy-kit";
import { composePromptCopy } from "@/lib/alemny/signature";

const FIELD_ICONS: Record<BuilderIcon, typeof BookOpen> = {
  book: BookOpen,
  code: Code2,
  palette: Palette,
  video: Clapperboard,
  briefcase: Briefcase,
};

const INITIAL_FORM: BuilderFormState = {
  fieldId: BUILDER_FIELDS[0].id,
  goalId: BUILDER_FIELDS[0].goals[0].id,
  modelId: BUILDER_MODELS[0].id,
  depthId: BUILDER_DEPTHS[1].id,
  topic: "",
  extra: "",
};

export function PromptBuilder() {
  const [form, setForm] = useState<BuilderFormState>(INITIAL_FORM);
  const [output, setOutput] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  /* مسودة المستخدم — تعديل حر للبرومبت الناتج قبل النسخ */
  const [draft, setDraft] = useState<string | null>(null);
  /* توقيع علّمني تِك عند النسخ — مفعّل افتراضيًّا */
  const [includeSignature, setIncludeSignature] = useState(true);

  const field = useMemo(() => BUILDER_FIELDS.find((f) => f.id === form.fieldId) ?? BUILDER_FIELDS[0], [form.fieldId]);
  const model = useMemo(() => BUILDER_MODELS.find((m) => m.id === form.modelId) ?? BUILDER_MODELS[0], [form.modelId]);
  const depth = useMemo(() => BUILDER_DEPTHS.find((d) => d.id === form.depthId) ?? BUILDER_DEPTHS[0], [form.depthId]);

  const patch = (partial: Partial<BuilderFormState>) => setForm((prev) => ({ ...prev, ...partial }));

  /* وضع الصور: مجال التصميم + هدف «توليد صورة 8K ثلاثية الأبعاد» → توقيع بصري */
  const isImageMode = form.fieldId === "design" && form.goalId === "image";

  const changeField = (fieldId: string) => {
    const nextField = BUILDER_FIELDS.find((f) => f.id === fieldId) ?? BUILDER_FIELDS[0];
    patch({ fieldId, goalId: nextField.goals[0].id });
  };

  const generate = () => {
    setGenerating(true);
    setOutput(null);
    /* تأخير قصير لإحساس التوليد الفعلي */
    setTimeout(() => {
      setOutput(generateBuilderPrompt(form));
      setDraft(null);
      setGenerating(false);
    }, 550);
  };

  const onCopy = async () => {
    if (!output) return;
    /* نسخ نقي ١٠٠٪: النص المعروض بعد التعقيم + التوقيع المناسب (نصي/بصري) عند التفعيل فقط */
    const ok = await copyText(
      composePromptCopy(draft ?? output, isImageMode, includeSignature),
    );
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      toast.success("تم نسخ البرومبت الهندسي! ✓", { description: "الصقه في النموذج المستهدف وابدأ." });
    } else {
      toast.error("تعذّر النسخ تلقائيًّا", { description: "حدد النص يدويًّا وانسخه." });
    }
  };

  return (
    <section id="builder" aria-label="صانع البرومبتات الذكي" className="relative py-20 md:py-28">
      <SectionHeading
          eyebrow="المختبر الذكي — برومبت على مقاسك"
          eyebrowIcon={FlaskConical}
          title="صانع الأوامر الهندسي"
          highlight="المولّد الذكي المتدرج"
          description="اختر مجالك، النموذج المستهدف، هدفك، وعمق الصياغة — وسيبني لك المختبر برومبتًا هندسيًّا كاملًا: الدور، السياق، الخطوات، القيود، وصيغة المخرجات. جاهز للنسخ في ثوانٍ."
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          {/* لوحة التحكم */}
          <div className="glass rounded-3xl p-5 md:p-6 xl:col-span-2">
            <p className="mb-5 flex items-center gap-2 text-[15px] font-bold text-white">
              <Wand2 className="h-5 w-5 text-alemny-lilac" aria-hidden />
              لوحة التوليد
            </p>

            <div className="space-y-4">
              <Field label="المجال">
                <Select value={form.fieldId} onValueChange={changeField}>
                  <SelectTrigger className="min-h-[48px] w-full border-alemny-purple/35 bg-[#120E22] text-base text-white focus:ring-alemny-purple/50">
                    <SelectValue placeholder="اختر المجال" />
                  </SelectTrigger>
                  <SelectContent className="border-alemny-purple/40 bg-[#140F24] text-white">
                    {BUILDER_FIELDS.map((f) => {
                      const Icon = FIELD_ICONS[f.icon];
                      return (
                        <SelectItem key={f.id} value={f.id} className="focus:bg-alemny-purple/20">
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-alemny-lilac" aria-hidden />
                            {f.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="الهدف المطلوب">
                <Select value={form.goalId} onValueChange={(v) => patch({ goalId: v })}>
                  <SelectTrigger className="min-h-[48px] w-full border-alemny-purple/35 bg-[#120E22] text-base text-white focus:ring-alemny-purple/50">
                    <SelectValue placeholder="اختر الهدف" />
                  </SelectTrigger>
                  <SelectContent className="border-alemny-purple/40 bg-[#140F24] text-white">
                    {field.goals.map((g) => (
                      <SelectItem key={g.id} value={g.id} className="focus:bg-alemny-purple/20">
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="النموذج المستهدف">
                <Select value={form.modelId} onValueChange={(v) => patch({ modelId: v })}>
                  <SelectTrigger className="min-h-[48px] w-full border-alemny-purple/35 bg-[#120E22] text-base text-white focus:ring-alemny-purple/50">
                    <SelectValue placeholder="اختر النموذج" />
                  </SelectTrigger>
                  <SelectContent className="border-alemny-purple/40 bg-[#140F24] text-white">
                    {BUILDER_MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="font-en focus:bg-alemny-purple/20">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 rounded-lg border border-alemny-cyan/25 bg-alemny-cyan/8 px-3 py-2 text-[11.5px] leading-5 text-alemny-cyan">
                  تلميح النموذج: {model.note}
                </p>
              </Field>

              <Field label="مستوى العمق">
                <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="مستوى العمق">
                  {BUILDER_DEPTHS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => patch({ depthId: d.id })}
                      aria-pressed={form.depthId === d.id}
                      className={`rounded-xl px-1 py-2.5 text-[12px] font-bold transition-all ${
                        form.depthId === d.id ? "btn-neon text-white" : "glass-soft text-alemny-muted hover:text-white"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="الموضوع أو المدخل الأساسي">
                <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => patch({ topic: e.target.value })}
                  placeholder="مثال: مادة هندسة البرمجيات / متجر إلكتروني للعطور..."
                  className="glass-input w-full min-h-[48px] text-base placeholder:text-white/25"
                />
              </Field>

              <Field label="تفاصيل إضافية (اختياري)">
                <textarea
                  value={form.extra}
                  onChange={(e) => patch({ extra: e.target.value })}
                  placeholder="أي قيود أو سياق خاص: مدة، ميزانية، أسلوب..."
                  rows={2}
                  className="glass-input w-full min-h-[48px] text-base placeholder:text-white/25"
                />
              </Field>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={generate}
                  disabled={generating}
                  className="btn-neon flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white disabled:opacity-70"
                >
                  {generating ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Sparkles className="h-5 w-5" aria-hidden />}
                  {generating ? "جاري الهندسة..." : "توليد البرومبت الهندسي"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setOutput(null);
                    setDraft(null);
                  }}
                  className="glass-soft glass-hover flex h-13 w-13 items-center justify-center rounded-2xl text-alemny-muted hover:text-white"
                  aria-label="إعادة تعيين المختبر"
                  title="إعادة تعيين"
                >
                  <RotateCcw className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
          </div>

          {/* لوحة المخرجات */}
          <div className="glass flex min-h-[420px] flex-col rounded-3xl p-5 md:p-6 xl:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-[15px] font-bold text-white">
                <FlaskConical className="h-5 w-5 text-alemny-emerald" aria-hidden />
                البرومبت الهندسي الناتج
              </p>
              {output && (
                <span className="rounded-full border border-alemny-purple/35 bg-alemny-purple/10 px-3 py-1 text-[11px] font-bold text-alemny-lilac">
                  {arNum(output.length)} حرفًا • ٥ أقسام
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-1 flex-col items-center justify-center gap-4"
                >
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-alemny-purple" aria-hidden />
                    <span className="absolute inset-0 -z-10 rounded-full bg-alemny-purple/30 blur-xl" />
                  </div>
                  <p className="text-sm text-alemny-muted">يهندس البرومبت: الدور ← السياق ← الخطوات ← القيود ← الصيغة...</p>
                </motion.div>
              ) : output ? (
                <motion.div key="output" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col">
                  <PromptPreviewEditor
                    value={draft ?? output}
                    onChange={setDraft}
                    dir="rtl"
                    isImage={isImageMode}
                    signatureOn={includeSignature}
                    minHeightClass="min-h-[260px]"
                    ariaLabel="البرومبت الهندسي الناتج — قابل للتعديل قبل النسخ"
                  />
                  <SignaturePanel
                    isImage={isImageMode}
                    checked={includeSignature}
                    onChange={setIncludeSignature}
                    className="mb-3 mt-3"
                  />
                  <button
                    type="button"
                    onClick={onCopy}
                    className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-[14.5px] font-bold text-white ${copied ? "btn-emerald" : "btn-neon"}`}
                    aria-live="polite"
                  >
                    {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-4.5 w-4.5" aria-hidden />}
                    {copied ? "تم النسخ بنجاح!" : "نسخ البرومبت الصافي"}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-alemny-purple/30 bg-black/20 px-6 py-12 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-alemny-purple/40 bg-alemny-purple/12 text-alemny-lilac">
                    <Sparkles className="h-7 w-7" aria-hidden />
                  </span>
                  <p className="max-w-sm text-[14px] leading-8 text-alemny-muted">
                    اختر إعداداتك من اللوحة الجانبية ثم اضغط «توليد البرومبت الهندسي» — سيظهر هنا برومبت من ٥ أقسام
                    احترافية: الدور، السياق، الخطوات، القيود، وصيغة المخرجات.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold text-alemny-muted">{label}</span>
      {children}
    </label>
  );
}
