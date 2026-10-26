import type { Metadata } from "next";
import { PromptVault } from "@/components/alemny/prompt-vault";

export const metadata: Metadata = {
  title: "مكتبة هندسة الأوامر | علَّمني تِك",
  description:
    "برومبتات احترافية مقسمة بالمجالات: المذاكرة والبحث العلمي، البرمجة وتطوير المواقع، تصميم الصور 8K، وبناء السيرة الذاتية والمشاريع — خصّص متغيراتك وانسخ البرومبت بضغطة واحدة.",
  alternates: { canonical: "/prompts" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; focus?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="alemny-shell w-full py-10 sm:py-14">
      <PromptVault initialCat={sp.cat} focusSlug={sp.focus} />
    </div>
  );
}
