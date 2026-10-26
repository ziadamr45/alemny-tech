"use client";

/* ============================================================
   مكتبة هندسة الأوامر — /prompts (V2)
   • بطاقات واسعة ونظيفة: بلا مدخلات مكدّسة داخل البطاقة.
   • «تخصيص ونسخ البرومبت» يفتح نافذة زجاجية كاملة (Modal)
     فيها مخصص المتغيرات الحي + المعاينة + النسخ.
   • عدّادات نسخ حية من Neon PostgreSQL بأرقام عربية موحدة.
   ============================================================ */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Wand2,
  Zap,
  Copy,
  Check,
  SlidersHorizontal,
  ChevronDown,
  Lightbulb,
  SearchX,
  X,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { SectionHeading } from "./section-heading";
import { PromptIconGlyph, ModelBadge } from "./icons";
import { copyText } from "@/lib/alemny/clipboard";
import { arNum } from "@/lib/alemny/format";
import { buildPurePrompt } from "@/lib/alemny/signature";
import { useAlemnyStore } from "@/lib/alemny/store";
import {
  PROMPT_CATEGORIES,
  type MagicPrompt,
  type PromptCategoryId,
} from "@/lib/alemny/prompts";

type TabId = "all" | PromptCategoryId;

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "الكل" },
  ...PROMPT_CATEGORIES.map((c) => ({ id: c.id as TabId, label: c.label })),
];

const INITIAL_VISIBLE = 6;

interface PromptVaultProps {
  /** تصفية أولية من معامل المسار ?cat= */
  initialCat?: string;
  /** برومبت مطلوب فتحه للتخصيص مباشرة ?focus= */
  focusSlug?: string;
}

export function PromptVault({ initialCat, focusSlug }: PromptVaultProps) {
  const [tab, setTab] = useState<TabId>((initialCat as TabId) ?? "all");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(!!initialCat && initialCat !== "all");
  const [customize, setCustomize] = useState<MagicPrompt | null>(null);
  /* توقيع علَّمني تِك عند النسخ — مفعَّل افتراضيًّا ومشترك بين البطاقات ونافذة التخصيص */
  const [includeSignature, setIncludeSignature] = useState(true);
  const prompts = useAlemnyStore((s) => s.prompts);

  /* فتح برومبت محدد عبر ?focus= — تعديل الحالة أثناء التصيير */
  const [prevFocus, setPrevFocus] = useState<string | undefined>(undefined);
  if (focusSlug !== prevFocus) {
    setPrevFocus(focusSlug);
    const target = focusSlug ? prompts.find((p) => p.id === focusSlug) : undefined;
    if (target) setCustomize(target);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      const inTab = tab === "all" || p.category === tab;
      const inQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.hook.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q));
      return inTab && inQuery;
    });
  }, [tab, query, prompts]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  return (
    <section id="prompts" aria-label="مكتبة هندسة الأوامر" className="relative py-20 md:py-28">
      <SectionHeading
          eyebrow="هندسة الأوامر — انسخ وخصّص والصق"
          eyebrowIcon={Wand2}
          title="مكتبة البرومبتات الهندسية"
          highlight="الجاهزة للنسخ"
          description="برومبتات مهندَسة باحتراف لمهام حقيقية: اضغط «تخصيص ونسخ» لفتح نافذة التخصيص الكاملة، أدخل متغيراتك وشاهد البرومبت يتحدث فورًا، ثم انسخه بضغطة واحدة."
        />

        {/* التبويبات */}
        <div className="filter-chips mb-4 items-center" role="tablist" aria-label="تصفية البرومبتات حسب الفئة">
          {TABS.map((t) => {
            const count = t.id === "all" ? prompts.length : prompts.filter((p) => p.category === t.id).length;
            const activeTab = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab}
                onClick={() => setTab(t.id)}
                className={`relative rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-300 ${
                  activeTab
                    ? "btn-neon text-white"
                    : "glass-soft text-alemny-muted hover:border-alemny-purple/60 hover:text-white"
                }`}
              >
                {t.label}
                <span className={`mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${activeTab ? "bg-white/20 text-white" : "bg-alemny-purple/20 text-alemny-lilac"}`}>
                  {arNum(count)}
                </span>
              </button>
            );
          })}
        </div>

        {/* بحث داخلي سريع */}
        <div className="mb-10 flex justify-center">
          <div className="glass-soft flex w-full max-w-md items-center gap-2 rounded-full px-4 py-2.5">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-alemny-lilac" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث داخل المكتبة: مذاكرة، سيرة ذاتية، صور 8K..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              aria-label="بحث داخل مكتبة البرومبتات"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs text-alemny-muted hover:text-white"
                aria-label="مسح البحث"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* الشبكة */}
        {visible.length === 0 ? (
          <div className="glass mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
            <SearchX className="h-10 w-10 text-alemny-lilac" aria-hidden />
            <p className="font-bold text-white">لا يوجد برومبت مطابق لبحثك</p>
            <p className="text-sm text-alemny-muted">جرّب كلمة أعم مثل «مذاكرة» أو أعد تعيين الفلاتر.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTab("all");
              }}
              className="btn-neon mt-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
            <AnimatePresence mode="popLayout">
              {visible.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  includeSignature={includeSignature}
                  onToggleSignature={setIncludeSignature}
                  onCustomize={() => setCustomize(prompt)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* عرض الكل */}
        {filtered.length > INITIAL_VISIBLE && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="glass glass-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white"
              aria-expanded={showAll}
            >
              {showAll ? "اعرض أقل" : `اعرض كل البرومبتات (${arNum(filtered.length)})`}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} aria-hidden />
            </button>
          </div>
        )}

      {/* نافذة التخصيص الكاملة */}
      <CustomizeModal
        prompt={customize}
        onClose={() => setCustomize(null)}
        includeSignature={includeSignature}
        onToggleSignature={setIncludeSignature}
      />
    </section>
  );
}

/* ============================ بطاقة البرومبت ============================ */

function PromptCard({
  prompt,
  includeSignature,
  onToggleSignature,
  onCustomize,
}: {
  prompt: MagicPrompt;
  includeSignature: boolean;
  onToggleSignature: (v: boolean) => void;
  onCustomize: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const categoryLabel = PROMPT_CATEGORIES.find((c) => c.id === prompt.category)?.label ?? "";

  const onQuickCopy = async () => {
    /* نسخ نقي: نص البرومبت فقط (بلا فواصل أو شرح) + توقيع المنصة عند التفعيل */
    const ok = await copyText(buildPurePrompt(prompt.body, prompt.category, includeSignature));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      /* عدّاد النسخ الحي — يُسجَّل فورًا في Neon PostgreSQL */
      useAlemnyStore.getState().registerCopy(prompt.id);
      toast.success("تم نسخ البرومبت بنجاح! ✓", {
        description: "الصقه الآن في محادثة الذكاء الاصطناعي واحصل على نتيجتك.",
      });
    } else {
      toast.error("تعذّر النسخ تلقائيًّا", { description: "افتح نافذة التخصيص وانسخ من المعاينة يدويًّا." });
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="card-3d flex flex-col rounded-3xl p-6 md:p-7"
    >
      <span className="ambient-spot -top-14 left-1/3 h-32 w-32" aria-hidden />

      {/* الترويسة */}
      <div className="relative z-10 mb-4 flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac shadow-[0_8px_24px_-8px_rgba(128,70,233,0.55)]">
          <PromptIconGlyph icon={prompt.icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <span className="mb-1.5 inline-block rounded-full border border-alemny-purple/35 bg-alemny-purple/10 px-2.5 py-0.5 text-[10.5px] font-bold text-alemny-lilac">
            {categoryLabel}
          </span>
          <h3 className="t-card-title font-bold text-white">{prompt.title}</h3>
        </div>
      </div>

      {/* شارات النماذج المستهدفة */}
      <div className="relative z-10 mb-4 flex flex-wrap gap-1.5">
        {prompt.models.map((m) => (
          <ModelBadge key={m} model={m} />
        ))}
      </div>

      {/* خطاف النتيجة */}
      <div className="relative z-10 mb-4 flex items-start gap-2 rounded-2xl border border-alemny-emerald/30 bg-alemny-emerald/8 px-3.5 py-3">
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-alemny-emerald" aria-hidden />
        <p className="text-[12.5px] leading-6 text-alemny-emerald">
          <span className="font-bold">النتيجة التي ستحصل عليها: </span>
          {prompt.hook}
        </p>
      </div>

      {/* لمحة عن البرومبت */}
      <p
        dir={prompt.ltr ? "ltr" : "rtl"}
        className="relative z-10 mb-4 line-clamp-3 flex-1 rounded-2xl border border-alemny-purple/20 bg-black/40 p-4 text-[12.5px] leading-6 text-alemny-muted"
        style={{ textAlign: prompt.ltr ? "left" : "right" }}
      >
        {prompt.body.replace(/\{\{\w+\}\}/g, "…").slice(0, 220)}
        {prompt.body.length > 220 ? "…" : ""}
      </p>

      {/* نصيحة الاستخدام */}
      <div className="relative z-10 mb-5 space-y-1.5">
        {prompt.tips.slice(0, 1).map((tip) => (
          <p key={tip} className="flex items-start gap-1.5 text-[11.5px] leading-5 text-alemny-muted">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-alemny-amber" aria-hidden />
            {tip}
          </p>
        ))}
      </div>

      {/* عدّاد النسخ الحي */}
      {typeof prompt.copiesCount === "number" && (
        <p className="relative z-10 mb-3.5 flex items-center justify-center gap-1.5 text-[11px] text-alemny-muted" aria-live="polite">
          <Copy className="h-3 w-3 text-alemny-lilac" aria-hidden />
          نُسخ هذا البرومبت
          <span className="font-bold text-alemny-lilac">{arNum(prompt.copiesCount)}</span>
          مرة من قبل الطلاب والمطورين
        </p>
      )}

      {/* مفتاح توقيع المنصة عند النسخ */}
      <div className="relative z-10 mb-2.5 flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-1.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#C4A2FF]" aria-hidden />
          <span className="text-xs leading-5 text-white/60">توقيع علَّمني تِك عند النسخ</span>
        </span>
        <Switch
          checked={includeSignature}
          onCheckedChange={onToggleSignature}
          aria-label="توقيع علَّمني تِك عند النسخ"
          className="h-5 w-9 shrink-0 data-[state=checked]:bg-alemny-purple"
        />
      </div>

      {/* أزرار الإجراء — نسخ سريع + تخصيص كامل */}
      <div className="relative z-10 mt-auto grid gap-2.5">
        <button
          type="button"
          onClick={onCustomize}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-alemny-purple/45 bg-alemny-purple/12 text-[14px] font-bold text-white transition-all hover:border-alemny-lilac hover:bg-alemny-purple/22 hover:shadow-[0_0_28px_rgba(128,70,233,0.35)]"
        >
          <SlidersHorizontal className="h-4.5 w-4.5" aria-hidden />
          تخصيص ونسخ البرومبت
        </button>
        <button
          type="button"
          onClick={onQuickCopy}
          className={`flex h-11 items-center justify-center gap-2 rounded-2xl text-[13.5px] font-bold text-white transition-all ${
            copied ? "btn-emerald" : "btn-neon"
          }`}
          aria-live="polite"
        >
          {copied ? <Check className="h-4.5 w-4.5" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "تم النسخ بنجاح!" : "نسخ سريع للنص الأصلي"}
        </button>
      </div>
    </motion.article>
  );
}

/* ==================== نافذة التخصيص الزجاجية الكاملة ==================== */

function CustomizeModal({
  prompt,
  onClose,
  includeSignature,
  onToggleSignature,
}: {
  prompt: MagicPrompt | null;
  onClose: () => void;
  includeSignature: boolean;
  onToggleSignature: (v: boolean) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  /* تصفير القيم عند فتح برومبت مختلف — تعديل أثناء التصيير */
  const [prevPromptId, setPrevPromptId] = useState<string | undefined>(prompt?.id);
  if (prompt?.id !== prevPromptId) {
    setPrevPromptId(prompt?.id);
    setValues({});
    setCopied(false);
  }

  const finalPrompt = useMemo(() => {
    if (!prompt) return "";
    let out = prompt.body;
    prompt.variables.forEach((v) => {
      const val = values[v.key]?.trim();
      out = out.replaceAll(`{{${v.key}}}`, val ? val : `{{${v.key}}}`);
    });
    return out;
  }, [prompt, values]);

  const segments = useMemo(() => {
    if (!prompt) return [];
    return prompt.body.split(/(\{\{\w+\}\})/g).map((part) => {
      const match = part.match(/^\{\{(\w+)\}\}$/);
      if (match) {
        const v = prompt.variables.find((x) => x.key === match[1]);
        return { type: "var" as const, key: match[1], label: v?.label ?? match[1], value: values[match[1]]?.trim() ?? "" };
      }
      return { type: "text" as const, text: part };
    });
  }, [prompt, values]);

  const onCopy = async () => {
    if (!prompt) return;
    /* نسخ نقي: البرومبت المخصَّص فقط بلا فواصل زخرفية + توقيع المنصة عند التفعيل */
    const ok = await copyText(buildPurePrompt(finalPrompt, prompt.category, includeSignature));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      useAlemnyStore.getState().registerCopy(prompt.id);
      toast.success("تم نسخ البرومبت المخصَّص! ✓", {
        description: "قيمك الخاصة مدمجة الآن في النص — الصقه مباشرة.",
      });
    } else {
      toast.error("تعذّر النسخ تلقائيًّا", { description: "حدد النص يدويًّا من المعاينة وانسخه." });
    }
  };

  const filledCount = prompt ? prompt.variables.filter((v) => (values[v.key] ?? "").trim()).length : 0;

  return (
    <Dialog open={!!prompt} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="glass w-[calc(100%-2rem)] max-w-3xl sm:max-w-3xl gap-0 overflow-hidden rounded-3xl border-alemny-purple/40 bg-[#0C0916]/97 p-0 shadow-[0_40px_120px_-30px_rgba(128,70,233,0.55)]"
      >
        {prompt && (
          <div className="max-h-[70vh] overflow-y-auto no-scrollbar p-6 md:p-8">
            <DialogTitle className="sr-only">تخصيص البرومبت: {prompt.title}</DialogTitle>
            <DialogDescription className="sr-only">أدخل قيم متغيراتك وشاهد البرومبت يتحدث فورًا ثم انسخه.</DialogDescription>

            {/* ترويسة النافذة */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac">
                  <PromptIconGlyph icon={prompt.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="mb-1 text-[11px] font-bold text-alemny-lilac">
                    {PROMPT_CATEGORIES.find((c) => c.id === prompt.category)?.label}
                  </p>
                  <h3 className="t-card-title font-display font-bold text-white">{prompt.title}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="glass-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-alemny-muted transition-colors hover:text-white"
                aria-label="إغلاق نافذة التخصيص"
              >
                <X className="h-4.5 w-4.5" aria-hidden />
              </button>
            </div>

            {/* شارات النماذج */}
            <div className="mb-6 flex flex-wrap gap-1.5">
              {prompt.models.map((m) => (
                <ModelBadge key={m} model={m} />
              ))}
            </div>

            {/* مخصص المتغيرات — واسع ومريح */}
            {prompt.variables.length > 0 ? (
              <div className="mb-6 rounded-2xl border border-alemny-purple/30 bg-[#0D0A18]/80 p-5 md:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-[13.5px] font-bold text-white">
                    <SlidersHorizontal className="h-4 w-4 text-alemny-lilac" aria-hidden />
                    خصّص البرومبت لموضوعك — يتحدّث فورًا:
                  </p>
                  <span className="neon-chip px-3 py-1 text-[11px] font-bold text-alemny-lilac" aria-live="polite">
                    {arNum(filledCount)} / {arNum(prompt.variables.length)} حقول معبّأة
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 w-full xl:grid-cols-2">
                  {prompt.variables.map((v) => (
                    <label key={v.key} className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-alemny-muted">{v.label}</span>
                      <input
                        type="text"
                        value={values[v.key] ?? ""}
                        onChange={(e) => setValues((prev) => ({ ...prev, [v.key]: e.target.value }))}
                        placeholder={v.placeholder}
                        className="glass-input w-full min-h-[48px] text-base placeholder:text-white/30"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 flex items-center gap-2 rounded-2xl border border-alemny-purple/25 bg-[#0D0A18]/80 px-4 py-3 text-[12.5px] text-alemny-muted">
                <Sparkles className="h-4 w-4 text-alemny-lilac" aria-hidden />
                هذا البرومبت جاهز كما هو بلا متغيرات — انسخه مباشرة.
              </div>
            )}

            {/* معاينة حية كاملة */}
            <div className="mb-5">
              <p className="mb-2 text-[13px] font-bold text-white">المعاينة الحية — جاهزة للنسخ:</p>
              <div
                dir={prompt.ltr ? "ltr" : "rtl"}
                className="max-h-72 overflow-y-auto rounded-2xl border border-alemny-purple/25 bg-black/50 p-5"
              >
                <p className="whitespace-pre-wrap text-[13px] leading-7 text-alemny-muted" style={{ textAlign: prompt.ltr ? "left" : "right" }}>
                  {segments.map((seg, i) =>
                    seg.type === "text" ? (
                      <span key={i}>{seg.text}</span>
                    ) : seg.value ? (
                      <span key={i} className="var-filled" title={seg.label}>
                        {seg.value}
                      </span>
                    ) : (
                      <span key={i} className="var-slot" title={seg.label}>
                        {seg.label}
                      </span>
                    ),
                  )}
                </p>
              </div>
              {includeSignature && (
                <p className="mt-2 text-xs text-white/45">✨ سيُضاف توقيع علّمني تِك تلقائيًّا في نهاية النص المنسوخ</p>
              )}
            </div>

            {/* نصائح الخبراء */}
            {prompt.tips.length > 0 && (
              <div className="mb-6 space-y-2 rounded-2xl border border-alemny-amber/25 bg-alemny-amber/6 p-4">
                {prompt.tips.map((tip) => (
                  <p key={tip} className="flex items-start gap-2 text-[12.5px] leading-6 text-alemny-muted">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-alemny-amber" aria-hidden />
                    {tip}
                  </p>
                ))}
              </div>
            )}

            {/* مفتاح توقيع المنصة عند النسخ */}
            <div className="mb-2.5 flex min-h-[44px] items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-1.5">
              <span className="flex min-w-0 items-center gap-2">
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
            <p className="mb-4 text-xs leading-5 text-white/45">
              يُضاف توقيع المنصة وروابط المتابعة في نهاية النص المنسوخ — ويمكنك إيقافه بضغطة واحدة
            </p>

            {/* زر النسخ الرئيسي */}
            <button
              type="button"
              onClick={onCopy}
              className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-[15.5px] font-bold text-white transition-all ${
                copied ? "btn-emerald" : "btn-neon"
              }`}
              aria-live="polite"
            >
              {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-5 w-5" aria-hidden />}
              {copied ? "تم النسخ بنجاح — بالتوفيق!" : "نسخ البرومبت المخصَّص بالكامل"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
