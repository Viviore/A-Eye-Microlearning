"use client";

import { motion } from "framer-motion";
import { Search, MousePointerClick, BrainCircuit, ShieldCheck, Play, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Observe",
    description: "Scan captions, check context, and look for anomalies in the data stream.",
    colSpan: "md:col-span-2 lg:col-span-3",
  },
  {
    icon: MousePointerClick,
    title: "Locate",
    description: "Click on suspicious glitches to drop investigation markers.",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: BrainCircuit,
    title: "Verdict",
    description: "Analyze the evidence: Is this Real, Generated, or Unconfirmed?",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Calibrate",
    description: "Rate your certainty. Top investigators know when they need more data.",
    colSpan: "md:col-span-2 lg:col-span-3",
  },
];

export default function HowToPlay() {
  return (
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 relative overflow-hidden font-sans selection:bg-emerald-500/30 py-24">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-8 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-3 py-1.5 mb-8 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SYS.MSG: TUTORIAL_LOADED</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-zinc-100 font-heading uppercase mb-6"
            >
              Investigation <br />
              <span className="text-zinc-500">Protocol</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-zinc-400 max-w-[50ch] leading-relaxed"
            >
              Master the workflow of a digital forensics expert before entering the field. Follow these core directives to establish truth.
            </motion.p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`bg-zinc-900/40 border border-zinc-800 p-8 flex flex-col justify-between group relative overflow-hidden ${step.colSpan}`}
            >
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-500 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-100 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors duration-300">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="font-mono text-xs text-zinc-600 font-bold">
                  0{index + 1}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-zinc-100 mb-3 font-heading uppercase tracking-wide group-hover:text-emerald-50 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base max-w-[40ch]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-start"
        >
          <Link href="/quiz/pre" passHref>
            <Button size="lg" className="h-14 px-8 text-base font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150 group">
              <Play className="mr-3 w-5 h-5 fill-zinc-950" />
              Init Assessment
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
