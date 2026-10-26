/* ============================================================
   علَّمني تِك — Alemny Tech | الثوابت الرسمية للمنصة
   معمارية متعددة الصفحات: كل قسم مساره الخاص.
   ============================================================ */

export const BRAND = {
  ar: "علَّمني تِك",
  en: "Alemny Tech",
  slogan: "كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي",
  handle: "@alemnytech",
  email: "Alemnytech@gmail.com",
  tagline:
    "بوابتك العملية لإتقان أحدث تقنيات الذكاء الاصطناعي، البرمجة، وهندسة الأوامر بخطوات تطبيقية مبسطة.",
} as const;

/* --------------------------- هوية الفريق --------------------------- */

/** مطوّر المنصة — يظهر في تذييل كل الصفحات */
export const DEVELOPER_NAME = "زياد عمرو";
export const DEVELOPER_SITE_URL = "https://ziadamrme.vercel.app";

/** نص زر يوتيوب الثابت في الشريط العلوي */
export const YOUTUBE_CTA_LABEL = "يوتيوب علَّمني تِك";

export type SocialId = "youtube" | "facebook" | "instagram" | "threads";

export interface SocialLink {
  id: SocialId;
  label: string;
  labelEn: string;
  url: string;
  color: string;
  description: string;
}

export const SOCIALS: SocialLink[] = [
  {
    id: "youtube",
    label: "يوتيوب",
    labelEn: "YouTube",
    url: "https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B",
    color: "#FF3B3B",
    description: "شروحات فيديو خطوة بخطوة",
  },
  {
    id: "facebook",
    label: "فيسبوك",
    labelEn: "Facebook",
    url: "https://www.facebook.com/share/1FQ26HCoBr/",
    color: "#5B8DEF",
    description: "منشورات ونصائح يومية",
  },
  {
    id: "instagram",
    label: "إنستغرام",
    labelEn: "Instagram",
    url: "https://www.instagram.com/alemnytech",
    color: "#E1306C",
    description: "ريلز تقنية سريعة ومبهرة",
  },
  {
    id: "threads",
    label: "ثريدز",
    labelEn: "Threads",
    url: "https://www.threads.com/@alemnytech",
    color: "#E8E4F4",
    description: "نقاشات وأخبار التقنية",
  },
];

/* ------------------------- التنقل بين الصفحات ------------------------- */

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
}

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "الرئيسية", shortLabel: "الرئيسية" },
  { href: "/articles", label: "المقالات والأخبار التقنية", shortLabel: "المقالات" },
  { href: "/tutorials", label: "الشروحات العملية", shortLabel: "الشروحات" },
  { href: "/prompts", label: "مكتبة هندسة الأوامر", shortLabel: "البرومبتات" },
  { href: "/directory", label: "الدليل التقني المتجدد", shortLabel: "الدليل" },
  { href: "/lab", label: "المختبر الذكي", shortLabel: "المختبر" },
];

/** أيقونات الأبواب في شبكة Bento الرئيسية (مفاتيح Lucide) */
export type PortalId = "articles" | "tutorials" | "prompts" | "lab";
