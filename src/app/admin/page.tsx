import type { Metadata } from "next";
import { AdminDashboard } from "@/components/alemny/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "لوحة التحكم الديناميكية | علَّمني تِك",
  description: "لوحة تحكم المحتوى: إضافة وتعديل المقالات، الشروحات، البرومبتات، والأدوات مباشرةً في قاعدة بيانات Neon PostgreSQL.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminDashboard />;
}
