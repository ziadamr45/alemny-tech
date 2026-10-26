"use client";

/* ============================================================
   عارض محتوى المقالات — يحوّل نص المقال الخام إلى كتل HTML
   الصيغة المدعومة:
   «## عنوان» · «### عنوان فرعي» · «- قوائم نقطية»
   «``` كود قابل للنسخ ```» · «> تنبيه» · **عريض** · `كود` · فقرات
   تحليل مباشر ومتين بدون أي مكتبة Markdown خارجية.
   ============================================================ */

import { useState, type ReactNode } from "react";
import { Check, Copy, Info } from "lucide-react";

/** التنسيق الداخلي: **عريض** و `كود` */
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts
    .filter((p) => p !== "")
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={i}
            dir="ltr"
            className="mx-0.5 inline-block rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[0.85em] text-[#C4A2FF]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
}

/* ------------------------------ كتلة كود قابلة للنسخ ------------------------------ */

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* الحافظة غير متاحة — نتجاهل بهدوء */
    }
  };

  return (
    <div className="relative my-5 rounded-xl border border-white/10 bg-black/50 p-4">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="نسخ الكود"
        className="glass-soft absolute end-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:text-white"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[#34D399]" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
      </button>
      <pre
        dir="ltr"
        className="no-scrollbar overflow-x-auto text-left font-mono text-[13px] leading-relaxed text-white/85"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------------------------------- العارض الرئيسي ---------------------------------- */

export function ArticleRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const t = lines[i].trim();

    if (!t) {
      i++;
      continue;
    }

    /* عنوان فرعي ### */
    if (t.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="mb-3 mt-7 text-lg font-semibold text-white/95 sm:text-xl">
          {renderInline(t.slice(4))}
        </h3>,
      );
      i++;
      continue;
    }

    /* عنوان رئيسي ## */
    if (t.startsWith("## ")) {
      blocks.push(
        <h2
          key={key++}
          className="mb-4 mt-9 border-b border-white/10 pb-2 text-xl font-bold text-white sm:text-2xl"
        >
          {renderInline(t.slice(3))}
        </h2>,
      );
      i++;
      continue;
    }

    /* كود قابل للنسخ داخل أسوار ``` */
    if (t.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // تخطي إغلاق السياج
      blocks.push(<CodeBlock key={key++} code={codeLines.join("\n")} />);
      continue;
    }

    /* قائمة نقطية متتالية */
    if (t.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="t-body flex gap-3 text-white/85">
              <span
                className="ms-1 mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#A855F7]"
                aria-hidden
              />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    /* تنبيه > */
    if (t.startsWith("> ")) {
      blocks.push(
        <div
          key={key++}
          className="t-body my-4 flex gap-3 rounded-xl border border-[#8046E9]/30 bg-[#8046E9]/10 p-4 text-white/85"
        >
          <Info className="mt-1 h-5 w-5 shrink-0 text-[#C4A2FF]" aria-hidden />
          <div>{renderInline(t.replace(/^>\s?/, ""))}</div>
        </div>,
      );
      i++;
      continue;
    }

    /* فقرة: أسطر متتالية غير فارغة وغير خاصة */
    const paragraph: string[] = [];
    while (i < lines.length) {
      const t2 = lines[i].trim();
      if (
        !t2 ||
        t2.startsWith("## ") ||
        t2.startsWith("### ") ||
        t2.startsWith("- ") ||
        t2.startsWith("```") ||
        t2.startsWith("> ")
      ) {
        break;
      }
      paragraph.push(t2);
      i++;
    }
    if (paragraph.length > 0) {
      blocks.push(
        <p key={key++} className="t-body my-4 text-white/80">
          {renderInline(paragraph.join(" "))}
        </p>,
      );
    }
  }

  return <div>{blocks}</div>;
}
