"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Target, Activity, AlertTriangle, CheckCircle2, XCircle, ChevronRight, BarChart, FileText, Camera, Video, Sparkles, BookOpen } from "lucide-react";

export default function ResultsDashboardPage() {
  const {
    level1Verdict, level1Confidence,
    level2Verdict, level2Confidence,
    level3Verdict, level3Confidence,
    sessions,
  } = useGameStore();

  const c1Verdict = level1Verdict || sessions['case-001']?.verdict || null;
  const c1Conf = level1Confidence ?? sessions['case-001']?.confidence ?? null;

  const c2Verdict = level2Verdict || sessions['case-002']?.verdict || null;
  const c2Conf = level2Confidence ?? sessions['case-002']?.confidence ?? null;

  const c3Verdict = level3Verdict || sessions['case-003']?.verdict || null;
  const c3Conf = level3Confidence ?? sessions['case-003']?.confidence ?? null;

  const isC1Correct = c1Verdict === "Misleading";
  const isC2Correct = c2Verdict === "Misleading";
  const isC3Correct = c3Verdict === "Misleading";

  const correctCount = [isC1Correct, isC2Correct, isC3Correct].filter(Boolean).length;
  const totalCases = 3;
  const accuracyPercent = Math.round((correctCount / totalCases) * 100);

  const confidences = [c1Conf, c2Conf, c3Conf].filter((c): c is number => c !== null);
  const avgConfidence = confidences.length > 0
    ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
    : 0;

  // Calibration Profile calculation
  let calibrationProfile = "In Training";
  let calibrationDesc = "Complete your case reports to establish a full calibration profile.";
  let ProfileIcon = Activity;
  let profileColor = "text-amber-400";

  if (confidences.length === 3) {
    if (accuracyPercent >= 66 && avgConfidence >= 70) {
      calibrationProfile = "Master Digital Investigator";
      calibrationDesc = "High investigation accuracy with well-calibrated confidence. You accurately evaluate evidence and stand firm in your conclusions.";
      ProfileIcon = Shield;
      profileColor = "text-emerald-400";
    } else if (accuracyPercent < 66 && avgConfidence >= 70) {
      calibrationProfile = "Overconfident Trap";
      calibrationDesc = "You expressed high certainty on inaccurate report conclusions. Beware of sensational language and cross-examine visual evidence.";
      ProfileIcon = AlertTriangle;
      profileColor = "text-red-500";
    } else if (accuracyPercent >= 66 && avgConfidence < 70) {
      calibrationProfile = "Hesitant Observer";
      calibrationDesc = "Your investigation quality is high, but your confidence is conservative. Trust your evidence-based observations!";
      ProfileIcon = Target;
      profileColor = "text-blue-400";
    } else {
      calibrationProfile = "Cautious Skeptic";
      calibrationDesc = "Low confidence and accuracy. Focus on cross-referencing claim wording, visual boundaries, and source credibility.";
      ProfileIcon = Activity;
      profileColor = "text-amber-400";
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
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 p-6 md:p-12 relative overflow-x-hidden font-sans pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[1200px] mx-auto relative z-10 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart className="w-6 h-6 text-emerald-500" />
              <h1 className="text-3xl md:text-4xl font-black font-heading tracking-widest uppercase">
                Learning Report & Debrief
              </h1>
            </div>
            <p className="text-zinc-400 font-mono text-xs tracking-widest uppercase">
              UNESCO Digital Intelligence Simulator // Final Case Analysis
            </p>
          </div>

          <Link href="/quiz/post" passHref>
            <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600">
              Take Post-Assessment Quiz <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Global Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Key Metrics */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Investigation Quality</div>
              <div className="text-5xl font-black font-heading text-zinc-100 mb-1">{accuracyPercent}%</div>
              <div className="text-xs text-zinc-400">Successfully verified {correctCount} out of {totalCases} target cases with evidence.</div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Avg. Confidence Calibration</div>
              <div className="text-5xl font-black font-heading text-emerald-400 mb-1">{avgConfidence}%</div>
              <div className="text-xs text-zinc-400">Your self-reported certainty rating committed prior to report submission.</div>
            </div>
          </motion.div>

          {/* Calibration Profile */}
          <motion.div variants={itemVariants} className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm backdrop-blur-sm shadow-2xl flex flex-col justify-between">
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-800 pb-3">
              Psychological Confidence Calibration Profile
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="relative">
                <div className={`absolute inset-0 blur-2xl opacity-20 bg-current ${profileColor}`} />
                <ProfileIcon className={`w-20 h-20 relative z-10 ${profileColor}`} />
              </div>
              <h2 className={`text-2xl font-black font-heading uppercase tracking-widest ${profileColor}`}>
                {calibrationProfile}
              </h2>
              <p className="text-zinc-300 text-xs max-w-md leading-relaxed">
                {calibrationDesc}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Case File Breakdown per ARCHITECTURE.md */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-lg font-bold font-heading uppercase tracking-widest text-zinc-100 border-b border-zinc-800 pb-3">
            Investigation Case Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 001 */}
            <div className={`p-6 border rounded-sm relative space-y-4 ${isC1Correct ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Case 001</div>
                    <div className="font-bold text-zinc-100 text-sm">Text Investigation</div>
                  </div>
                </div>
                {isC1Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>

              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Verdict:</span>
                  <span className="font-bold text-zinc-200">{c1Verdict || "Not Completed"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-mono text-zinc-300">{c1Conf !== null ? `${c1Conf}%` : "N/A"}</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-sm text-[11px] text-zinc-400 leading-relaxed space-y-1">
                <strong className="text-zinc-200 block text-xs font-bold font-heading uppercase">MIL Takeaway:</strong>
                Evaluate whether online claims are grounded in physical reality rather than sensational copy.
              </div>
            </div>

            {/* Case 002 */}
            <div className={`p-6 border rounded-sm relative space-y-4 ${isC2Correct ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Case 002</div>
                    <div className="font-bold text-zinc-100 text-sm">Photo Investigation</div>
                  </div>
                </div>
                {isC2Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>

              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Verdict:</span>
                  <span className="font-bold text-zinc-200">{c2Verdict || "Not Completed"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-mono text-zinc-300">{c2Conf !== null ? `${c2Conf}%` : "N/A"}</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-sm text-[11px] text-zinc-400 leading-relaxed space-y-1">
                <strong className="text-zinc-200 block text-xs font-bold font-heading uppercase">MIL Takeaway:</strong>
                Inspect peripheral environmental details (warped geometry, distorted signage) rather than focusing solely on central subjects.
              </div>
            </div>

            {/* Case 003 */}
            <div className={`p-6 border rounded-sm relative space-y-4 ${isC3Correct ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Case 003</div>
                    <div className="font-bold text-zinc-100 text-sm">Video Investigation</div>
                  </div>
                </div>
                {isC3Correct ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>

              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Verdict:</span>
                  <span className="font-bold text-zinc-200">{c3Verdict || "Not Completed"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-mono text-zinc-300">{c3Conf !== null ? `${c3Conf}%` : "N/A"}</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-sm text-[11px] text-zinc-400 leading-relaxed space-y-1">
                <strong className="text-zinc-200 block text-xs font-bold font-heading uppercase">MIL Takeaway:</strong>
                Use slow-motion inspection (0.5x) to spot frame-by-frame temporal flickering along facial mask and jawline boundaries.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
