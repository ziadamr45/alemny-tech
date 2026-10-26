import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, ChevronLeft, Clock } from "lucide-react";
import { ArticleRenderer } from "@/components/alemny/article-renderer";
import { ShareBar } from "@/components/alemny/share-bar";
import { ARTICLE_CATEGORIES } from "@/lib/alemny/articles";
import { getArticles } from "@/lib/alemny/server-content";
import { arDate, arNum } from "@/lib/alemny/format";

const SITE_URL = "https://alemny-tech.vercel.app";

/* صفحة التفاصيل: صف قاعدة البيانات يستخدم slug والبيانات المحلية تستخدم id */
function detailHref(item: { id: string; slug?: string }) {
  return `/articles/${item.slug ?? item.id}`;
}

/* استدعاء واحد لكل طلب (تُستدعى في الميتاداتا والصفحة معًا) */
const loadArticles = cache(getArticles);

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: articles } = await loadArticles();
  const article = articles.find((a) => detailHref(a) === `/articles/${slug}`);
  if (!article) return {};
  return {
    title: `${article.title} | علَّمني تِك`,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/articles/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { data: articles } = await loadArticles();
  const article = articles.find((a) => detailHref(a) === `/articles/${slug}`);
  if (!article) notFound();

  const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category);
  const created = arDate((article as unknown as { createdAt?: string | Date }).createdAt);

  /* مقالات ذات صلة: نفس الفئة أولًا ثم تعبئة من بقية المقالات */
  const others = articles.filter((a) => detailHref(a) !== `/articles/${slug}`);
  const related = [
    ...others.filter((a) => a.category === article.category),
    ...others.filter((a) => a.category !== article.category),
  ].slice(0, 3);

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
        <Link href="/articles" className="transition-colors hover:text-white">
          المقالات
        </Link>
        <ChevronLeft className="h-4 w-4 text-white/30" aria-hidden />
        <span style={{ color: cat?.color ?? "#A855F7" }}>{cat?.label ?? "تقنية"}</span>
      </nav>

      <Link
        href="/articles"
        className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
      >
        <ArrowRight className="h-4 w-4" aria-hidden />
        العودة إلى جميع المقالات
      </Link>

      {/* ترويسة المقال */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-xs font-bold"
            style={{
              borderColor: `${cat?.color ?? "#A855F7"}55`,
              color: cat?.color ?? "#A855F7",
              backgroundColor: `${cat?.color ?? "#A855F7"}12`,
            }}
          >
            {cat?.label ?? "تقنية"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden />
            {arNum(article.readMinutes)} دقائق قراءة
          </span>
          {created && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden />
              {created}
            </span>
          )}
        </div>
        <h1 className="t-hero mb-6 mt-4 font-extrabold leading-[1.35] text-white">
          {article.title}
        </h1>
        <div className="t-body rounded-2xl border border-e-4 border-e-[#8046E9] border-white/10 bg-white/5 p-5 text-white/85 sm:p-6">
          {article.excerpt}
        </div>
      </header>

      {/* جسم المقال */}
      <div className="reader-glass mx-auto my-8 max-w-4xl rounded-3xl p-5 sm:p-9">
        <ArticleRenderer content={article.content} />
      </div>

      {/* المشاركة */}
      <section aria-label="شارك المقال" className="my-10">
        <h2 className="t-card-title mb-4 font-bold text-white">شارك المقال</h2>
        <ShareBar title={article.title} slug={slug} />
      </section>

      {/* مقالات ذات صلة */}
      {related.length > 0 && (
        <section aria-label="مقالات ذات صلة" className="my-12">
          <h2 className="t-card-title mb-5 font-bold text-white">مقالات ذات صلة</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
            {related.map((r) => {
              const rcat = ARTICLE_CATEGORIES.find((c) => c.id === r.category);
              return (
                <Link
                  key={r.id}
                  href={detailHref(r)}
                  className="card-3d block rounded-3xl p-5 sm:p-6"
                >
                  <span
                    className="inline-block rounded-full border px-2.5 py-1 text-[10.5px] font-bold"
                    style={{
                      borderColor: `${rcat?.color ?? "#A855F7"}55`,
                      color: rcat?.color ?? "#A855F7",
                      backgroundColor: `${rcat?.color ?? "#A855F7"}12`,
                    }}
                  >
                    {rcat?.label ?? "تقنية"}
                  </span>
                  <h3 className="t-card-title mt-3 font-bold text-white">{r.title}</h3>
                  <p className="t-body mt-2 line-clamp-2 text-white/60">{r.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[12px] text-white/50">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {arNum(r.readMinutes)} دقائق قراءة
                    <ArrowLeft className="ms-auto h-3.5 w-3.5" aria-hidden />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
