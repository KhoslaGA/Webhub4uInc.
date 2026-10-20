import { BUSINESS } from "@/lib/business";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css";
import SmoothScroll from "@/components/sections/new/SmoothScroll";
import Analytics from "@/components/analytics/Analytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--fontInter",
});

export const metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: "Webhub4U — Web Design & AI Solutions Agency in the GTA",
  description:
    "Webhub4U is a Brampton-based digital agency building high-performance websites, local SEO, and AI-powered tools — chatbots, AI receptionists, and automation — for businesses across the Greater Toronto Area.",
  openGraph: {
    title: "Webhub4U — Web Design & AI Solutions Agency in the GTA",
    description:
      "High-performance websites, local SEO, and AI-powered tools for GTA businesses.",
    url: BUSINESS.url,
    siteName: "Webhub4U",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800&family=Geist:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className}`}>
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
