import type { Metadata } from "next";
import { ToolsDirectory } from "@/components/alemny/tools-directory";

export const metadata: Metadata = {
  title: "الدليل التقني المتجدد | علَّمني تِك",
  description:
    "موسوعة متجددة باستمرار للمواقع والتقنيات والأدوات المُختبرة فعليًّا: الميزات الحقيقية، سيناريو الاستخدام العملي، والرابط الرسمي المباشر — بلا ترشيحات وهمية.",
  alternates: { canonical: "/directory" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  return <ToolsDirectory initialCat={sp.cat} />;
}
