import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import Providers from "@/components/providers/Providers";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Cursor from "@/components/ui/Cursor";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "You're invited",
  description: "A private event. You need a personal link.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <ScrollProgress />
          <Cursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
