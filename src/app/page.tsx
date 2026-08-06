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
      <main className="min-h-screen relative overflow-x-hidden font-sans flex flex-col bg-[#FAFAFA] pt-20">
      
      {/* Decorative Scribbles in Background */}
      <div className="absolute top-10 left-10 opacity-20 pointer-events-none rotate-12">
        <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
          <path d="M10,50 Q40,10 90,50 T10,90" stroke="#0F172A" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>
      <div className="absolute top-[80vh] right-20 opacity-20 pointer-events-none -rotate-12">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#FFB800" strokeWidth="3" strokeDasharray="8,4" />
          <path d="M30,30 L70,70 M70,30 L30,70" stroke="#FFB800" strokeWidth="3" />
        </svg>
      </div>

      {/* HERO SECTION */}
      <section id="hero" className="max-w-[1400px] w-full mx-auto px-6 py-12 md:py-24 min-h-[90vh] flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hero */}
          <div className="lg:col-span-7 flex flex-col items-start text-left pt-12 md:pt-0">
            
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-[#FFB800] text-[#0F172A] font-heading text-lg font-bold border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] rounded-sm"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <NotebookPen className="w-5 h-5 text-[#FFB800]" />
              <span>CASE FILE: OPEN</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter leading-[0.9] text-[#0F172A] font-heading mb-8 relative"
            >
              <span className="block text-[#FFB800]">A-EYE</span>
              <span className="block">INVESTIGATION</span>
              
              {/* Hand-drawn underline */}
              <motion.svg 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                className="absolute -bottom-4 left-0 w-full h-6 text-[#FFB800]" viewBox="0 0 200 20" preserveAspectRatio="none">
                <motion.path d="M4,10 Q50,20 100,5 T196,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </motion.svg>
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
                  className="w-[85%] h-[85%] object-contain drop-shadow-[4px_4px_0px_#0F172A]" 
                />
              </motion.div>

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
                hidden: { opacity: 0, y: 40, rotate: 0 },
                visible: { opacity: 1, y: 0, rotate: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              whileHover={{ scale: 1.03, y: -5, rotate: 0 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#0F172A] p-8 border-[3px] border-[#FFB800] shadow-[8px_8px_0px_0px_#FFB800] cursor-default"
              style={{ borderRadius: "15px 255px 225px 15px / 255px 15px 15px 225px" }}
            >
              <div className="w-16 h-16 bg-[#FFB800] rounded-full flex items-center justify-center mb-6 border-2 border-[#0F172A]">
                <FileText className="w-8 h-8 text-[#0F172A]" />
              </div>
              <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 001: Text Forensics</h3>
              <p className="font-sans text-lg leading-relaxed">
                Analyze suspicious social feeds, flag deceptive claims, and cross-reference them against verified sources. Learn to spot the tactics behind disinformation.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40, rotate: 0 },
                visible: { opacity: 1, y: 0, rotate: -1, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              whileHover={{ scale: 1.03, y: -5, rotate: 0 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#0F172A] p-8 border-[3px] border-[#FFB800] shadow-[8px_8px_0px_0px_#FFB800] mt-4 md:mt-0 cursor-default"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <div className="w-16 h-16 bg-[#FFB800] rounded-full flex items-center justify-center mb-6 border-2 border-[#0F172A]">
                <Camera className="w-8 h-8 text-[#0F172A]" />
              </div>
              <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 002: Image Analysis</h3>
              <p className="font-sans text-lg leading-relaxed">
                Use the digital magnifier to scan viral photos for AI-generated artifacts. Hands missing fingers, melting backgrounds, and impossible physics.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40, rotate: 0 },
                visible: { opacity: 1, y: 0, rotate: 2, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              whileHover={{ scale: 1.03, y: -5, rotate: 0 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#0F172A] p-8 border-[3px] border-[#FFB800] shadow-[8px_8px_0px_0px_#FFB800] mt-8 md:mt-0 cursor-default"
              style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
            >
              <div className="w-16 h-16 bg-[#FFB800] rounded-full flex items-center justify-center mb-6 border-2 border-[#0F172A]">
                <Video className="w-8 h-8 text-[#0F172A]" />
              </div>
              <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 003: Video Deepfakes</h3>
              <p className="font-sans text-lg leading-relaxed">
                Scrub through video feeds frame by frame to detect temporal inconsistencies, audio-sync failures, and digital masks.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: WHY TRAIN WITH US? (MISSION) */}
      <section id="mission" className="w-full py-24 relative overflow-hidden bg-[#FAFAFA]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex justify-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="max-w-4xl w-full bg-[#FFB800] p-10 md:p-16 border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative -rotate-1"
            style={{ borderRadius: "2px" }}
          >
            {/* Paper clip */}
            <div className="absolute -top-6 right-10 w-8 h-20 border-[4px] border-[#0F172A] rounded-full bg-white rotate-12 z-20 shadow-[2px_2px_0px_0px_#0F172A]"></div>
            
            <div className="flex items-center justify-center mb-8 gap-4 border-b-[4px] border-[#0F172A] pb-8">
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
            className="h-20 px-16 text-2xl font-heading tracking-wide bg-[#FFB800] hover:bg-white text-[#0F172A] border-[4px] border-[#FFB800] shadow-[8px_8px_0px_0px_rgba(255,184,0,0.5)] hover:shadow-[4px_4px_0px_0px_#FFB800] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 group"
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
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
