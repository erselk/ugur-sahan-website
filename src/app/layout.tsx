import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Sans, Marcellus } from 'next/font/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
});

export const metadata: Metadata = {
  title: "Uğur Şahan",
  description: "Yazılım ve Yazarlık",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${marcellus.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  );
}
