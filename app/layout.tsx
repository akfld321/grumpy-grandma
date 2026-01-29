import type { Metadata } from "next";
import { Gowun_Batang, Black_Han_Sans } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google';
import LayoutWrapper from "@/components/LayoutWrapper";

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun-batang",
});

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-han-sans",
});

export const metadata: Metadata = {
  title: "조선의 욕쟁이 할머니 사주",
  description: "너, 인생 답답해서 왔냐? 대충 살 거면 나가!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
      <body
        className={`${gowunBatang.variable} ${blackHanSans.variable} antialiased font-serif bg-stone-950 text-ink`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
