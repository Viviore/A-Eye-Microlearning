"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, FileText, Camera, Video, BarChart, Home, Lock, CheckCircle2, HelpCircle, Menu, X, Power, AlertOctagon } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export function IngameNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfirmTerminate, setIsConfirmTerminate] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsConfirmTerminate(true);
            }}
            className="group flex items-center justify-center gap-2 transition-all whitespace-nowrap border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bg-white text-[#0F172A] hover:bg-[#FF3366] hover:border-[#0F172A] px-4 py-3 xl:py-2 xl:shrink-0 font-sans font-bold"
          >
            <Home className="w-5 h-5 xl:w-5 xl:h-5 text-[#0F172A] group-hover:hidden" />
            <Power className="w-5 h-5 xl:w-5 xl:h-5 text-white hidden group-hover:block" />
            <span className="grid text-base xl:text-sm xl:hidden 2xl:grid items-center text-center">
              <span className="col-start-1 row-start-1 group-hover:opacity-0 transition-opacity">Return to Home</span>
              <span className="col-start-1 row-start-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-white">Terminate</span>
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmTerminate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-[4px] border-[#0F172A] p-6 md:p-8 shadow-[12px_12px_0px_0px_#0F172A] max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4 text-[#FF3366]">
              <AlertOctagon className="w-10 h-10" strokeWidth={2.5} />
              <h3 className="font-heading font-black text-2xl uppercase text-[#0F172A]">Terminate Session?</h3>
            </div>
            <p className="font-sans font-bold text-[#0F172A]/70 mb-8 border-l-[4px] border-[#FF3366] pl-4">
              Are you sure you want to abort the current mission? Any unsaved progress will be kept in your current state, but you will return to headquarters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsConfirmTerminate(false)}
                className="flex-1 px-4 py-3 bg-gray-100 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-heading font-black tracking-wider uppercase text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsConfirmTerminate(false);
                  router.push("/");
                }}
                className="flex-1 px-4 py-3 bg-[#FF3366] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-heading font-black tracking-wider uppercase text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
