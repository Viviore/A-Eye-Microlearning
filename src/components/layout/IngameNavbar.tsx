"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, FileText, Camera, Video, BarChart, Home, Lock, CheckCircle2, HelpCircle, Menu, X, Power, AlertOctagon } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { useGameStore } from "@/store/gameStore";

export function IngameNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfirmTerminate, setIsConfirmTerminate] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { preQuizScore, postQuizScore, completedLevels, level1Verdict, level2Verdict, level3Verdict, resetGame } = useGameStore();

  if (pathname === "/") {
    return null;
  }

  const isPreQuizDone = preQuizScore !== null;
  const isC1Done = completedLevels.includes(1) || level1Verdict !== null;
  const isC2Done = completedLevels.includes(2) || level2Verdict !== null;
  const isC3Done = completedLevels.includes(3) || level3Verdict !== null;

  const navItems = [
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
      done: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-[4px] border-[#0F172A] bg-white">
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 py-3 xl:h-20 xl:py-0 flex items-center justify-between relative">
        
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div 
            className="border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] transition-transform group-hover:-rotate-2 group-hover:scale-105 overflow-hidden flex items-center justify-center bg-[#FFB800]"
          >
            <img src="/logo.png" alt="A-Eye Logo" className="w-10 h-10 object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold tracking-wide text-[#0F172A] uppercase text-xl sm:text-2xl md:text-3xl group-hover:text-[#FFB800] transition-colors leading-none whitespace-nowrap">
              A-EYE <span className="text-muted-foreground hidden 2xl:inline">| MIL SIMULATOR</span>
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className="xl:hidden ml-auto p-2 text-[#0F172A] border-[4px] border-[#0F172A] bg-white shadow-[3px_3px_0px_0px_#0F172A] hover:bg-[#FFB800] transition-colors cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation & Actions Wrapper */}
        <div className={`${
          isMobileMenuOpen 
            ? "flex absolute top-full left-0 right-0 bg-white border-b-[4px] border-[#0F172A] p-4 shadow-xl z-50 flex-col items-stretch gap-6" 
            : "hidden"
        } xl:flex xl:flex-1 xl:static xl:flex-row xl:bg-transparent xl:border-none xl:p-0 xl:shadow-none xl:items-center xl:justify-end xl:gap-8`}>
          
          {/* Stepper (Side-by-side on Desktop) */}
          <nav className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 xl:gap-0">
            {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const isUnlocked = item.unlocked;

            if (isUnlocked) {
              return (
                <div key={item.path} className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 xl:gap-0">
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 transition-all whitespace-nowrap border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] group ${
                      isActive
                        ? "bg-[#FFB800] text-[#0F172A] px-4 py-3 xl:py-2"
                        : "bg-white text-[#0F172A] hover:bg-[#FFB800] hover:text-white px-4 py-3 xl:p-2 xl:w-11 xl:h-11"
                    }`}
                    title={!isActive ? item.label : undefined}
                  >
                    {item.done && !isActive ? (
                      <CheckCircle2 className="w-5 h-5 xl:w-5 xl:h-5 text-[#0F172A] group-hover:text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 xl:w-5 xl:h-5 ${isActive ? "text-[#0F172A]" : "text-[#0F172A] group-hover:text-white"}`} />
                    )}
                    
                    <span className={`text-base xl:text-sm font-sans font-bold ${isActive ? "block" : "block xl:hidden"}`}>
                      {item.label}
                    </span>
                  </Link>

                  {/* Connector Line (Desktop Only) */}
                  {index < navItems.length - 1 && (
                    <div className="hidden xl:block w-3 2xl:w-6 h-[4px] bg-[#0F172A] relative z-0" />
                  )}
                </div>
              );
            }

            return (
              <div key={item.path} className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 xl:gap-0">
                <div
                  className="flex items-center justify-center gap-2 px-4 py-3 xl:p-2 xl:w-11 xl:h-11 bg-gray-100 border-[4px] border-dashed border-[#0F172A]/50 cursor-not-allowed whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)]"
                  title={`Locked: Complete previous step first`}
                >
                  <Lock className="w-5 h-5 text-[#0F172A]/50" />
                  <span className="text-base xl:text-sm font-sans font-bold text-[#0F172A]/50 block xl:hidden">
                    {item.label}
                  </span>
                </div>
                
                {index < navItems.length - 1 && (
                  <div className="hidden xl:block w-3 2xl:w-6 h-[4px] border-b-[4px] border-dashed border-[#0F172A]/30 relative z-0" />
                )}
              </div>
            );
          })}
          </nav>
          
          {/* Separate Return to Home Button */}
          <BrutalButton
            variant="secondary"
            size="nav"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsConfirmTerminate(true);
            }}
            className="group hover:bg-[#FF3366] hover:text-white"
          >
            <Home className="w-4 h-4 mr-2 group-hover:hidden" />
            <Power className="w-4 h-4 mr-2 hidden group-hover:block text-white" />
            <span className="grid items-center text-center">
              <span className="col-start-1 row-start-1 group-hover:opacity-0 transition-opacity whitespace-nowrap">Home</span>
              <span className="col-start-1 row-start-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white">Abort</span>
            </span>
          </BrutalButton>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmTerminate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/80 backdrop-blur-md transition-all">
          <div className="relative bg-[#FAFAFA] border-[4px] border-[#0F172A] p-6 md:p-10 shadow-[12px_12px_0px_0px_#0F172A] max-w-lg w-full animate-in fade-in zoom-in-95 duration-200">
            {/* Warning badge */}
            <div className="absolute -top-6 -left-4 md:-left-6 bg-[#FF3366] border-[4px] border-[#0F172A] p-3 shadow-[4px_4px_0px_0px_#0F172A] rotate-[-5deg] z-10">
              <AlertOctagon className="w-8 h-8 text-white" strokeWidth={3} />
            </div>

            <div className="mt-4 mb-6">
              <h3 className="font-heading font-black text-3xl md:text-4xl uppercase text-[#0F172A] mb-3 tracking-tight">Terminate Session?</h3>
              <div className="w-16 h-2 bg-[#FF3366] border-2 border-[#0F172A]"></div>
            </div>
            
            <p className="font-sans font-bold text-[#0F172A]/80 text-base md:text-lg leading-relaxed mb-8 bg-white p-4 md:p-5 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] relative">
              Are you sure you want to abort the current mission? <span className="text-[#FF3366] font-black uppercase underline decoration-2 underline-offset-4">ALL progress</span>, including your pre-quiz and previous missions, will be <span className="text-[#0F172A] font-black uppercase">permanently deleted</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <BrutalButton
                variant="secondary"
                onClick={() => setIsConfirmTerminate(false)}
                className="flex-1 text-base md:text-lg"
              >
                Cancel
              </BrutalButton>
              <BrutalButton
                variant="primary"
                onClick={() => {
                  resetGame();
                  setIsConfirmTerminate(false);
                  router.push("/");
                }}
                className="flex-1 bg-[#FF3366] hover:bg-[#FF3366]/90 text-white text-base md:text-lg"
              >
                Confirm
              </BrutalButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
