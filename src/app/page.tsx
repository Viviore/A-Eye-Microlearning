"use client";

import { motion } from "framer-motion";
import { Search, Play, NotebookPen, FileText, Camera, Video, ShieldAlert, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen relative overflow-x-hidden font-sans flex flex-col bg-white pt-20">
      
      {/* Brutalist Background Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-[#FFB800] border-[4px] border-[#0F172A] z-0 hidden md:block translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-60 left-10 w-16 h-16 bg-[#0F172A] z-0 hidden lg:block rotate-45"></div>
      <div className="absolute top-[30vh] right-[20vw] w-8 h-8 border-[4px] border-[#0F172A] z-0 hidden md:block rounded-full bg-white"></div>

      {/* HERO SECTION */}
      <section id="hero" className="max-w-[1400px] w-full mx-auto px-6 py-12 md:py-24 min-h-[90vh] flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hero */}
          <div className="lg:col-span-7 flex flex-col items-start text-left pt-12 md:pt-0">
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-[#FFB800] text-[#0F172A] font-heading text-lg font-bold border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-none uppercase"
            >
              <NotebookPen className="w-5 h-5 text-[#0F172A]" />
              <span>CASE FILE: OPEN</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter leading-[0.9] text-[#0F172A] font-heading mb-8 relative"
            >
              <span className="block text-[#FFB800] drop-shadow-[4px_4px_0px_#0F172A]">A-EYE</span>
              <span className="block text-white drop-shadow-[4px_4px_0px_#0F172A]">INVESTIGATION</span>
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
                  className="bg-white hover:bg-[#FFB800] text-[#0F172A] border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] h-16 px-10 text-xl font-heading font-black tracking-wider uppercase transition-all group"
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[4/5] bg-white border-[4px] border-[#0F172A] flex flex-col justify-between relative group shadow-[12px_12px_0px_0px_#0F172A]"
            >
              <div className="border-b-[4px] border-[#0F172A] bg-[#FFB800] p-3 flex gap-2 w-full">
                <div className="w-4 h-4 rounded-full border-[2px] border-[#0F172A] bg-white"></div>
                <div className="w-4 h-4 rounded-full border-[2px] border-[#0F172A] bg-white"></div>
                <div className="w-4 h-4 rounded-full border-[2px] border-[#0F172A] bg-white"></div>
              </div>
              
              <div className="flex justify-between items-start z-10 relative px-8 pt-8">
                <Search className="w-16 h-16 text-[#0F172A] stroke-[1.5]" />
                <motion.div 
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 6 }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.8 }}
                  className="text-right font-heading text-xl text-[#FFB800] font-bold border-2 border-[#FFB800] px-3 py-1 rounded-sm bg-white"
                >
                  TOP SECRET
                </motion.div>
              </div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center z-0 pt-8 pb-32"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/character_mascot/character_pose.png" 
                  alt="A-Eye Mascot" 
                  className="w-[85%] h-[85%] object-contain filter drop-shadow-[8px_8px_0px_#0F172A]" 
                />
              </motion.div>

              <div 
                className="z-10 bg-[#FFB800] px-6 py-5 border-t-[4px] border-[#0F172A] relative mt-auto flex-none"
              >
                
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
      </section>

      {/* SECTION 1: THE A-EYE PROTOCOL (FEATURES) */}
      <section id="protocol" className="w-full bg-[#0F172A] text-white py-24 relative overflow-hidden border-y-[4px] border-[#FFB800]">
        <div className="absolute top-0 left-0 w-full h-4 bg-[url('/noise.png')] opacity-10"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4 uppercase text-[#FFB800]">
              The A-Eye Protocol
            </h2>
            <p className="text-xl font-sans opacity-90 max-w-2xl mx-auto">
              Master the three core pillars of digital forensics. Prove your skills across different media types in our simulated environment.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              className="bg-white text-[#0F172A] border-[4px] border-[#FFB800] shadow-[8px_8px_0px_0px_#FFB800] flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FFB800] transition-all"
            >
              <div className="border-b-[4px] border-[#FFB800] bg-[#FFB800] p-2 flex gap-1.5">
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
              </div>
              <div className="p-8 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="w-16 h-16 bg-[#FFB800] flex items-center justify-center mb-6 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
                  <FileText className="w-8 h-8 text-[#0F172A]" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 001: Text Forensics</h3>
                <p className="font-sans text-lg font-bold leading-relaxed opacity-90">
                  Analyze suspicious social feeds, flag deceptive claims, and cross-reference them against verified sources. Learn to spot the tactics behind disinformation.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              className="bg-white text-[#0F172A] border-[4px] border-[#FFB800] shadow-[8px_8px_0px_0px_#FFB800] flex flex-col mt-4 md:mt-0 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FFB800] transition-all"
            >
              <div className="border-b-[4px] border-[#FFB800] bg-[#FFB800] p-2 flex gap-1.5">
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
              </div>
              <div className="p-8 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="w-16 h-16 bg-[#FFB800] flex items-center justify-center mb-6 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
                  <Camera className="w-8 h-8 text-[#0F172A]" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 002: Image Analysis</h3>
                <p className="font-sans text-lg font-bold leading-relaxed opacity-90">
                  Use the digital magnifier to scan viral photos for AI-generated artifacts. Hands missing fingers, melting backgrounds, and impossible physics.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              className="bg-white text-[#0F172A] border-[4px] border-[#FFB800] shadow-[8px_8px_0px_0px_#FFB800] flex flex-col mt-8 md:mt-0 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FFB800] transition-all"
            >
              <div className="border-b-[4px] border-[#FFB800] bg-[#FFB800] p-2 flex gap-1.5">
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
              </div>
              <div className="p-8 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="w-16 h-16 bg-[#FFB800] flex items-center justify-center mb-6 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
                  <Video className="w-8 h-8 text-[#0F172A]" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 003: Video Deepfakes</h3>
                <p className="font-sans text-lg font-bold leading-relaxed opacity-90">
                  Scrub through video feeds frame by frame to detect temporal inconsistencies, audio-sync failures, and digital masks.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: WHY TRAIN WITH US? (MISSION) */}
      <section id="mission" className="w-full py-24 md:py-32 relative overflow-hidden bg-white">
        {/* Brutalist Background Elements */}
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#FFB800] border-[4px] border-[#0F172A] z-0 hidden md:block"></div>
        <div className="absolute top-20 right-20 w-48 h-12 bg-black z-0 hidden lg:block -rotate-12"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex justify-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="max-w-4xl w-full bg-[#FFB800] p-10 md:p-16 border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative flex flex-col hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#0F172A] transition-all"
          >
            <div className="absolute top-0 left-0 w-full border-b-[4px] border-[#0F172A] bg-white p-2 flex gap-2">
              <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#FFB800]"></div>
              <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
              <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
            </div>
            
            <div className="flex items-center justify-center mb-8 gap-4 border-b-[4px] border-[#0F172A] pb-8 pt-6">
              <ShieldAlert className="w-12 h-12 text-[#0F172A]" />
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight uppercase text-[#0F172A]">
                Mission Briefing
              </h2>
            </div>

            <div className="space-y-6 font-sans text-xl font-bold text-[#0F172A] leading-relaxed">
              <p>
                The digital landscape is becoming increasingly deceptive. Synthetic media, disinformation campaigns, and AI-generated hallucinations are everywhere.
              </p>
              <p>
                A-Eye is a state-of-the-art Media Information Literacy (MIL) simulator designed to train the next generation of digital investigators. 
              </p>
              <ul className="list-none space-y-4 my-6 pl-4">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="w-6 h-6 mt-1 shrink-0" />
                  <span>Build immunity against highly sophisticated disinformation tactics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="w-6 h-6 mt-1 shrink-0" />
                  <span>Learn how to effectively cross-reference and verify source material.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="w-6 h-6 mt-1 shrink-0" />
                  <span>Recognize the telltale visual artifacts of AI generation.</span>
                </li>
              </ul>
              <p className="pt-4 border-t-2 border-dashed border-[#0F172A]/50">
                Your score tracks your deductive reasoning. Mistakes cost points. Finding the truth secures your rank.
              </p>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* SECTION 3: CALL TO ACTION */}
      <section className="w-full py-24 bg-[#0F172A] border-t-[4px] border-[#FFB800] text-center px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-8 uppercase text-white"
        >
          Ready to open the files?
        </motion.h2>
        <Link href="/how-to-play" passHref>
          <Button 
            size="lg" 
            className="bg-white hover:bg-[#FFB800] text-[#0F172A] border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] hover:shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] h-20 px-16 text-2xl font-heading font-black tracking-wider uppercase transition-all group"
          >
            <Play className="mr-4 w-8 h-8" />
            Begin Investigation
          </Button>
        </Link>
      </section>

    </main>
    </>
  );
}
