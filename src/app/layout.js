import { BUSINESS } from "@/lib/business";
import localFont from "next/font/local";
import "./globals.css";
import "./theme.css";
import SmoothScroll from "@/components/sections/new/SmoothScroll";
import Analytics from "@/components/analytics/Analytics";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  weight: "300 900",
  style: "normal",
  display: "swap",
  variable: "--fontInter",
});

// Design-system fonts, self-hosted (no render-blocking third-party CSS).
// Provenance and licences: src/app/fonts/README.md.
const fraunces = localFont({
  src: [
    { path: "./fonts/Fraunces-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Fraunces-Variable-Italic.woff2", weight: "100 900", style: "italic" },
  ],
  display: "swap",
  variable: "--wh-font-fraunces",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--wh-font-geist",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata = {
  ...(process.env.VERCEL_ENV === "preview" ? { robots: { index: false, follow: false } } : {}),
  metadataBase: new URL(BUSINESS.url),
  title: "Webhub4U — Web Development, SEO & Custom Software",
  description:
    "Webhub4U is a Brampton-based agency providing web development, SEO and custom software for Toronto and Greater Toronto Area businesses.",
  openGraph: {
    title: "Webhub4U — Web Development, SEO & Custom Software",
    description:
      "Web development, SEO and custom software for Toronto and GTA businesses.",
    url: BUSINESS.url,
    siteName: "Webhub4U",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${geist.variable}`}
    >
      <body className={`${inter.className}`}>
        <SmoothScroll>{children}</SmoothScroll>
        {process.env.VERCEL_ENV !== "preview" && <Analytics />}
      </body>
    </html>
  );
}
