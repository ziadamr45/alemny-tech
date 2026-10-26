"use client";

/* ============================================================
   عنوان قسم موحد — Section Heading (V3)
   طباعة سائلة (.t-section / .t-body) تتمدد من موبايل 320px
   حتى شاشات 4K مع التفاف سليم للنصوص العربية الطويلة.
   ============================================================ */

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
}

export function SectionHeading({ eyebrow, eyebrowIcon: Icon, title, highlight, description }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mb-10 max-w-3xl px-1 text-center md:mb-14"
    >
      <span className="glass-soft mb-5 inline-flex max-w-full items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-alemny-lilac">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="min-w-0">{eyebrow}</span>
      </span>
      <h2 className="t-section font-display font-bold text-white">
        {title}{" "}
        {highlight ? <span className="text-gradient-purple">{highlight}</span> : null}
      </h2>
      <p className="t-body mt-4 text-alemny-muted">{description}</p>
      <div className="shimmer-line mx-auto mt-6 h-px w-40 rounded-full" aria-hidden />
    </motion.div>
  );
}
