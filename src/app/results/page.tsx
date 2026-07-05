"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Target, Activity, AlertTriangle, CheckCircle2, XCircle, ChevronRight, BarChart } from "lucide-react";

export default function ResultsDashboardPage() {
  const {
    level1Verdict, level1Confidence,
    level2Verdict, level2Confidence,
    level3Verdict, level3Confidence
  } = useGameStore();

  // Score Calculations
  const isL1Correct = level1Verdict === "AI Generated";
  const isL2Correct = level2Verdict === "Fact-Checked First";
  const isL3Correct = level3Verdict === "AI Generated" || level3Verdict === "Insufficient Evidence";

  const correctCount = [isL1Correct, isL2Correct, isL3Correct].filter(Boolean).length;
  const totalLevels = 3;
  const accuracyPercent = Math.round((correctCount / totalLevels) * 100);

  // Confidence Calculations
  const confidences = [level1Confidence, level2Confidence, level3Confidence].filter((c): c is number => c !== null);
  const avgConfidence = confidences.length > 0 
    ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
    : 0;

  // Calibration Logic
  let calibrationProfile = "Needs Data";
  let calibrationDesc = "Complete more investigations to establish your profile.";
  let ProfileIcon = Activity;
  let profileColor = "text-zinc-400";

  if (confidences.length === 3) {
    if (accuracyPercent >= 66 && avgConfidence >= 70) {
      calibrationProfile = "Master Investigator";
      calibrationDesc = "High accuracy paired with high confidence. You trust your instincts and they are usually right.";
      ProfileIcon = Shield;
      profileColor = "text-emerald-400";
    } else if (accuracyPercent < 66 && avgConfidence >= 70) {
      calibrationProfile = "Overconfident";
      calibrationDesc = "You are highly confident but frequently incorrect. This makes you highly susceptible to misinformation.";
      ProfileIcon = AlertTriangle;
      profileColor = "text-red-500";
    } else if (accuracyPercent >= 66 && avgConfidence < 70) {
      calibrationProfile = "Hesitant but Sharp";
      calibrationDesc = "Your accuracy is high, but you doubt your findings. Trust your forensic analysis more.";
      ProfileIcon = Target;
      profileColor = "text-blue-400";
    } else {
      calibrationProfile = "In Training";
      calibrationDesc = "Low confidence and low accuracy. You need more practice identifying generative artifacts.";
      ProfileIcon = Activity;
      profileColor = "text-orange-400";
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 p-6 md:p-12 relative overflow-x-hidden font-sans pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[1200px] mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart className="w-6 h-6 text-emerald-500" />
              <h1 className="text-3xl md:text-4xl font-black font-heading tracking-widest uppercase">
                Investigation Debrief
              </h1>
            </div>
            <p className="text-zinc-400 font-mono text-xs tracking-widest uppercase">
              Field Operations // Session Analysis
            </p>
          </div>
          
          <Link href="/quiz/post" passHref>
            <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150">
              Take Final Assessment <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Global Stats */}
          <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-sm backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Global Accuracy</div>
                <div className="text-6xl font-black font-heading text-zinc-100 mb-2">{accuracyPercent}%</div>
                <div className="text-sm text-zinc-400">Successfully classified {correctCount} out of {totalLevels} targets.</div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-sm backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Avg. Confidence</div>
                <div className="text-6xl font-black font-heading text-zinc-100 mb-2">{avgConfidence}%</div>
                <div className="text-sm text-zinc-400">Your self-reported certainty across all missions.</div>
              </div>
            </div>
          </motion.div>

          {/* Calibration Profile */}
          <motion.div variants={itemVariants} className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm backdrop-blur-sm shadow-2xl flex flex-col">
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8 border-b border-zinc-800 pb-4">
              Psychological Calibration Profile
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="mb-6 relative">
                <div className={`absolute inset-0 blur-2xl opacity-20 bg-current ${profileColor}`} />
                <ProfileIcon className={`w-24 h-24 relative z-10 ${profileColor}`} />
              </div>
              <h2 className={`text-3xl font-black font-heading uppercase tracking-widest mb-4 ${profileColor}`}>
                {calibrationProfile}
              </h2>
              <p className="text-zinc-400 max-w-md leading-relaxed">
                {calibrationDesc}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Case Files Breakdown */}
        <motion.div variants={itemVariants} className="mb-6">
          <h3 className="text-lg font-bold font-heading uppercase tracking-widest text-zinc-100 mb-6 border-b border-zinc-800 pb-2">
            Case File Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Level 1 Card */}
            <div className={`p-6 border rounded-sm relative overflow-hidden ${isL1Correct ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Target 01</div>
                  <div className="font-bold text-zinc-100">Everyday Selfie</div>
                </div>
                {isL1Correct ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Your Verdict</div>
                  <div className="text-sm font-bold text-zinc-300">{level1Verdict || "Skipped"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Confidence</div>
                  <div className="text-sm font-mono text-zinc-300">{level1Confidence !== null ? `${level1Confidence}%` : "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Level 2 Card */}
            <div className={`p-6 border rounded-sm relative overflow-hidden ${isL2Correct ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Target 02</div>
                  <div className="font-bold text-zinc-100">Viral News Post</div>
                </div>
                {isL2Correct ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Your Verdict</div>
                  <div className="text-sm font-bold text-zinc-300">{level2Verdict || "Skipped"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Confidence</div>
                  <div className="text-sm font-mono text-zinc-300">{level2Confidence !== null ? `${level2Confidence}%` : "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Level 3 Card */}
            <div className={`p-6 border rounded-sm relative overflow-hidden ${isL3Correct ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Target 03</div>
                  <div className="font-bold text-zinc-100">Deepfake Reality</div>
                </div>
                {isL3Correct ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Your Verdict</div>
                  <div className="text-sm font-bold text-zinc-300">{level3Verdict || "Skipped"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Confidence</div>
                  <div className="text-sm font-mono text-zinc-300">{level3Confidence !== null ? `${level3Confidence}%` : "N/A"}</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
