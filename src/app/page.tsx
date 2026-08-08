"use client";

import { motion } from "framer-motion";
import { Search, Play, NotebookPen, FileText, Camera, Video, ShieldAlert, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Star8, Star15, Star22, Star35 } from "@/components/ui/stars";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen relative overflow-x-hidden font-sans flex flex-col bg-white pt-20">
      
      {/* Stars */}
      <Star35 className="absolute top-32 left-[10%] w-32 h-32 text-[#FFB800] z-0 hidden md:block animate-[spin_15s_linear_infinite]" />
      <Star8 className="absolute top-[60vh] right-[5%] w-40 h-40 text-[#0F172A] opacity-10 z-0 hidden lg:block animate-[pulse_6s_ease-in-out_infinite]" />
      <Star15 className="absolute bottom-[5vh] left-[5%] w-24 h-24 text-[#FFB800] z-0 hidden md:block animate-[spin_20s_linear_infinite_reverse]" />

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
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter leading-[0.9] font-heading mb-8 relative"
            >
              <span className="block text-[#FFB800] drop-shadow-[6px_6px_0px_#0F172A]">A-EYE</span>
              <span className="block text-[#0F172A]">INVESTIGATION</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#0F172A] max-w-[40ch] leading-relaxed mb-8 font-sans font-semibold"
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
                <BrutalButton 
                  size="xl" 
                  variant="hero"
                  className="w-full sm:w-auto group"
                >
                  <Play className="mr-3 w-6 h-6" />
                  Start Training
                </BrutalButton>
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
                >
                  <Badge className="text-xl bg-white text-primary border-primary">TOP SECRET</Badge>
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

      {/* SECTION: WHAT IS MIL? */}
      <section id="what-is-mil" className="w-full py-20 md:py-28 bg-white border-t-[4px] border-[#0F172A] relative overflow-hidden">
        {/* Background Decorative */}
        <Star8 className="absolute top-20 right-[5%] w-32 h-32 text-[#0F172A] opacity-5 z-0 hidden lg:block animate-[pulse_8s_ease-in-out_infinite]" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            
            <div className="flex flex-col lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#0F172A] text-white font-heading text-lg font-bold border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#FFB800] rounded-none uppercase w-fit">
                <Search className="w-5 h-5 text-[#FFB800]" />
                <span>Terminology</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-8 uppercase text-[#0F172A]">
                What is <span className="text-[#FFB800] drop-shadow-[4px_4px_0px_#0F172A]">MIL?</span>
              </h2>
              
              <div className="space-y-6 font-sans text-xl md:text-2xl text-[#0F172A]/90 font-medium leading-relaxed">
                <p>
                  <strong className="text-[#0F172A] font-black">MIL</strong> stands for <strong>Media and Information Literacy</strong>. 
                </p>
                <p>
                  In a world overflowing with deepfakes, AI hallucinations, and coordinated disinformation, knowing how to critically evaluate what you see is a vital survival skill.
                </p>
                <p>
                  MIL empowers you to independently ask: <span className="italic text-[#0F172A] font-bold">Who created this? What evidence supports it? Has it been manipulated?</span>
                </p>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0 lg:order-1">
              <Card className="bg-[#FFB800] p-8 md:p-12 relative flex flex-col justify-center min-h-[320px] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#0F172A] transition-all shadow-[8px_8px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none">
                <div className="absolute top-0 left-0 w-full border-b-[4px] border-[#0F172A] bg-white p-2 flex gap-2">
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                </div>
                <CardContent className="p-0 pt-8 font-sans text-3xl md:text-4xl font-black text-[#0F172A] leading-tight uppercase tracking-tight text-center">
                  "Don't just consume media.
                  <br />
                  <span className="text-white drop-shadow-[2px_2px_0px_#0F172A]">Interrogate it."</span>
                </CardContent>
              </Card>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white border-[4px] border-[#0F172A] rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] z-20 animate-[spin_12s_linear_infinite]">
                <Star35 className="w-12 h-12 text-[#FFB800]" />
              </div>
            </div>
            
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
              className="h-full"
            >
              <Card className="flex flex-col hover:-translate-y-2 transition-all h-full border-primary shadow-[8px_8px_0px_0px_#FFB800] hover:shadow-[12px_12px_0px_0px_#FFB800]">
                <div className="border-b-[4px] border-primary bg-primary p-2 flex gap-1.5">
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                </div>
                <CardContent className="p-8 relative overflow-hidden flex-1">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="w-16 h-16 bg-[#FFB800] flex items-center justify-center mb-6 border-[4px] border-[#0F172A] shadow-shadow">
                    <FileText className="w-10 h-10 text-[#0F172A]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 001: Text Forensics</h3>
                  <p className="font-sans text-lg font-bold leading-relaxed opacity-90">
                    Analyze suspicious social feeds, flag deceptive claims, and cross-reference them against verified sources. Learn to spot the tactics behind disinformation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              className="mt-4 md:mt-0 h-full"
            >
              <Card className="flex flex-col hover:-translate-y-2 transition-all h-full border-primary shadow-[8px_8px_0px_0px_#FFB800] hover:shadow-[12px_12px_0px_0px_#FFB800]">
                <div className="border-b-[4px] border-primary bg-primary p-2 flex gap-1.5">
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                </div>
                <CardContent className="p-8 relative overflow-hidden flex-1">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="w-16 h-16 bg-[#FFB800] flex items-center justify-center mb-6 border-[4px] border-[#0F172A] shadow-shadow">
                    <Camera className="w-10 h-10 text-[#0F172A]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 002: Image Analysis</h3>
                  <p className="font-sans text-lg font-bold leading-relaxed opacity-90">
                    Use the digital magnifier to scan viral photos for AI-generated artifacts. Hands missing fingers, melting backgrounds, and impossible physics.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
              }}
              className="mt-8 md:mt-0 h-full"
            >
              <Card className="flex flex-col hover:-translate-y-2 transition-all h-full border-primary shadow-[8px_8px_0px_0px_#FFB800] hover:shadow-[12px_12px_0px_0px_#FFB800]">
                <div className="border-b-[4px] border-primary bg-primary p-2 flex gap-1.5">
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                  <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
                </div>
                <CardContent className="p-8 relative overflow-hidden flex-1">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="w-16 h-16 bg-[#FFB800] flex items-center justify-center mb-6 border-[4px] border-[#0F172A] shadow-shadow">
                    <Video className="w-10 h-10 text-[#0F172A]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black font-heading mb-3 uppercase tracking-wide">Case 003: Video Deepfakes</h3>
                  <p className="font-sans text-lg font-bold leading-relaxed opacity-90">
                    Scrub through video feeds frame by frame to detect temporal inconsistencies, audio-sync failures, and digital masks.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: WHY TRAIN WITH US? (MISSION) */}
      <section id="mission" className="w-full py-24 md:py-32 relative overflow-hidden bg-white">
        {/* Stars */}
        <Star22 className="absolute top-20 left-[10%] w-48 h-48 text-[#0F172A] opacity-5 z-0 hidden md:block animate-[spin_20s_linear_infinite]" />
        <Star8 className="absolute bottom-20 right-[10%] w-32 h-32 text-[#FFB800] z-0 hidden lg:block animate-[spin_15s_linear_infinite_reverse]" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-12 gap-4">
            <ShieldAlert className="w-12 h-12 text-[#0F172A]" />
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight uppercase text-[#0F172A]">
              Mission Briefing
            </h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full"
          >
            {/* Main Intro Cell */}
            <Card className="lg:col-span-2 bg-primary p-8 md:p-12 relative flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#0F172A] transition-all shadow-[8px_8px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none">
              <div className="absolute top-0 left-0 w-full border-b-[4px] border-[#0F172A] bg-white p-2 flex gap-2">
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#FFB800]"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]"></div>
                <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white"></div>
              </div>
              <CardContent className="p-0 pt-8 space-y-6 font-sans text-xl md:text-2xl font-bold text-[#0F172A] leading-relaxed">
                <p>
                  Welcome to the A-Eye Simulation. Your objective is to process a series of restricted case files containing unverified digital artifacts.
                </p>
                <p>
                  You will analyze suspicious feeds, verify metadata, and use our forensic magnifier to uncover the truth. You must pass a pre-test to establish your baseline, and a post-test to certify your investigator status.
                </p>
              </CardContent>
            </Card>

            {/* Score Cell */}
            <Card className="bg-[#0F172A] text-white p-8 relative flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FFB800] transition-all shadow-[8px_8px_0px_0px_#FFB800] border-[4px] border-[#FFB800] rounded-none">
              <CardContent className="p-0 flex flex-col h-full justify-center space-y-4">
                <div className="text-6xl font-black font-heading text-[#FFB800] mb-2">01</div>
                <p className="font-sans text-lg font-bold leading-relaxed">
                  Your score tracks your deductive reasoning. Mistakes cost points. Finding the truth secures your rank.
                </p>
              </CardContent>
            </Card>
            
            {/* Objectives Cells */}
            <Card className="bg-white p-6 relative hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#0F172A] transition-all shadow-[4px_4px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-primary border-[3px] border-[#0F172A] flex items-center justify-center shadow-[3px_3px_0px_0px_#0F172A]">
                  <BadgeCheck className="w-8 h-8 text-[#0F172A]" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[#0F172A] uppercase">Build Immunity</h3>
                <p className="font-sans font-semibold text-[#0F172A]/80 text-lg">Against highly sophisticated disinformation tactics.</p>
              </CardContent>
            </Card>

            <Card className="bg-white p-6 relative hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#0F172A] transition-all shadow-[4px_4px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-primary border-[3px] border-[#0F172A] flex items-center justify-center shadow-[3px_3px_0px_0px_#0F172A]">
                  <BadgeCheck className="w-8 h-8 text-[#0F172A]" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[#0F172A] uppercase">Cross-Reference</h3>
                <p className="font-sans font-semibold text-[#0F172A]/80 text-lg">Learn how to effectively verify source material.</p>
              </CardContent>
            </Card>

            <Card className="bg-white p-6 relative hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#0F172A] transition-all shadow-[4px_4px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-primary border-[3px] border-[#0F172A] flex items-center justify-center shadow-[3px_3px_0px_0px_#0F172A]">
                  <BadgeCheck className="w-8 h-8 text-[#0F172A]" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[#0F172A] uppercase">Spot Artifacts</h3>
                <p className="font-sans font-semibold text-[#0F172A]/80 text-lg">Recognize the telltale visual glitches of AI generation.</p>
              </CardContent>
            </Card>
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
          <BrutalButton 
            size="xl" 
            variant="secondary"
            className="w-full sm:w-auto group hover:bg-[#FFB800]"
          >
            <Play className="mr-4 w-8 h-8" />
            Begin Investigation
          </BrutalButton>
        </Link>
      </section>

    </main>
    </>
  );
}
