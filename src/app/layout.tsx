import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { RouteGuard } from "@/components/game/RouteGuard";

const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
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
      className={`${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50">
        <Header />
        <RouteGuard>
          <div className="flex-1">{children}</div>
        </RouteGuard>
      </body>
    </html>
  );
}
