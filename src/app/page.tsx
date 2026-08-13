"use client";

import { motion } from "framer-motion";
import {
  Search,
  Play,
  NotebookPen,
  FileText,
  Camera,
  Video,
  ShieldAlert,
  BadgeCheck,
  Fingerprint,
  ScanEye,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Star8, Star15, Star22, Star35 } from "@/components/ui/stars";
import { AnimatedBackground } from "@/components/ui/animated-background";

/* ------------------------------------------------------------------ */
/*  Marquee Ticker                                                     */
/* ------------------------------------------------------------------ */
function MarqueeTicker() {
  const items = [
    "CLASSIFIED",
    "TOP SECRET",
    "EYES ONLY",
    "MEDIA FORENSICS",
    "AI DETECTION",
    "VERIFY SOURCES",
    "TRUST NOTHING",
    "INVESTIGATE EVERYTHING",
  ];

  return (
    <div className="w-full bg-[#0F172A] border-y-[4px] border-[#FFB800] overflow-hidden py-3 relative select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="font-heading font-black text-sm md:text-base text-[#FFB800] uppercase tracking-[0.3em] mx-6 md:mx-10 flex items-center gap-3"
          >
            <Star8 className="w-3 h-3 text-[#FFB800] shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stagger wrapper                                                    */
/* ------------------------------------------------------------------ */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen relative overflow-x-hidden font-sans flex flex-col bg-[#FAFAFA] pt-20">

        {/* ============================================================ */}
        {/* HERO                                                         */}
        {/* ============================================================ */}
        <section
          id="hero"
          className="max-w-[1400px] w-full mx-auto px-6 py-16 md:py-24 min-h-[85vh] flex flex-col justify-center relative z-10"
        >
          <AnimatedBackground theme="light" />
          {/* Decorative Stars */}
          <Star35 className="absolute top-24 left-[8%] w-28 h-28 text-[#FFB800] z-0 hidden md:block animate-[spin_18s_linear_infinite]" />
          <Star8 className="absolute bottom-16 right-[3%] w-20 h-20 text-[#0F172A] opacity-[0.07] z-0 hidden lg:block animate-[pulse_5s_ease-in-out_infinite]" />
          <Star15 className="absolute top-[60%] left-[2%] w-16 h-16 text-[#FFB800] opacity-40 z-0 hidden lg:block animate-[spin_22s_linear_infinite_reverse]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center relative z-10">
            {/* Left Column: Typography */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              <motion.div variants={fadeUp}>
                <Badge className="bg-[#FFB800] text-[#0F172A] border-[4px] border-[#0F172A] px-4 py-2 font-heading font-bold tracking-widest text-sm shadow-[4px_4px_0px_0px_#0F172A] flex items-center gap-2 mb-8 rounded-none">
                  <NotebookPen className="w-5 h-5" />
                  <span>CASE FILE: OPEN</span>
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.5rem] font-black tracking-[-0.04em] leading-[0.85] font-heading mb-6 relative"
              >
                <span className="block text-[#FFB800] drop-shadow-[6px_6px_0px_#0F172A]">
                  A-EYE
                </span>
                <span className="block text-[#0F172A] text-[0.55em] mt-1">
                  MIL SIMULATOR
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-[#0F172A]/80 max-w-[42ch] leading-relaxed mb-10 font-sans font-semibold"
              >
                Inspect simulated social feeds, identify AI-generated artifacts,
                and sharpen your critical thinking in this digital forensics
                training simulation.
              </motion.p>

              <motion.div variants={fadeUp}>
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
            </motion.div>

            {/* Right Column: Mascot Card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="lg:col-span-5 relative hidden lg:block"
            >
              <div className="aspect-[4/5] bg-white border-[4px] border-[#0F172A] flex flex-col justify-between relative group shadow-[12px_12px_0px_0px_#0F172A] hover:shadow-[16px_16px_0px_0px_#0F172A] hover:-translate-y-1 transition-all duration-300">
                {/* Window Bar */}
                <div className="border-b-[4px] border-[#0F172A] bg-[#FFB800] p-3 flex gap-2 w-full shrink-0">
                  <div className="w-4 h-4 rounded-full border-[2px] border-[#0F172A] bg-white" />
                  <div className="w-4 h-4 rounded-full border-[2px] border-[#0F172A] bg-white" />
                  <div className="w-4 h-4 rounded-full border-[2px] border-[#0F172A] bg-white" />
                </div>

                {/* Top row: icon + badge */}
                <div className="flex justify-between items-start z-10 relative px-8 pt-6">
                  <ScanEye className="w-14 h-14 text-[#0F172A] stroke-[1.5]" />
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 6 }}
                    transition={{
                      type: "spring",
                      bounce: 0.6,
                      delay: 0.8,
                    }}
                  >
                    <Badge className="text-lg bg-[#FF3366] text-white border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] px-3 py-1 rounded-none font-heading">
                      CLASSIFIED
                    </Badge>
                  </motion.div>
                </div>

                {/* Floating Mascot */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center z-0 pt-8 pb-28"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/character_mascot/character_pose.png"
                    alt="A-Eye Mascot"
                    className="w-[85%] h-[85%] object-contain filter drop-shadow-[8px_8px_0px_#0F172A]"
                  />
                </motion.div>

                {/* Bottom Checklist */}
                <div className="z-10 bg-[#FFB800] px-6 py-5 border-t-[4px] border-[#0F172A] relative mt-auto flex-none">
                  <h3 className="font-heading text-xl font-bold mb-2 text-[#0F172A] uppercase tracking-wider">
                    Checklist:
                  </h3>
                  <ul className="font-sans text-base space-y-1.5 text-[#0F172A] font-bold">
                    <li className="flex items-center gap-2">
                      <span className="text-[#0F172A]">✓</span> Verify the
                      source
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0F172A]">✓</span> Inspect
                      metadata
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0F172A]">✓</span> Look for
                      artifacts
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MARQUEE TICKER                                               */}
        {/* ============================================================ */}
        <MarqueeTicker />

        {/* ============================================================ */}
        {/* WHAT IS MIL?                                                 */}
        {/* ============================================================ */}
        <section
          id="what-is-mil"
          className="w-full py-20 md:py-28 bg-white relative overflow-visible"
        >
          <AnimatedBackground theme="light" />
          <Star8 className="absolute top-20 right-[5%] w-32 h-32 text-[#0F172A] opacity-5 z-0 hidden lg:block animate-[pulse_8s_ease-in-out_infinite]" />

          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center"
            >
              {/* Pull-Quote Card */}
              <motion.div
                variants={scaleIn}
                className="relative lg:order-1"
              >
                <Card className="bg-[#FFB800] p-8 md:p-12 relative flex flex-col justify-center min-h-[400px] md:min-h-[480px] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#0F172A] transition-all shadow-[8px_8px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none overflow-visible">
                  <div className="absolute top-0 left-0 w-full border-b-[4px] border-[#0F172A] bg-white p-2 flex gap-2 z-10">
                    <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]" />
                    <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white" />
                  </div>
                  <CardContent className="p-0 pt-8 font-sans text-3xl md:text-4xl font-black text-[#0F172A] leading-tight uppercase tracking-tight text-center relative z-10">
                    &ldquo;Don&apos;t just consume media.
                    <br />
                    <span className="text-white drop-shadow-[2px_2px_0px_#0F172A]">
                      Interrogate it.&rdquo;
                    </span>
                  </CardContent>

                  {/* Mascot Peeking from inside */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="absolute -top-16 -right-6 md:-top-24 md:-right-12 z-20 pointer-events-none"
                  >
                    <img src="/character_mascot/idea_expression.png" alt="Idea Mascot" className="w-40 md:w-56 h-auto object-contain filter drop-shadow-[4px_4px_0px_#0F172A] animate-[bounce_4s_ease-in-out_infinite]" />
                  </motion.div>
                </Card>

                {/* Spinning Star Decoration */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white border-[4px] border-[#0F172A] rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] z-20 animate-[spin_12s_linear_infinite]">
                  <Star35 className="w-10 h-10 text-[#FFB800]" />
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                variants={staggerContainer}
                className="flex flex-col lg:order-2"
              >
                <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#0F172A] text-white font-heading text-base font-bold border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#FFB800] rounded-none uppercase w-fit">
                    <Search className="w-5 h-5 text-[#FFB800]" />
                    <span>Terminology</span>
                  </div>
                </motion.div>

                <motion.h2
                  variants={fadeUp}
                  className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-6 uppercase text-[#0F172A]"
                >
                  What is{" "}
                  <span className="text-[#FFB800] drop-shadow-[4px_4px_0px_#0F172A]">
                    MIL?
                  </span>
                </motion.h2>

                <motion.div
                  variants={fadeUp}
                  className="space-y-5 font-sans text-lg md:text-xl text-[#0F172A]/85 font-medium leading-relaxed"
                >
                  <p>
                    <strong className="text-[#0F172A] font-black">MIL</strong>{" "}
                    stands for{" "}
                    <strong>Media and Information Literacy</strong>.
                  </p>
                  <p>
                    In a world overflowing with deepfakes, AI hallucinations,
                    and coordinated disinformation, knowing how to critically
                    evaluate what you see is a vital survival skill.
                  </p>
                  <p>
                    MIL empowers you to independently ask:{" "}
                    <span className="italic text-[#0F172A] font-bold">
                      Who created this? What evidence supports it? Has it been
                      manipulated?
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* THE A-EYE PROTOCOL (FEATURES)                                */}
        {/* ============================================================ */}
        <section
          id="protocol"
          className="w-full bg-[#0F172A] text-white py-20 md:py-28 relative overflow-hidden border-y-[4px] border-[#FFB800]"
        >
          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="text-center mb-14"
            >
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4 uppercase text-[#FFB800]"
              >
                The A-Eye Protocol
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl font-sans opacity-80 max-w-2xl mx-auto font-medium"
              >
                Master the three core pillars of digital forensics. Prove your
                skills across different media types in our simulated
                environment.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {[
                {
                  icon: FileText,
                  title: "Case 001: Text Forensics",
                  desc: "Analyze suspicious social feeds, flag deceptive claims, and cross-reference them against verified sources. Learn to spot the tactics behind disinformation.",
                },
                {
                  icon: Camera,
                  title: "Case 002: Image Analysis",
                  desc: "Use the digital magnifier to scan viral photos for AI-generated artifacts. Hands missing fingers, melting backgrounds, and impossible physics.",
                },
                {
                  icon: Video,
                  title: "Case 003: Video Deepfakes",
                  desc: "Scrub through video feeds frame by frame to detect temporal inconsistencies, audio-sync failures, and digital masks.",
                },
              ].map((feature, i) => (
                <motion.div key={feature.title} variants={fadeUp} className="h-full">
                  <Card className="flex flex-col hover:-translate-y-2 transition-all duration-300 h-full border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#FFB800] hover:shadow-[12px_12px_0px_0px_#FFB800] rounded-none group">
                    {/* Window bar */}
                    <div className="border-b-[4px] border-[#0F172A] bg-[#FFB800] p-2 flex gap-1.5 shrink-0">
                      <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white" />
                      <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]" />
                      <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white" />
                    </div>
                    <CardContent className="p-6 md:p-8 relative overflow-hidden flex-1 flex flex-col">
                      <div className="w-14 h-14 bg-[#FFB800] flex items-center justify-center mb-5 border-[4px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] group-hover:shadow-[5px_5px_0px_0px_#0F172A] transition-shadow">
                        <feature.icon
                          className="w-8 h-8 text-[#0F172A]"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black font-heading mb-3 uppercase tracking-wide">
                        {feature.title}
                      </h3>
                      <p className="font-sans text-base md:text-lg font-bold leading-relaxed opacity-85 mt-auto">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MISSION BRIEFING                                             */}
        {/* ============================================================ */}
        <section
          id="mission"
          className="w-full py-20 md:py-28 relative overflow-hidden bg-white"
        >
          <AnimatedBackground theme="light" />
          <Star22 className="absolute top-20 left-[8%] w-40 h-40 text-[#0F172A] opacity-[0.04] z-0 hidden md:block animate-[spin_20s_linear_infinite]" />
          <Star8 className="absolute bottom-16 right-[8%] w-28 h-28 text-[#FFB800] opacity-30 z-0 hidden lg:block animate-[spin_15s_linear_infinite_reverse]" />

          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="flex flex-col items-center"
            >
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-center mb-10 gap-4"
              >
                <ShieldAlert className="w-10 h-10 text-[#0F172A]" />
                <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight uppercase text-[#0F172A]">
                  Mission Briefing
                </h2>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full"
              >
                {/* Main Intro Cell */}
                <motion.div variants={fadeUp} className="lg:col-span-2">
                  <Card className="bg-primary h-full p-8 md:p-10 relative flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#0F172A] transition-all duration-300 shadow-[8px_8px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none">
                    <div className="absolute top-0 left-0 w-full border-b-[4px] border-[#0F172A] bg-white p-2 flex gap-2">
                      <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#FFB800]" />
                      <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-[#0F172A]" />
                      <div className="w-4 h-4 border-[4px] border-[#0F172A] bg-white" />
                    </div>
                    <CardContent className="p-0 pt-8 space-y-5 font-sans text-lg md:text-xl font-bold text-[#0F172A] leading-relaxed">
                      <p>
                        Welcome to the A-Eye Simulation. Your objective is to
                        process a series of restricted case files containing
                        unverified digital artifacts.
                      </p>
                      <p>
                        You will analyze suspicious feeds, verify metadata, and
                        use our forensic magnifier to uncover the truth. You
                        must pass a pre-test to establish your baseline, and a
                        post-test to certify your investigator status.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Score Cell */}
                <motion.div variants={fadeUp}>
                  <Card className="bg-[#0F172A] text-white h-full p-8 relative flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FFB800] transition-all duration-300 shadow-[8px_8px_0px_0px_#FFB800] border-[4px] border-[#FFB800] rounded-none">
                    <CardContent className="p-0 flex flex-col h-full justify-center space-y-4">
                      <div className="text-6xl font-black font-heading text-[#FFB800] mb-2">
                        01
                      </div>
                      <p className="font-sans text-lg font-bold leading-relaxed">
                        Your score tracks your deductive reasoning. Mistakes
                        cost points. Finding the truth secures your rank.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Objectives Cells */}
                {[
                  {
                    icon: BadgeCheck,
                    title: "Build Immunity",
                    desc: "Against highly sophisticated disinformation tactics.",
                  },
                  {
                    icon: Fingerprint,
                    title: "Cross-Reference",
                    desc: "Learn how to effectively verify source material.",
                  },
                  {
                    icon: AlertTriangle,
                    title: "Spot Artifacts",
                    desc: "Recognize the telltale visual glitches of AI generation.",
                  },
                ].map((obj) => (
                  <motion.div key={obj.title} variants={fadeUp}>
                    <Card className="bg-white h-full p-6 relative hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#0F172A] transition-all duration-300 shadow-[4px_4px_0px_0px_#0F172A] border-[4px] border-[#0F172A] rounded-none group">
                      <CardContent className="p-0 space-y-3">
                        <div className="w-12 h-12 bg-primary border-[3px] border-[#0F172A] flex items-center justify-center shadow-[3px_3px_0px_0px_#0F172A] group-hover:bg-[#FFB800] transition-colors">
                          <obj.icon className="w-7 h-7 text-[#0F172A]" />
                        </div>
                        <h3 className="font-heading font-black text-xl text-[#0F172A] uppercase">
                          {obj.title}
                        </h3>
                        <p className="font-sans font-semibold text-[#0F172A]/80 text-base">
                          {obj.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CTA FOOTER                                                   */}
        {/* ============================================================ */}
        <section className="w-full py-20 md:py-24 bg-[#0F172A] border-t-[4px] border-[#FFB800] text-center px-6 relative overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative z-10"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-8 uppercase text-white"
            >
              Ready to open the files?
            </motion.h2>
            <motion.div variants={fadeUp}>
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
            </motion.div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
