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
      unlocked: true,
      done: isC1Done,
    },
    {
      path: "/level/2",
      label: "Case 002",
      icon: Camera,
      unlocked: true,
      done: isC2Done,
    },
    {
      path: "/level/3",
      label: "Case 003",
      icon: Video,
      unlocked: true,
      done: isC3Done,
    },
    {
      path: "/results",
      label: "Results",
      icon: BarChart,
      unlocked: true,
      done: isC3Done,
    },
    {
      path: "/quiz/post",
      label: "Post-Test",
      icon: CheckCircle2,
      unlocked: true,
      done: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-[3px] border-dashed border-[#0F172A] bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div 
            className="p-2 bg-[#FFB800] border-[3px] border-[#0F172A] text-white shadow-[4px_4px_0px_0px_#0F172A] transition-transform group-hover:-rotate-2 group-hover:scale-105"
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold tracking-wide text-[#0F172A] uppercase text-3xl group-hover:text-[#FFB800] transition-colors leading-none">
              A-EYE
            </span>
            <span className="text-sm font-sans text-muted-foreground uppercase tracking-widest mt-0.5">
              MIL Simulator
            </span>
          </div>
        </Link>

        {/* Step-by-Step Locked Navigation */}
        <nav className="flex items-center gap-4 overflow-x-auto py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const isUnlocked = item.unlocked;

            if (isUnlocked) {
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-sans font-bold transition-all whitespace-nowrap border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] group ${
                    isActive
                      ? "bg-[#FFB800] text-[#0F172A]"
                      : "bg-white text-[#0F172A] hover:bg-[#FFB800] hover:text-white"
                  }`}
                  style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#0F172A]" : "text-[#0F172A] group-hover:text-white"}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.done && (
                    <span className={`font-bold ml-1 ${isActive ? "text-[#0F172A]" : "text-[#0F172A] group-hover:text-white"}`}>✓</span>
                  )}
                </Link>
              );
            }

            return (
              <div
                key={item.path}
                className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-bold text-[#0F172A]/50 bg-[#1D2A3C] border-[3px] border-dashed border-[#0F172A]/50 cursor-not-allowed whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)]"
                title={`Locked: Complete previous step first`}
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                <Lock className="w-4 h-4 text-[#0F172A]/50" />
                <span className="hidden sm:inline">{item.label}</span>
              </div>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
