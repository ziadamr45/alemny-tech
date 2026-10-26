"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search, Sparkles, Wrench, GraduationCap, Youtube, AtSign, ArrowLeft, Mail } from "lucide-react";
import { BRAND, SOCIALS } from "@/lib/alemny/constants";
import { buildSearchIndex, filterSearchItems, type SearchItem, type SearchKind } from "@/lib/alemny/search";
import { useAlemnyStore } from "@/lib/alemny/store";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KIND_META: Record<SearchKind, { label: string; color: string }> = {
  prompt: { label: "برومبت", color: "#A855F7" },
  tool: { label: "أداة", color: "#38BDF8" },
  tutorial: { label: "شرح", color: "#34D399" },
  action: { label: "رابط", color: "#D7D2E6" },
};

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const prompts = useAlemnyStore((s) => s.prompts);
  const tools = useAlemnyStore((s) => s.tools);
  const tutorials = useAlemnyStore((s) => s.tutorials);
  const index = useMemo(() => buildSearchIndex(prompts, tools, tutorials), [prompts, tools, tutorials]);
  const results = useMemo(() => filterSearchItems(index, query), [index, query]);

  const grouped = useMemo(() => {
    const g: Record<SearchKind, SearchItem[]> = { prompt: [], tool: [], tutorial: [], action: [] };
    results.forEach((r) => g[r.kind].push(r));
    return g;
  }, [results]);

  /* عند اختيار نتيجة: انتقال سلس + إشعار القسم المعني بالتصفية */
  const go = (item: SearchItem) => {
    onOpenChange(false);
    if (item.event) {
      window.dispatchEvent(new CustomEvent(item.event.name, { detail: item.event.detail }));
    }
    requestAnimationFrame(() => {
      document.querySelector(item.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) setQuery("");
  };

  const hasResults = results.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="glass top-[14%] max-w-xl translate-y-0 gap-0 overflow-hidden rounded-2xl border-alemny-purple/40 bg-[#0C0916]/95 p-0 shadow-[0_24px_80px_-16px_rgba(128,70,233,0.55)] sm:top-[12%]"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">البحث الفوري في كل محتوى المنصة</DialogTitle>
        <DialogDescription className="sr-only">
          ابحث في البرومبتات الجاهزة، أدوات الذكاء الاصطناعي، والشروحات العملية.
        </DialogDescription>

        <Command shouldFilter={false} className="w-full bg-transparent" loop>
          <div className="flex items-center gap-3 border-b border-alemny-purple/25 px-4 py-3.5">
            <Search className="h-5 w-5 shrink-0 text-alemny-lilac" aria-hidden />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="ابحث عن برومبت، أداة، أو شرح... (مثال: NotebookLM)"
              className="h-9 flex-1 border-0 bg-transparent font-body text-[15px] text-white placeholder:text-white/35 focus:ring-0"
            />
            <kbd className="hidden shrink-0 rounded-md border border-alemny-purple/40 bg-[#120E22] px-2 py-1 font-en text-[10px] text-alemny-muted sm:inline-block">
              ESC
            </kbd>
          </div>

          <CommandList className="max-h-[52vh] overflow-y-auto px-2 py-2">
            {!hasResults && (
              <CommandEmpty className="py-10 text-center">
                <p className="text-sm font-semibold text-white">لا توجد نتائج مطابقة لـ «{query}»</p>
                <p className="mt-1.5 text-xs text-alemny-muted">
                  جرّب كلمات مثل: مذاكرة، برومبت، Claude، فيديو، سيرة ذاتية...
                </p>
              </CommandEmpty>
            )}

            {grouped.prompt.length > 0 && (
              <CommandGroup
                heading={
                  <span className="flex items-center gap-2 text-xs font-bold text-alemny-lilac">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden /> مكتبة البرومبتات
                  </span>
                }
              >
                {grouped.prompt.map((item) => (
                  <ResultRow key={item.id} item={item} onSelect={() => go(item)} />
                ))}
              </CommandGroup>
            )}

            {grouped.tool.length > 0 && (
              <CommandGroup
                heading={
                  <span className="flex items-center gap-2 text-xs font-bold text-alemny-cyan">
                    <Wrench className="h-3.5 w-3.5" aria-hidden /> أدوات الذكاء الاصطناعي
                  </span>
                }
              >
                {grouped.tool.map((item) => (
                  <ResultRow key={item.id} item={item} onSelect={() => go(item)} />
                ))}
              </CommandGroup>
            )}

            {grouped.tutorial.length > 0 && (
              <CommandGroup
                heading={
                  <span className="flex items-center gap-2 text-xs font-bold text-alemny-emerald">
                    <GraduationCap className="h-3.5 w-3.5" aria-hidden /> الشروحات العملية
                  </span>
                }
              >
                {grouped.tutorial.map((item) => (
                  <ResultRow key={item.id} item={item} onSelect={() => go(item)} />
                ))}
              </CommandGroup>
            )}

            {/* روابط سريعة دائمة */}
            <CommandGroup
              heading={
                <span className="flex items-center gap-2 text-xs font-bold text-alemny-muted">
                  <AtSign className="h-3.5 w-3.5" aria-hidden /> روابط سريعة
                </span>
              }
            >
              <CommandItem
                value="youtube-channel"
                onSelect={() => window.open(SOCIALS[0].url, "_blank", "noopener")}
                className="gap-3 rounded-lg px-3 py-2.5 text-sm text-white aria-selected:bg-alemny-purple/15"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF3B3B]/15 text-[#FF5B5B]">
                  <Youtube className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex-1">قناة علَّمني تِك على يوتيوب</span>
                <span className="font-en text-[10px] text-alemny-muted">{BRAND.handle}</span>
              </CommandItem>
              <CommandItem
                value="email"
                onSelect={() => window.open(`mailto:${BRAND.email}`, "_self")}
                className="gap-3 rounded-lg px-3 py-2.5 text-sm text-white aria-selected:bg-alemny-purple/15"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-alemny-purple/15 text-alemny-lilac">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex-1">راسلنا عبر البريد الرسمي</span>
                <span className="font-en text-[10px] text-alemny-muted">{BRAND.email}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>

          <div className="flex items-center justify-between border-t border-alemny-purple/25 px-4 py-2.5 text-[11px] text-alemny-muted">
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3 rotate-90" aria-hidden /> للتنقل بين النتائج
            </span>
            <span className="font-en tracking-wide">Ctrl + K للفتح • Enter للانتقال</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function ResultRow({ item, onSelect }: { item: SearchItem; onSelect: () => void }) {
  const meta = KIND_META[item.kind];
  return (
    <CommandItem
      value={item.id}
      onSelect={onSelect}
      className="gap-3 rounded-lg px-3 py-2.5 text-sm text-white aria-selected:bg-alemny-purple/15"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold"
        style={{ borderColor: `${meta.color}44`, backgroundColor: `${meta.color}14`, color: meta.color }}
        aria-hidden
      >
        {meta.label.slice(0, 2)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{item.title}</span>
        <span className="block truncate text-xs text-alemny-muted">{item.subtitle}</span>
      </span>
      <span
        className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold"
        style={{ borderColor: `${meta.color}44`, color: meta.color }}
      >
        {meta.label}
      </span>
    </CommandItem>
  );
}
