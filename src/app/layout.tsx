import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import "driver.js/dist/driver.css";
import { IngameNavbar } from "@/components/layout/IngameNavbar";
import { RouteGuard } from "@/components/game/RouteGuard";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A-Eye | Digital Investigation Simulator",
  description: "Digital investigation training. Inspect simulated social feeds, identify AI artifacts, and verify the truth.",
};

import { TransitionProvider } from "@/components/layout/TransitionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <TransitionProvider>
          <IngameNavbar />
          <RouteGuard>
            <div className="flex-1">{children}</div>
          </RouteGuard>
        </TransitionProvider>
      </body>
    </html>
  );
}
