/* ============================================================
   أدوات العرض الرقمي — توحيد الأرقام العربية-الهندية
   قاعدة المنصة: لا تخلط أبدًا بين الأرقام العربية والإنجليزية
   في نفس الشارة أو السطر. كل الأرقام المعروضة تمرّ من هنا.
   ============================================================ */

/** يحوّل أي رقم إلى صيغته العربية-الهندية مع فواصل الآلاف: ٢٬٨٤٢ */
export function arNum(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "٠";
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString("ar-EG");
}

/** أرقام عربية-هندية بدون فواصل: 100 → ١٠٠ */
export function arDigits(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "٠";
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString("ar-EG", { useGrouping: false });
}

/** تاريخ عربي مبسّط: ٥ مايو ٢٠٢٦ */
export function arDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
}
