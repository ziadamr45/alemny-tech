/* ============================================================
   علَّمني تِك — Alemny Tech | الثوابت الرسمية للمنصة
   ============================================================ */

export const BRAND = {
  ar: "علَّمني تِك",
  en: "Alemny Tech",
  slogan: "كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي",
  handle: "@alemnytech",
  email: "Alemnytech@gmail.com",
  tagline:
    "المنصة العربية المتكاملة التي تنقلك من الكلام النظري إلى النتيجة العملية المبهرة في المذاكرة، البرمجة، التصميم، وصناعة المحتوى.",
} as const;

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
    description: "نقاشات وأخبار الذكاء الاصطناعي",
  },
];

export type SectionId = "home" | "prompts" | "tools" | "versus" | "builder" | "tutorials";

export const NAV_LINKS: { id: SectionId; label: string; shortLabel: string }[] = [
  { id: "home", label: "الرئيسية", shortLabel: "الرئيسية" },
  { id: "prompts", label: "مكتبة البرومبتات السحرية", shortLabel: "البرومبتات" },
  { id: "tools", label: "دليل أدوات الذكاء الاصطناعي", shortLabel: "الأدوات" },
  { id: "versus", label: "حلبة المقارنات Versus", shortLabel: "Versus" },
  { id: "builder", label: "صانع البرومبتات الذكي", shortLabel: "الصانع الذكي" },
  { id: "tutorials", label: "الشروحات العملية", shortLabel: "الشروحات" },
];

export const SECTION_IDS: SectionId[] = ["home", "prompts", "tools", "versus", "builder", "tutorials"];

/** أحداث التواصل بين البحث الشامل والأقسام */
export const EVT_SET_PROMPT_TAB = "alemny:set-prompt-tab";
export const EVT_SET_TOOL_FILTER = "alemny:set-tool-filter";
