"use client";

/* ============================================================
   المقالات والأخبار التقنية — /articles (V3)
   بطاقات كاملة قابلة للنقر تفتح صفحة المقال المستقلة
   /articles/[slug]. البيانات حية من Neon PostgreSQL مع
   احتياطي محلي أنيق.
   ============================================================ */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Newspaper,
  SearchX,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { arNum } from "@/lib/alemny/format";
import { useAlemnyStore } from "@/lib/alemny/store";
import {
  ARTICLE_CATEGORIES,
  type Article,
  type ArticleCategoryId,
} from "@/lib/alemny/articles";

type CatFilter = "all" | ArticleCategoryId;

/* صفحة التفاصيل: صف قاعدة البيانات يستخدم slug والبيانات المحلية تستخدم id */
function detailHref(article: { id: string; slug?: string }) {
  return `/articles/${article.slug ?? article.id}`;
}

interface ArticlesFeedProps {
  initialCat?: string;
}

export function ArticlesFeed({ initialCat }: ArticlesFeedProps) {
  const [cat, setCat] = useState<CatFilter>((initialCat as CatFilter) ?? "all");
  const [query, setQuery] = useState("");
  const articles = useAlemnyStore((s) => s.articles);

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
    <section aria-label="المقالات والأخبار التقنية" className="relative">
      <SectionHeading
        eyebrow="الموسوعة الدائمة — فهم أعمق"
        eyebrowIcon={Newspaper}
        title="المقالات والأخبار التقنية"
        highlight="من كلام النظرية إلى الإتقان"
        description="مقالات شاملة في عالم التكنولوجيا، الذكاء الاصطناعي، البرمجة، الأمن الرقمي، والمستقبل الرقمي — مكتوبة لتُقرأ مرة وتُستفاد منها سنوات."
      />

      {/* الفلاتر */}
      <div className="filter-chips mb-4" role="tablist" aria-label="تصفية المقالات حسب الفئة">
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
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
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
      className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-300 ${
        active
          ? "text-white"
          : "glass-soft text-alemny-muted hover:border-alemny-purple/60 hover:text-white"
      }`}
      style={
        active
          ? { background: `linear-gradient(135deg, ${color}CC, ${color}88)`, boxShadow: `0 0 22px ${color}55` }
          : undefined
      }
    >
      {label}
      <span
        className={`mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${
          active ? "bg-white/25 text-white" : "bg-white/8 text-alemny-muted"
        }`}
      >
        {arNum(count)}
      </span>
    </button>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category);
  const extraTags = article.tags.length - 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
    >
      <Link href={detailHref(article)} className="card-3d group flex flex-col rounded-3xl p-6 md:p-7">
        <span className="ambient-spot -top-14 left-1/3 h-32 w-32" aria-hidden />

        <div className="relative z-10 mb-3.5 flex items-center justify-between gap-2">
          <span
            className="rounded-full border px-3 py-1 text-[11px] font-bold"
            style={{
              borderColor: `${cat?.color ?? "#A855F7"}55`,
              color: cat?.color ?? "#A855F7",
              backgroundColor: `${cat?.color ?? "#A855F7"}12`,
            }}
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

        <h3 className="t-card-title relative z-10 font-bold text-white">{article.title}</h3>
        <p className="t-body relative z-10 mt-2.5 line-clamp-3 flex-1 text-white/70">
          {article.excerpt}
        </p>

        {/* الوسوم */}
        <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/6 px-2.5 py-0.5 text-[10.5px] text-alemny-muted"
            >
              #{tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className="rounded-full bg-white/6 px-2.5 py-0.5 text-[10.5px] text-alemny-muted">
              +{arNum(extraTags)}
            </span>
          )}
        </div>

        <div className="relative z-10 mt-5 flex items-center justify-between border-t border-alemny-purple/15 pt-4">
          <span className="flex items-center gap-1.5 text-[11.5px] text-alemny-muted">
            <Clock className="h-3.5 w-3.5 text-alemny-lilac" aria-hidden />
            {arNum(article.readMinutes)} دقائق قراءة
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-alemny-purple/45 bg-alemny-purple/12 px-4 py-2 text-[12.5px] font-bold text-white transition-all group-hover:border-alemny-lilac group-hover:bg-alemny-purple/25">
            اقرأ المقال
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
