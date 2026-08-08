"use client";

import { motion } from "framer-motion";
import { Search, MousePointerClick, BrainCircuit, ShieldCheck, Play, NotebookPen } from "lucide-react";
import Link from "next/link";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppTransition } from "@/components/layout/TransitionProvider";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

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
  const { startTransition } = useAppTransition();

  return (
    <>
      <LandingNavbar />
      <main className="min-h-[100dvh] relative overflow-hidden font-sans py-16 md:py-24 pt-28 md:pt-32">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-8 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <Badge className="bg-[#FFB800] text-[#0F172A] border-[4px] border-[#0F172A] px-4 py-2 font-mono font-bold tracking-widest text-sm shadow-[4px_4px_0px_0px_#0F172A] flex items-center gap-2">
                <NotebookPen className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} />
                <span>TUTORIAL LOADED</span>
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] text-[#0F172A] font-heading mb-6 relative inline-block uppercase"
            >
              Investigation <br />
              <span className="text-[#FFB800] relative inline-block drop-shadow-[4px_4px_0_#0F172A]">
                Protocol
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl text-muted-foreground max-w-[50ch] leading-relaxed mt-4 font-sans font-medium"
            >
              Master the workflow of a digital forensics expert before entering the field. Follow these core directives to establish truth.
            </motion.p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 mb-16 px-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`${step.colSpan} flex`}
            >
              <Card className="bg-white w-full border-[4px] border-[#0F172A] rounded-none p-6 md:p-8 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#0F172A] shadow-[8px_8px_0px_0px_#0F172A] transition-all duration-300">
                <CardContent className="p-0 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-12">
                    <div 
                      className="p-4 bg-white border-[4px] border-[#0F172A] text-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] group-hover:bg-[#FFB800] transition-colors duration-300"
                    >
                      <step.icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <div className="font-heading text-2xl text-[#0F172A] font-black bg-[#FFB800] border-[4px] border-[#0F172A] px-3 shadow-[4px_4px_0px_0px_#0F172A] group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300">
                      0{index + 1}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-3xl lg:text-4xl font-black text-[#0F172A] mb-4 font-heading uppercase tracking-wide group-hover:text-[#FFB800] transition-colors duration-300 drop-shadow-[1px_1px_0_#0F172A]">
                      {step.title}
                    </h3>
                    <p className="text-[#0F172A]/80 leading-relaxed text-lg max-w-[40ch] font-sans font-bold">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-start items-center relative mt-12 gap-8 w-full sm:w-auto"
        >
          <div className="w-full sm:w-auto">
            <BrutalButton 
              onClick={() => {
                const preloadPromise = import("@/utils/preloader").then(m => m.preloadGameAssets());
                startTransition("/level/1", { variant: 'init', waitFor: preloadPromise });
              }}
              size="xl" 
              variant="hero"
              className="w-full sm:w-auto group"
            >
              <Play className="mr-4 w-8 h-8 fill-[#0F172A]" />
              Init Assessment
            </BrutalButton>
          </div>
        </motion.div>
      </div>
    </main>
    </>
  );
}
