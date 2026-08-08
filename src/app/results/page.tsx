"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { BrutalButton } from "@/components/ui/brutal-button";
import Link from "next/link";
import { Shield, Target, Activity, AlertTriangle, CheckCircle2, ChevronRight, BarChart, FileText, Camera, Video, XCircle, TrendingUp, Download } from "lucide-react";
import { ChartBarMultiple } from "@/components/charts/chart-bar-multiple";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";

export default function ResultsDashboardPage() {
  const {
    cumulativeScore,
    case001Score,
    case002Score,
    case003Score,
    preQuizScore,
    preQuizAwareness,
    preQuizConfidence,
    postQuizScore,
    postQuizAwareness,
    postQuizConfidence,
  } = useGameStore();

  const maxCaseScore = 500;
  const maxTotalScore = 1500;

  const getCasePercentage = (score: number) => Math.round((score / maxCaseScore) * 100);
  const accuracyPercent = Math.round((cumulativeScore / maxTotalScore) * 100);

  const c1Percent = getCasePercentage(case001Score);
  const c2Percent = getCasePercentage(case002Score);
  const c3Percent = getCasePercentage(case003Score);

  const profileRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadImage = async () => {
    if (!profileRef.current) return;
    try {
      setIsDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(profileRef.current, {
        pixelRatio: 2,
        backgroundColor: "#FAFAFA",
      });
      const link = document.createElement("a");
      link.download = `AEye_Profile_${calibrationProfile.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // AI Proficiency Profile calculation (2x2 Matrix: Accuracy vs Confidence)
  let calibrationProfile = "THE INITIATE";
  let calibrationDesc = "Complete your case reports and post-assessment to establish a full calibration profile.";
  let ProfileIcon = Activity;
  let profileColor = "bg-gray-300";
  let cognitivePrimary = "Awaiting Data";
  let cognitiveSecondary = "Awaiting Data";

  if (postQuizScore !== null && postQuizConfidence !== null) {
    const isHighAccuracy = accuracyPercent >= 60;
    const isHighConfidence = postQuizConfidence >= 4;

    if (isHighAccuracy && isHighConfidence) {
      calibrationProfile = "THE ALGORITHM ARCHITECT";
      calibrationDesc = "You possess a master-level understanding of digital manipulation. You spot synthetic artifacts with ruthless efficiency and trust your systemic logic to separate reality from fiction.";
      ProfileIcon = Shield;
      profileColor = "bg-emerald-400";
      cognitivePrimary = "Deep Pattern Recognition";
      cognitiveSecondary = "Decisive Verification";
    } else if (isHighAccuracy && !isHighConfidence) {
      calibrationProfile = "THE DEEP ANALYST";
      calibrationDesc = "Highly accurate but extremely cautious. You spot the fakes, but you second-guess your conclusions, preferring to cross-reference multiple times rather than jumping to a verdict.";
      ProfileIcon = Target;
      profileColor = "bg-blue-400";
      cognitivePrimary = "Meticulous Cross-Referencing";
      cognitiveSecondary = "Perpetual Skepticism";
    } else if (!isHighAccuracy && isHighConfidence) {
      calibrationProfile = "THE BOLD THEORIST";
      calibrationDesc = "You move fast and trust your gut, but often fall for advanced AI trickery. You are highly confident in your assessments, but your rapid processing misses crucial microscopic artifacts.";
      ProfileIcon = AlertTriangle;
      profileColor = "bg-amber-400";
      cognitivePrimary = "Rapid Heuristic Processing";
      cognitiveSecondary = "Over-Extrapolation";
    } else {
      calibrationProfile = "THE VULNERABLE INITIATE";
      calibrationDesc = "Unsure of what is real and struggling to spot manipulations. You are currently vulnerable to synthetic media operations and need to build your foundational detection protocols.";
      ProfileIcon = XCircle;
      profileColor = "bg-red-400";
      cognitivePrimary = "Surface-Level Observation";
      cognitiveSecondary = "Baseline Trust";
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-[100dvh] bg-[#FAFAFA] text-[#0F172A] p-6 md:p-12 relative font-sans pb-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20">
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[1200px] mx-auto relative z-10 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-[4px] border-[#0F172A] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
                <BarChart className="w-8 h-8 text-[#0F172A]" strokeWidth={3} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-heading tracking-widest uppercase text-[#0F172A] drop-shadow-[4px_4px_0_rgba(255,184,0,1)]">
                LEARNING DEBRIEF
              </h1>
            </div>
            <p className="text-[#0F172A] font-bold font-mono text-sm tracking-widest uppercase bg-white border-2 border-[#0F172A] inline-block px-3 py-1 shadow-[2px_2px_0px_0px_#0F172A]">
              UNESCO Digital Intelligence Simulator // Final Analysis
            </p>
          </div>

          <BrutalButton 
            onClick={handleDownloadImage}
            disabled={isDownloading}
            variant="blue" 
            size="lg"
          >
            <Download className="mr-3 w-6 h-6" strokeWidth={2.5} />
            {isDownloading ? "GENERATING..." : "DOWNLOAD PROFILE"}
          </BrutalButton>
        </motion.div>

        {preQuizScore !== null && postQuizScore !== null && (
          <motion.div variants={itemVariants} className="bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b-[4px] border-[#0F172A] pb-4">
              <TrendingUp className="w-8 h-8 text-[#FFB800]" strokeWidth={3} />
              <h2 className="text-3xl font-black font-heading uppercase text-[#0F172A]">Your Growth</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="bg-[#FAFAFA] border-[3px] border-[#0F172A] p-4 text-center">
                <div className="text-sm font-bold font-mono uppercase text-[#0F172A]/70 mb-2">Detection Skill</div>
                <div className="text-3xl font-black font-heading text-[#0F172A]">
                  <span className="text-[#0F172A]/50">{preQuizScore}/5</span> <span className="text-[#FFB800] px-2">→</span> <span>{postQuizScore}/5</span>
                </div>
              </div>
              <div className="bg-[#FAFAFA] border-[3px] border-[#0F172A] p-4 text-center">
                <div className="text-sm font-bold font-mono uppercase text-[#0F172A]/70 mb-2">Confidence Rating</div>
                <div className="text-3xl font-black font-heading text-[#0F172A]">
                  <span className="text-[#0F172A]/50">{preQuizConfidence}/5</span> <span className="text-[#FFB800] px-2">→</span> <span>{postQuizConfidence}/5</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0F172A] text-white p-4 font-sans font-bold text-lg leading-relaxed shadow-[4px_4px_0px_0px_#FFB800]">
              {postQuizScore > preQuizScore && postQuizConfidence! > preQuizConfidence! && "Incredible progress. You went from struggling to spot fakes to catching them consistently, and your confidence has grown to match your skills. You are now equipped to navigate the digital world."}
              {postQuizScore > preQuizScore && postQuizConfidence! <= preQuizConfidence! && "Your objective detection skills improved significantly, even if your confidence hasn't fully caught up yet. Trust your eyes—you're better at this than you think."}
              {postQuizScore <= preQuizScore && postQuizConfidence! > preQuizConfidence! && "Your confidence has grown, which is the first step to awareness. Keep applying the cross-examination techniques to improve your objective detection rate."}
              {postQuizScore <= preQuizScore && postQuizConfidence! <= preQuizConfidence! && "You've established a baseline. Digital literacy is a continuous journey of maintaining skepticism. Review the case files to sharpen your detection protocols further."}
            </div>
          </motion.div>
        )}


        {/* Top Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Total Score & Accuracy */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 bg-white border-[4px] border-[#0F172A] p-8 pb-12 shadow-[8px_8px_0px_0px_#0F172A] relative flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 left-0 bg-[#0F172A] text-white font-mono font-bold text-xs px-3 py-1 uppercase border-r-[4px] border-b-[4px] border-[#0F172A] flex items-center gap-2">
                <Activity className="w-4 h-4" /> TOTAL MISSION SCORE
              </div>
              
              <div className="mt-8 w-full bg-[#FAFAFA] border-[3px] border-[#0F172A] py-8 relative shadow-[inset_4px_4px_0px_rgba(15,23,42,0.05)]">
                <span className="text-7xl lg:text-8xl font-black font-mono text-[#0F172A] tracking-tighter">
                  {cumulativeScore.toString().padStart(4, '0')}
                </span>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#FFB800] border-[3px] border-[#0F172A] px-4 py-1 text-sm font-black font-heading uppercase tracking-widest shadow-[4px_4px_0px_0px_#0F172A] whitespace-nowrap">
                  / {maxTotalScore} MAXIMUM
                </div>
              </div>
            </div>
            
            <div className="bg-white border-[4px] border-[#0F172A] p-6 shadow-[8px_8px_0px_0px_#0F172A] relative shrink-0">
              <div className="text-sm font-black font-heading uppercase tracking-widest text-[#0F172A] mb-4">
                INVESTIGATION ACCURACY
              </div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black font-heading text-[#0F172A]">{accuracyPercent}%</div>
                <div className="flex-1 h-8 bg-gray-200 border-[3px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(2, accuracyPercent)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className="absolute top-0 left-0 h-full bg-[#FFB800] border-r-[3px] border-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Proficiency Profile */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex">
            <div className={`w-full border-[4px] border-[#0F172A] p-6 lg:p-10 shadow-[8px_8px_0px_0px_#0F172A] flex flex-col relative overflow-hidden ${profileColor}`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0F172A 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              
              <div className="relative z-10 flex items-center justify-between border-b-[4px] border-[#0F172A] pb-4 mb-auto bg-white/40 px-4 py-2 border-t-[4px] -mx-4 -mt-4 lg:-mx-10 lg:-mt-10">
                <div className="font-black font-heading uppercase tracking-widest text-[#0F172A] text-lg lg:text-xl flex items-center gap-2">
                  <Target className="w-6 h-6" strokeWidth={2.5} /> PROFICIENCY PROFILE
                </div>
                <div className="bg-white border-[3px] border-[#0F172A] p-1 shadow-[2px_2px_0px_0px_#0F172A]">
                  <ProfileIcon className="w-8 h-8 text-[#0F172A]" strokeWidth={2.5} />
                </div>
              </div>

              <div className="relative z-10 text-center space-y-8 mt-12 mb-8">
                <h2 className="text-4xl lg:text-5xl font-black font-heading uppercase tracking-widest text-white drop-shadow-[4px_4px_0_rgba(15,23,42,1)] py-4">
                  {calibrationProfile}
                </h2>
                <div className="bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] text-left relative group transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#0F172A] flex flex-col">
                  <div className="absolute -top-4 -left-4 bg-[#0F172A] w-8 h-8 border-[2px] border-white z-20" />
                  
                  <div className="p-6 lg:p-8 border-b-[4px] border-dashed border-[#0F172A]/30">
                    <p className="text-[#0F172A] font-bold font-sans text-base md:text-lg leading-relaxed relative z-10">
                      {calibrationDesc}
                    </p>
                  </div>
                  
                  <div className="p-6 lg:p-8 bg-[#FAFAFA] flex flex-col gap-6">
                    <div className="text-sm font-black font-heading uppercase tracking-widest text-[#0F172A] border-b-[2px] border-[#0F172A]/20 pb-2">
                      COGNITIVE SUBSYSTEMS
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 shrink-0 bg-[#0F172A] text-white flex items-center justify-center font-black font-heading text-xl shadow-[4px_4px_0px_0px_#FFB800] border-[2px] border-[#0F172A]">
                        P1
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold font-mono text-[#0F172A]/70 uppercase mb-1">PRIMARY TRAIT</div>
                        <div className="text-lg lg:text-xl font-black font-heading text-[#0F172A] uppercase leading-tight">{cognitivePrimary}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 shrink-0 bg-white border-[3px] border-[#0F172A] text-[#0F172A] flex items-center justify-center font-black font-heading text-xl shadow-[4px_4px_0px_0px_#0F172A]">
                        S2
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold font-mono text-[#0F172A]/70 uppercase mb-1">SECONDARY TRAIT</div>
                        <div className="text-lg lg:text-xl font-black font-heading text-[#0F172A] uppercase leading-tight">{cognitiveSecondary}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Neo-brutalist Bar Chart Full Width Row */}
        <motion.div variants={itemVariants} className="pt-4">
          <ChartBarMultiple c1={case001Score} c2={case002Score} c3={case003Score} />
        </motion.div>

        {/* Breakdown Cards */}
        <motion.div variants={itemVariants} className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Case 001 Card */}
            <div className={`p-6 pt-8 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] bg-white relative group hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#0F172A] transition-all duration-300 flex flex-col justify-between`}>
              <div className="absolute -top-[4px] -right-[4px] bg-white border-[4px] border-[#0F172A] p-2 z-10 shadow-[4px_4px_0px_0px_#0F172A] group-hover:rotate-6 transition-transform">
                {c1Percent >= 60 ? <CheckCircle2 className="w-6 h-6 text-[#10B981]" strokeWidth={3} /> : <AlertTriangle className="w-6 h-6 text-[#EF4444]" strokeWidth={3} />}
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#FF4A4A] border-[1px] border-[#0F172A]" />
                  <div className="text-xs font-bold font-mono text-[#0F172A]/70 uppercase tracking-widest">CASE 001</div>
                </div>
                <div className="text-2xl font-black font-heading uppercase leading-tight">TEXT<br/>ANALYSIS</div>
              </div>
              <div className="text-sm font-bold bg-[#FAFAFA] p-4 border-[3px] border-[#0F172A] text-[#0F172A] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                Examine claims vs. physical reality.
              </div>
            </div>

            {/* Case 002 Card */}
            <div className={`p-6 pt-8 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] bg-white relative group hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#0F172A] transition-all duration-300 flex flex-col justify-between`}>
              <div className="absolute -top-[4px] -right-[4px] bg-white border-[4px] border-[#0F172A] p-2 z-10 shadow-[4px_4px_0px_0px_#0F172A] group-hover:rotate-6 transition-transform">
                {c2Percent >= 60 ? <CheckCircle2 className="w-6 h-6 text-[#10B981]" strokeWidth={3} /> : <AlertTriangle className="w-6 h-6 text-[#EF4444]" strokeWidth={3} />}
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#00E599] border-[1px] border-[#0F172A]" />
                  <div className="text-xs font-bold font-mono text-[#0F172A]/70 uppercase tracking-widest">CASE 002</div>
                </div>
                <div className="text-2xl font-black font-heading uppercase leading-tight">PHOTO<br/>ANALYSIS</div>
              </div>
              <div className="text-sm font-bold bg-[#FAFAFA] p-4 border-[3px] border-[#0F172A] text-[#0F172A] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                Inspect peripheral environmental details.
              </div>
            </div>

            {/* Case 003 Card */}
            <div className={`p-6 pt-8 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] bg-white relative group hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#0F172A] transition-all duration-300 flex flex-col justify-between`}>
              <div className="absolute -top-[4px] -right-[4px] bg-white border-[4px] border-[#0F172A] p-2 z-10 shadow-[4px_4px_0px_0px_#0F172A] group-hover:rotate-6 transition-transform">
                {c3Percent >= 60 ? <CheckCircle2 className="w-6 h-6 text-[#10B981]" strokeWidth={3} /> : <AlertTriangle className="w-6 h-6 text-[#EF4444]" strokeWidth={3} />}
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#4A90E2] border-[1px] border-[#0F172A]" />
                  <div className="text-xs font-bold font-mono text-[#0F172A]/70 uppercase tracking-widest">CASE 003</div>
                </div>
                <div className="text-2xl font-black font-heading uppercase leading-tight">VIDEO<br/>ANALYSIS</div>
              </div>
              <div className="text-sm font-bold bg-[#FAFAFA] p-4 border-[3px] border-[#0F172A] text-[#0F172A] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                Spot temporal flickering & facial masks.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Hidden Export Card (1080x1080 1:1 format) */}
      <div 
        ref={profileRef}
        className="fixed left-[-9999px] top-[-9999px] w-[1080px] h-[1080px] bg-[#FAFAFA] flex flex-col p-12 font-sans border-[16px] border-[#0F172A]"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
      >
        {/* Header */}
        <div className="flex items-center gap-6 mb-10 border-b-[8px] border-[#0F172A] pb-8">
          <div className="p-4 bg-[#FFB800] border-[6px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A]">
            <BarChart className="w-14 h-14 text-[#0F172A]" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-5xl font-black font-heading tracking-widest uppercase text-[#0F172A] drop-shadow-[5px_5px_0_rgba(255,184,0,1)]">
              A-EYE SIMULATOR
            </h1>
            <p className="text-[#0F172A] font-bold font-mono text-xl tracking-widest uppercase bg-white border-[4px] border-[#0F172A] inline-block px-4 py-2 mt-2 shadow-[4px_4px_0px_0px_#0F172A]">
              OFFICIAL CALIBRATION PROFILE
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className={`flex-1 border-[8px] border-[#0F172A] p-10 shadow-[16px_16px_0px_0px_#0F172A] flex flex-col relative overflow-hidden ${profileColor}`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 4px 4px, #0F172A 2px, transparent 0)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 flex items-center justify-between border-b-[6px] border-[#0F172A] pb-6 mb-10 bg-white/40 px-6 py-4 border-t-[6px] -mx-10 -mt-10">
            <div className="font-black font-heading uppercase tracking-widest text-[#0F172A] text-2xl flex items-center gap-4">
              <Target className="w-8 h-8" strokeWidth={3} /> PROFICIENCY PROFILE
            </div>
            <div className="bg-white border-[4px] border-[#0F172A] p-2 shadow-[4px_4px_0px_0px_#0F172A]">
              <ProfileIcon className="w-10 h-10 text-[#0F172A]" strokeWidth={2.5} />
            </div>
          </div>

          <div className="relative z-10 text-center space-y-10 mt-4 mb-10">
            <h2 className="text-6xl font-black font-heading uppercase tracking-widest text-white drop-shadow-[6px_6px_0_rgba(15,23,42,1)] py-4">
              {calibrationProfile}
            </h2>
            <div className="bg-white border-[6px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] text-left relative flex flex-col mx-auto w-full max-w-3xl">
              <div className="absolute -top-6 -left-6 bg-[#0F172A] w-12 h-12 border-[4px] border-white z-20" />
              
              <div className="p-8 border-b-[6px] border-dashed border-[#0F172A]/30">
                <p className="text-[#0F172A] font-bold font-sans text-xl leading-relaxed relative z-10">
                  {calibrationDesc}
                </p>
              </div>
              
              <div className="p-8 bg-[#FAFAFA] flex flex-col gap-6">
                <div className="text-lg font-black font-heading uppercase tracking-widest text-[#0F172A] border-b-[4px] border-[#0F172A]/20 pb-3">
                  COGNITIVE SUBSYSTEMS
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 shrink-0 bg-[#0F172A] text-white flex items-center justify-center font-black font-heading text-2xl shadow-[6px_6px_0px_0px_#FFB800] border-[4px] border-[#0F172A]">
                    P1
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold font-mono text-[#0F172A]/70 uppercase mb-1">PRIMARY TRAIT</div>
                    <div className="text-2xl font-black font-heading text-[#0F172A] uppercase leading-tight">{cognitivePrimary}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 shrink-0 bg-white border-[4px] border-[#0F172A] text-[#0F172A] flex items-center justify-center font-black font-heading text-2xl shadow-[6px_6px_0px_0px_#0F172A]">
                    S2
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold font-mono text-[#0F172A]/70 uppercase mb-1">SECONDARY TRAIT</div>
                    <div className="text-2xl font-black font-heading text-[#0F172A] uppercase leading-tight">{cognitiveSecondary}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 flex justify-between items-end w-full">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-bold font-mono text-[#0F172A]/70 uppercase tracking-widest">
              MISSION SCORE
            </div>
            <div className="px-6 py-3 bg-[#0F172A] text-white font-bold font-mono text-3xl border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#FFB800]">
              {cumulativeScore.toString().padStart(4, '0')} <span className="text-[#FFB800] text-xl">/ {maxTotalScore}</span>
            </div>
          </div>
          <div className="text-2xl font-black font-heading uppercase text-[#0F172A] bg-[#FFB800] px-6 py-3 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
            A-EYE.UNESCO.ORG
          </div>
        </div>
      </div>
    </main>
  );
}
