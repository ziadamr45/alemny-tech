"use client";

/* ============================================================
   حاوية التنقل السفلية العائمة — Mobile Nav Dock (V3)
   شريط زجاجي ثلاثي الأبعاد يطفو أسفل الشاشة على الموبايل
   والأجهزة اللوحية (< lg) للتنقل بإبهام واحد، مع كبسولة
   بنفسجية متحركة تتبع المسار النشط (framer-motion layoutId).
   سطح المكتب يحتفظ بشريط التنقل العلوي الكامل.
   ============================================================ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Newspaper,
  GraduationCap,
  Sparkles,
  Compass,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/alemny/constants";

/** أيقونة كل مسار رئيسي (بنفس ترتيب NAV_LINKS) */
const DOCK_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/articles": Newspaper,
  "/tutorials": GraduationCap,
  "/prompts": Sparkles,
  "/directory": Compass,
  "/lab": FlaskConical,
};

export function MobileNavDock() {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav aria-label="التنقل السريع" className="dock-3d lg:hidden">
      <div className="no-scrollbar flex items-stretch gap-1 overflow-x-auto px-2 pt-2">
        {NAV_LINKS.map((link) => {
          const Icon = DOCK_ICONS[link.href] ?? Compass;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1.5 py-1.5 transition-colors duration-300 ${
                active ? "text-white" : "text-alemny-muted hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 rounded-2xl border border-white/15 bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-8px_rgba(128,70,233,0.75)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10 flex min-h-[52px] flex-col items-center justify-center gap-1">
                <Icon className="h-[21px] w-[21px]" strokeWidth={1.75} aria-hidden />
                <span className="text-[10px] font-semibold leading-tight">{link.shortLabel}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
