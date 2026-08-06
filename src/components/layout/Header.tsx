"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText, Camera, Video, BarChart, Home, Lock, CheckCircle2, HelpCircle, Menu, X } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { preQuizScore, postQuizScore, completedLevels, level1Verdict, level2Verdict, level3Verdict } = useGameStore();

  if (pathname === "/") {
    return null;
  }

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
      done: postQuizScore !== null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-[4px] border-dashed border-[#0F172A] bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 xl:h-20 xl:py-0 flex items-center justify-between relative">
        
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div 
            className="p-2 bg-[#FFB800] border-[4px] border-[#0F172A] text-white shadow-[4px_4px_0px_0px_#0F172A] transition-transform group-hover:-rotate-2 group-hover:scale-105"
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

        {/* Mobile Hamburger Button */}
        <button 
          className="xl:hidden p-2 text-[#0F172A] border-[4px] border-[#0F172A] bg-white shadow-[3px_3px_0px_0px_#0F172A] hover:bg-[#FFB800] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation */}
        <nav className={`${
          isMobileMenuOpen 
            ? "flex absolute top-full left-0 right-0 bg-white border-b-[4px] border-dashed border-[#0F172A] p-4 shadow-xl z-50 flex-col items-stretch" 
            : "hidden"
        } xl:flex xl:static xl:flex-row xl:bg-transparent xl:border-none xl:p-0 xl:shadow-none xl:items-center gap-3 xl:gap-4`}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const isUnlocked = item.unlocked;

            if (isUnlocked) {
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-center xl:justify-start gap-2 px-4 py-3 xl:py-2 text-sm font-sans font-bold transition-all whitespace-nowrap border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] group ${
                    isActive
                      ? "bg-[#FFB800] text-[#0F172A]"
                      : "bg-white text-[#0F172A] hover:bg-[#FFB800] hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 xl:w-4 xl:h-4 ${isActive ? "text-[#0F172A]" : "text-[#0F172A] group-hover:text-white"}`} />
                  <span className="text-base xl:text-sm">{item.label}</span>
                  {item.done && (
                    <span className={`font-bold ml-1 ${isActive ? "text-[#0F172A]" : "text-[#0F172A] group-hover:text-white"}`}>✓</span>
                  )}
                </Link>
              );
            }

            return (
              <div
                key={item.path}
                className="flex items-center justify-center xl:justify-start gap-2 px-4 py-3 xl:py-2 text-sm font-sans font-bold text-[#0F172A]/50 bg-gray-100 border-[4px] border-dashed border-[#0F172A]/50 cursor-not-allowed whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)]"
                title={`Locked: Complete previous step first`}
              >
                <Lock className="w-5 h-5 xl:w-4 xl:h-4 text-[#0F172A]/50" />
                <span className="text-base xl:text-sm">{item.label}</span>
              </div>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
