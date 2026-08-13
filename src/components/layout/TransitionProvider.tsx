"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PixelTransition } from "./PixelTransition";

type TransitionVariant = 'init' | 'next-case' | 'results' | 'post-assessment';

export type TransitionOptions = {
  waitFor?: Promise<unknown>;
  variant?: TransitionVariant;
};

type TransitionContextType = {
  startTransition: (href: string, options?: TransitionOptions) => void;
  startInPlaceTransition: (action: () => void, options?: TransitionOptions) => void;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextType>({
  startTransition: () => {},
  startInPlaceTransition: () => {},
  isTransitioning: false,
});

export const useAppTransition = () => useContext(TransitionContext);

const STATUS_MESSAGES = [
  "Establishing secure connection...",
  "Downloading investigation files...",
  "Decrypting case assets...",
  "Loading forensics toolkit...",
  "Verifying integrity..."
];

const getVariantConfig = (variant: TransitionVariant) => {
  switch(variant) {
    case 'next-case': return {
      bg: 'bg-[#FFB800]',
      border: 'border-[#0F172A]',
      titleColor: 'text-[#0F172A]',
      textColor: 'text-[#0F172A]/70',
      title: 'ACCESSING NEXT CASE...'
    };
    case 'post-assessment': return {
      bg: 'bg-[#FFB800]',
      border: 'border-[#0F172A]',
      titleColor: 'text-[#0F172A]',
      textColor: 'text-[#0F172A]/70',
      title: 'CONCLUDING INVESTIGATIONS...'
    };
    case 'results': return {
      bg: 'bg-[#FFB800]',
      border: 'border-[#0F172A]',
      titleColor: 'text-[#0F172A]',
      textColor: 'text-[#0F172A]/70',
      title: 'COMPILING FINAL REPORT...'
    };
    case 'init':
    default: return {
      bg: 'bg-[#FFB800]',
      border: 'border-[#0F172A]',
      titleColor: 'text-[#0F172A]',
      textColor: 'text-[#0F172A]/70',
      title: 'INITIATING PROTOCOL...'
    };
  }
};

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [navigated, setNavigated] = useState(false);
  const [sourcePath, setSourcePath] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0]);
  const [loadProgress, setLoadProgress] = useState<number | null>(null);
  const [variant, setVariant] = useState<TransitionVariant>('init');
  const [isGlitching, setIsGlitching] = useState(false);

  const startTransition = (href: string, options?: TransitionOptions) => {
    if (pathname === href) {
      router.push(href);
      return;
    }
    
    setVariant(options?.variant || 'init');
    setIsTransitioning(true);
    setSourcePath(pathname);
    setMinTimeElapsed(false);
    setNavigated(false);
    setLoadProgress(null);
    
    setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1800);

    const slideDownAnimation = new Promise(resolve => setTimeout(resolve, 600));

    Promise.all([slideDownAnimation, options?.waitFor || Promise.resolve()]).then(() => {
      router.push(href);
    });
  };

  const startInPlaceTransition = (action: () => void, options?: TransitionOptions) => {
    setIsGlitching(true);

    setTimeout(() => {
      // Execute the action at the peak of the transition
      action();
    }, 450);

    setTimeout(() => {
      setIsGlitching(false);
    }, 550);
  };

  useEffect(() => {
    if (isTransitioning && sourcePath && pathname !== sourcePath) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNavigated(true);
    }
  }, [pathname, isTransitioning, sourcePath]);

  useEffect(() => {
    if (isTransitioning && navigated && minTimeElapsed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTransitioning(false);
    }
  }, [isTransitioning, navigated, minTimeElapsed]);

  useEffect(() => {
    if (!isTransitioning) return;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatusText(STATUS_MESSAGES[0]);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < STATUS_MESSAGES.length) {
        setStatusText(STATUS_MESSAGES[currentIndex]);
      } else {
        setStatusText("Awaiting network response...");
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  useEffect(() => {
    const handleProgress = (e: Event) => {
      setLoadProgress((e as CustomEvent<number>).detail);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('preload-progress', handleProgress);
      return () => window.removeEventListener('preload-progress', handleProgress);
    }
  }, []);

  const config = getVariantConfig(variant);

  return (
    <TransitionContext.Provider value={{ startTransition, startInPlaceTransition, isTransitioning }}>
      {children}

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ top: "-120vh" }}
            animate={{ top: "0" }}
            exit={{ top: "120vh" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed left-0 w-full h-[100vh] ${config.bg} z-[99999] border-y-[8px] ${config.border} flex flex-col items-center justify-center pointer-events-none gap-4`}
            style={{ margin: 0, padding: 0 }}
          >
            <span className={`font-heading font-black ${config.titleColor} text-4xl md:text-6xl uppercase tracking-widest animate-pulse flex items-center gap-4 text-center px-4`}>
              {config.title}
              {loadProgress !== null && (
                <span className={`text-3xl md:text-5xl opacity-80`}>
                  {loadProgress}%
                </span>
              )}
            </span>
            <span className={`font-mono font-bold ${config.textColor} text-sm md:text-lg tracking-wider`}>
              [ {statusText} ]
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <PixelTransition isActive={isGlitching} />
    </TransitionContext.Provider>
  );
}
