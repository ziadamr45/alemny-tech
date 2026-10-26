import type { Metadata } from "next";
import { ArticlesFeed } from "@/components/alemny/articles-feed";

export const metadata: Metadata = {
  title: "المقالات والأخبار التقنية | علَّمني تِك",
  description:
    "مقالات شاملة في عالم التكنولوجيا، الذكاء الاصطناعي، البرمجة، الأمن الرقمي، والمستقبل الرقمي — محتوى دائم الصلة مكتوب بالعربية ليُقرأ مرة ويُستفاد منه سنوات.",
  alternates: { canonical: "/articles" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; focus?: string }>;
}) {
  const sp = await searchParams;
  return <ArticlesFeed initialCat={sp.cat} focusSlug={sp.focus} />;
}
