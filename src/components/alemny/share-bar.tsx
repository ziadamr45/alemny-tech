"use client";

/* ============================================================
   شريط المشاركة — نسخ الرابط + واتساب + فيسبوك + إكس
   يظهر في صفحات المقالات المستقلة /articles/[slug]
   ============================================================ */

import { useState } from "react";
import { Check, Facebook, Link2, MessageCircle, Twitter } from "lucide-react";

const SITE_URL = "https://alemny-tech.vercel.app";

export function ShareBar({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/articles/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* الحافظة غير متاحة — نتجاهل بهدوء */
    }
  };

  const shareLinks = [
    {
      label: "واتساب",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
      Icon: MessageCircle,
    },
    {
      label: "فيسبوك",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      Icon: Facebook,
    },
    {
      label: "إكس",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      Icon: Twitter,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="نسخ رابط المقال"
          className="obsidian-btn min-h-[44px] text-sm font-bold text-white"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[#34D399]" aria-hidden />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden />
          )}
          {copied ? "تم النسخ!" : "نسخ الرابط"}
        </button>
        {shareLinks.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`مشاركة المقال عبر ${label}`}
            className="obsidian-btn min-h-[44px] text-sm font-bold text-white"
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </a>
        ))}
      </div>
      <span
        dir="ltr"
        className="mt-3 block max-w-full truncate font-mono text-[11px] text-white/35"
      >
        {url}
      </span>
    </div>
  );
}
