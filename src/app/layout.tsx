import type { Metadata, Viewport } from "next";
import { Readex_Pro, Cairo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteChrome } from "@/components/alemny/site-chrome";

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alemny-tech.vercel.app"),
  title: "علَّمني تِك | كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي",
  description:
    "بوابتك العملية لإتقان أحدث تقنيات الذكاء الاصطناعي، البرمجة، وهندسة الأوامر بخطوات تطبيقية مبسطة.",
  keywords: [
    "علَّمني تِك",
    "Alemny Tech",
    "الذكاء الاصطناعي بالعربي",
    "التكنولوجيا بالعربية",
    "مقالات تقنية",
    "شروحات تقنية",
    "هندسة الأوامر",
    "برومبتات جاهزة",
    "الدليل التقني",
    "تعلم البرمجة",
  ],
  authors: [{ name: "Alemny Tech — علَّمني تِك" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "علَّمني تِك — كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي",
    description:
      "بوابتك العملية لإتقان أحدث تقنيات الذكاء الاصطناعي، البرمجة، وهندسة الأوامر بخطوات تطبيقية مبسطة.",
    url: "https://alemny-tech.vercel.app",
    siteName: "علَّمني تِك — Alemny Tech",
    locale: "ar_AR",
    type: "website",
    images: [{ url: "/og-cover.jpg", width: 1800, height: 2400, alt: "شعار علَّمني تِك الرسمي" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "علَّمني تِك — Alemny Tech",
    description: "كل ما يهمك في عالم التكنولوجيا والذكاء الاصطناعي — @alemnytech",
    images: ["/og-cover.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07060B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${readexPro.variable} ${cairo.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-[#07060B] text-white overflow-x-hidden`}
      >
        <SiteChrome>{children}</SiteChrome>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(5, 30, 22, 0.92)",
              border: "1px solid rgba(52, 211, 153, 0.5)",
              color: "#D1FAE5",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              fontFamily: "var(--font-cairo), sans-serif",
              boxShadow: "0 12px 40px -8px rgba(52, 211, 153, 0.35)",
            },
          }}
        />
      </body>
    </html>
  );
}
