"use client";

/* ============================================================
   عدة النسخ النقي المشتركة — علَّمني تِك
   ------------------------------------------------------------
   • SignaturePanel: مفتاح التوقيع الشفاف (افتراضيًّا مفعّل) بالنص
     الإلزامي المطابق للمواصفة — نصّي أو بصري حسب نوع البرومبت.
   • PromptPreviewEditor: صندوق معاينة قابل للتعديل مباشرة
     (<textarea>) بحرية ١٠٠٪ + شارة بنفسجية مميزة تُبرز جملة
     التوقيع التي ستُلحق في نهاية النص المنسوخ.
   • النسخ دائمًا يمر عبر composePromptCopy(): تعقيم من أي جمل
     توقيع أو فواصل أو نصوص واجهة، ثم إلحاق التوقيع عند التفعيل.
   ============================================================ */

import { Sparkles, BadgeCheck, CircleOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  BRAND_IMAGE_SIGNATURE,
  BRAND_TEXT_SIGNATURE,
  IMAGE_SIGNATURE_LABEL,
  TEXT_SIGNATURE_LABEL,
} from "@/lib/alemny/signature";

/* ------------------------- مفتاح التوقيع الشفاف ------------------------- */

export function SignaturePanel({
  isImage,
  checked,
  onChange,
  className = "",
}: {
  isImage: boolean;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[48px] items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2 ${className}`}
      data-signature-panel={isImage ? "image" : "text"}
    >
      <span className="flex min-w-0 items-start gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C4A2FF]" aria-hidden />
        <span className="text-[11.5px] font-semibold leading-5 text-white/70">
          {isImage ? IMAGE_SIGNATURE_LABEL : TEXT_SIGNATURE_LABEL}
        </span>
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={isImage ? IMAGE_SIGNATURE_LABEL : TEXT_SIGNATURE_LABEL}
        className="mt-0.5 h-5 w-9 shrink-0 data-[state=checked]:bg-alemny-purple"
      />
    </div>
  );
}

/* ------------------- صندوق المعاينة القابل للتعديل ------------------- */

export function PromptPreviewEditor({
  value,
  onChange,
  dir = "rtl",
  isImage,
  signatureOn,
  minHeightClass = "min-h-[220px]",
  ariaLabel = "نص البرومبت — قابل للتعديل قبل النسخ",
}: {
  value: string;
  onChange: (v: string) => void;
  dir?: "rtl" | "ltr";
  isImage: boolean;
  signatureOn: boolean;
  minHeightClass?: string;
  ariaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-alemny-purple/25 bg-black/50 p-3" data-prompt-editor>
      {/* النص النقي — قابل للتعديل بحرية كاملة قبل النسخ */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        aria-label={ariaLabel}
        spellCheck={false}
        className={`w-full ${minHeightClass} resize-y overflow-y-auto rounded-xl border border-white/8 bg-black/40 px-4 py-3.5 font-body text-[13px] leading-7 text-white/85 transition-colors placeholder:text-white/25 focus:border-alemny-purple/60 focus:outline-none focus:ring-2 focus:ring-alemny-purple/35`}
        style={{ textAlign: dir === "ltr" ? "left" : "right" }}
      />

      {/* شارة التوقيع البنفسجية — تُبرز جملة التوقيع داخل صندوق المعاينة نفسه */}
      {signatureOn ? (
        <div
          className="mt-2 rounded-xl border border-[#8046E9]/60 bg-[#8046E9]/12 px-3.5 py-3 shadow-[0_0_20px_rgba(128,70,233,0.18)]"
          data-signature-clause
        >
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#C4A2FF]">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            توقيع علَّمني تِك — يُلحق تلقائيًّا في نهاية النص المنسوخ:
          </p>
          <p
            dir={isImage ? "ltr" : "rtl"}
            className="whitespace-pre-wrap text-[11px] leading-5.5 text-white/65"
            style={{ textAlign: isImage ? "left" : "right" }}
          >
            {isImage ? BRAND_IMAGE_SIGNATURE : BRAND_TEXT_SIGNATURE}
          </p>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5">
          <CircleOff className="h-3.5 w-3.5 shrink-0 text-white/35" aria-hidden />
          <p className="text-[11px] leading-5 text-white/40">
            التوقيع مُعطَّل — سيُنسخ النص صافيًّا ١٠٠٪ بلا أي إضافة، وإن أضفته يدويًّا فسيُزال قبل النسخ.
          </p>
        </div>
      )}
    </div>
  );
}
