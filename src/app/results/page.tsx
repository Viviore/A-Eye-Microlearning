"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { BrutalButton } from "@/components/ui/brutal-button";
import Link from "next/link";
import { Shield, Target, Activity, AlertTriangle, CheckCircle2, ChevronRight, BarChart, FileText, Camera, Video, XCircle, TrendingUp, Download, Share2 } from "lucide-react";
import { ChartBarMultiple } from "@/components/charts/chart-bar-multiple";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";

const ALL_PROFILES = [
  {
    id: "T1_TEXT",
    name: "THE EXPERT FACT-CHECKER",
    threshold: "80% - 100%",
    desc: "Master of dismantling narrative manipulation. You spot fake stories with ease.",
    icon: Shield,
    color: "bg-emerald-400",
    cognitivePrimary: "Spotting Fake Stories",
    cognitiveSecondary: "Double-Checking Sources",
  },
  {
    id: "T1_PHOTO",
    name: "THE DETAIL INVESTIGATOR",
    threshold: "80% - 100%",
    desc: "Uncanny ability to spot microscopic visual anomalies in any image.",
    icon: Target,
    color: "bg-emerald-400",
    cognitivePrimary: "Finding Tiny Photo Errors",
    cognitiveSecondary: "Noticing Weird Backgrounds",
  },
  {
    id: "T1_VIDEO",
    name: "THE DEEPFAKE SPOTTER",
    threshold: "80% - 100%",
    desc: "Flawlessly detects deepfakes, motion inconsistencies, and audio manipulation.",
    icon: Activity,
    color: "bg-emerald-400",
    cognitivePrimary: "Catching Unnatural Movement",
    cognitiveSecondary: "Spotting Fake Voices & Faces",
  },
  {
    id: "T2_TEXT",
    name: "THE CAREFUL READER",
    threshold: "60% - 79%",
    desc: "Strong at cross-referencing claims and linguistic tricks, though cautious.",
    icon: FileText,
    color: "bg-blue-400",
    cognitivePrimary: "Questioning Big Claims",
    cognitiveSecondary: "Looking for Solid Proof",
  },
  {
    id: "T2_PHOTO",
    name: "THE PHOTO INSPECTOR",
    threshold: "60% - 79%",
    desc: "Meticulous at observing spatial and lighting inconsistencies in pictures.",
    icon: Camera,
    color: "bg-blue-400",
    cognitivePrimary: "Zooming in on Images",
    cognitiveSecondary: "Checking Shadows and Lighting",
  },
  {
    id: "T2_VIDEO",
    name: "THE VIDEO REVIEWER",
    threshold: "60% - 79%",
    desc: "Skilled at spotting temporal glitches and frame drops upon closer review.",
    icon: Video,
    color: "bg-blue-400",
    cognitivePrimary: "Replaying Suspicious Clips",
    cognitiveSecondary: "Watching for Glitches",
  },
  {
    id: "T3_TEXT",
    name: "THE HEADLINE SKIMMER",
    threshold: "40% - 59%",
    desc: "Catches obvious lies but falls for subtle narrative framing and emotional hooks.",
    icon: AlertTriangle,
    color: "bg-amber-400",
    cognitivePrimary: "Reading Too Fast",
    cognitiveSecondary: "Believing Emotional Stories",
  },
  {
    id: "T3_PHOTO",
    name: "THE QUICK GLANCER",
    threshold: "40% - 59%",
    desc: "Good at catching obvious AI artifacts, but misses complex visual fakes.",
    icon: AlertTriangle,
    color: "bg-amber-400",
    cognitivePrimary: "Looking Only at the Main Subject",
    cognitiveSecondary: "Missing Edited Details",
  },
  {
    id: "T3_VIDEO",
    name: "THE CASUAL WATCHER",
    threshold: "40% - 59%",
    desc: "Susceptible to high-quality deepfakes despite trusting your gut.",
    icon: AlertTriangle,
    color: "bg-amber-400",
    cognitivePrimary: "Trusting What Looks Real",
    cognitiveSecondary: "Missing Clever Deepfakes",
  },
  {
    id: "T4_TEXT",
    name: "THE TRUSTING READER",
    threshold: "0% - 39%",
    desc: "Easily manipulated by emotional or urgent text claims.",
    icon: XCircle,
    color: "bg-red-400",
    cognitivePrimary: "Believing Everything Written",
    cognitiveSecondary: "Falling for Text Scams",
  },
  {
    id: "T4_PHOTO",
    name: "THE EASY TARGET",
    threshold: "0% - 39%",
    desc: "Blind to obvious spatial and structural AI artifacts.",
    icon: XCircle,
    color: "bg-red-400",
    cognitivePrimary: "Ignoring Bad Photoshop",
    cognitiveSecondary: "Tricked by Fake Pictures",
  },
  {
    id: "T4_VIDEO",
    name: "THE DEEPFAKE VICTIM",
    threshold: "0% - 39%",
    desc: "Completely unprepared for temporal manipulation and synthetic video.",
    icon: XCircle,
    color: "bg-red-400",
    cognitivePrimary: "Thinking All Videos are Real",
    cognitiveSecondary: "Missing Robot Voices",
  },
];

export default function ResultsDashboardPage() {
  const {
    cumulativeScore,
    case001Score,
    case002Score,
    case003Score,
    preAssessmentResult,
    postAssessmentResult,
  } = useGameStore();

  const maxCaseScore = 500;
  const maxTotalScore = 1500;

  const getCasePercentage = (score: number) => Math.round((score / maxCaseScore) * 100);
  const accuracyPercent = Math.round((cumulativeScore / maxTotalScore) * 100);

  const c1Percent = getCasePercentage(case001Score);
  const c2Percent = getCasePercentage(case002Score);
  const c3Percent = getCasePercentage(case003Score);

  const preSkill = preAssessmentResult?.skillPercentage || 0;
  const postSkill = postAssessmentResult?.skillPercentage || 0;
  const skillGrowth = postSkill - preSkill;
  const skillGrowthSign = skillGrowth >= 0 ? "+" : "";

  const preAwareness = preAssessmentResult?.awarenessRating || 1;
  const postAwareness = postAssessmentResult?.awarenessRating || 1;
  const awarenessGrowth = postAwareness - preAwareness;
  const awarenessGrowthSign = awarenessGrowth >= 0 ? "+" : "";

  const preConfidence = preAssessmentResult?.confidenceRating || 1;
  const postConfidence = postAssessmentResult?.confidenceRating || 1;
  const confidenceGrowth = postConfidence - preConfidence;
  const confidenceGrowthSign = confidenceGrowth >= 0 ? "+" : "";

  const profileRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExportModal = async () => {
    if (!modalRef.current) return;
    try {
      setIsDownloading(true);
      // Wait for any animations to settle
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(modalRef.current, {
        pixelRatio: 2,
        backgroundColor: "#FAFAFA",
      });
      const fileName = `AEye_Result_${calibrationProfile.replace(/\s+/g, '_')}.png`;

      if (navigator.share) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], fileName, { type: blob.type });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "My A-Eye Profiling Result",
              text: `I scored ${accuracyPercent}% on A-Eye and got the profile: ${calibrationProfile}!`,
              files: [file],
            });
            return;
          }
        } catch (shareErr) {
          console.log("Web Share API failed, falling back to download", shareErr);
        }
      }

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // AI Proficiency Profile calculation (Based on Accuracy and Best Case)
  let calibrationProfile = "THE INITIATE";
  let calibrationDesc = "Complete your case reports to establish a full calibration profile.";
  let ProfileIcon = Activity;
  let profileColor = "bg-gray-300";
  let cognitivePrimary = "Awaiting Data";
  let cognitiveSecondary = "Awaiting Data";

  if (case001Score > 0 || case002Score > 0 || case003Score > 0) {
    // Determine highest scoring category
    let bestCase = "TEXT";
    let highestScore = case001Score;
    
    if (case002Score > highestScore) {
      bestCase = "PHOTO";
      highestScore = case002Score;
    }
    if (case003Score > highestScore) {
      bestCase = "VIDEO";
      highestScore = case003Score;
    }

    // Determine tier
    let tier = "T4";
    if (accuracyPercent >= 80) tier = "T1";
    else if (accuracyPercent >= 60) tier = "T2";
    else if (accuracyPercent >= 40) tier = "T3";

    // Find the matching profile
    const profileId = `${tier}_${bestCase}`;
    const matchedProfile = ALL_PROFILES.find(p => p.id === profileId);

    if (matchedProfile) {
      calibrationProfile = matchedProfile.name;
      calibrationDesc = matchedProfile.desc;
      ProfileIcon = matchedProfile.icon;
      profileColor = matchedProfile.color;
      cognitivePrimary = matchedProfile.cognitivePrimary;
      cognitiveSecondary = matchedProfile.cognitiveSecondary;
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
            onClick={() => setIsModalOpen(true)}
            variant="blue" 
            size="lg"
          >
            <Download className="mr-3 w-6 h-6" strokeWidth={2.5} />
            EXPORT RESULT
          </BrutalButton>
        </motion.div>




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

        {/* ALL CALIBRATION TIERS SECTION */}
        <motion.div variants={itemVariants} className="pt-12 pb-4">
          <div className="flex items-center gap-3 mb-8 border-b-[4px] border-[#0F172A] pb-4">
            <div className="p-2 bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
              <Target className="w-6 h-6 text-[#0F172A]" strokeWidth={3} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading tracking-widest uppercase text-[#0F172A]">
              ALL CALIBRATION TIERS
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALL_PROFILES.map((profile, i) => {
              const isCurrent = calibrationProfile === profile.name;
              const Icon = profile.icon;
              return (
                <div key={i} className={`border-[4px] border-[#0F172A] p-6 shadow-[6px_6px_0px_0px_#0F172A] flex flex-col relative transition-all duration-300 ${isCurrent ? `${profile.color} -translate-y-2 shadow-[10px_10px_0px_0px_#0F172A] z-10` : 'bg-white hover:-translate-y-1'}`}>
                  {isCurrent && (
                    <div className="absolute -top-4 -right-4 bg-white border-[3px] border-[#0F172A] px-3 py-1 font-black font-heading text-sm shadow-[4px_4px_0px_0px_#0F172A] rotate-3 text-[#0F172A] z-20">
                      YOUR TIER
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] ${isCurrent ? 'bg-white' : profile.color}`}>
                      <Icon className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
                    </div>
                    <div className="font-mono font-bold text-sm text-[#0F172A] bg-white border-[2px] border-[#0F172A] px-2 py-0.5 shadow-[2px_2px_0px_0px_#0F172A]">
                      {profile.threshold}
                    </div>
                  </div>
                  <h3 className={`text-xl font-black font-heading uppercase leading-tight mb-3 ${isCurrent ? 'text-white drop-shadow-[2px_2px_0_rgba(15,23,42,1)]' : 'text-[#0F172A]'}`}>
                    {profile.name}
                  </h3>
                  <p className={`text-sm font-bold font-sans flex-1 mb-6 ${isCurrent ? 'text-[#0F172A]' : 'text-[#0F172A]/70'}`}>
                    {profile.desc}
                  </p>
                  
                  <div className={`mt-auto p-4 border-[3px] border-[#0F172A] ${isCurrent ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                    <div className="text-xs font-black font-heading uppercase tracking-widest text-[#0F172A] border-b-[2px] border-[#0F172A]/20 pb-2 mb-3">
                      COGNITIVE SUBSYSTEMS
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 shrink-0 bg-[#0F172A] text-white flex items-center justify-center font-black font-heading text-xs shadow-[2px_2px_0px_0px_#FFB800] border-[1.5px] border-[#0F172A]">
                          P1
                        </div>
                        <div>
                          <div className="text-[10px] font-bold font-mono text-[#0F172A]/70 uppercase leading-none mb-0.5">Primary Trait</div>
                          <div className="text-sm font-black font-heading text-[#0F172A] uppercase leading-tight">{profile.cognitivePrimary}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 shrink-0 bg-white border-[1.5px] border-[#0F172A] text-[#0F172A] flex items-center justify-center font-black font-heading text-xs shadow-[2px_2px_0px_0px_#0F172A]">
                          S2
                        </div>
                        <div>
                          <div className="text-[10px] font-bold font-mono text-[#0F172A]/70 uppercase leading-none mb-0.5">Secondary Trait</div>
                          <div className="text-sm font-black font-heading text-[#0F172A] uppercase leading-tight">{profile.cognitiveSecondary}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* YOUR GROWTH SECTION */}
        <motion.div variants={itemVariants} className="pt-12 pb-8">
          <div className="flex items-center gap-3 mb-8 border-b-[4px] border-[#0F172A] pb-4">
            <div className="p-2 bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
              <TrendingUp className="w-6 h-6 text-[#0F172A]" strokeWidth={3} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading tracking-widest uppercase text-[#0F172A]">
              YOUR GROWTH
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MIL Skill Growth */}
            <div className="bg-white border-[4px] border-[#0F172A] p-6 md:p-8 shadow-[8px_8px_0px_0px_#0F172A] relative flex flex-col justify-center min-h-[220px]">
              <div className="absolute top-0 left-0 bg-[#0F172A] text-white font-mono font-bold text-xs px-3 py-1 uppercase border-r-[4px] border-b-[4px] border-[#0F172A] flex items-center gap-2">
                <Target className="w-4 h-4" /> MIL SKILL
              </div>
              <div className="mt-6 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black font-heading text-[#0F172A]">{preSkill}%</span>
                    <span className="font-mono text-xs font-bold text-[#0F172A]/70 uppercase tracking-widest">Before</span>
                  </div>
                  <ChevronRight className="w-8 h-8 text-[#0F172A]/30" strokeWidth={3} />
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black font-heading text-[#FFB800] drop-shadow-[2px_2px_0_#0F172A]">{postSkill}%</span>
                    <span className="font-mono text-xs font-bold text-[#0F172A]/70 uppercase tracking-widest">After</span>
                  </div>
                </div>
                <div className="bg-[#FFB800] border-[3px] border-[#0F172A] px-4 py-2 shadow-[4px_4px_0px_0px_#0F172A] w-full text-center">
                  <span className="font-heading font-black text-xl text-[#0F172A] uppercase">{skillGrowthSign}{skillGrowth} percentage points</span>
                </div>
              </div>
            </div>

            {/* Self-Reported Growth */}
            <div className="flex flex-col gap-6">
              {/* Awareness */}
              <div className="bg-white border-[4px] border-[#0F172A] p-6 shadow-[6px_6px_0px_0px_#0F172A] flex flex-col justify-between flex-1">
                <div className="font-heading font-bold text-lg uppercase tracking-wide text-[#0F172A] mb-4">
                  AI Misinformation Awareness
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-heading text-[#0F172A]">{preAwareness}/5</span>
                    <ChevronRight className="w-5 h-5 text-[#0F172A]/30" strokeWidth={3} />
                    <span className="text-2xl font-black font-heading text-[#FFB800] drop-shadow-[1px_1px_0_#0F172A]">{postAwareness}/5</span>
                  </div>
                  <div className="font-mono font-bold text-lg text-[#0F172A] bg-[#FAFAFA] border-[2px] border-[#0F172A] px-3 py-1 shadow-[2px_2px_0px_0px_#0F172A]">
                    {awarenessGrowthSign}{awarenessGrowth}
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div className="bg-white border-[4px] border-[#0F172A] p-6 shadow-[6px_6px_0px_0px_#0F172A] flex flex-col justify-between flex-1">
                <div className="font-heading font-bold text-lg uppercase tracking-wide text-[#0F172A] mb-4">
                  Confidence Identifying AI Fakes
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-heading text-[#0F172A]">{preConfidence}/5</span>
                    <ChevronRight className="w-5 h-5 text-[#0F172A]/30" strokeWidth={3} />
                    <span className="text-2xl font-black font-heading text-[#FFB800] drop-shadow-[1px_1px_0_#0F172A]">{postConfidence}/5</span>
                  </div>
                  <div className="font-mono font-bold text-lg text-[#0F172A] bg-[#FAFAFA] border-[2px] border-[#0F172A] px-3 py-1 shadow-[2px_2px_0px_0px_#0F172A]">
                    {confidenceGrowthSign}{confidenceGrowth}
                  </div>
                </div>
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white border-[4px] border-[#0F172A] p-8 shadow-[12px_12px_0px_0px_rgba(255,184,0,1)]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#0F172A] hover:text-red-500 transition-colors"
              >
                <XCircle className="w-8 h-8" strokeWidth={2.5} />
              </button>
              
              <div className="flex items-center gap-4 mb-8 border-b-[4px] border-[#0F172A] pb-4">
                <div className="p-2 bg-[#FFB800] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
                  <Share2 className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black font-heading uppercase text-[#0F172A]">Result Summary</h2>
              </div>

              <div className="space-y-4 font-mono text-[#0F172A]">
                <div>
                  <h3 className="font-bold text-xs text-[#0F172A]/60 uppercase tracking-widest mb-1">Your Profile</h3>
                  <div className={`p-3 border-[3px] border-[#0F172A] ${profileColor} font-black text-xl flex items-center gap-3 shadow-[4px_4px_0px_0px_#0F172A]`}>
                    <ProfileIcon className="w-6 h-6" />
                    {calibrationProfile}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-bold text-xs text-[#0F172A]/60 uppercase tracking-widest mb-1">Primary Cognitive</h3>
                    <div className="bg-[#FAFAFA] border-[3px] border-[#0F172A] p-2 text-sm font-bold shadow-[4px_4px_0px_0px_#0F172A]">
                      {cognitivePrimary}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#0F172A]/60 uppercase tracking-widest mb-1">Secondary Cognitive</h3>
                    <div className="bg-[#FAFAFA] border-[3px] border-[#0F172A] p-2 text-sm font-bold shadow-[4px_4px_0px_0px_#0F172A]">
                      {cognitiveSecondary}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAFAFA] border-[3px] border-[#0F172A] p-4 text-center relative shadow-[4px_4px_0px_0px_#0F172A] mt-2">
                  <div className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest mb-1">Overall Accuracy</div>
                  <div className="text-4xl font-black">{accuracyPercent}%</div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <BrutalButton className="w-full text-xl" variant="blue" size="lg" disabled={isDownloading} onClick={handleExportModal}>
                  <Download className="mr-2 w-5 h-5" /> {isDownloading ? "EXPORTING..." : "EXPORT RESULT"}
                </BrutalButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
