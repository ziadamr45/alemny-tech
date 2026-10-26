"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Search, ExternalLink, Check, Target, Gift, SearchX, Sparkles } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { ToolIconGlyph } from "./icons";
import { arNum } from "@/lib/alemny/format";
import { useAlemnyStore } from "@/lib/alemny/store";
import {
  TOOL_CATEGORIES,
  TOOL_PRICING,
  type AITool,
  type ToolCategoryId,
  type ToolPricing,
} from "@/lib/alemny/tools";

type CatFilter = "all" | ToolCategoryId;
type PriceFilter = "all" | ToolPricing;

export function ToolsDirectory({ initialCat }: { initialCat?: string }) {
  const [cat, setCat] = useState<CatFilter>((initialCat as CatFilter) ?? "all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [query, setQuery] = useState("");
  const tools = useAlemnyStore((s) => s.tools);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const inCat = cat === "all" || t.category === cat;
      const inPrice = price === "all" || t.pricing === price;
      const inQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.tagline.includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q));
      return inCat && inPrice && inQuery;
    });
  }, [cat, price, query, tools]);

  const resetAll = () => {
    setCat("all");
    setPrice("all");
    setQuery("");
  };

  return (
    <section id="tools" aria-label="دليل أدوات الذكاء الاصطناعي" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="الدليل التقني المتجدد — موثق ومراجع يدويًّا"
          eyebrowIcon={BadgeCheck}
          title="الدليل التقني المتجدد"
          highlight="أدوات مُختبرة وموثقة"
          description="ثماني أدوات اختبرناها فعليًّا في قناة علَّمني تِك: الميزات الحقيقية، سيناريو استخدام عملي، ورابط رسمي مباشر — بلا إعلانات مدفوعة ولا ترشيحات وهمية."
        />

        {/* الفلاتر */}
        <div className="glass mb-10 space-y-4 rounded-3xl p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* تصفية الفئات */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="تصفية حسب الفئة">
              <span className="ml-1 text-xs font-bold text-alemny-muted">الفئة:</span>
              <FilterChip active={cat === "all"} onClick={() => setCat("all")} label="الكل" count={tools.length} />
              {TOOL_CATEGORIES.map((c) => (
                <FilterChip
                  key={c.id}
                  active={cat === c.id}
                  onClick={() => setCat(c.id)}
                  label={c.shortLabel}
                  count={tools.filter((t) => t.category === c.id).length}
                />
              ))}
            </div>

            {/* تصفية السعر */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="تصفية حسب السعر">
              <span className="ml-1 text-xs font-bold text-alemny-muted">السعر:</span>
              <FilterChip active={price === "all"} onClick={() => setPrice("all")} label="الكل" small />
              {TOOL_PRICING.map((p) => (
                <FilterChip
                  key={p.id}
                  active={price === p.id}
                  onClick={() => setPrice(p.id)}
                  label={p.label}
                  small
                />
              ))}
            </div>
          </div>

          {/* البحث */}
          <div className="flex items-center gap-3 border-t border-alemny-purple/20 pt-4">
            <div className="glass-soft flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-alemny-lilac" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن أداة: NotebookLM، Cursor، Veo..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
                aria-label="بحث في دليل الأدوات"
              />
            </div>
            <span className="hidden shrink-0 text-xs text-alemny-muted sm:block">
              عرض <span className="font-bold text-white">{arNum(filtered.length)}</span> من {arNum(tools.length)} أدوات
            </span>
          </div>
        </div>

        {/* البطاقات */}
        {filtered.length === 0 ? (
          <div className="glass mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
            <SearchX className="h-10 w-10 text-alemny-cyan" aria-hidden />
            <p className="font-bold text-white">لا توجد أداة مطابقة للفلاتر الحالية</p>
            <p className="text-sm text-alemny-muted">وسّع البحث أو أعد تعيين الفلاتر لعرض كل الأدوات.</p>
            <button type="button" onClick={resetAll} className="btn-neon mt-2 rounded-full px-5 py-2.5 text-sm font-bold text-white">
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  small = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full font-bold transition-all duration-300 ${small ? "px-3 py-1.5 text-[12px]" : "px-3.5 py-2 text-[12.5px]"} ${
        active ? "btn-neon text-white" : "glass-soft text-alemny-muted hover:border-alemny-purple/60 hover:text-white"
      }`}
    >
      {label}
      {typeof count === "number" && (
        <span className={`mr-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] ${active ? "bg-white/20 text-white" : "bg-alemny-purple/20 text-alemny-lilac"}`}>
          {arNum(count)}
        </span>
      )}
    </button>
  );
}

function ToolCard({ tool }: { tool: AITool }) {
  const pricingMeta =
    tool.pricing === "free"
      ? { label: "مجاني بالكامل", color: "#34D399" }
      : { label: "فريميوم / باقات الطلاب", color: "#FBBF24" };

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
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-alemny-purple/40 bg-alemny-purple/15 text-alemny-lilac">
          <ToolIconGlyph icon={tool.icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold leading-7 text-white">{tool.name}</h3>
          <p className="font-en text-[11.5px] tracking-wide text-alemny-muted">{tool.nameEn}</p>
          {tool.badge && (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-alemny-amber/40 bg-alemny-amber/10 px-2 py-0.5 text-[10px] font-bold text-alemny-amber">
              <Sparkles className="h-3 w-3" aria-hidden />
              {tool.badge}
            </span>
          )}
        </div>
      </div>

      <p className="mb-4 text-[13.5px] leading-7 text-alemny-muted">{tool.tagline}</p>

      {/* شارة السعر */}
      <div className="mb-4">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-bold"
          style={{ borderColor: `${pricingMeta.color}44`, backgroundColor: `${pricingMeta.color}12`, color: pricingMeta.color }}
        >
          <Gift className="h-3.5 w-3.5" aria-hidden />
          {pricingMeta.label}
        </span>
      </div>

      {/* الميزات */}
      <ul className="mb-4 space-y-2">
        {tool.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[12.5px] leading-6 text-alemny-muted">
            <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-alemny-emerald" aria-hidden />
            {f}
          </li>
        ))}
      </ul>

      {/* سيناريو عملي */}
      <div className="mb-5 rounded-2xl border border-alemny-cyan/25 bg-alemny-cyan/8 p-3.5">
        <p className="mb-1 flex items-center gap-1.5 text-[12px] font-bold text-alemny-cyan">
          <Target className="h-3.5 w-3.5" aria-hidden />
          سيناريو عملي من علَّمني تِك:
        </p>
        <p className="text-[12.5px] leading-6 text-alemny-muted">{tool.useCase}</p>
      </div>

      {/* الرابط الرسمي */}
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="glass glass-hover mt-auto flex h-12 items-center justify-center gap-2 rounded-2xl text-[14px] font-bold text-white"
        aria-label={`فتح الموقع الرسمي لـ ${tool.name}`}
      >
        <ExternalLink className="h-4.5 w-4.5 text-alemny-cyan" aria-hidden />
        الرابط الرسمي المباشر
      </a>
    </motion.article>
  );
}
