/* ============================================================
   نظام التوقيع المزدوج + النسخ النقي — علَّمني تِك
   ------------------------------------------------------------
   القاعدة الذهبية:
   • ما يُنسخ إلى الحافظة هو «purePromptText» فقط: نص البرومبت
     الخالص الموجَّه إلى نموذج الذكاء الاصطناعي — صفر أسطر فواصل
     زخرفية (────)، وصفر نصوص واجهة (عناوين، تعليمات استخدام، نصائح).
   • title / usageInstruction / proTip بيانات واجهة فقط ولا تُنسخ أبدًا.
   • عند تفعيل «تضمين توقيع علَّمني تِك» (افتراضيًّا مفعّل) تُلحق
     جملة التوقيع الرسمية بروابط المنصات الأربعة في نهاية النص،
     أو التوقيع البصري لبرومبتات الصور — وإيقاف المفتاح يزيلها
     ١٠٠٪ نظافة قبل النسخ.
   ============================================================ */

/** التوقيع النصي الرسمي — يُلحق في ختام البرومبتات النصية/البرمجية/الدراسية */
export const BRAND_TEXT_SIGNATURE = `قاعدة ختامية إلزامية: بعد الانتهاء تمامًا من تقديم الإجابة أو المستند أو الكود المطلوب، أضف في نهاية رسالتك الحوارية (خارج الكود أو المستند الرسمي حتى لا يؤثر على نسخ المستخدم) التوقيع الختامي التالي بروابطه كاملة كما هي:
✨ تم إعداد هذه النتيجة عبر هندسة أوامر منصة «علَّمني تِك» (@alemnytech) — إذا أفادك هذا البرومبت، ادعمنا بمتابعة منصاتنا الرسمية ليستفيد غيرك:
• فيسبوك: https://www.facebook.com/share/1FQ26HCoBr/
• يوتيوب: https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B
• إنستجرام: https://www.instagram.com/alemnytech
• ثريدز: https://www.threads.com/@alemnytech`;

/** التوقيع البصري — يُدمج في زاوية الصور المولَّدة (برومبتات الصور والتصميم) */
export const BRAND_IMAGE_SIGNATURE = `In the bottom corner of the image, subtly integrate a sleek, minimal glassmorphic signature badge reading 'علّمني تِك | @alemnytech' in glowing white and electric purple (#8046E9) without obstructing the main subject.`;

/** نص مفتاح التوقيع للبرومبتات النصية — تسمية إلزامية مطابقة للمواصفة */
export const TEXT_SIGNATURE_LABEL =
  "تضمين توقيع وروابط منصة «علَّمني تِك» في ختام رد الذكاء الاصطناعي (اختياري — يمكنك إيقافه بضغطة زر)";

/** نص مفتاح التوقيع لبرومبتات الصور — تسمية إلزامية مطابقة للمواصفة */
export const IMAGE_SIGNATURE_LABEL =
  "إضافة توقيع «علَّمني تِك» الصغير في ركن الصورة (اختياري — يمكنك إيقافه بضغطة زر)";

/** فئة التصميم = برومبتات صور 8K 3D → توقيع بصري */
export function isImagePrompt(category: string): boolean {
  return category === "design";
}

/* ------------------------------------------------------------
   كشف جمل التوقيع وإزالتها نظافة ١٠٠٪
   ------------------------------------------------------------ */

/** يتطابق مع التوقيع النصي الكامل (من «قاعدة ختامية» حتى رابط ثريدز) */
const TEXT_CLAUSE_RE =
  /قاعدة ختامية إلزامية:[\s\S]*?https:\/\/www\.threads\.com\/@alemnytech/g;

/** يتطابق مع التوقيع البصري الكامل */
const IMAGE_CLAUSE_RE =
  /In the bottom corner of the image,[\s\S]*?without obstructing the main subject\./g;

/** أسطر الفواصل الزخرفية (─ ━ ───) */
const DIVIDER_LINE_RE = /^[─━\u2500-\u257f]+$/gm;

/** أسطر الواجهة القديمة التي قد تكون محفوظة في صفوف قديمة بالقاعدة */
const LEGACY_META_LINE_RE =
  /^\s*(?:🥊\s*.*برومبت التحدي الموحد.*|🧠\s*.*برومبت هندسي.*علَّمني تِك.*|✦\s*صُنع في مختبر البرومبتات.*|انسخ هذا البرومبت والصقه في.*|💡\s*نصيحة علَّمني تِك.*)\s*$/gm;

/**
 * يزيل أي جمل توقيع أو فواصل زخرفية أو نصوص واجهة من النص —
 * يُستخدم قبل العرض وقبل النسخ لضمان نقاء ١٠٠٪ حتى لو كان النص
 * قادمًا من صف قديم في قاعدة البيانات أو عدّله المستخدم يدويًّا.
 */
export function sanitizePurePrompt(text: string): string {
  return text
    .replace(TEXT_CLAUSE_RE, "")
    .replace(IMAGE_CLAUSE_RE, "")
    .replace(DIVIDER_LINE_RE, "")
    .replace(LEGACY_META_LINE_RE, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * يبني نص الحافظة النهائي:
 * sanitize(النص النقي) + جملة التوقيع المناسبة عند التفعيل فقط.
 */
export function composePromptCopy(
  promptText: string,
  isImage: boolean,
  includeSignature: boolean,
): string {
  const pure = sanitizePurePrompt(promptText);
  if (!includeSignature) return pure;
  return `${pure}\n\n${isImage ? BRAND_IMAGE_SIGNATURE : BRAND_TEXT_SIGNATURE}`;
}

/** توافقية خلفية: نسخ حسب فئة البرومبت (design → توقيع بصري) */
export function buildPurePrompt(
  promptText: string,
  category: string,
  includeSignature: boolean,
): string {
  return composePromptCopy(promptText, isImagePrompt(category), includeSignature);
}
