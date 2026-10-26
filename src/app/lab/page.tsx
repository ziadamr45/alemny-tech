import type { Metadata } from "next";
import { VersusArena } from "@/components/alemny/versus-arena";
import { PromptBuilder } from "@/components/alemny/prompt-builder";

export const metadata: Metadata = {
  title: "المختبر الذكي | علَّمني تِك",
  description:
    "أدوات تفاعلية وهندسة أوامر ذكية: حلبة المواجهات العملية المقيسة بالأرقام، وصانع الأوامر الهندسي الذي يبني لك برومبتًا كاملًا بخمس طبقات جاهزًا للنسخ.",
  alternates: { canonical: "/lab" },
};

export default function Page() {
  return (
    <div className="alemny-shell w-full py-10 sm:py-14">
      <VersusArena />
      <PromptBuilder />
    </div>
  );
}
