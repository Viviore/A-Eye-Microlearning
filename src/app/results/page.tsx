"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { BrutalButton } from "@/components/ui/brutal-button";
import Link from "next/link";
import { Shield, Target, Activity, AlertTriangle, CheckCircle2, ChevronRight, BarChart, FileText, Camera, Video, XCircle, TrendingUp } from "lucide-react";
import { ChartBarMultiple } from "@/components/charts/chart-bar-multiple";

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

  // Calibration Profile calculation
  let calibrationProfile = "IN TRAINING";
  let calibrationDesc = "Complete your case reports to establish a full calibration profile.";
  let ProfileIcon = Activity;
  let profileColor = "bg-yellow-300";

  if (accuracyPercent >= 80) {
    calibrationProfile = "MASTER INVESTIGATOR";
    calibrationDesc = "Exceptional accuracy! You effectively cross-examine digital evidence and catch subtle AI anomalies across all mediums.";
    ProfileIcon = Shield;
    profileColor = "bg-emerald-400";
  } else if (accuracyPercent >= 60) {
    calibrationProfile = "COMPETENT OBSERVER";
    calibrationDesc = "Solid foundational skills. You catch most obvious manipulations, but advanced AI trickery sometimes slips through the cracks.";
    ProfileIcon = Target;
    profileColor = "bg-blue-400";
  } else if (accuracyPercent >= 40) {
    calibrationProfile = "HESITANT SKEPTIC";
    calibrationDesc = "You are developing your eye for AI, but you struggle with consistency. Remember to isolate variables and check spatial logic.";
    ProfileIcon = AlertTriangle;
    profileColor = "bg-amber-400";
  } else {
    calibrationProfile = "VULNERABLE TARGET";
    calibrationDesc = "Low accuracy. You frequently misclassify manipulated media. Focus on cross-referencing visual boundaries and source credibility.";
    ProfileIcon = XCircle;
    profileColor = "bg-red-400";
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

          {postQuizScore === null ? (
            <Link href="/quiz/post" passHref>
              <BrutalButton variant="primary" size="lg">
                TAKE POST-QUIZ <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
              </BrutalButton>
            </Link>
          ) : (
            <div className="font-mono text-sm font-bold bg-[#0F172A] text-white px-4 py-2 uppercase tracking-wider">
              Assessment Completed
            </div>
          )}
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


        {/* Global Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Total Score Block */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border-[4px] border-[#0F172A] p-8 shadow-[8px_8px_0px_0px_#0F172A] relative flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 left-0 bg-[#0F172A] text-white font-mono font-bold text-xs px-3 py-1 uppercase border-r-[4px] border-b-[4px] border-[#0F172A]">
                TOTAL MISSION SCORE
              </div>
              
              <div className="mt-8 flex items-baseline gap-2 justify-center">
                <span className="text-8xl font-black font-heading text-[#FFB800] drop-shadow-[4px_4px_0_rgba(15,23,42,1)]">{cumulativeScore}</span>
              </div>
              <div className="text-xl font-black font-heading text-[#0F172A] uppercase border-t-[4px] border-[#0F172A] pt-4 mt-4 w-full">
                OUT OF {maxTotalScore} POINTS
              </div>
            </div>
            
            <div className="bg-white border-[4px] border-[#0F172A] p-6 shadow-[8px_8px_0px_0px_#0F172A] relative">
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

          {/* Profile & Neo-Brutalist Bar Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Calibration Profile */}
            <div className={`border-[4px] border-[#0F172A] p-8 shadow-[8px_8px_0px_0px_#0F172A] flex flex-col justify-between ${profileColor}`}>
              <div className="flex items-center justify-between border-b-[4px] border-[#0F172A] pb-4 mb-6">
                <div className="font-black font-heading uppercase tracking-widest text-[#0F172A] text-xl">
                  PROFICIENCY PROFILE
                </div>
                <ProfileIcon className="w-10 h-10 text-[#0F172A]" strokeWidth={2.5} />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black font-heading uppercase tracking-widest text-white drop-shadow-[2px_2px_0_rgba(15,23,42,1)]">
                  {calibrationProfile}
                </h2>
                <p className="text-[#0F172A] font-bold text-sm bg-white/80 p-4 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] inline-block">
                  {calibrationDesc}
                </p>
              </div>
            </div>

            {/* Neo-brutalist Bar Chart (Recharts) */}
            <ChartBarMultiple c1={case001Score} c2={case002Score} c3={case003Score} />

          </motion.div>
        </div>

        {/* Breakdown Cards */}
        <motion.div variants={itemVariants} className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Case 001 Card */}
            <div className={`p-6 pt-8 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] bg-white relative`}>
              <div className="absolute -top-[4px] -right-[4px] bg-[#FF4A4A] border-[4px] border-[#0F172A] p-2 z-10 shadow-[4px_4px_0px_0px_#0F172A]">
                {c1Percent >= 60 ? <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} /> : <AlertTriangle className="w-6 h-6 text-[#0F172A]" strokeWidth={3} />}
              </div>
              <div className="mb-4">
                <div className="text-xs font-bold font-mono text-[#0F172A]/60 uppercase">CASE 001</div>
                <div className="text-2xl font-black font-heading uppercase">TEXT ANALYSIS</div>
              </div>
              <div className="text-sm font-bold bg-gray-100 p-3 border-[2px] border-[#0F172A] mb-2 text-[#0F172A]">
                Examine claims vs. physical reality.
              </div>
            </div>

            {/* Case 002 Card */}
            <div className={`p-6 pt-8 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] bg-white relative`}>
              <div className="absolute -top-[4px] -right-[4px] bg-[#00E599] border-[4px] border-[#0F172A] p-2 z-10 shadow-[4px_4px_0px_0px_#0F172A]">
                {c2Percent >= 60 ? <CheckCircle2 className="w-6 h-6 text-[#0F172A]" strokeWidth={3} /> : <AlertTriangle className="w-6 h-6 text-[#0F172A]" strokeWidth={3} />}
              </div>
              <div className="mb-4">
                <div className="text-xs font-bold font-mono text-[#0F172A]/60 uppercase">CASE 002</div>
                <div className="text-2xl font-black font-heading uppercase">PHOTO ANALYSIS</div>
              </div>
              <div className="text-sm font-bold bg-gray-100 p-3 border-[2px] border-[#0F172A] mb-2 text-[#0F172A]">
                Inspect peripheral environmental details.
              </div>
            </div>

            {/* Case 003 Card */}
            <div className={`p-6 pt-8 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] bg-white relative`}>
              <div className="absolute -top-[4px] -right-[4px] bg-[#4A90E2] border-[4px] border-[#0F172A] p-2 z-10 shadow-[4px_4px_0px_0px_#0F172A]">
                {c3Percent >= 60 ? <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} /> : <AlertTriangle className="w-6 h-6 text-[#0F172A]" strokeWidth={3} />}
              </div>
              <div className="mb-4">
                <div className="text-xs font-bold font-mono text-[#0F172A]/60 uppercase">CASE 003</div>
                <div className="text-2xl font-black font-heading uppercase">VIDEO ANALYSIS</div>
              </div>
              <div className="text-sm font-bold bg-gray-100 p-3 border-[2px] border-[#0F172A] mb-2 text-[#0F172A]">
                Spot temporal flickering & facial masks.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
