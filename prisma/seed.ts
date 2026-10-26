/* ============================================================
   علَّمني تِك — Alemny Tech — Database Seeder
   ------------------------------------------------------------
   Seeds ALL initial platform content into Neon PostgreSQL:
     • 11 expert-engineered Arabic prompts
     • 8 verified 2026 AI tools
     • 4 Versus missions (Gemini vs Claude 5.5 vs ChatGPT)
     • 3 step-by-step tutorials
     • 6 evergreen tech/AI articles
   Idempotent: safe to run repeatedly (upsert by slug).
   Live counters (copiesCount) are NOT reset on re-seed.
   Run:  npx prisma db seed   (or: bun db:seed)
   ============================================================ */

import { PrismaClient } from "@prisma/client";

import { MAGIC_PROMPTS } from "../src/lib/alemny/prompts";
import { AI_TOOLS } from "../src/lib/alemny/tools";
import { VERSUS_MISSIONS, buildChallengePrompt } from "../src/lib/alemny/versus";
import { TUTORIALS } from "../src/lib/alemny/tutorials";
import { ARTICLES } from "../src/lib/alemny/articles";
import { SOCIALS } from "../src/lib/alemny/constants";

const prisma = new PrismaClient();

/** Official YouTube channel of علَّمني تِك */
const YOUTUBE_URL =
  SOCIALS.find((s) => s.id === "youtube")?.url ??
  "https://youtube.com/@alemnytech?si=oFjESFXnUTG4EP8B";

/** Realistic launch-day copy counters (never reset on re-seed) */
const INITIAL_COPIES: Record<string, number> = {
  "master-mentor": 2840,
  "code-architect": 1930,
  "book-analyzer": 1280,
  "quiz-generator": 860,
  "octane-8k": 1560,
  "ats-resume": 2310,
  "project-90": 1140,
  "yt-script": 730,
  "neon-landing": 920,
  "glass-poster": 680,
  "grad-projects": 1470,
};

const FEATURED_PROMPTS = new Set(["master-mentor", "code-architect", "octane-8k", "ats-resume"]);
const FEATURED_TOOLS = new Set(["notebooklm", "cursor-agents", "ai-studio-veo"]);

/** Editorial highlight badges for the tools directory */
const TOOL_BADGES: Record<string, string> = {
  notebooklm: "الأقوى للمذاكرة",
  "claude-design": "جديد ٢٠٢٦",
  "ai-studio-veo": "الأفضل للفيديو",
  "cursor-agents": "الأفضل للبرمجة",
  gemini: "الأشهر عالميًّا",
  "claude-code": "مرجع المطورين",
  chatgpt: "الأكثر تنوعًا",
  "web-importer": "إضافة مجانية",
};

async function seedPrompts() {
  for (const p of MAGIC_PROMPTS) {
    const data = {
      slug: p.id,
      title: p.title,
      category: p.category,
      targetModel: p.models[0] ?? "Gemini",
      targetModels: p.models,
      resultHook: p.hook,
      promptText: p.body,
      variables: p.variables,
      icon: p.icon,
      tips: p.tips,
      keywords: p.keywords,
      ltr: p.ltr ?? false,
      featured: FEATURED_PROMPTS.has(p.id),
    };
    await prisma.prompt.upsert({
      where: { slug: p.id },
      update: data, // copiesCount intentionally excluded → live counter preserved
      create: { ...data, copiesCount: INITIAL_COPIES[p.id] ?? 0 },
    });
  }
  return MAGIC_PROMPTS.length;
}

async function seedTools() {
  for (const t of AI_TOOLS) {
    const data = {
      slug: t.id,
      name: t.name,
      arabicTitle: t.nameEn,
      category: t.category,
      pricingType: t.pricing,
      description: t.tagline,
      officialUrl: t.url,
      badge: TOOL_BADGES[t.id] ?? null,
      features: t.features,
      useCase: t.useCase,
      icon: t.icon,
      keywords: t.keywords,
      featured: FEATURED_TOOLS.has(t.id),
    };
    await prisma.aiTool.upsert({ where: { slug: t.id }, update: data, create: data });
  }
  return AI_TOOLS.length;
}

function scoreOf(missionId: string, model: "gemini" | "claude" | "chatgpt"): number {
  const mission = VERSUS_MISSIONS.find((m) => m.id === missionId);
  const found = mission?.models.find((m) => m.id === model);
  if (!mission || !found) throw new Error(`Versus score missing: ${missionId}/${model}`);
  return found.score;
}

async function seedVersus() {
  for (const m of VERSUS_MISSIONS) {
    const data = {
      slug: m.id,
      number: m.number,
      title: m.title,
      shortTitle: m.shortTitle,
      icon: m.icon,
      description: m.description,
      scenario: m.scenario,
      geminiScore: scoreOf(m.id, "gemini"),
      claudeScore: scoreOf(m.id, "claude"),
      chatgptScore: scoreOf(m.id, "chatgpt"),
      winner: m.winner,
      summary: m.verdict,
      challengePrompt: buildChallengePrompt(m),
      workflow: m.workflow,
      models: m.models.map(({ id, score, pros, cons }) => ({ id, score, pros, cons })),
      keywords: m.keywords,
    };
    await prisma.versusMission.upsert({ where: { slug: m.id }, update: data, create: data });
  }
  return VERSUS_MISSIONS.length;
}

async function seedTutorials() {
  for (const t of TUTORIALS) {
    const data = {
      slug: t.id,
      title: t.title,
      summary: t.subtitle,
      level: t.level,
      duration: t.duration,
      icon: t.icon,
      steps: t.steps,
      youtubeUrl: YOUTUBE_URL,
      keywords: t.keywords,
    };
    await prisma.tutorial.upsert({ where: { slug: t.id }, update: data, create: data });
  }
  return TUTORIALS.length;
}

async function seedArticles() {
  for (const a of ARTICLES) {
    const data = {
      slug: a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      readMinutes: a.readMinutes,
      tags: a.tags,
      content: a.content,
      keywords: a.keywords,
      published: true,
      featured: a.featured ?? false,
    };
    await prisma.article.upsert({ where: { slug: a.id }, update: data, create: data });
  }
  return ARTICLES.length;
}

async function main() {
  const started = Date.now();
  console.log("\n🌱  علَّمني تِك — seeding Neon PostgreSQL …\n");

  const prompts = await seedPrompts();
  const tools = await seedTools();
  const versus = await seedVersus();
  const tutorials = await seedTutorials();
  const articles = await seedArticles();

  const [dbPrompts, dbTools, dbVersus, dbTutorials, dbArticles] = await Promise.all([
    prisma.prompt.count(),
    prisma.aiTool.count(),
    prisma.versusMission.count(),
    prisma.tutorial.count(),
    prisma.article.count(),
  ]);

  console.log("✅ Seed complete:");
  console.log(`   • Prompts   : ${dbPrompts}/${prompts} rows`);
  console.log(`   • AiTools   : ${dbTools}/${tools} rows`);
  console.log(`   • Versus    : ${dbVersus}/${versus} rows`);
  console.log(`   • Tutorials : ${dbTutorials}/${tutorials} rows`);
  console.log(`⏱  ${Date.now() - started}ms\n`);

  if (
    dbPrompts < prompts ||
    dbTools < tools ||
    dbVersus < versus ||
    dbTutorials < tutorials ||
    dbArticles < articles
  ) {
    throw new Error("Row count mismatch — seeding incomplete!");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
