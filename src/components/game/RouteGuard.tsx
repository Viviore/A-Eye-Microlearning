"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Lock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { preQuizScore, completedLevels, level1Verdict, level2Verdict, level3Verdict } = useGameStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string>("");

  const isPreQuizDone = preQuizScore !== null;
  const isC1Done = completedLevels.includes(1) || level1Verdict !== null;
  const isC2Done = completedLevels.includes(2) || level2Verdict !== null;
  const isC3Done = completedLevels.includes(3) || level3Verdict !== null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  if (isRedirecting) {
    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 p-8 max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-sm shadow-2xl space-y-4"
        >
          <div className="flex justify-center">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-full text-red-400">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold font-heading uppercase text-zinc-100 tracking-wider">
            Access Restricted
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You must complete <strong className="text-emerald-400">{redirectTarget}</strong> before unlocking this step.
          </p>
          
          <div className="pt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Redirecting to required step...
          </div>
        </motion.div>
      </main>
    );
  }

  return <>{children}</>;
}
