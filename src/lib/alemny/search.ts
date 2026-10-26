/* ============================================================
   فهرس البحث الشامل (Ctrl + K) — يوحّد كل محتوى المنصة
   معمارية متعددة الصفحات: كل نتيجة تنقلك إلى مسارها الخاص.
   ============================================================ */

import { MAGIC_PROMPTS, PROMPT_CATEGORIES } from "./prompts";
import { AI_TOOLS, TOOL_CATEGORIES } from "./tools";
import { TUTORIALS } from "./tutorials";
import { ARTICLES, ARTICLE_CATEGORIES } from "./articles";
import { arNum } from "./format";
import type { MagicPrompt } from "./prompts";
import type { AITool } from "./tools";
import type { Tutorial } from "./tutorials";
import type { Article } from "./articles";

export type SearchKind = "prompt" | "tool" | "tutorial" | "article" | "action";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  /** مسار الصفحة الهدف (يُفتح عبر useRouter.push) */
  href: string;
  keywords: string[];
}

/** إزالة التشكيل وتوحيد الحروف لمطابقة عربية ذكية */
export function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "") // تشكيل + تطويل
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(item: SearchItem, query: string): boolean {
  const q = normalizeArabic(query);
  if (!q) return true;
  const haystack = normalizeArabic([item.title, item.subtitle, ...item.keywords].join(" "));
  return q.split(" ").every((token) => haystack.includes(token));
}

export function filterSearchItems(items: SearchItem[], query: string): SearchItem[] {
  return items.filter((item) => matches(item, query));
}

/** المقالات والشروحات تفتح صفحاتها المستقلة: صف قاعدة البيانات يستخدم slug والاحتياطي يستخدم id */
function detailHref(base: string, item: { id: string; slug?: string }): string {
  return `/${base}/${item.slug ?? item.id}`;
}

export function buildSearchIndex(
  prompts: MagicPrompt[] = MAGIC_PROMPTS,
  tools: AITool[] = AI_TOOLS,
  tutorials: Tutorial[] = TUTORIALS,
  articles: Article[] = ARTICLES,
): SearchItem[] {
  const promptItems: SearchItem[] = prompts.map((p) => ({
    id: `prompt-${p.id}`,
    kind: "prompt" as const,
    title: p.title,
    subtitle: `برومبت جاهز للنسخ — ${PROMPT_CATEGORIES.find((c) => c.id === p.category)?.label ?? ""}`,
    href: `/prompts?cat=${p.category}&focus=${p.id}`,
    keywords: p.keywords,
  }));

  const toolItems: SearchItem[] = tools.map((t) => ({
    id: `tool-${t.id}`,
    kind: "tool" as const,
    title: `${t.name} — ${t.nameEn}`,
    subtitle: `أداة موثقة — ${TOOL_CATEGORIES.find((c) => c.id === t.category)?.label ?? ""}`,
    href: `/directory?cat=${t.category}`,
    keywords: t.keywords,
  }));

  const tutorialItems: SearchItem[] = tutorials.map((t) => ({
    id: `tutorial-${t.id}`,
    kind: "tutorial" as const,
    title: t.title,
    subtitle: `شرح عملي — ${arNum(t.steps.length)} خطوات • ${t.duration}`,
    href: detailHref("tutorials", t),
    keywords: t.keywords,
  }));

  const articleItems: SearchItem[] = articles.map((a) => ({
    id: `article-${a.id}`,
    kind: "article" as const,
    title: a.title,
    subtitle: `مقال — ${ARTICLE_CATEGORIES.find((c) => c.id === a.category)?.label ?? ""}`,
    href: detailHref("articles", a),
    keywords: a.keywords,
  }));

  return [...articleItems, ...promptItems, ...toolItems, ...tutorialItems];
}
