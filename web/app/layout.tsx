import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "cbug — Claude Bug Hunting Skills",
  description:
    "51 specialized Claude skills for bug hunting, web security, and external red-team workflows. Auto-load by context. 7-Question Gate before every submission.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${GeistMono.variable} ${instrumentSerif.variable} antialiased`}>
        <SmoothScroll />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
