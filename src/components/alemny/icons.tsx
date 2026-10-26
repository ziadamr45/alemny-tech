"use client";

import {
  NotebookPen,
  PenTool,
  Clapperboard,
  SquareTerminal,
  Sparkles,
  Code2,
  MessagesSquare,
  Puzzle,
  GraduationCap,
  BookOpen,
  ListChecks,
  Image as ImageIcon,
  FileBadge,
  Rocket,
  Clapperboard as ScriptIcon,
  LayoutTemplate,
  Layers,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import type { ToolIcon } from "@/lib/alemny/tools";
import type { MagicPrompt } from "@/lib/alemny/prompts";

const TOOL_ICON_MAP: Record<ToolIcon, LucideIcon> = {
  notebook: NotebookPen,
  palette: PenTool,
  video: Clapperboard,
  terminal: SquareTerminal,
  sparkles: Sparkles,
  code: Code2,
  chat: MessagesSquare,
  puzzle: Puzzle,
};

export function ToolIconGlyph({ icon, className = "h-6 w-6" }: { icon: ToolIcon; className?: string }) {
  const Icon = TOOL_ICON_MAP[icon] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}

const PROMPT_ICON_MAP: Record<MagicPrompt["icon"], LucideIcon> = {
  graduation: GraduationCap,
  book: BookOpen,
  quiz: ListChecks,
  code: Code2,
  image: ImageIcon,
  cv: FileBadge,
  rocket: Rocket,
  script: ScriptIcon,
  layout: LayoutTemplate,
  poster: Layers,
  bulb: Lightbulb,
};

export function PromptIconGlyph({ icon, className = "h-5 w-5" }: { icon: MagicPrompt["icon"]; className?: string }) {
  const Icon = PROMPT_ICON_MAP[icon] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}

/* ألوان شارات نماذج الذكاء الاصطناعي */
const MODEL_COLORS: Record<string, string> = {
  Gemini: "#38BDF8",
  NotebookLM: "#8046E9",
  "Claude 5.5": "#FBBF24",
  "Claude Code": "#FBBF24",
  "Claude Design": "#FBBF24",
  "Cursor Agents": "#A855F7",
  ChatGPT: "#34D399",
  "Nano Banana / Imagen": "#F472B6",
};

export function ModelBadge({ model }: { model: string }) {
  const color = MODEL_COLORS[model] ?? "#A855F7";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-en text-[11px] font-medium tracking-wide"
      style={{ borderColor: `${color}55`, backgroundColor: `${color}14`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
      {model}
    </span>
  );
}
