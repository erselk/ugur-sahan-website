import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { AdminLayoutWrapper } from "@/components/AdminLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uğur Şahan | Kişisel Web Sitesi",
  description: "Şiirler, anılar, denemeler, inovasyon ve girişimcilik üzerine yazılar ve tadımlar.",
  keywords: ["Uğur Şahan", "şiir", "anı", "deneme", "inovasyon", "girişimcilik", "tadım"],
  authors: [{ name: "Uğur Şahan" }],
  creator: "Uğur Şahan",
  publisher: "Uğur Şahan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ugursahan.com"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://ugursahan.com",
    title: "Uğur Şahan | Kişisel Web Sitesi",
    description: "Şiirler, anılar, denemeler, inovasyon ve girişimcilik üzerine yazılar ve tadımlar.",
    siteName: "Uğur Şahan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uğur Şahan | Kişisel Web Sitesi",
    description: "Şiirler, anılar, denemeler, inovasyon ve girişimcilik üzerine yazılar ve tadımlar.",
    creator: "@OduncAkil",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]', geistSans.variable, geistMono.variable)}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AdminLayoutWrapper>
              {children}
            </AdminLayoutWrapper>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
