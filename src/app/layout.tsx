import type { Metadata, Viewport } from "next";
import { Unbounded, Onest, Neucha } from "next/font/google";
import "./globals.css";
import { brand, siteUrl } from "@/data/brand";
import { Cursor } from "@/components/effects/Cursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyCta } from "@/components/layout/StickyCta";
import { ScrollWatcher } from "@/components/effects/ScrollWatcher";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const neucha = Neucha({
  variable: "--font-neucha",
  subsets: ["cyrillic", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — мойка окон в Москве`,
    template: `%s — ${brand.name}`,
  },
  description:
    "Мойка окон в Москве и области: квартиры, панорамное остекление, балконы, витрины, офисы, окна после ремонта. Ориентировочный расчёт стоимости за минуту.",
  keywords: [
    "мойка окон Москва",
    "мойка окон в Москве",
    "мойка панорамных окон",
    "мойка витрин",
    "мойка окон после ремонта",
    "мойка балконов",
    "мойка офисных окон",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: brand.name,
    title: `${brand.name} — окна, через которые хочется смотреть`,
    description:
      "Мойка окон, панорамного остекления, витрин и стеклянных поверхностей в Москве.",
    // Статический файл, а не генерируемый маршрут: так ссылка получает
    // префикс подпапки, а хостинг отдаёт правильный content-type.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${brand.name} — мойка окон в Москве` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — мойка окон в Москве`,
    description:
      "Мойка окон, панорамного остекления, витрин и стеклянных поверхностей в Москве.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${onest.variable} ${neucha.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-sun focus:px-4 focus:py-2 focus:font-semibold"
        >
          Перейти к содержимому
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyCta />
        <Cursor />
        <ScrollWatcher />
      </body>
    </html>
  );
}
