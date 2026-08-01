"use client";

import { motion } from "framer-motion";
import { Search, Play, NotebookPen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="h-full relative overflow-hidden font-sans flex flex-col">
      
      {/* Decorative Scribbles in Background */}
      <div className="absolute top-10 left-10 opacity-20 pointer-events-none rotate-12">
        <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
          <path d="M10,50 Q40,10 90,50 T10,90" stroke="#0F172A" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 pointer-events-none -rotate-12">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#FFB800" strokeWidth="3" strokeDasharray="8,4" />
          <path d="M30,30 L70,70 M70,30 L30,70" stroke="#FFB800" strokeWidth="3" />
        </svg>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 py-12 md:py-24 flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hero */}
          <div className="lg:col-span-7 flex flex-col items-start text-left pt-12 md:pt-0">
            
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-[#FFB800] text-[#0F172A] font-heading text-lg font-bold border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] rounded-sm"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <NotebookPen className="w-5 h-5 text-[#FFB800]" />
              <span>CASE FILE: OPEN</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter leading-[0.9] text-[#0F172A] font-heading mb-8 relative"
            >
              <span className="block text-[#FFB800]">A-EYE</span>
              <span className="block">INVESTIGATION</span>
              
              {/* Hand-drawn underline */}
              <svg className="absolute -bottom-4 left-0 w-full h-6 text-[#FFB800]" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M4,10 Q50,20 100,5 T196,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#0F172A] max-w-[40ch] leading-relaxed mb-12 font-sans font-semibold"
            >
              Inspect simulated social feeds, identify generated artifacts, and verify the truth in this digital forensics training simulation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <Link href="/how-to-play" passHref>
                <Button 
                  size="lg" 
                  className="h-16 px-10 text-xl font-heading tracking-wide bg-[#ffffff] hover:bg-[#FFB800] hover:text-white text-[#0F172A] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:shadow-[2px_2px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 group"
                  style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                >
                  <Play className="mr-3 w-6 h-6" />
                  Start Training
                </Button>
              </Link>
              
            </motion.div>
          </div>

          {/* Right Column: Visual / Graphic Element */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[4/5] bg-white border-[3px] border-[#0F172A] p-8 flex flex-col justify-between relative group shadow-[8px_8px_0px_0px_#0F172A]"
              style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
            >
              
              {/* Tape at the top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] z-20">
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-50" />
              </div>
              
              <div className="flex justify-between items-start z-10 relative">
                <Search className="w-16 h-16 text-[#0F172A] stroke-[1.5]" />
                <div className="text-right font-heading text-xl text-[#FFB800] font-bold border-2 border-[#FFB800] px-3 py-1 rotate-6 rounded-sm bg-white">
                  TOP SECRET
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-0 pt-8 pb-32">
                <img 
                  src="/character_mascot/character_pose.png" 
                  alt="A-Eye Mascot" 
                  className="w-[85%] h-[85%] object-contain drop-shadow-[4px_4px_0px_#0F172A]" 
                />
              </div>

              <div 
                className="z-10 bg-[#FFB800] px-6 py-5 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rotate-1 relative mt-auto flex-none"
                style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
              >
                {/* Thumbtack */}
                <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] z-20">
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60" />
                </div>
                
                <h3 className="font-heading text-2xl font-bold mb-2 text-[#0F172A]">Checklist:</h3>
                <ul className="font-sans text-lg space-y-2 text-[#0F172A]">
                  <li className="flex items-center gap-2"><span className="font-bold">✓</span> Verify the source</li>
                  <li className="flex items-center gap-2"><span className="font-bold">✓</span> Inspect metadata</li>
                  <li className="flex items-center gap-2"><span className="font-bold">✓</span> Look for artifacts</li>
                </ul>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
