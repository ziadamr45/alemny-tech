/* ============================================================
   Server-side live content — Neon PostgreSQL via Prisma
   ------------------------------------------------------------
   Every getter tries the database first and falls back — fast
   and gracefully — to the static seed data on ANY failure
   (cold start, connection drop, empty tables). The response
   always declares its `source` so the UI can show it.
   ============================================================ */

import { db } from "@/lib/db";

import type {
  MagicPrompt,
  PromptCategoryId,
  PromptVariable,
} from "./prompts";
import { MAGIC_PROMPTS } from "./prompts";
import type { AITool, ToolCategoryId, ToolPricing } from "./tools";
import { AI_TOOLS } from "./tools";
import type { ArenaModelId, VersusMission } from "./versus";
import { VERSUS_MISSIONS } from "./versus";
import type { Tutorial } from "./tutorials";
import { TUTORIALS } from "./tutorials";
import { SOCIALS } from "./constants";

export type ContentSource = "database" | "fallback";

export interface ContentResult<T> {
  source: ContentSource;
  data: T[];
}

const YOUTUBE_URL =
  SOCIALS.find((s) => s.id === "youtube")?.url ??
  "https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B";

/* ---------------------------------- Prompts --------------------------------- */

type PromptRow = {
  slug: string;
  title: string;
  category: string;
  targetModels: unknown;
  resultHook: string;
  promptText: string;
  variables: unknown;
  icon: string;
  tips: unknown;
  keywords: unknown;
  ltr: boolean;
  copiesCount: number;
};

function mapPromptRow(r: PromptRow): MagicPrompt {
  return {
    id: r.slug,
    title: r.title,
    hook: r.resultHook,
    category: r.category as PromptCategoryId,
    models: Array.isArray(r.targetModels) ? (r.targetModels as string[]) : [],
    icon: r.icon as MagicPrompt["icon"],
    variables: Array.isArray(r.variables) ? (r.variables as PromptVariable[]) : [],
    body: r.promptText,
    tips: Array.isArray(r.tips) ? (r.tips as string[]) : [],
    keywords: Array.isArray(r.keywords) ? (r.keywords as string[]) : [],
    ltr: r.ltr,
    copiesCount: r.copiesCount,
  };
}

export async function getPrompts(): Promise<ContentResult<MagicPrompt>> {
  try {
    const rows = await db.prompt.findMany({
      orderBy: [{ featured: "desc" }, { copiesCount: "desc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) throw new Error("prompts table empty");
    return { source: "database", data: rows.map(mapPromptRow) };
  } catch {
    return { source: "fallback", data: MAGIC_PROMPTS };
  }
}

/* ---------------------------------- Tools ----------------------------------- */

type ToolRow = {
  slug: string;
  name: string;
  arabicTitle: string;
  category: string;
  pricingType: string;
  description: string;
  officialUrl: string;
  badge: string | null;
  features: unknown;
  useCase: string;
  icon: string;
  keywords: unknown;
};

function mapToolRow(r: ToolRow): AITool {
  return {
    id: r.slug,
    name: r.name,
    nameEn: r.arabicTitle,
    url: r.officialUrl,
    category: r.category as ToolCategoryId,
    pricing: r.pricingType as ToolPricing,
    tagline: r.description,
    features: Array.isArray(r.features) ? (r.features as string[]) : [],
    useCase: r.useCase,
    icon: r.icon as AITool["icon"],
    keywords: Array.isArray(r.keywords) ? (r.keywords as string[]) : [],
    badge: r.badge ?? undefined,
  };
}

export async function getTools(): Promise<ContentResult<AITool>> {
  try {
    const rows = await db.aiTool.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) throw new Error("ai_tools table empty");
    return { source: "database", data: rows.map(mapToolRow) };
  } catch {
    return { source: "fallback", data: AI_TOOLS };
  }
}

/* ---------------------------------- Versus ---------------------------------- */

type VersusRow = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  scenario: string;
  winner: string;
  summary: string;
  challengePrompt: string;
  workflow: unknown;
  models: unknown;
  keywords: unknown;
};

function mapVersusRow(r: VersusRow): VersusMission {
  return {
    id: r.slug,
    number: r.number,
    title: r.title,
    shortTitle: r.shortTitle,
    icon: r.icon as VersusMission["icon"],
    description: r.description,
    scenario: r.scenario,
    winner: r.winner as ArenaModelId,
    verdict: r.summary,
    workflow: Array.isArray(r.workflow) ? (r.workflow as string[]) : [],
    models: Array.isArray(r.models)
      ? (r.models as VersusMission["models"])
      : [],
    keywords: Array.isArray(r.keywords) ? (r.keywords as string[]) : [],
    challengePrompt: r.challengePrompt,
  };
}

export async function getVersusMissions(): Promise<ContentResult<VersusMission>> {
  try {
    const rows = await db.versusMission.findMany({ orderBy: { createdAt: "asc" } });
    if (rows.length === 0) throw new Error("versus_missions table empty");
    return { source: "database", data: rows.map(mapVersusRow) };
  } catch {
    return { source: "fallback", data: VERSUS_MISSIONS };
  }
}

/* --------------------------------- Tutorials -------------------------------- */

type TutorialRow = {
  slug: string;
  title: string;
  summary: string;
  level: string;
  duration: string;
  icon: string;
  steps: unknown;
  youtubeUrl: string;
  keywords: unknown;
};

function mapTutorialRow(r: TutorialRow): Tutorial {
  return {
    id: r.slug,
    title: r.title,
    subtitle: r.summary,
    level: r.level as Tutorial["level"],
    duration: r.duration,
    icon: r.icon as Tutorial["icon"],
    steps: Array.isArray(r.steps) ? (r.steps as Tutorial["steps"]) : [],
    keywords: Array.isArray(r.keywords) ? (r.keywords as string[]) : [],
    youtubeUrl: r.youtubeUrl,
  };
}

export async function getTutorials(): Promise<ContentResult<Tutorial>> {
  try {
    const rows = await db.tutorial.findMany({ orderBy: { createdAt: "asc" } });
    if (rows.length === 0) throw new Error("tutorials table empty");
    return { source: "database", data: rows.map(mapTutorialRow) };
  } catch {
    return { source: "fallback", data: TUTORIALS };
  }
}

/* ------------------------------- Copy counter ------------------------------- */

export async function incrementPromptCopies(
  slug: string,
): Promise<{ ok: boolean; copiesCount?: number }> {
  try {
    const row = await db.prompt.update({
      where: { slug },
      data: { copiesCount: { increment: 1 } },
      select: { copiesCount: true },
    });
    return { ok: true, copiesCount: row.copiesCount };
  } catch {
    return { ok: false };
  }
}

/* --------------------------------- DB health -------------------------------- */

export interface DbHealth {
  database: "connected" | "unavailable";
  latencyMs: number | null;
  counts: { prompts: number; tools: number; versus: number; tutorials: number } | null;
  region: string;
}

export async function getDbHealth(): Promise<DbHealth> {
  const started = Date.now();
  try {
    const [prompts, tools, versus, tutorials] = await Promise.all([
      db.prompt.count(),
      db.aiTool.count(),
      db.versusMission.count(),
      db.tutorial.count(),
    ]);
    return {
      database: "connected",
      latencyMs: Date.now() - started,
      counts: { prompts, tools, versus, tutorials },
      region: process.env.VERCEL_REGION ?? "local",
    };
  } catch {
    return { database: "unavailable", latencyMs: null, counts: null, region: process.env.VERCEL_REGION ?? "local" };
  }
}
