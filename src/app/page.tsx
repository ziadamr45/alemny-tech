import type { Metadata } from "next";
import { HomeLanding } from "@/components/alemny/home-landing";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "علَّمني تِك — Alemny Tech",
  alternateName: "Alemny Tech",
  description:
    "بوابتك العملية لإتقان أحدث تقنيات الذكاء الاصطناعي، البرمجة، وهندسة الأوامر بخطوات تطبيقية مبسطة.",
  email: "Alemnytech@gmail.com",
  sameAs: [
    "https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B",
    "https://www.facebook.com/share/1FQ26HCoBr/",
    "https://www.instagram.com/alemnytech",
    "https://www.threads.com/@alemnytech",
  ],
};

export const metadata: Metadata = {
  title: "علَّمني تِك | كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي",
  description:
    "المنصة العربية الشاملة: مقالات تقنية، شروحات عملية خطوة بخطوة، مكتبة هندسة الأوامر، الدليل التقني المتجدد، والمختبر الذكي — بالعربية ومن صميم التجربة.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeLanding />
    </>
  );
}
