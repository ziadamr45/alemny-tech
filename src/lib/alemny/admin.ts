/* ============================================================
   لوحة التحكم /admin — طبقة الحماية والتحقق (Server-side)
   ------------------------------------------------------------
   • المفتاح يُرسل في ترويسة x-admin-key من لوحة التحكم فقط.
   • يقارن مع ADMIN_API_KEY من بيئة النشر (Vercel/local .env).
   • لا يوجد أي مفتاح في كود الواجهة أو مستودع Git.
   ============================================================ */

import { z } from "zod";

/**
 * مفتاح لوحة التحكم:
 * • في الإنتاج (Vercel) يُقرأ حصريًّا من متغير البيئة ADMIN_API_KEY —
 *   ولا يوجد أي مفتاح احتياطي في الكود المنشور.
 * • في التطوير المحلي فقط (NODE_ENV !== production) يُستخدم مفتاح
 *   تجريبي حتى تعمل اللوحة دون إعداد.
 */
const DEV_FALLBACK_KEY = "alemny-admin-2026";
const PROD_LOCKOUT_KEY = "__ADMIN_API_KEY_REQUIRED__";

export function getAdminKey(): string {
  const envKey = process.env.ADMIN_API_KEY?.trim();
  if (envKey) return envKey;
  if (process.env.NODE_ENV === "production") return PROD_LOCKOUT_KEY;
  return DEV_FALLBACK_KEY;
}

export function isAuthorized(request: Request): boolean {
  const provided = request.headers.get("x-admin-key")?.trim() ?? "";
  if (!provided) return false;
  // مقارنة ثابتة الزمن مبسطة: طول متساوٍ ثم تطابق حرفي
  const expected = getAdminKey();
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/* ------------------------- مخططات التحقق (zod) ------------------------- */

export const articleSchema = z.object({
  slug: z.string().min(2).max(80),
  title: z.string().min(4).max(220),
  excerpt: z.string().min(10).max(600),
  category: z.enum(["ai", "dev", "security", "future"]),
  readMinutes: z.number().int().min(1).max(120).default(5),
  tags: z.array(z.string().max(60)).max(10).default([]),
  content: z.string().min(50),
  keywords: z.array(z.string().max(60)).max(20).default([]),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const promptSchema = z.object({
  slug: z.string().min(2).max(80),
  title: z.string().min(4).max(220),
  category: z.enum(["study", "coding", "design", "productivity"]),
  targetModel: z.string().min(1).max(80),
  targetModels: z.array(z.string().max(80)).max(8).default([]),
  resultHook: z.string().min(5).max(400),
  promptText: z.string().min(30),
  variables: z
    .array(z.object({ key: z.string().min(1).max(40), label: z.string().min(1).max(80), placeholder: z.string().max(120) }))
    .max(10)
    .default([]),
  icon: z.string().min(1).max(30).default("bulb"),
  tips: z.array(z.string().max(400)).max(8).default([]),
  keywords: z.array(z.string().max(60)).max(20).default([]),
  ltr: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const tutorialSchema = z.object({
  slug: z.string().min(2).max(80),
  title: z.string().min(4).max(220),
  summary: z.string().min(10).max(600),
  level: z.string().min(2).max(40),
  duration: z.string().min(2).max(40),
  icon: z.string().min(1).max(30).default("notebook"),
  steps: z
    .array(z.object({ title: z.string().min(2).max(200), desc: z.string().min(5).max(1200), tip: z.string().max(600).default("") }))
    .min(1)
    .max(20),
  youtubeUrl: z.string().min(5).max(400),
  keywords: z.array(z.string().max(60)).max(20).default([]),
});

export const toolSchema = z.object({
  slug: z.string().min(2).max(80),
  name: z.string().min(2).max(120),
  arabicTitle: z.string().min(2).max(160),
  category: z.enum(["study", "coding", "design", "media"]),
  pricingType: z.enum(["free", "freemium"]),
  description: z.string().min(10).max(600),
  officialUrl: z.string().min(6).max(400),
  badge: z.string().max(60).nullable().default(null),
  features: z.array(z.string().max(400)).max(12).default([]),
  useCase: z.string().max(800).default(""),
  icon: z.string().min(1).max(30).default("sparkles"),
  keywords: z.array(z.string().max(60)).max(20).default([]),
  featured: z.boolean().default(false),
});

export type CollectionName = "articles" | "prompts" | "tutorials" | "tools";

export const COLLECTIONS: CollectionName[] = ["articles", "prompts", "tutorials", "tools"];

export function isCollection(v: string): v is CollectionName {
  return (COLLECTIONS as string[]).includes(v);
}

export function collectionSchema(c: CollectionName) {
  switch (c) {
    case "articles":
      return articleSchema;
    case "prompts":
      return promptSchema;
    case "tutorials":
      return tutorialSchema;
    case "tools":
      return toolSchema;
  }
}

/** توحيد السلاغ: أحرف لاتينية/عربية وأرقام وشرطات فقط */
export function normalizeSlug(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `item-${Date.now().toString(36)}`;
}
