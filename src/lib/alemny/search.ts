/* ============================================================
   فهرس البحث الشامل (Ctrl + K) — يوحّد البرومبتات والأدوات والشروحات
   ============================================================ */

import { MAGIC_PROMPTS, PROMPT_CATEGORIES } from "./prompts";
import { AI_TOOLS, TOOL_CATEGORIES } from "./tools";
import { TUTORIALS } from "./tutorials";

export type SearchKind = "prompt" | "tool" | "tutorial" | "action";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  target: string;
  event?: { name: string; detail: string };
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

export function buildSearchIndex(): SearchItem[] {
  const prompts: SearchItem[] = MAGIC_PROMPTS.map((p) => ({
    id: `prompt-${p.id}`,
    kind: "prompt" as const,
    title: p.title,
    subtitle: `برومبت جاهز للنسخ — ${PROMPT_CATEGORIES.find((c) => c.id === p.category)?.label ?? ""}`,
    target: "#prompts",
    event: { name: "alemny:set-prompt-tab", detail: p.category },
    keywords: p.keywords,
  }));

  const tools: SearchItem[] = AI_TOOLS.map((t) => ({
    id: `tool-${t.id}`,
    kind: "tool" as const,
    title: `${t.name} — ${t.nameEn}`,
    subtitle: `أداة موثقة — ${TOOL_CATEGORIES.find((c) => c.id === t.category)?.label ?? ""}`,
    target: "#tools",
    event: { name: "alemny:set-tool-filter", detail: t.category },
    keywords: t.keywords,
  }));

  const tutorials: SearchItem[] = TUTORIALS.map((t) => ({
    id: `tutorial-${t.id}`,
    kind: "tutorial" as const,
    title: t.title,
    subtitle: `شرح عملي — ${t.steps.length} خطوات • ${t.duration}`,
    target: "#tutorials",
    keywords: t.keywords,
  }));

  return [...prompts, ...tools, ...tutorials];
}
