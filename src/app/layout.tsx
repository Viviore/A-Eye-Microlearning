import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import "driver.js/dist/driver.css";
import { Header } from "@/components/layout/Header";
import { RouteGuard } from "@/components/game/RouteGuard";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A-Eye | Digital Investigation Simulator",
  description: "Digital investigation training. Inspect simulated social feeds, identify AI artifacts, and verify the truth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <Header />
        <RouteGuard>
          <div className="flex-1">{children}</div>
        </RouteGuard>
      </body>
    </html>
  );
}
