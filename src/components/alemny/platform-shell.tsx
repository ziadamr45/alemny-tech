"use client";

import { useState } from "react";
import { Header } from "@/components/alemny/header";
import { SearchModal } from "@/components/alemny/search-modal";
import { Hero } from "@/components/alemny/hero";
import { PromptVault } from "@/components/alemny/prompt-vault";
import { ToolsDirectory } from "@/components/alemny/tools-directory";
import { VersusArena } from "@/components/alemny/versus-arena";
import { PromptBuilder } from "@/components/alemny/prompt-builder";
import { TutorialsHub } from "@/components/alemny/tutorials-hub";
import { CommunityFooter, BackToTop } from "@/components/alemny/footer";

export function PlatformShell() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="aurora relative flex min-h-screen flex-col overflow-x-clip">
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      <main className="relative z-10 flex-1">
        <Hero />
        <PromptVault />
        <ToolsDirectory />
        <VersusArena />
        <PromptBuilder />
        <TutorialsHub />
      </main>

      <CommunityFooter />
      <BackToTop />
    </div>
  );
}
