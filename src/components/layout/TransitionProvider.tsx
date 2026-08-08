"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type TransitionContextType = {
  startTransition: (href: string, waitFor?: Promise<any>) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  startTransition: () => {},
});

export const useAppTransition = () => useContext(TransitionContext);

const STATUS_MESSAGES = [
  "Establishing secure connection...",
  "Downloading investigation files...",
  "Decrypting case assets...",
  "Loading forensics toolkit...",
  "Verifying integrity..."
];

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [navigated, setNavigated] = useState(false);
  const [sourcePath, setSourcePath] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0]);
  const [loadProgress, setLoadProgress] = useState<number | null>(null);

  const startTransition = (href: string, waitFor?: Promise<any>) => {
    if (pathname === href) {
      router.push(href);
      return;
    }
    
    setIsTransitioning(true);
    setSourcePath(pathname);
    setMinTimeElapsed(false);
    setNavigated(false);
    setLoadProgress(null);
    
    setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1800); // Enforce a snappier 1.8s minimum display

    const slideDownAnimation = new Promise(resolve => setTimeout(resolve, 600));

    Promise.all([slideDownAnimation, waitFor || Promise.resolve()]).then(() => {
      router.push(href);
    });
  };

  useEffect(() => {
    if (isTransitioning && sourcePath && pathname !== sourcePath) {
      setNavigated(true);
    }
  }, [pathname, isTransitioning, sourcePath]);

  useEffect(() => {
    if (isTransitioning && navigated && minTimeElapsed) {
      setIsTransitioning(false);
    }
  }, [isTransitioning, navigated, minTimeElapsed]);

  useEffect(() => {
    if (!isTransitioning) return;
    
    setStatusText(STATUS_MESSAGES[0]);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < STATUS_MESSAGES.length) {
        setStatusText(STATUS_MESSAGES[currentIndex]);
      } else {
        setStatusText("Awaiting network response...");
      }
    }, 400); // Faster hacker-style cycling (400ms)

    return () => clearInterval(interval);
  }, [isTransitioning]);

  useEffect(() => {
    const handleProgress = (e: any) => {
      setLoadProgress(e.detail);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('preload-progress', handleProgress);
      return () => window.removeEventListener('preload-progress', handleProgress);
    }
  }, []);

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ top: "-100vh" }}
            animate={{ top: "0" }}
            exit={{ top: "100vh" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 w-full h-[100vh] bg-[#FFB800] z-[99999] border-y-[8px] border-[#0F172A] flex flex-col items-center justify-center pointer-events-none gap-4"
            style={{ margin: 0, padding: 0 }}
          >
            <span className="font-heading font-black text-[#0F172A] text-4xl md:text-6xl uppercase tracking-widest animate-pulse flex items-center gap-4">
              Initiating Protocol...
              {loadProgress !== null && (
                <span className="text-3xl md:text-5xl text-[#0F172A]/80">
                  {loadProgress}%
                </span>
              )}
            </span>
            <span className="font-mono font-bold text-[#0F172A]/70 text-sm md:text-lg tracking-wider">
              [ {statusText} ]
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
