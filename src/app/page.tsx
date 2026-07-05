"use client";

import { motion } from "framer-motion";
import { ScanSearch, Terminal, Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24 min-h-[100dvh] flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hero */}
          <div className="lg:col-span-7 flex flex-col items-start text-left pt-12 md:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-3 py-1.5 mb-8 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SYS.MSG: INIT_INVESTIGATION_PROTOCOL</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-zinc-100 font-heading uppercase mb-8"
            >
              <span className="block text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">A-EYE</span>
              <span className="block text-zinc-300">PROTOCOL</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-zinc-400 max-w-[45ch] leading-relaxed mb-12"
            >
              Inspect simulated social feeds, identify generated artifacts, and verify the truth in this digital forensics training simulation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/how-to-play" passHref>
                <Button size="lg" className="h-14 px-8 text-base font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150 group">
                  <Play className="mr-3 w-5 h-5 fill-zinc-950" />
                  Initialize
                  <ArrowRight className="ml-3 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Visual / Graphic Element */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[4/5] bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm p-8 flex flex-col justify-between relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex justify-between items-start z-10">
                <ScanSearch className="w-12 h-12 text-emerald-500" />
                <div className="text-right font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  <div>Status: Standby</div>
                  <div>Auth: Pending</div>
                </div>
              </div>

              <div className="z-10">
                <div className="w-full h-px bg-zinc-800 mb-6" />
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest leading-loose">
                  [01] Load assets<br/>
                  [02] Scan for anomalies<br/>
                  [03] Establish verdict
                </div>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-emerald-500/50" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-emerald-500/50" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-emerald-500/50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-emerald-500/50" />
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
