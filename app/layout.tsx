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
  description: "니 인생이 왜 꼬였는지 궁금하냐? 내가 아주 뼈 때리게 풀어주마!",
  openGraph: {
    title: "조선의 욕쟁이 할머니 사주",
    description: "니 인생이 왜 꼬였는지 궁금하냐? 내가 아주 뼈 때리게 풀어주마!",
    images: [{ url: "/og-image-v3.png", width: 1200, height: 630, alt: "욕쟁이 할머니 사주" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "조선의 욕쟁이 할머니 사주",
    description: "니 인생이 왜 꼬였는지 궁금하냐? 내가 아주 뼈 때리게 풀어주마!",
    images: ["/og-image-v3.png"],
  },
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
