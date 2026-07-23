"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText, Camera, Video, BarChart, Home, Lock, CheckCircle2, HelpCircle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export function Header() {
  const pathname = usePathname();
  const { preQuizScore, completedLevels, level1Verdict, level2Verdict, level3Verdict } = useGameStore();

  const isPreQuizDone = preQuizScore !== null;
  const isC1Done = completedLevels.includes(1) || level1Verdict !== null;
  const isC2Done = completedLevels.includes(2) || level2Verdict !== null;
  const isC3Done = completedLevels.includes(3) || level3Verdict !== null;

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
      unlocked: true,
      done: false,
    },
    {
      path: "/quiz/pre",
      label: "Pre-Test",
      icon: HelpCircle,
      unlocked: true,
      done: isPreQuizDone,
    },
    {
      path: "/level/1",
      label: "Case 001",
      icon: FileText,
      unlocked: isPreQuizDone,
      done: isC1Done,
    },
    {
      path: "/level/2",
      label: "Case 002",
      icon: Camera,
      unlocked: isC1Done,
      done: isC2Done,
    },
    {
      path: "/level/3",
      label: "Case 003",
      icon: Video,
      unlocked: isC2Done,
      done: isC3Done,
    },
    {
      path: "/results",
      label: "Results",
      icon: BarChart,
      unlocked: isC3Done,
      done: isC3Done,
    },
    {
      path: "/quiz/post",
      label: "Post-Test",
      icon: CheckCircle2,
      unlocked: isC3Done,
      done: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400 group-hover:border-emerald-500 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black tracking-widest text-zinc-100 uppercase text-sm group-hover:text-emerald-400 transition-colors">
              A-EYE
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest -mt-1">
              MIL Simulator
            </span>
          </div>
        </Link>

        {/* Step-by-Step Locked Navigation */}
        <nav className="flex items-center gap-1 md:gap-1.5 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const isUnlocked = item.unlocked;

            if (isUnlocked) {
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 font-bold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.done && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" title="Completed" />
                  )}
                </Link>
              );
            }

            return (
              <div
                key={item.path}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono text-zinc-600 border border-zinc-900 cursor-not-allowed opacity-60 whitespace-nowrap"
                title={`Locked: Complete previous step first`}
              >
                <Lock className="w-3 h-3 text-zinc-600" />
                <span className="hidden sm:inline">{item.label}</span>
              </div>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
