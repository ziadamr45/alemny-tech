"use client";

/* ============================================================
   الهيكل المشترك لكل صفحات المنصة (V3 — Chrome متجاوب)
   Navbar علوي ثابت + البحث الشامل (Ctrl+K) + المحتوى + التذييل
   + حاوية التنقل السفلية العائمة على الجوال، مع ترطيب المحتوى
   الحي مرة واحدة عند الإقلاع. التذييل لاصق بأسفل الشاشة دائمًا.
   ============================================================ */

import { useEffect, useState } from "react";
import { Navbar } from "@/components/alemny/navbar";
import { SearchModal } from "@/components/alemny/search-modal";
import { CommunityFooter, BackToTop } from "@/components/alemny/footer";
import { MobileNavDock } from "@/components/alemny/mobile-nav-dock";
import { useAlemnyStore } from "@/lib/alemny/store";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const hydrate = useAlemnyStore((s) => s.hydrate);

  /* ترطيب المحتوى الحي عند الإقلاع — أول عرض فوري من البيانات المحلية */
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className="aurora relative flex min-h-screen flex-col overflow-x-clip">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* pb-28 يفرغ مسار حاوية التنقل السفلية على الجوال — الديسكتوب غير متأثر */}
      <main id="main" className="relative z-10 flex-1 pb-28 lg:pb-0">
        {children}
      </main>

      <CommunityFooter />
      <BackToTop />
      <MobileNavDock />
    </div>
  );
}
