import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maketica.co.kr"),
  title: {
    default: "maketica — 국내 최고 단가 CPA 제휴마케팅 플랫폼",
    template: "%s — maketica",
  },
  description: "블로그·SNS·유튜브로 건당 최대 15만원. 매주 금요일 정산, 투명한 승인율 공개. 초보자도 가능한 CPA 제휴마케팅 플랫폼.",
  keywords: ["CPA", "제휴마케팅", "부업", "마케터", "퍼블리셔", "수익화", "블로그수익"],
  authors: [{ name: "maketica" }],
  creator: "maketica",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://maketica.co.kr",
    siteName: "maketica",
    title: "maketica — 국내 최고 단가 CPA 제휴마케팅 플랫폼",
    description: "블로그·SNS·유튜브로 건당 최대 15만원. 매주 금요일 정산. 초보자도 가능한 CPA 마케팅 플랫폼.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "maketica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "maketica — CPA 제휴마케팅 플랫폼",
    description: "건당 최대 15만원. 매주 금요일 정산. 지금 시작하세요.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script src="/inapp-guard.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
