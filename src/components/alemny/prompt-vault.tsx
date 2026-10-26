"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { PromptIconGlyph, ModelBadge } from "./icons";
import { copyText } from "@/lib/alemny/clipboard";
import { EVT_SET_PROMPT_TAB } from "@/lib/alemny/constants";
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

export function PromptVault() {
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const prompts = useAlemnyStore((s) => s.prompts);

  /* استقبال تصفية من البحث الشامل */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setTab(detail as TabId);
      setShowAll(true);
    };
    window.addEventListener(EVT_SET_PROMPT_TAB, handler);
    return () => window.removeEventListener(EVT_SET_PROMPT_TAB, handler);
  }, []);

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
    <section id="prompts" aria-label="مكتبة البرومبتات السحرية" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="النظام الأول — النسخ واللصق والنتيجة"
          eyebrowIcon={Wand2}
          title="مكتبة البرومبتات السحرية"
          highlight="الجاهزة للنسخ"
          description="برومبتات مهندَسة باحتراف لمهام حقيقية: اكتب متغيراتك داخل البطاقة، شاهد البرومبت يتحدث فورًا، ثم انسخه بضغطة واحدة والصقه في نموذجك المفضل."
        />

        {/* التبويبات */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="تصفية البرومبتات حسب الفئة">
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
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* بحث داخلي سريع */}
        <div className="mb-8 flex justify-center">
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
          <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
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
              {showAll ? "اعرض أقل" : `اعرض كل البرومبتات (${filtered.length})`}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================ بطاقة البرومبت ============================ */

function PromptCard({ prompt }: { prompt: MagicPrompt }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const categoryLabel = PROMPT_CATEGORIES.find((c) => c.id === prompt.category)?.label ?? "";

  /* استبدال المتغيرات بالقيم الحية (أو إبقاء القوس عند الفراغ) */
  const finalPrompt = useMemo(() => {
    let out = prompt.body;
    prompt.variables.forEach((v) => {
      const val = values[v.key]?.trim();
      out = out.replaceAll(`{{${v.key}}}`, val ? val : `{{${v.key}}}`);
    });
    return out;
  }, [prompt, values]);

  const segments = useMemo(() => {
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
    const ok = await copyText(finalPrompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      /* عدّاد النسخ الحي — يُسجَّل فورًا في Neon PostgreSQL */
      useAlemnyStore.getState().registerCopy(prompt.id);
      toast.success("تم نسخ البرومبت بنجاح! ✓", {
        description: "الصقه الآن في محادثة الذكاء الاصطناعي واحصل على نتيجتك.",
      });
    } else {
      toast.error("تعذّر النسخ تلقائيًّا", { description: "حدد النص يدويًّا من المعاينة وانسخه." });
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass glass-hover flex flex-col rounded-3xl p-5 md:p-6"
    >
      {/* الترويسة */}
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac">
          <PromptIconGlyph icon={prompt.icon} />
        </span>
        <div className="min-w-0">
          <span className="mb-1.5 inline-block rounded-full border border-alemny-purple/35 bg-alemny-purple/10 px-2.5 py-0.5 text-[10.5px] font-bold text-alemny-lilac">
            {categoryLabel}
          </span>
          <h3 className="text-[16.5px] font-bold leading-7 text-white">{prompt.title}</h3>
        </div>
      </div>

      {/* شارات النماذج المستهدفة */}
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {prompt.models.map((m) => (
          <ModelBadge key={m} model={m} />
        ))}
      </div>

      {/* خطاف النتيجة */}
      <div className="mb-4 flex items-start gap-2 rounded-2xl border border-alemny-emerald/30 bg-alemny-emerald/8 px-3.5 py-2.5">
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-alemny-emerald" aria-hidden />
        <p className="text-[12.5px] leading-6 text-alemny-emerald">
          <span className="font-bold">النتيجة التي ستحصل عليها: </span>
          {prompt.hook}
        </p>
      </div>

      {/* مخصص المتغيرات الحي */}
      {prompt.variables.length > 0 && (
        <div className="mb-4 rounded-2xl border border-alemny-purple/25 bg-[#0D0A18]/70 p-3.5">
          <p className="mb-2.5 flex items-center gap-1.5 text-[12px] font-bold text-alemny-muted">
            <SlidersHorizontal className="h-3.5 w-3.5 text-alemny-lilac" aria-hidden />
            خصّص البرومبت لموضوعك — شاهد المتغيرات تتحدث فورًا:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {prompt.variables.map((v) => (
              <label key={v.key} className="block">
                <span className="mb-1 block text-[11px] font-semibold text-alemny-muted">{v.label}</span>
                <input
                  type="text"
                  value={values[v.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [v.key]: e.target.value }))}
                  placeholder={v.placeholder}
                  className="w-full rounded-xl border border-alemny-purple/30 bg-[#120E22] px-3 py-2 text-[13px] text-white placeholder:text-white/25 transition-colors focus:border-alemny-purple focus:outline-none focus:ring-1 focus:ring-alemny-purple/50"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* معاينة البرومبت الحي */}
      <div
        dir={prompt.ltr ? "ltr" : "rtl"}
        className="mb-4 max-h-64 flex-1 overflow-y-auto rounded-2xl border border-alemny-purple/25 bg-black/45 p-4"
      >
        <p className="whitespace-pre-wrap text-left font-body text-[13px] leading-7 text-alemny-muted" style={{ textAlign: prompt.ltr ? "left" : "right" }}>
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
            )
          )}
        </p>
      </div>

      {/* نصيحة الاستخدام */}
      <div className="mb-4 space-y-1.5">
        {prompt.tips.slice(0, 1).map((tip) => (
          <p key={tip} className="flex items-start gap-1.5 text-[11.5px] leading-5 text-alemny-muted">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-alemny-amber" aria-hidden />
            {tip}
          </p>
        ))}
      </div>

      {/* عدّاد النسخ الحي + زر النسخ */}
      {typeof prompt.copiesCount === "number" && (
        <p className="mb-2.5 flex items-center justify-center gap-1.5 text-[11px] text-alemny-muted" aria-live="polite">
          <Copy className="h-3 w-3 text-alemny-lilac" aria-hidden />
          نُسخ هذا البرومبت
          <span className="font-bold text-alemny-lilac">
            {prompt.copiesCount.toLocaleString("ar-EG")}
          </span>
          مرة من قبل الطلاب والمطورين
        </p>
      )}

      <button
        type="button"
        onClick={onCopy}
        className={`mt-auto flex h-12 items-center justify-center gap-2 rounded-2xl text-[14.5px] font-bold text-white transition-all ${
          copied ? "btn-emerald" : "btn-neon"
        }`}
        aria-live="polite"
      >
        {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-4.5 w-4.5" aria-hidden />}
        {copied ? "تم النسخ بنجاح!" : "نسخ البرومبت بالكامل"}
      </button>
    </motion.article>
  );
}
