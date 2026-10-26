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
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="alemny-shell w-full py-10 sm:py-14">
      <ArticlesFeed initialCat={sp.cat} />
    </div>
  );
}
