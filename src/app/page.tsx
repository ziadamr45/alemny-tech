import { PlatformShell } from "@/components/alemny/platform-shell";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "علَّمني تِك — Alemny Tech",
  alternateName: "Alemny Tech",
  description: "كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي — منصة عربية للبرومبتات والأدوات والشروحات العملية.",
  email: "Alemnytech@gmail.com",
  sameAs: [
    "https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B",
    "https://www.facebook.com/share/1FQ26HCoBr/",
    "https://www.instagram.com/alemnytech",
    "https://www.threads.com/@alemnytech",
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PlatformShell />
    </>
  );
}
