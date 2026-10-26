"use client";

/* ============================================================
   المقالات والأخبار التقنية — /articles (V2)
   موسوعة مقالات دائمة الصلة مع قارئ زجاجي كامل الشاشة.
   البيانات حية من Neon PostgreSQL مع احتياطي محلي أنيق.
   ============================================================ */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Newspaper,
  Clock,
  SearchX,
  X,
  Tag,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SectionHeading } from "./section-heading";
import { arNum, arDate } from "@/lib/alemny/format";
import { useAlemnyStore } from "@/lib/alemny/store";
import { ARTICLE_CATEGORIES, type Article, type ArticleCategoryId } from "@/lib/alemny/articles";

type CatFilter = "all" | ArticleCategoryId;

interface ArticlesFeedProps {
  initialCat?: string;
  focusSlug?: string;
}

export function ArticlesFeed({ initialCat, focusSlug }: ArticlesFeedProps) {
  const [cat, setCat] = useState<CatFilter>((initialCat as CatFilter) ?? "all");
  const [query, setQuery] = useState("");
  const [reading, setReading] = useState<Article | null>(null);
  const articles = useAlemnyStore((s) => s.articles);

  /* فتح مقال محدد عبر ?focus= — تعديل الحالة أثناء التصيير (نمط React الموثق) */
  const [prevFocus, setPrevFocus] = useState<string | undefined>(undefined);
  if (focusSlug !== prevFocus) {
    setPrevFocus(focusSlug);
    const target = focusSlug ? articles.find((a) => a.id === focusSlug) : undefined;
    if (target) setReading(target);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const inCat = cat === "all" || a.category === cat;
      const inQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.keywords.some((k) => k.toLowerCase().includes(q));
      return inCat && inQuery;
    });
  }, [articles, cat, query]);

  return (
    <section aria-label="المقالات والأخبار التقنية" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="الموسوعة الدائمة — فهم أعمق"
          eyebrowIcon={Newspaper}
          title="المقالات والأخبار التقنية"
          highlight="من كلام النظرية إلى الإتقان"
          description="مقالات شاملة في عالم التكنولوجيا، الذكاء الاصطناعي، البرمجة، الأمن الرقمي، والمستقبل الرقمي — مكتوبة لتُقرأ مرة وتُستفاد منها سنوات."
        />

        {/* الفلاتر */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="تصفية المقالات حسب الفئة">
          <CategoryChip
            active={cat === "all"}
            onClick={() => setCat("all")}
            label="الكل"
            count={articles.length}
            color="#A855F7"
          />
          {ARTICLE_CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
              label={c.label}
              count={articles.filter((a) => a.category === c.id).length}
              color={c.color}
            />
          ))}
        </div>

        {/* بحث */}
        <div className="mb-10 flex justify-center">
          <div className="glass-soft flex w-full max-w-md items-center gap-2 rounded-full px-4 py-2.5">
            <BookOpen className="h-4 w-4 shrink-0 text-alemny-lilac" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في المقالات: أمن، وكلاء، مشاريع..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              aria-label="بحث في المقالات"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-xs text-alemny-muted hover:text-white" aria-label="مسح البحث">
                مسح
              </button>
            )}
          </div>
        </div>

        {/* الشبكة */}
        {filtered.length === 0 ? (
          <div className="glass mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
            <SearchX className="h-10 w-10 text-alemny-lilac" aria-hidden />
            <p className="font-bold text-white">لا يوجد مقال مطابق لبحثك</p>
            <p className="text-sm text-alemny-muted">جرّب كلمة أعم أو أعد تعيين الفلاتر.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCat("all");
              }}
              className="btn-neon mt-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} onOpen={() => setReading(article)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* نافذة القراءة الكاملة */}
      <ArticleReader article={reading} onClose={() => setReading(null)} />
    </section>
  );
}

/* ============================== بطاقة المقال ============================== */

function CategoryChip({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-300 ${
        active
          ? "text-white"
          : "glass-soft text-alemny-muted hover:border-alemny-purple/60 hover:text-white"
      }`}
      style={active ? { background: `linear-gradient(135deg, ${color}CC, ${color}88)`, boxShadow: `0 0 22px ${color}55` } : undefined}
    >
      {label}
      <span className={`mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${active ? "bg-white/25 text-white" : "bg-white/8 text-alemny-muted"}`}>
        {arNum(count)}
      </span>
    </button>
  );
}

function ArticleCard({ article, index, onOpen }: { article: Article; index: number; onOpen: () => void }) {
  const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="card-3d flex flex-col rounded-3xl p-6 md:p-7"
    >
      <span className="ambient-spot -top-14 left-1/3 h-32 w-32" aria-hidden />

      <div className="relative z-10 mb-3.5 flex items-center justify-between gap-2">
        <span
          className="rounded-full border px-3 py-1 text-[11px] font-bold"
          style={{ borderColor: `${cat?.color ?? "#A855F7"}55`, color: cat?.color ?? "#A855F7", backgroundColor: `${cat?.color ?? "#A855F7"}12` }}
        >
          {cat?.label ?? "تقنية"}
        </span>
        {article.featured && (
          <span className="neon-chip px-2.5 py-1 text-[10px] font-bold text-alemny-lilac">
            <Sparkles className="h-3 w-3" aria-hidden />
            مميز
          </span>
        )}
      </div>

      <h3 className="relative z-10 text-[17px] font-bold leading-8 text-white">{article.title}</h3>
      <p className="relative z-10 mt-2.5 line-clamp-3 flex-1 text-[13px] leading-7 text-alemny-muted">{article.excerpt}</p>

      {/* الوسوم */}
      <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
        {article.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-white/6 px-2.5 py-0.5 text-[10.5px] text-alemny-muted">
            #{tag}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-alemny-purple/15 pt-4">
        <span className="flex items-center gap-1.5 text-[11.5px] text-alemny-muted">
          <Clock className="h-3.5 w-3.5 text-alemny-lilac" aria-hidden />
          {arNum(article.readMinutes)} دقائق قراءة
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 rounded-xl border border-alemny-purple/45 bg-alemny-purple/12 px-4 py-2 text-[12.5px] font-bold text-white transition-all hover:border-alemny-lilac hover:bg-alemny-purple/25"
        >
          اقرأ المقال
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </motion.article>
  );
}

/* ============================ قارئ المقال الكامل ============================ */

/** عارض محتوى مبسّط: عناوين «## / ###»، قوائم «- »، وفقرات */
export function ArticleRenderer({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={i} className="pt-2 font-display text-[16.5px] font-bold text-white">
              {trimmed.slice(4)}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={i} className="flex items-center gap-2.5 pt-3 font-display text-xl font-bold text-white">
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-alemny-lilac to-alemny-purple" aria-hidden />
              {trimmed.slice(3)}
            </h3>
          );
        }
        if (trimmed.split("\n").every((l) => l.trim().startsWith("- "))) {
          const items = trimmed.split("\n").map((l) => l.trim().slice(2));
          return (
            <ul key={i} className="space-y-2.5">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-[14.5px] leading-8 text-alemny-muted">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-alemny-lilac shadow-[0_0_6px_rgba(168,85,247,0.8)]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[14.5px] leading-9 text-alemny-muted">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function ArticleReader({ article, onClose }: { article: Article | null; onClose: () => void }) {
  const cat = article ? ARTICLE_CATEGORIES.find((c) => c.id === article.category) : null;
  return (
    <Dialog open={!!article} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="reader-glass max-h-[90vh] max-w-3xl gap-0 overflow-y-auto rounded-3xl p-0">
        {article && (
          <article className="p-6 md:p-9">
            <DialogTitle className="sr-only">{article.title}</DialogTitle>
            <DialogDescription className="sr-only">{article.excerpt}</DialogDescription>

            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-3 py-1 text-[11.5px] font-bold"
                  style={{ borderColor: `${cat?.color ?? "#A855F7"}55`, color: cat?.color ?? "#A855F7", backgroundColor: `${cat?.color ?? "#A855F7"}12` }}
                >
                  {cat?.label ?? "تقنية"}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-alemny-muted">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {arNum(article.readMinutes)} دقائق قراءة
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="glass-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-alemny-muted transition-colors hover:text-white"
                aria-label="إغلاق القراءة"
              >
                <X className="h-4.5 w-4.5" aria-hidden />
              </button>
            </div>

            <h2 className="mb-3 font-display text-2xl font-bold leading-[1.6] text-white md:text-[1.8rem]">{article.title}</h2>
            <p className="mb-6 border-r-2 border-alemny-purple/60 pr-4 text-[14px] leading-8 text-alemny-lilac">{article.excerpt}</p>

            <ArticleRenderer content={article.content} />

            {article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-alemny-purple/15 pt-6">
                <Tag className="h-4 w-4 text-alemny-lilac" aria-hidden />
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-alemny-purple/30 bg-alemny-purple/10 px-3 py-1 text-[11.5px] text-alemny-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        )}
      </DialogContent>
    </Dialog>
  );
}
