"use client";

import { motion } from "framer-motion";
import { Search, MousePointerClick, BrainCircuit, ShieldCheck, Play, NotebookPen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <main className="min-h-[100dvh] relative overflow-hidden font-sans py-24">
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
              className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-[#0F172A] font-heading mb-6 relative inline-block"
            >
              Investigation <br />
              <span className="text-[#FFB800] relative inline-block">
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
              className={`${step.colSpan}`}
            >
              <Card className="bg-white p-8 flex flex-col justify-between h-full group hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#0F172A] shadow-[8px_8px_0px_0px_#0F172A] transition-all">
                <CardContent className="p-0">
                  <div className="flex justify-between items-start mb-8">
                    <div 
                      className="p-3 bg-[#FFB800] border-[4px] border-[#0F172A] text-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] group-hover:bg-[#FFB800] transition-colors duration-300"
                    >
                      <step.icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <div className="font-heading text-2xl text-[#0F172A] font-black bg-[#FFB800] border-[4px] border-[#0F172A] px-3 shadow-[4px_4px_0px_0px_#0F172A]">
                      0{index + 1}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-[#0F172A] mb-3 font-heading uppercase tracking-wide">
                      {step.title}
                    </h3>
                    <p className="text-[#0F172A] leading-relaxed text-lg max-w-[40ch] font-sans font-bold">
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
          className="flex justify-start items-center relative mt-12 gap-8"
        >
          <Link href="/quiz/pre" passHref>
            <Button 
              size="lg" 
              className="bg-white hover:bg-[#FFB800] text-[#0F172A] border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] hover:shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] h-20 px-16 text-2xl font-heading font-black tracking-wider uppercase transition-all group"
            >
              <Play className="mr-4 w-8 h-8" />
              Init Assessment
            </Button>
          </Link>


        </motion.div>
      </div>
    </main>
  );
}
