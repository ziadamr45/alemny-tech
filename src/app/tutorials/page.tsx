import type { Metadata } from "next";
import { TutorialsHub } from "@/components/alemny/tutorials-hub";

export const metadata: Metadata = {
  title: "الشروحات العملية | علَّمني تِك",
  description:
    "أدلة تطبيقية خطوة بخطوة وفيديوهات تعليمية: من رفع الملازم إلى الدفتر الذكي، لبناء مشروعك الأول مع وكلاء البرمجة، وحتى أول فيديو سينمائي بالذكاء الاصطناعي.",
  alternates: { canonical: "/tutorials" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const sp = await searchParams;
  return <TutorialsHub focusSlug={sp.focus} />;
}
