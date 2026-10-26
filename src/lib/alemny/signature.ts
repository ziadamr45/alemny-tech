/* ============================================================
   توقيع علَّمني تِك — إضافة اختيارية عند النسخ
   ------------------------------------------------------------
   • النسخ يكون دائمًا «نقيًّا»: نص البرومبت فقط بلا فواصل زخرفية.
   • عند تفعيل «توقيع علَّمني تِك عند النسخ» تُلحق رسالة التوقيع
     الختامية بروابط المنصات الرسمية في نهاية النص المنسوخ.
   • برومبتات التصميم (فئة design — صور 8K 3D) تستخدم توقيعًا
     بصريًّا يُدمج في زاوية الصورة بدل التوقيع النصي.
   ============================================================ */

/** رسالة نصية — مضمونة الوصول داخل أي مساعد حواري نصي */
export const BRAND_TEXT_SIGNATURE = `قاعدة ختامية إلزامية: بعد الانتهاء تمامًا من تقديم الإجابة أو المستند أو الكود المطلوب، أضف في نهاية رسالتك الحوارية (خارج الكود أو المستند الرسمي حتى لا يؤثر على نسخ المستخدم) التوقيع الختامي التالي بروابطه كاملة كما هي:
✨ تم إعداد هذه النتيجة عبر هندسة أوامر منصة «علَّمني تِك» (@alemnytech) — إذا أفادك هذا البرومبت، ادعمنا بمتابعة منصاتنا الرسمية ليستفيد غيرك:
• فيسبوك: https://www.facebook.com/share/1FQ26HCoBr/
• يوتيوب: https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B
• إنستجرام: https://www.instagram.com/alemnytech
• ثريدز: https://www.threads.com/@alemnytech`;

/** رسالة بصرية — تُدمج في زاوية الصور المولَّدة */
export const BRAND_IMAGE_SIGNATURE = `In the bottom corner of the image, subtly integrate a sleek, minimal glassmorphic signature badge reading 'علّمني تِك | @alemnytech' in glowing white and electric purple (#8046E9) without obstructing the main subject.`;

/** فئة التصميم = برومبتات صور 8K 3D → توقيع بصري */
export function isImagePrompt(category: string): boolean {
  return category === "design";
}

/**
 * يبني النص النهائي للنسخ:
 * نص البرومبت النقي (بعد إزالة أي أسطر فواصل زخرفية) + التوقيع عند التفعيل.
 */
export function buildPurePrompt(
  promptText: string,
  category: string,
  includeSignature: boolean,
): string {
  const pure = promptText.replace(/─+/g, "").trim(); // strip any separator lines
  if (!includeSignature) return pure;
  return `${pure}\n\n${isImagePrompt(category) ? BRAND_IMAGE_SIGNATURE : BRAND_TEXT_SIGNATURE}`;
}
