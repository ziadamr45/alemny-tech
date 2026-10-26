"use client";

/* ============================================================
   الهيكل المشترك لكل صفحات المنصة (V2 — معمارية متعددة الصفحات)
   Navbar ثابت + البحث الشامل + المحتوى + التذييل + زر العودة،
   مع ترطيب المحتوى الحي من Neon PostgreSQL مرة واحدة.
   ============================================================ */

import { useEffect, useState } from "react";
import { Navbar } from "@/components/alemny/navbar";
import { SearchModal } from "@/components/alemny/search-modal";
import { CommunityFooter, BackToTop } from "@/components/alemny/footer";
import { useAlemnyStore } from "@/lib/alemny/store";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const hydrate = useAlemnyStore((s) => s.hydrate);

  /* ترطيب المحتوى الحي من Neon PostgreSQL — أول عرض فوري من البيانات المحلية */
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className="aurora relative flex min-h-screen flex-col overflow-x-clip">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      <main className="relative z-10 flex-1">{children}</main>

      <CommunityFooter />
      <BackToTop />
    </div>
  );
}
