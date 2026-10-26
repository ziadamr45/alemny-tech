"use client";

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
      className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
    >
      <span className="glass-soft mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-alemny-lilac">
        <Icon className="h-4 w-4" aria-hidden />
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-bold leading-snug text-white md:text-[2.6rem] md:leading-[1.35]">
        {title}{" "}
        {highlight ? <span className="text-gradient-purple">{highlight}</span> : null}
      </h2>
      <p className="mt-4 text-base leading-8 text-alemny-muted md:text-lg md:leading-9">{description}</p>
      <div className="shimmer-line mx-auto mt-6 h-px w-40 rounded-full" aria-hidden />
    </motion.div>
  );
}
