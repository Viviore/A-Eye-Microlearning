"use client";

import { motion } from "framer-motion";
import { Search, MousePointerClick, BrainCircuit, ShieldCheck, Play, NotebookPen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Observe",
    description: "Scan captions, check context, and look for anomalies in the data stream.",
    colSpan: "md:col-span-2 lg:col-span-3",
    rotation: "rotate-1",
  },
  {
    icon: MousePointerClick,
    title: "Locate",
    description: "Click on suspicious glitches to drop investigation markers.",
    colSpan: "md:col-span-2 lg:col-span-2",
    rotation: "-rotate-2",
  },
  {
    icon: BrainCircuit,
    title: "Verdict",
    description: "Analyze the evidence: Is this Real, Generated, or Unconfirmed?",
    colSpan: "md:col-span-2 lg:col-span-2",
    rotation: "rotate-2",
  },
  {
    icon: ShieldCheck,
    title: "Calibrate",
    description: "Rate your certainty. Top investigators know when they need more data.",
    colSpan: "md:col-span-2 lg:col-span-3",
    rotation: "-rotate-1",
  },
];

export default function HowToPlay() {
  return (
    <main className="min-h-[100dvh] relative overflow-hidden font-sans py-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 opacity-30 pointer-events-none rotate-12">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
          <path d="M10,10 L90,10 L10,30 L90,30" stroke="#00E5FF" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-8 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-[#FFB800] text-[#0F172A] font-heading text-lg font-bold border-[3px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A]"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <NotebookPen className="w-5 h-5 text-[#FFB800]" />
              <span>TUTORIAL LOADED</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-[#0F172A] font-heading mb-6 relative inline-block"
            >
              Investigation <br />
              <span className="text-[#FFB800]">Protocol</span>
              {/* Hand-drawn underline */}
              <svg className="absolute -bottom-4 left-0 w-full h-6 text-[#00E5FF]" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M0,10 Q50,20 100,5 T200,10" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
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
              className={`glass-panel p-8 flex flex-col justify-between group relative overflow-hidden ${step.colSpan} ${step.rotation}`}
            >
              {/* Tape at the top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/10 -rotate-3 backdrop-blur-[2px] z-20" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div 
                  className="p-3 bg-[#FFB800] border-[3px] border-[#0F172A] text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] group-hover:bg-[#FFB800] group-hover:text-white transition-colors duration-300"
                  style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="font-heading text-xl text-[#00E5FF] font-bold border-b-2 border-dashed border-[#00E5FF] px-2 rotate-6">
                  0{index + 1}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-[#0F172A] mb-3 font-heading group-hover:text-[#FFB800] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg max-w-[40ch]">
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
          className="flex justify-start relative mt-12"
        >
          <Link href="/quiz/pre" passHref>
            <Button 
              size="lg" 
              className="btn-primary text-xl px-10 h-16 group"
            >
              <Play className="mr-3 w-6 h-6" />
              Init Assessment
            </Button>
          </Link>

          {/* Squiggly arrow pointing to CTA */}
          <div className="absolute left-64 top-4 hidden md:block rotate-[15deg] text-[#00E5FF]">
             <svg width="80" height="40" viewBox="0 0 100 50">
               <path d="M10,25 Q30,10 50,25 T90,25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
               <path d="M75,10 L90,25 L70,35" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
             </svg>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
