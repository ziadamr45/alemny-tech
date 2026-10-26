"use client";

/* ============================================================
   متجر المحتوى الحي — Live Content Store (zustand)
   ------------------------------------------------------------
   Strategy: static-first, database-swap hydration.
   • First paint is instant from the bundled seed data.
   • On mount, PlatformShell calls hydrate() which fetches the
     live collections from Neon (via /api/*) with a hard 8s
     timeout; whichever endpoint answers with `database`
     replaces its collection. Any failure is silent — the site
     keeps running on the static data (graceful fallback).
   • registerCopy() fires the copiesCount increment to Neon and
     bumps the counter optimistically in the UI.
   ============================================================ */

import { create } from "zustand";

import type { MagicPrompt } from "./prompts";
import { MAGIC_PROMPTS } from "./prompts";
import type { AITool } from "./tools";
import { AI_TOOLS } from "./tools";
import type { VersusMission } from "./versus";
import { VERSUS_MISSIONS } from "./versus";
import type { Tutorial } from "./tutorials";
import { TUTORIALS } from "./tutorials";
import type { Article } from "./articles";
import { ARTICLES } from "./articles";
import { buildChallengePrompt } from "./versus";

export type LiveSource = "static" | "database";

interface ApiEnvelope<T> {
  source: "database" | "fallback";
  data: T[];
}

const FETCH_TIMEOUT_MS = 8000;

async function fetchEnvelope<T>(url: string): Promise<ApiEnvelope<T> | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    if (!json || !Array.isArray(json.data) || json.data.length === 0) return null;
    return json;
  } catch {
    return null;
  }
}

interface AlemnyState {
  prompts: MagicPrompt[];
  tools: AITool[];
  missions: VersusMission[];
  tutorials: Tutorial[];
  articles: Article[];
  source: LiveSource;
  /** true once the hydration attempt finished (success OR fallback) */
  hydrated: boolean;
  hydrating: boolean;
  hydratedAt: number | null;
  hydrate: () => Promise<void>;
  /** force re-fetch from Neon (used after admin mutations) */
  refresh: () => Promise<void>;
  /** Optimistic UI bump for copiesCount */
  bumpCopies: (slug: string) => void;
  /** Fire-and-forget POST to Neon + optimistic bump */
  registerCopy: (slug: string) => void;
}

export const useAlemnyStore = create<AlemnyState>((set, get) => ({
  prompts: MAGIC_PROMPTS,
  tools: AI_TOOLS,
  missions: VERSUS_MISSIONS,
  tutorials: TUTORIALS,
  articles: ARTICLES,
  source: "static",
  hydrated: false,
  hydrating: false,
  hydratedAt: null,

  hydrate: async () => {
    if (get().hydrated || get().hydrating) return;
    set({ hydrating: true });
    try {
      const [promptsRes, toolsRes, versusRes, tutorialsRes, articlesRes] = await Promise.all([
        fetchEnvelope<MagicPrompt>("/api/prompts"),
        fetchEnvelope<AITool>("/api/tools"),
        fetchEnvelope<VersusMission>("/api/versus"),
        fetchEnvelope<Tutorial>("/api/tutorials"),
        fetchEnvelope<Article>("/api/articles"),
      ]);

      const next: Partial<AlemnyState> = { hydrated: true, hydrating: false, hydratedAt: Date.now() };
      let live = false;

      if (promptsRes && promptsRes.source === "database") {
        next.prompts = promptsRes.data;
        live = true;
      }
      if (toolsRes && toolsRes.source === "database") {
        next.tools = toolsRes.data;
        live = true;
      }
      if (versusRes && versusRes.source === "database") {
        next.missions = versusRes.data;
        live = true;
      }
      if (tutorialsRes && tutorialsRes.source === "database") {
        next.tutorials = tutorialsRes.data;
        live = true;
      }
      if (articlesRes && articlesRes.source === "database") {
        next.articles = articlesRes.data;
        live = true;
      }

      next.source = live ? "database" : "static";
      set(next);
    } catch {
      set({ hydrated: true, hydrating: false, hydratedAt: Date.now(), source: "static" });
    }
  },

  refresh: async () => {
    set({ hydrated: false });
    await get().hydrate();
  },

  bumpCopies: (slug) =>
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.id === slug ? { ...p, copiesCount: (p.copiesCount ?? 0) + 1 } : p,
      ),
    })),

  registerCopy: (slug) => {
    get().bumpCopies(slug);
    // Fire-and-forget — the copy itself already succeeded client-side,
    // so a Neon hiccup must never break the UX.
    void fetch(`/api/prompts/${encodeURIComponent(slug)}/copy`, { method: "POST" }).catch(() => {});
  },
}));

/** Convenience: challenge prompt per mission (DB value when live) */
export function missionChallengePrompt(mission: VersusMission): string {
  return mission.challengePrompt ?? buildChallengePrompt(mission);
}
