"use client";

/* ============================================================
   لوحة التحكم الديناميكية — /admin (V2)
   CMS كامل متصل بـ Neon PostgreSQL عبر Prisma:
   إضافة وتعديل وحذف المقالات، الشروحات، البرومبتات، والأدوات
   مباشرةً من الواجهة — بلا لمس الكود إطلاقًا.
   الحماية: مفتاح إدارة يُدخل مرة واحدة (ترويسة x-admin-key).
   ============================================================ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Newspaper,
  GraduationCap,
  Wand2,
  Wrench,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  KeyRound,
  Database,
  LockKeyhole,
  Layers,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { arNum } from "@/lib/alemny/format";
import { useAlemnyStore } from "@/lib/alemny/store";
import { BRAND } from "@/lib/alemny/constants";

/* ============================ الأنواع والإعدادات ============================ */

type Row = Record<string, unknown>;
type FieldValue = string | number | boolean | string[] | Record<string, string>[];
type Values = Record<string, FieldValue>;

type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "lines" | "rows";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  hint?: string;
  rows?: number;
  ltr?: boolean;
  sub?: { key: string; label: string; type: "text" | "textarea"; placeholder?: string }[];
  wide?: boolean;
}

interface CollectionConfig {
  name: "articles" | "tutorials" | "prompts" | "tools";
  label: string;
  icon: typeof Newspaper;
  color: string;
  titleKey: string;
  subKey?: string;
  fields: FieldDef[];
  defaults: Values;
  /** اشتقاقات قبل الإرسال (مثل targetModel من أول نموذج) */
  derive?: (v: Values) => Values;
}

const slugify = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const asLines = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
const asRows = (v: unknown): Record<string, string>[] =>
  Array.isArray(v) ? (v as Record<string, string>[]).map((r) => ({ ...r })) : [];

export const COLLECTIONS_CONFIG: CollectionConfig[] = [
  {
    name: "articles",
    label: "المقالات",
    icon: Newspaper,
    color: "#A855F7",
    titleKey: "title",
    subKey: "excerpt",
    defaults: { category: "ai", readMinutes: 6, tags: [], keywords: [], published: true, featured: false },
    fields: [
      { key: "title", label: "عنوان المقال", type: "text", wide: true },
      { key: "slug", label: "المعرّف (slug)", type: "text", ltr: true, hint: "اتركه كما وُلّد تلقائيًّا من العنوان" },
      {
        key: "category",
        label: "الفئة",
        type: "select",
        options: [
          { value: "ai", label: "الذكاء الاصطناعي" },
          { value: "dev", label: "البرمجة والتطوير" },
          { value: "security", label: "الأمن والحصانة الرقمية" },
          { value: "future", label: "المستقبل الرقمي" },
        ],
      },
      { key: "readMinutes", label: "مدة القراءة (دقائق)", type: "number" },
      { key: "tags", label: "الوسوم", type: "lines", hint: "وسم واحد في كل سطر", wide: true },
      { key: "excerpt", label: "المستخلص (يظهر في البطاقة)", type: "textarea", rows: 3, wide: true },
      {
        key: "content",
        label: "محتوى المقال الكامل",
        type: "textarea",
        rows: 14,
        wide: true,
        hint: "«## عنوان فرعي» للعناوين، «- عنصر» للقوائم، وسطر فارغ يفصل الفقرات.",
      },
      { key: "keywords", label: "كلمات البحث", type: "lines", hint: "كلمة في كل سطر", wide: true },
      { key: "published", label: "منشور (ظاهر في الموقع)", type: "checkbox" },
      { key: "featured", label: "مميز (يظهر أولًا وفي الرئيسية)", type: "checkbox" },
    ],
  },
  {
    name: "tutorials",
    label: "الشروحات",
    icon: GraduationCap,
    color: "#34D399",
    titleKey: "title",
    subKey: "summary",
    defaults: { level: "مبتدئ", duration: "١٠ دقائق", icon: "notebook", keywords: [] },
    fields: [
      { key: "title", label: "عنوان الشرح", type: "text", wide: true },
      { key: "slug", label: "المعرّف (slug)", type: "text", ltr: true, hint: "اتركه كما وُلّد تلقائيًّا" },
      {
        key: "level",
        label: "المستوى",
        type: "select",
        options: [
          { value: "مبتدئ", label: "مبتدئ" },
          { value: "متوسط", label: "متوسط" },
          { value: "مبتدئ → متوسط", label: "مبتدئ → متوسط" },
        ],
      },
      { key: "duration", label: "المدة", type: "text", hint: "مثال: ١٢ دقيقة" },
      {
        key: "icon",
        label: "الأيقونة",
        type: "select",
        options: [
          { value: "notebook", label: "دفتر ذكي" },
          { value: "cursor", label: "برمجة ووكلاء" },
          { value: "veo", label: "فيديو" },
        ],
      },
      { key: "youtubeUrl", label: "رابط يوتيوب (قناة المنصة)", type: "text", ltr: true, wide: true },
      { key: "summary", label: "الوصف المختصر", type: "textarea", rows: 3, wide: true },
      {
        key: "steps",
        label: "خطوات الشرح",
        type: "rows",
        wide: true,
        sub: [
          { key: "title", label: "عنوان الخطوة", type: "text" },
          { key: "desc", label: "الوصف التفصيلي", type: "textarea" },
          { key: "tip", label: "نصيحة احترافية (اختياري)", type: "textarea" },
        ],
      },
      { key: "keywords", label: "كلمات البحث", type: "lines", hint: "كلمة في كل سطر", wide: true },
    ],
  },
  {
    name: "prompts",
    label: "البرومبتات",
    icon: Wand2,
    color: "#38BDF8",
    titleKey: "title",
    subKey: "resultHook",
    defaults: { category: "study", icon: "bulb", targetModels: [], variables: [], tips: [], keywords: [], ltr: false, featured: false },
    derive: (v) => ({
      ...v,
      targetModel: asLines(v.targetModels)[0] ?? "Gemini",
      slug: typeof v.slug === "string" && v.slug ? v.slug : slugify(String(v.title ?? "")),
    }),
    fields: [
      { key: "title", label: "عنوان البرومبت", type: "text", wide: true },
      { key: "slug", label: "المعرّف (slug)", type: "text", ltr: true, hint: "اتركه فارغًا ليُولَّد من العنوان" },
      {
        key: "category",
        label: "الفئة",
        type: "select",
        options: [
          { value: "study", label: "المذاكرة والبحث العلمي" },
          { value: "coding", label: "البرمجة وتطوير المواقع" },
          { value: "design", label: "تصميم الصور 8K 3D" },
          { value: "productivity", label: "الإنتاجية وCV والمشاريع" },
        ],
      },
      { key: "targetModels", label: "النماذج المستهدفة", type: "lines", hint: "نموذج في كل سطر (الأول هو الرئيسي)", wide: true },
      { key: "resultHook", label: "خطاف النتيجة (ما الذي سيحصل عليه المستخدم)", type: "textarea", rows: 2, wide: true },
      {
        key: "promptText",
        label: "نص البرومبت الكامل",
        type: "textarea",
        rows: 12,
        wide: true,
        hint: "استخدم {{variableKey}} لتصبح متغيرًا حيًّا قابلًا للتخصيص.",
      },
      {
        key: "variables",
        label: "المتغيرات الحية",
        type: "rows",
        wide: true,
        sub: [
          { key: "key", label: "المفتاح (بالإنجليزية)", type: "text", placeholder: "subject" },
          { key: "label", label: "التسمية الظاهرة", type: "text", placeholder: "المادة أو المقرر" },
          { key: "placeholder", label: "النص الإرشادي", type: "text", placeholder: "مثال: مادة قواعد البيانات" },
        ],
      },
      { key: "tips", label: "نصائح الخبراء", type: "lines", hint: "نصيحة في كل سطر", wide: true },
      { key: "keywords", label: "كلمات البحث", type: "lines", wide: true },
      { key: "ltr", label: "عرض النص باتجاه LTR (للبرومبتات اللاتينية)", type: "checkbox" },
      { key: "featured", label: "مميز", type: "checkbox" },
    ],
  },
  {
    name: "tools",
    label: "الأدوات",
    icon: Wrench,
    color: "#FBBF24",
    titleKey: "name",
    subKey: "description",
    defaults: { category: "study", pricingType: "free", icon: "sparkles", features: [], keywords: [], featured: false },
    derive: (v) => ({ ...v, badge: typeof v.badge === "string" && v.badge.trim() ? v.badge.trim() : null }),
    fields: [
      { key: "name", label: "اسم الأداة (إنجليزي)", type: "text", ltr: true, wide: true },
      { key: "slug", label: "المعرّف (slug)", type: "text", ltr: true, hint: "اتركه كما وُلّد تلقائيًّا" },
      { key: "arabicTitle", label: "التسمية العربية", type: "text", wide: true },
      {
        key: "category",
        label: "الفئة",
        type: "select",
        options: [
          { value: "study", label: "المذاكرة والبحث" },
          { value: "coding", label: "البرمجة والأكواد" },
          { value: "design", label: "التصميم والواجهات" },
          { value: "media", label: "الفيديو والصوت" },
        ],
      },
      {
        key: "pricingType",
        label: "التسعير",
        type: "select",
        options: [
          { value: "free", label: "مجاني بالكامل" },
          { value: "freemium", label: "فريميوم / باقات" },
        ],
      },
      { key: "officialUrl", label: "الرابط الرسمي", type: "text", ltr: true, wide: true },
      { key: "badge", label: "شارة التمييز (اختياري)", type: "text", hint: "مثال: الأقوى للمذاكرة" },
      { key: "description", label: "الوصف المختصر", type: "textarea", rows: 2, wide: true },
      { key: "useCase", label: "سيناريو الاستخدام العملي", type: "textarea", rows: 3, wide: true },
      { key: "features", label: "الميزات", type: "lines", hint: "ميزة في كل سطر", wide: true },
      {
        key: "icon",
        label: "الأيقونة",
        type: "select",
        options: [
          { value: "notebook", label: "دفتر" },
          { value: "palette", label: "تصميم" },
          { value: "video", label: "فيديو" },
          { value: "terminal", label: "طرفية" },
          { value: "sparkles", label: "نجمة" },
          { value: "code", label: "كود" },
          { value: "chat", label: "محادثة" },
          { value: "puzzle", label: "إضافة" },
        ],
      },
      { key: "keywords", label: "كلمات البحث", type: "lines", wide: true },
      { key: "featured", label: "مميز", type: "checkbox" },
    ],
  },
];

/* ============================ مساعدات الشبكة ============================ */

function buildInitValues(config: CollectionConfig, row: Row | null): Values {
  const values: Values = { ...config.defaults };
  if (!row) {
    // قيم أولية ذكية عند الإنشاء
    if ("slug" in values === false) values.slug = "";
    return values;
  }
  for (const f of config.fields) {
    const raw = row[f.key];
    if (raw === undefined || raw === null) continue;
    if (f.type === "lines") values[f.key] = asLines(raw);
    else if (f.type === "rows") values[f.key] = asRows(raw);
    else if (f.type === "number") values[f.key] = Number(raw);
    else if (f.type === "checkbox") values[f.key] = Boolean(raw);
    else values[f.key] = String(raw);
  }
  return values;
}

/* ============================ لوحة التحكم ============================ */

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [activeCol, setActiveCol] = useState<CollectionConfig["name"]>("articles");
  const [rows, setRows] = useState<Row[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [editing, setEditing] = useState<{ config: CollectionConfig; row: Row | null } | null>(null);
  const [deleting, setDeleting] = useState<{ config: CollectionConfig; row: Row } | null>(null);
  const refreshStore = useAlemnyStore((s) => s.refresh);
  const dbSource = useAlemnyStore((s) => s.source);

  /* التحقق من المفتاح المحفوظ عند الإقلاع (خارج المسار المتزامن) */
  useEffect(() => {
    void (async () => {
      await Promise.resolve();
      const saved = window.localStorage.getItem("alemny_admin_key");
      if (!saved) {
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: saved }),
        });
        if (res.ok) setAdminKey(saved);
        else window.localStorage.removeItem("alemny_admin_key");
      } catch {
        window.localStorage.removeItem("alemny_admin_key");
      }
      setChecking(false);
    })();
  }, []);

  const loadRows = useCallback(
    async (col: CollectionConfig["name"], key: string) => {
      setLoadingRows(true);
      try {
        const res = await fetch(`/api/admin/${col}`, { headers: { "x-admin-key": key }, cache: "no-store" });
        if (res.status === 401) {
          window.localStorage.removeItem("alemny_admin_key");
          setAdminKey(null);
          return;
        }
        const json = (await res.json()) as { ok: boolean; data?: Row[]; error?: string };
        if (json.ok && Array.isArray(json.data)) setRows(json.data);
        else toast.error("تعذّر جلب البيانات", { description: json.error });
      } catch {
        toast.error("تعذّر الاتصال بالخادم");
      }
      setLoadingRows(false);
    },
    [],
  );

  useEffect(() => {
    if (!adminKey) return;
    void (async () => {
      await Promise.resolve();
      await loadRows(activeCol, adminKey);
    })();
  }, [activeCol, adminKey, loadRows]);

  const activeConfig = useMemo(
    () => COLLECTIONS_CONFIG.find((c) => c.name === activeCol) ?? COLLECTIONS_CONFIG[0],
    [activeCol],
  );

  if (checking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-alemny-lilac" aria-hidden />
      </div>
    );
  }

  if (!adminKey) {
    return <LoginCard onAuth={(key) => setAdminKey(key)} />;
  }

  const ColIcon = activeConfig.icon;

  return (
    <section aria-label="لوحة التحكم الديناميكية" className="relative py-28 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* ترويسة اللوحة */}
        <div className="card-3d mb-8 rounded-3xl p-6 md:p-8">
          <span className="ambient-spot -top-16 left-1/3 h-40 w-40" aria-hidden />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-alemny-emerald/40 bg-alemny-emerald/12 text-alemny-emerald shadow-[0_0_28px_rgba(52,211,153,0.25)]">
                <ShieldCheck className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <h1 className="font-display text-xl font-bold text-white md:text-2xl">لوحة التحكم الديناميكية</h1>
                <p className="mt-1 text-[13px] text-alemny-muted">
                  أضف وعدّل واحذف محتوى {BRAND.ar} مباشرةً في قاعدة بيانات Neon PostgreSQL — بلا لمس الكود.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="neon-chip px-3.5 py-2 text-[11.5px] font-bold text-alemny-lilac">
                <Database className="h-3.5 w-3.5" aria-hidden />
                {dbSource === "database" ? "متصل بـ Neon مباشرة" : "وضع الاتصال الجاري…"}
              </span>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.removeItem("alemny_admin_key");
                  setAdminKey(null);
                }}
                className="glass-soft glass-hover flex h-10 items-center gap-2 rounded-xl px-4 text-[12.5px] font-bold text-alemny-muted hover:text-white"
                aria-label="تسجيل الخروج من لوحة التحكم"
              >
                <LockKeyhole className="h-4 w-4" aria-hidden />
                قفل اللوحة
              </button>
            </div>
          </div>
        </div>

        {/* تبويبات المجموعات */}
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="مجموعات المحتوى">
          {COLLECTIONS_CONFIG.map((c) => {
            const Icon = c.icon;
            const active = c.name === activeCol;
            return (
              <button
                key={c.name}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCol(c.name)}
                className={`flex items-center gap-2 rounded-2xl px-4.5 py-3 text-[13.5px] font-bold transition-all duration-300 ${
                  active ? "text-white" : "glass-soft text-alemny-muted hover:text-white"
                }`}
                style={active ? { background: `linear-gradient(135deg, ${c.color}CC, ${c.color}77)`, boxShadow: `0 0 24px ${c.color}44` } : undefined}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* رأس المجموعة */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-alemny-muted">
            <ColIcon className="h-4 w-4" style={{ color: activeConfig.color }} aria-hidden />
            {arNum(rows.length)} عنصرًا في «{activeConfig.label}» — البيانات حية من قاعدة البيانات
          </p>
          <button
            type="button"
            onClick={() => setEditing({ config: activeConfig, row: null })}
            className="btn-neon flex h-11 items-center gap-2 rounded-2xl px-5 text-[13.5px] font-bold text-white"
          >
            <Plus className="h-4.5 w-4.5" aria-hidden />
            إضافة {activeConfig.label === "البرومبتات" ? "برومبت" : activeConfig.label === "المقالات" ? "مقال" : activeConfig.label === "الشروحات" ? "شرحًا" : "أداة"} جديد
          </button>
        </div>

        {/* قائمة الصفوف */}
        {loadingRows ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-alemny-lilac" aria-hidden />
          </div>
        ) : rows.length === 0 ? (
          <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
            <Layers className="h-9 w-9 text-alemny-lilac" aria-hidden />
            <p className="font-bold text-white">لا توجد عناصر بعد</p>
            <p className="text-sm text-alemny-muted">ابدأ بإضافة أول عنصر إلى هذه المجموعة.</p>
          </div>
        ) : (
          <div className="max-h-[58vh] space-y-2.5 overflow-y-auto rounded-3xl border border-alemny-purple/20 bg-black/20 p-3">
            {rows.map((row) => (
              <div
                key={String(row.slug ?? row.id)}
                className="glass-soft glass-hover flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-white">{String(row[activeConfig.titleKey] ?? "بدون عنوان")}</p>
                  <p className="mt-0.5 truncate text-[11.5px] text-alemny-muted">
                    <span dir="ltr" className="inline-block font-en">{String(row.slug ?? "")}</span>
                    {activeConfig.subKey ? ` — ${String(row[activeConfig.subKey] ?? "").slice(0, 90)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing({ config: activeConfig, row })}
                    className="glass-soft glass-hover flex h-9 w-9 items-center justify-center rounded-xl text-alemny-lilac hover:text-white"
                    aria-label={`تحرير ${String(row[activeConfig.titleKey] ?? "")}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting({ config: activeConfig, row })}
                    className="glass-soft glass-hover flex h-9 w-9 items-center justify-center rounded-xl text-alemny-rose hover:text-white"
                    aria-label={`حذف ${String(row[activeConfig.titleKey] ?? "")}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نافذة التحرير */}
      {editing && (
        <EditorDialog
          config={editing.config}
          row={editing.row}
          adminKey={adminKey}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await loadRows(activeCol, adminKey);
            void refreshStore();
          }}
        />
      )}

      {/* تأكيد الحذف */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent className="glass border-alemny-rose/40 bg-[#140C12]/97 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-lg text-white">تأكيد الحذف النهائي</AlertDialogTitle>
            <AlertDialogDescription className="leading-8 text-alemny-muted">
              سيُحذف «{deleting ? String(deleting.row[deleting.config.titleKey] ?? "") : ""}» نهائيًّا من قاعدة البيانات.
              لا يمكن التراجع عن هذه العملية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2.5">
            <AlertDialogCancel className="glass-soft border-alemny-purple/40 text-white hover:text-white">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-to-l from-rose-600 to-rose-500 text-white shadow-[0_0_22px_rgba(244,63,94,0.4)]"
              onClick={async () => {
                if (!deleting || !adminKey) return;
                const { config, row } = deleting;
                try {
                  const res = await fetch(`/api/admin/${config.name}/${encodeURIComponent(String(row.slug))}`, {
                    method: "DELETE",
                    headers: { "x-admin-key": adminKey },
                  });
                  const json = (await res.json()) as { ok: boolean; error?: string };
                  if (json.ok) {
                    toast.success("تم الحذف نهائيًّا من قاعدة البيانات");
                    setDeleting(null);
                    await loadRows(activeCol, adminKey);
                    void refreshStore();
                  } else {
                    toast.error("فشل الحذف", { description: json.error });
                  }
                } catch {
                  toast.error("تعذّر الاتصال بالخادم");
                }
              }}
            >
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

/* ============================ بطاقة الدخول ============================ */

function LoginCard({ onAuth }: { onAuth: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!key.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (res.ok) {
        window.localStorage.setItem("alemny_admin_key", key);
        onAuth(key);
        toast.success("مرحبًا بك في لوحة التحكم!");
      } else {
        setError("المفتاح غير صحيح — تأكد من قيمة ADMIN_API_KEY.");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم.");
    }
    setBusy(false);
  };

  return (
    <section aria-label="دخول لوحة التحكم" className="flex min-h-[76vh] items-center justify-center px-4 pt-24">
      <div className="card-3d w-full max-w-md rounded-3xl p-8 text-center">
        <span className="ambient-spot -top-16 left-1/2 h-36 w-36" aria-hidden />
        <span className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-alemny-emerald/40 bg-alemny-emerald/12 text-alemny-emerald shadow-[0_0_34px_rgba(52,211,153,0.3)]">
          <ShieldCheck className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="relative z-10 font-display text-xl font-bold text-white md:text-2xl">لوحة التحكم الديناميكية</h1>
        <p className="relative z-10 mt-2 text-[13px] leading-7 text-alemny-muted">
          هذه المنطقة محمية. أدخل مفتاح الإدارة للتحكم الكامل في محتوى المنصة داخل قاعدة بيانات Neon.
        </p>
        <form
          className="relative z-10 mt-7 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <label className="block text-right">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-alemny-muted">مفتاح الإدارة</span>
            <div className="relative">
              <KeyRound className="absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-alemny-lilac" aria-hidden />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="أدخل مفتاح ADMIN_API_KEY"
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-alemny-purple/30 bg-[#120E22] pr-11 pl-4 text-[14px] text-white placeholder:text-white/25 transition-colors focus:border-alemny-purple focus:outline-none focus:ring-1 focus:ring-alemny-purple/50"
                dir="ltr"
              />
            </div>
          </label>
          {error && <p className="rounded-xl border border-alemny-rose/40 bg-alemny-rose/10 px-4 py-2.5 text-[12.5px] text-alemny-rose">{error}</p>}
          <button type="submit" disabled={busy || !key.trim()} className="btn-neon flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[14.5px] font-bold text-white disabled:opacity-50">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <ShieldCheck className="h-5 w-5" aria-hidden />}
            فتح اللوحة
          </button>
        </form>
      </div>
    </section>
  );
}

/* ============================ نافذة التحرير ============================ */

function EditorDialog({
  config,
  row,
  adminKey,
  onClose,
  onSaved,
}: {
  config: CollectionConfig;
  row: Row | null;
  adminKey: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const isCreate = row === null;
  const [values, setValues] = useState<Values>(() => buildInitValues(config, row));
  const [busy, setBusy] = useState(false);

  /* توليد السلاغ تلقائيًّا من العنوان عند الإنشاء — تعديل أثناء التصيير (يتقارب فورًا) */
  const titleForSlug = typeof values[config.titleKey] === "string" ? (values[config.titleKey] as string) : "";
  if (isCreate && values.slug === "" && titleForSlug) {
    setValues((v) => ({ ...v, slug: slugify(String(v[config.titleKey] ?? "")) }));
  }

  const setField = (key: string, value: FieldValue) => setValues((v) => ({ ...v, [key]: value }));

  const save = async () => {
    setBusy(true);
    try {
      const payload = config.derive ? config.derive(values) : values;
      const url = isCreate
        ? `/api/admin/${config.name}`
        : `/api/admin/${config.name}/${encodeURIComponent(String(row?.slug ?? ""))}`;
      const res = await fetch(url, {
        method: isCreate ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        toast.success(isCreate ? "تمت الإضافة إلى Neon PostgreSQL بنجاح" : "تم حفظ التعديلات في قاعدة البيانات");
        onClose();
        await onSaved();
      } else {
        toast.error(isCreate ? "فشلت الإضافة" : "فشل الحفظ", { description: json.error });
      }
    } catch {
      toast.error("تعذّر الاتصال بالخادم");
    }
    setBusy(false);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl gap-0 overflow-y-auto rounded-3xl border-alemny-purple/40 bg-[#0C0916]/97 p-0">
        <div className="p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                style={{ borderColor: `${config.color}55`, backgroundColor: `${config.color}14`, color: config.color }}
              >
                <config.icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-white md:text-xl">
                  {isCreate ? `إضافة ${config.label === "الأدوات" ? "أداة" : config.label === "المقالات" ? "مقال" : config.label === "الشروحات" ? "شرح" : "برومبت"} جديد` : "تحرير العنصر"}
                </h3>
                <p className="mt-0.5 text-[12px] text-alemny-muted">
                  {isCreate ? "سيُحفظ مباشرةً في قاعدة بيانات Neon" : <span dir="ltr" className="inline-block font-en">{String(row?.slug ?? "")}</span>}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="glass-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-alemny-muted transition-colors hover:text-white"
              aria-label="إغلاق المحرر"
            >
              <X className="h-4.5 w-4.5" aria-hidden />
            </button>
          </div>

          <div className="grid gap-4.5 md:grid-cols-2">
            {config.fields.map((f) => (
              <FieldInput key={f.key} field={f} value={values[f.key]} onChange={(v) => setField(f.key, v)} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="btn-neon mt-7 flex h-13 w-full items-center justify-center gap-2.5 rounded-2xl text-[15px] font-bold text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Plus className="h-5 w-5" aria-hidden />}
            {isCreate ? "حفظ في قاعدة البيانات" : "حفظ التعديلات"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================ حقول النماذج ============================ */

function FieldInput({ field, value, onChange }: { field: FieldDef; value: FieldValue | undefined; onChange: (v: FieldValue) => void }) {
  const spanClass = field.wide || field.type === "textarea" || field.type === "lines" || field.type === "rows" ? "md:col-span-2" : "";

  const labelEl = (
    <span className="mb-1.5 flex items-center justify-between gap-2">
      <span className="text-[12.5px] font-semibold text-alemny-muted">{field.label}</span>
      {field.hint && <span className="text-[10.5px] text-alemny-muted/70">{field.hint}</span>}
    </span>
  );

  const inputBase =
    "w-full rounded-xl border border-alemny-purple/30 bg-[#120E22] px-3.5 text-[13.5px] text-white placeholder:text-white/25 transition-colors focus:border-alemny-purple focus:outline-none focus:ring-1 focus:ring-alemny-purple/50";

  if (field.type === "checkbox") {
    return (
      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border border-alemny-purple/25 bg-[#0D0A18]/70 px-4 py-3.5 ${spanClass}`}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4.5 w-4.5 accent-[#8046E9]"
        />
        <span className="text-[13px] font-semibold text-white">{field.label}</span>
      </label>
    );
  }

  return (
    <label className={`block ${spanClass}`}>
      {labelEl}
      {field.type === "text" && (
        <input
          type="text"
          dir={field.ltr ? "ltr" : undefined}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} h-11 ${field.ltr ? "font-en text-left" : ""}`}
        />
      )}
      {field.type === "number" && (
        <input
          type="number"
          min={1}
          value={Number(value ?? 0)}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`${inputBase} h-11 text-left`}
          dir="ltr"
        />
      )}
      {field.type === "select" && (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} h-11 appearance-none`}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#120E22]">
              {o.label}
            </option>
          ))}
        </select>
      )}
      {field.type === "textarea" && (
        <textarea
          rows={field.rows ?? 4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} resize-y py-3 leading-7`}
        />
      )}
      {field.type === "lines" && (
        <textarea
          rows={field.rows ?? 4}
          value={asLines(value).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n").filter((l, i, arr) => l.trim() !== "" || i < arr.length - 1))}
          className={`${inputBase} resize-y py-3 leading-7`}
          placeholder={"سطر لكل عنصر"}
        />
      )}
      {field.type === "rows" && (
        <RowsEditor
          sub={field.sub ?? []}
          rows={asRows(value)}
          onChange={(rows) => onChange(rows)}
        />
      )}
    </label>
  );
}

function RowsEditor({
  sub,
  rows,
  onChange,
}: {
  sub: { key: string; label: string; type: "text" | "textarea"; placeholder?: string }[];
  rows: Record<string, string>[];
  onChange: (rows: Record<string, string>[]) => void;
}) {
  const inputBase =
    "w-full rounded-xl border border-alemny-purple/30 bg-[#120E22] px-3.5 text-[13px] text-white placeholder:text-white/25 transition-colors focus:border-alemny-purple focus:outline-none";

  return (
    <div className="space-y-3.5">
      {rows.map((row, i) => (
        <div key={i} className="rounded-2xl border border-alemny-purple/25 bg-black/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-alemny-lilac">#{arNum(i + 1)}</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => {
                  const next = [...rows];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}
                className="rounded-lg px-2 py-1 text-[11px] text-alemny-muted hover:text-white disabled:opacity-30"
                aria-label="تحريك للأعلى"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === rows.length - 1}
                onClick={() => {
                  const next = [...rows];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  onChange(next);
                }}
                className="rounded-lg px-2 py-1 text-[11px] text-alemny-muted hover:text-white disabled:opacity-30"
                aria-label="تحريك للأسفل"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-alemny-rose hover:bg-alemny-rose/15"
                aria-label="حذف هذا العنصر"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {sub.map((s) => (
              <label key={s.key} className={s.type === "textarea" ? "block md:col-span-2" : "block"}>
                <span className="mb-1 block text-[11px] font-semibold text-alemny-muted">{s.label}</span>
                {s.type === "textarea" ? (
                  <textarea
                    rows={2}
                    value={row[s.key] ?? ""}
                    placeholder={s.placeholder}
                    onChange={(e) => {
                      const next = rows.map((r, j) => (j === i ? { ...r, [s.key]: e.target.value } : r));
                      onChange(next);
                    }}
                    className={`${inputBase} resize-y py-2 leading-6`}
                  />
                ) : (
                  <input
                    type="text"
                    value={row[s.key] ?? ""}
                    placeholder={s.placeholder}
                    onChange={(e) => {
                      const next = rows.map((r, j) => (j === i ? { ...r, [s.key]: e.target.value } : r));
                      onChange(next);
                    }}
                    className={`${inputBase} h-10`}
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, Object.fromEntries(sub.map((s) => [s.key, ""]))])}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-alemny-purple/45 text-[12.5px] font-bold text-alemny-lilac transition-colors hover:bg-alemny-purple/10 hover:text-white"
      >
        <Plus className="h-4 w-4" aria-hidden />
        إضافة عنصر
      </button>
    </div>
  );
}
